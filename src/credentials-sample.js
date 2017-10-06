module.exports = {
  'webserver': {
    'host': 'localhost',
    'port': 8080,
    'staticDirectory': 'dist'
  },
  'api': {
    'privateKey': 'somerandomstringhere',
    'path': '/api/v1',
    'host': 'localhost',
    'port': 8081
  },
  'authentication': {
    'host': 'localhost',
    'port': 27017,
    'database': 'eun',
    'authSource': '',
    'username': '',
    'password': ''
  },
  'expenses': {
    'host': 'localhost',
    'port': 27017,
    'database': 'eun',
    'authSource': '',
    'username': '',
    'password': ''
  },
  'mailbox': {
    'host': 'mail.example.com',
    'port': 993,
    'user': 'foo@mail.example.com',
    'password': '',
    'tls': true,
    'tlsOptions': {
      'rejectUnauthorized': false
    }
  }
}
