const EventEmitter = require('events')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const crypto = require('crypto')

const defaultTo = require('lodash/defaultTo')

var Token = require('./models/token.js')

class Authentication extends EventEmitter {
  /**
   * Connects to a MongoDB database using the specified credentials and options.
   * @param  {Object} credentials
   * @param  {string} credentials.host
   * @param  {string} credentials.database
   * @param  {string} [credentials.username]
   * @param  {string} [credentials.password]
   * @param  {number} [credentials.port]
   * @param  {Object} [options]
   * @param  {boolean} [options.connectOnInit]
   * @param  {Object} [dependencies]
   * @see {@link https://github.com/Automattic/mongoose|mongoose}
   * @param  {Function} [dependencies.mongoose]
   */

  constructor (credentials, options, dependencies) {
    super()

    this._credentials = {
      host: credentials.host,
      database: credentials.database,
      username: defaultTo(credentials.username, null),
      password: defaultTo(credentials.password, null),
      port: defaultTo(credentials.port, 27017)
    }

    options = defaultTo(options, {})

    this._options = {
      connectOnInit: defaultTo(options.connectOnInit, true)
    }

    dependencies = defaultTo(dependencies, {})

    this._dependencies = {
      mongoose: defaultTo(dependencies.mongoose, mongoose)
    }

    if (this._options.connectOnInit) {
      this.connect()
    }
  }

  /**
   * Attempts to connect to the mongo database using the credentials.
   * On success, 'connect' will be emitted.
   * In the event of any error, 'error' will be emitted.
   * Does nothing if it is already connected.
   */
  connect () {
    if (this.isConnected) {
      return
    }

    const host = this._credentials.host
    const port = this._credentials.port
    const database = this._credentials.database
    let uri

    const hasUsername = this._credentials.username !== null
    const hasPassword = this._credentials.password !== null
    if (hasUsername && hasPassword) {
      const username = this._credentials.username
      const password = this._credentials.password
      uri = `mongodb://${username}:${password}@${host}:${port}/${database}`
    } else {
      uri = `mongodb://${host}:${port}/${database}`
    }

    this._db = this._dependencies.mongoose.createConnection(uri)

    Token = Token(this._dependencies.mongoose, this._db)

    this._db.on('open', this._onConnect.bind(this))
    this._db.on('error', this._onError.bind(this))
  }

  /**
   * Disconnects from the mongo database and emits the 'disconnect' event.
   * Does nothing if it is already disconnected.
   */
  disconnect () {
    if (!this.isConnected) {
      return
    }

    this._db.close()
    this._onDisconnect()
  }

  generateToken (ipAddress) {
    const token = crypto.randomBytes(32).toString('hex')
    const timestamp = Date.now()
    Token.create({
      token,
      ipAddress,
      timestamp
    }, function (err, t) {
      if (err) {
        console.error(err)
        return
      }
      console.log({token, ipAddress, timestamp})
    })
    return token
  }

  validateToken (token) {
    return new Promise((resolve, reject) => {
      Token.find({
        token
      }, [
        '_id',
        'timestamp'
      ], (error, tokens) => {
        if (error) {
          reject(error)
        } else if (tokens.length === 0) {
          resolve(null)
        } else {
          const {
            _id,
            timestamp
          } = tokens[0]
          Token.update({
            _id
          }, {
            timestamp: Date.now()
          }, (error) => {
            if (error) {
              reject(error)
            } else {
              resolve(timestamp)
            }
          })
        }
      })
    })
  }

  /**
   * Emits the 'connect' event.
   */
  _onConnect () {
    this.emit('connect')
  }

  /**
   * Emits the 'disconnect' event.
   */
  _onDisconnect () {
    this.emit('disconnect')
  }

  /**
   * Emits the 'error' event with an Error.
   * @param  {(Error|string)} error
   */
  _onError (error) {
    if (!(error instanceof Error)) {
      error = new Error(error)
    }

    this.emit('error', error)
  }
}

module.exports = Authentication
