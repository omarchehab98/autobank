const EventEmitter = require('events')
const _ = require('lodash')

class IMAP extends EventEmitter {
  constructor (options) {
    super()
    this.options = options
    this.state = 'disconnected'
    this._fakeMailServer = new MailServer()
  }

  connect () {
    // gmail is only used as an example here.
    if (this.options.host !== 'imap.gmail.com') {
      const error = new Error('Invalid credentials')
      error.textCode = 'AUTHENTICATIONFAILED'
      this.emit('error', error)
      return
    }
    this.emit('ready')
  }

  end () {
    this.state = 'disconnected'
    this.emit('end')
  }

  openBox (name, readOnly, callback) {
    _.defer(callback)
    this.state = 'connected'
  }

  search (flags, callback) {
    const mailArray = this._fakeMailServer.searchMail(flags)
    _.defer(() => {
      callback(undefined, mailArray)
    })
  }

  fetch (mailUID, options) {
    const mail = this._fakeMailServer.fetchMail(mailUID, options.markSeen)

    const fetch = new EventEmitter()
    _.delay(() => {
      fetch.emit('message', mail)
    }, 10)
    return fetch
  }

  setFlags (uids, flags, callback) {

  }

  __injectMail (mail) {
    this._fakeMailServer.injectMail(mail)
    this.emit('mail')
  }
}

class MailServer {
  constructor (markSeen) {
    this.mail = {}
    this.markSeen = markSeen
  }

  injectMail (mail) {
    this.mail[mail.uid] = mail
  }

  searchMail (flags) {
    const mailArray = _.filter(this.mail, mail => _.intersection(mail.flags, flags).length)
    return _.map(mailArray, mail => mail.uid)
  }

  fetchMail (uid, markSeen) {
    if (!this.mail[uid]) {
      return
    }
    let mail = this.mail[uid]
    if (markSeen) {
      mail.flags = ['SEEN']
    }
    return mail
  }
}

module.exports = IMAP
