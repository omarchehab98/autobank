function Token (mongoose, db) {
  const tokenSchema = new mongoose.Schema({
    token: String,
    ipAddress: String,
    timestamp: Number
  })
  return db.model('Token', tokenSchema)
}

module.exports = Token
