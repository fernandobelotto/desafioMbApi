const Event = require('../models/Event')

module.exports = {

  async getEventById(req, res) {
    const { id } = req.params

    const event = await Event.findById(id)

    return res.json(event)
  },
  async getAllEvents(req, res) {
    const events = await Event.find().populate('tickets')
    return res.json(events)
  },
  async createEvent(req, res) {
    try {
      const { requestValid, invalidFields } = checkRequest(req.body)
      if (!requestValid) {
        return res.status(500).json({ status: 'algum campo invalido', invalidFields })
      }
      await createEvent(req.body)
      return res.status(200).json({ status: 'success' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error' })
    }
  },
  async deleteEventById(req, res) {
    await Event.deleteOne({ _id: req.params.id })
    return res.json({ ok: true })
  },
  async deleteAllEvents(req, res) {
    await Event.remove()
    return res.json({ ok: true })
  }
}
function checkRequest(request) {
  const { eventName, eventDate, eventLatitude, eventLongitude, eventPlace, eventDescription } = request

  const invalidFields = []

  if (!eventName) {
    invalidFields.push('Campo eventName vazio')
  }
  if (!eventDate) {
    invalidFields.push('Campo eventDate vazio')
  }
  if (!eventLongitude) {
    invalidFields.push('Campo eventLongitude vazio')
  }
  if (!eventLatitude) {
    invalidFields.push('Campo eventLatitude vazio')
  }
  if (!eventPlace) {
    invalidFields.push('Campo eventLatitude vazio')
  }
  if (!eventDescription) {
    invalidFields.push('Campo eventLatitude vazio')
  }

  return { requestValid: invalidFields.length === 0, invalidFields }
}

async function createEvent(request) {
  const { eventName, eventDate, eventLatitude, eventLongitude, eventPlace, eventDescription } = request

  const event = await Event.create({
    eventName,
    eventDate,
    eventLatitude,
    eventLongitude,
    eventPlace,
    eventDescription
  })

  return event
}
