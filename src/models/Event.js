const mongoose = require('../database')

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    require: true
  },
  eventLongitude: {
    type: String,
    require: true
  },
  eventLatitude: {
    type: String,
    require: true
  },
  eventDescription: {
    type: String,
    require: true
  },
  eventPlace: {
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  eventDate: {
    type: String,
    require: true
  },
  tickets: [{
    type: mongoose.Types.ObjectId,
    ref: 'Ticket'
  }]
})

module.exports = mongoose.model('Event', EventSchema)
