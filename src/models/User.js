const mongoose = require('../database')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    require: false
  },
  loginOption: {
    type: String,
    required: true
  },
  tickets: [{
    type: mongoose.Types.ObjectId,
    ref: 'Ticket'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema)
