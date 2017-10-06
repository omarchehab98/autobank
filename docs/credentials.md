```js
// src/credentials.js
{
  "webserver": {
    "host": "localhost",
    "port": 8080,
    // `staticDirectory`: path to build directory relative to root directory of project
    "staticDirectory": "dist"
  },
  "api": {
    "privateKey": "somerandomstringhere",
    // `path`: prefix to API endpoints
    "path": "/api/v1",
    "host": "localhost",
    "port": 8081
  },
  "authentication": {
    "host": "localhost",
    "port": 27017,
    // `database`: mongodb database name
    "database": "eun",
    // `authSource`: optional
    "authSource": "",
    // `username`: optional
    "username": "",
    // `password`: optional
    "password": ""
  },
  "expenses": {
    "host": "localhost",
    "port": 27017,
    // `database`: mongodb database name, can be equal `authentication.database`
    "database": "eun",
    // `authSource`: optional
    "authSource": "",
    // `username`: optional
    "username": "",
    // `password`: optional
    "password": ""
  },
  // `mailbox`: optional, if you want to enable email monitoring you should fill it out.
  // For testing, you can inject data directly into mongo.
  "mailbox": {
    "host": "mail.example.com",
    "port": 993,
    "user": "foo@mail.example.com",
    "password": "",
    "tls": true,
    "tlsOptions": {
      "rejectUnauthorized": false
    }
  }
}

// src/client/environment.js
{
  'apiUrl': 'http://localhost:8081/api/v1'
}
```
