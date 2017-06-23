module.exports = {
  'webserver': {
    'host': 'localhost',
    'port': 3000
  },
  'api': {
    'privateKey': '',
    'path': '',
    'host': 'localhost',
    'port': 8080
  },
  'authentication': {
    'host': 'localhost',
    'port': 27017,
    'database': ''
  },
  'expenses': {
    'host': 'localhost',
    'port': 27017,
    'database': ''
  },
  'mailbox': {
    'host': 'localhost',
    'port': 993,
    'user': '',
    'password': '',
    'tls': true,
    'tlsOptions': {
      'rejectUnauthorized': true,
      'key': '',
      'cert': '',
      'ca': ''
    }
  }
}
