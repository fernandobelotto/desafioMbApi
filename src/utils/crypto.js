const crypto = require('crypto')

function encrypt (text) {
  return crypto.createHash(process.env.CRYPTO_HASH).update(text).digest(process.env.CRYPTO_DIGEST)
}

module.exports = { encrypt }
