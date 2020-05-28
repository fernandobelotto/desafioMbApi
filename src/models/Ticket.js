const mongoose = require('../database')

const TicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  eventId: {
    type: mongoose.Types.ObjectId,
    ref: 'Event',
    require: true
  },
  name: {
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    require: true,
    default: 0
  },
  refund: {
    type: Boolean,
    default: false,
    require: true
  }
})

module.exports = mongoose.model('Ticket', TicketSchema)
