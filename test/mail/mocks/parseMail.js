function parseMail (message) {
  return new Promise((resolve) => {
    resolve(message)
    return new Promise((resolve, reject) => {
      resolve()
    })
  })
}

module.exports = parseMail
