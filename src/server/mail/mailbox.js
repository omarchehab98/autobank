'use strict'
const EventEmitter = require('events')
const IMAP = require('imap')
const fs = require('fs')
const simpleParser = require('mailparser').simpleParser
const striptags = require('striptags')
const HTMLEntities = require('he')

const defaultTo = require('lodash/defaultTo')
const each = require('lodash/each')
const isObject = require('lodash/isObject')

class Mailbox extends EventEmitter {
  /**
   * Connects to an email address' inbox through IMAP using the specified
   * credentials and options.
   * @param {Object} credentials
   * @param {string} credentials.host
   * @param {string} credentials.user
   * @param {string} credentials.password
   * @param {number} [credentials.port]
   * @param {boolean} [credentials.tls]
   * @param {boolean} [credentials.tlsOptions]
   * @param {Object} [options]
   * @param {string} [options.mailbox]
   * @param {string[]} [options.search]
   * @param {string} [options.markSeen]
   * @param {string} [options.connectOnInit]
   * @param {Object} [dependencies]
   * @see {@link https://github.com/mscdex/node-imap|node-imap}
   * @param {Function} [dependencies.IMAP]
   * @param {Function} [dependencies.parseMail]
   */
  constructor (credentials, options, dependencies) {
    super()

    this._credentials = {
      host: credentials.host,
      user: credentials.user,
      password: credentials.password,
      port: defaultTo(credentials.port, 993),
      tls: defaultTo(credentials.tls, true),
      tlsOptions: defaultTo(credentials.tlsOptions, null)
    }

    if (this._credentials.tlsOptions !== null) {
      const tlsOptions = this._credentials.tlsOptions
      this._credentials.tlsOptions = Object.assign(tlsOptions, {
        cert: tlsOptions.cert && fs.readFileSync(tlsOptions.cert),
        key: tlsOptions.key && fs.readFileSync(tlsOptions.key),
        ca: tlsOptions.ca && fs.readFileSync(tlsOptions.ca)
      })
    }

    options = defaultTo(options, {})

    this._options = {
      mailbox: defaultTo(options.mailbox, 'INBOX'),
      search: defaultTo(options.search, ['UNSEEN']),
      markSeen: defaultTo(options.markSeen, true),
      connectOnInit: defaultTo(options.connectOnInit, true)
    }

    dependencies = defaultTo(dependencies, {})

    this._dependencies = {
      IMAP: defaultTo(dependencies.IMAP, IMAP),
      parseMail: defaultTo(dependencies.parseMail, parseMail)
    }

    this._onConnect = this._onConnect.bind(this)
    this._onDisconnect = this._onDisconnect.bind(this)
    this._onError = this._onError.bind(this)
    this._onMailIn = this._onMailIn.bind(this)
    this._onMailOut = this._onMailOut.bind(this)
    this._searchForMail = this._searchForMail.bind(this)
    this._fetchMail = this._fetchMail.bind(this)
    this._markSeen = this._markSeen.bind(this)

    if (this._options.connectOnInit) {
      this.connect()
    }
  }

  /**
   * Attempts to connect to the the IMAP inbox using the credentials.
   * On success, 'mail' will be emitted when there is new mail.
   * In the event of any error, 'error' will be emitted.
   * Does nothing if it is already connected.
   */
  connect () {
    if (this.isConnected) {
      return
    }

    this._imap = new this._dependencies.IMAP(this._credentials)

    // https://github.com/mscdex/node-imap#connection-events
    this._imap.on('ready', this._onConnect)
    this._imap.on('close', this._onDisconnect)
    this._imap.on('end', this._onDisconnect)
    this._imap.on('error', this._onError)
    this._imap.on('mail', this._searchForMail)
    this._imap.on('update', this._searchForMail)

    this._imap.connect()
  }

  /**
   * Disconnects from the IMAP inbox, stopping event emission.
   * Does nothing if it is already disconnected.
   */
  disconnect () {
    if (!this.isConnected) {
      return
    }
    this._imap.end()
  }

  /**
   * Returns whether or not the mailbox is connected to IMAP inbox.
   * @returns {boolean}
   */
  get isConnected () {
    const imapIsDefined = this._imap
    return isObject(imapIsDefined) && this._imap.state === 'connected'
  }

  /**
   * Once an IMAP connection is made, open mailbox and emits 'connect'.
   */
  _onConnect () {
    const mailboxName = this._options.mailbox

    this._imap.openBox(mailboxName, false, error => {
      if (error) {
        this._onError(error)
        return
      }

      this.emit('connect')
    })
  }

  /**
   * Once an IMAP connection is lost, emits 'disconnect'.
   */
  _onDisconnect () {
    this.emit('disconnect')
  }

  /**
   * Whenever a mail has been parsed, emits 'mail'.
   * @see {@link https://github.com/nodemailer/mailparser#mail-object|mailparser#mail-object}
   *   for parameter mail datatype.
   * @param {Object} mail
   */
  _onMailOut (mail) {
    this.emit('mail', mail)
  }

  /**
   * Fetches and parses a mail using it's unique identiefer.
   * Eventually emits 'mail' through _onMailOut.
   * @param {number} mailUID
   */
  _onMailIn (mailUID) {
    this._fetchMail(mailUID)
  }

  /**
   * Whenever an error has risen, emits 'error'.
   * @param {Error} error
   */
  _onError (error) {
    if (!(error instanceof Error)) {
      error = new Error(error)
    }

    this.emit('error', error)
  }

  /**
   * Search the mailbox for mail that match the options, calls _fetchMail
   * foreach match.
   */
  _searchForMail () {
    const searchFilter = this._options.search

    this._imap.search(searchFilter, (error, mailArray) => {
      if (error) {
        this._onError(error)
        return
      }

      if (mailArray.length > 0) {
        each(mailArray, this._fetchMail)
      }
    }, this._onError)
  }

  /**
   * Fetches and parses a mail using its unique identifier. Calls _onMailOut.
   * @param {number} mailUID
   */
  _fetchMail (mailUID) {
    const markSeen = this._options.markSeen

    const fetch = this._imap.fetch(mailUID, {bodies: '', markSeen})

    fetch.once('message', message => {
      if (markSeen) {
        this._markSeen(mailUID)
      }
      this._dependencies.parseMail(message)
        .then(this._onMailOut)
        .catch(this._onError)
    })

    fetch.once('error', this._onError)
  }

  /**
   * Sets a given mail's flag as Seen using its unique identifier.
   * @param {number} mailUID
   */
  _markSeen (mailUID) {
    this._imap.setFlags([mailUID], ['\\Seen'], error => {
      if (error) {
        this._onError(error)
      }
    })
  }
}

/**
 * Parses a given IMAP Message and returns a promise that resolves with the
 * parsed mail.
 * @see {@link https://github.com/mscdex/node-imap#data-types|node-imap#data-types}
 *   for parameter message datatype.
 * @see {@link https://github.com/nodemailer/mailparser#simpleparser|mailparser#simpleparser}
 *   for response mail datatype.
 * @param {ImapMessage} message
 * @returns {Promise}
 */
function parseMail (message) {
  return new Promise((resolve, reject) => {
    let mailBuffer = new Buffer('')

    message.on('body', stream => {
      stream.on('data', chunk => {
        mailBuffer = Buffer.concat([mailBuffer, chunk])
      })

      stream.once('end', () => {
        simpleParser(mailBuffer)
          .then(simplifyMail)
          .then(resolve)
          .catch(reject)
      })
    })
  })
}

/**
 * Reduces the content of the mail object received from simpleParser to it's
 * minimum.
 * @param {Object} mail
 * @param {Object} mail.from
 * @param {string} mail.from.text
 * @param {string} mail.subject
 * @param {*} mail.date
 * @param {string} mail.html
 * @param {array} mail.attachments
 * @returns {Object}
 * Sample response:
 * ```js
 * {
 *   "from": "Omar Chehab <omarchehab98@gmail.com>",
 *    "subject": "Fwd: Large Transaction Warning",
 *    "date": "2017-02-19T20:45:32.000Z",
 *   "body": {
 *     "text": "Dead Omar,\nThank you for your response.\nRegards,\neun",
 *     "html": "<p>Dear Omar,</p><p>Thank you for your response.</p><p>Yours,</p><p><a href='https://github.com/omarchehab98/eun'>eun</a></p>"
 *   },
 *   "attachments": []
 * }
 * ```
 */
function simplifyMail (mail) {
  return {
    from: mail.from.text,
    subject: mail.subject,
    date: mail.date,
    body: {
      text: htmlToText(mail.html)
      // html: mail.html
    },
    attachments: mail.attachments
  }
}

/**
 * Converts an HTML string to plaintext.
 * @param {string} html
 * @returns {string}
 */
function htmlToText (html) {
  let text = striptags(html)
    // Merge consecutive line breaks and spaces to a single linebreak.
    .replace(/\s*\n+\s*/g, '\n')
    // Remove linebreaks at the start and end of the string.
    .replace(/^\n|\n$/g, '')
  // Decode encoded characters. &amp; -> &
  text = HTMLEntities.decode(text)
  return text
}

module.exports = Mailbox
