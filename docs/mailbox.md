**eun-mailbox** is a simple email client that uses [IMAP](node-imap).

Receiving new mail is as easy as `mailbox.on('mail', doSomething)`

## Usage

```js
const Mailbox = require('eun-mailbox');

const credentials = {
  host: 'imap.gmail.com',
  user: 'omarchehab98@gmail.com',
  password: 'password'
};

const mailbox = new Mailbox(credentials);

mailbox.on('mail', mail => {
  console.log('mailbox has emitted "mail"\n', mail);
});
```

### Events

* connect
* disconnect
* mail
* error

#### connect

Emitted when connected to the IMAP server.

#### disconnect

Emitted when disconnected from the IMAP server.

#### mail

Emitted when there is unseen mail.

```js
{
  "from": "Omar Chehab <omarchehab98@gmail.com>",
  "subject": "Fwd: Large Transaction Warning",
  "date": "2017-02-19T20:45:32.000Z",
  "body": {
    "text": "Dear Omar,\nThank you for your response.\nRegards,\neun",
    "html": "<p>Dear Omar,</p><p>Thank you for your response.</p><p>Regards,</p><p><a href='https://github.com/omarchehab98/eun'>eun</a></p>"
  },
  "attachments": []
}
```

<!-- Definitions -->

[node-imap]: https://github.com/mscdex/node-imap
