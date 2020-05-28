const Ticket = require('../models/Ticket')
const User = require('../models/User')
const Event = require('../models/Event')

module.exports = {

  async getTicketById (req, res) {
    const { id } = req.params

    const ticket = await Ticket.findById(id)

    return res.json(ticket)
  },
  async getAllTickets (req, res) {
    const tickets = await Ticket.find().sort('createdAt')
    return res.json(tickets)
  },
  async createTicket (req, res) {
    try {
      const { eventId } = req.body
      const eventRegistred = await findEvent(eventId)

      if (eventRegistred === null) {
        return res.status(400).json({ status: 'error' })
      }

      const { requestValid } = checkRequest(req.body)

      if (!requestValid) {
        return res.status(400).json({ status: 'error' })
      }

      const ticket = await createNewTicket(req.body)

      eventRegistred.tickets.push(ticket)

      await eventRegistred.save()

      return res.status(200).json({ status: 'success, ticket create' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error' })
    }
  },
  async deleteTicketById (req, res) {
    await Ticket.deleteOne({ _id: req.params.id })
    return res.json({ ok: true, status: 'ticket deleted' })
  },
  async deleteAllTickets (req, res) {
    await Ticket.remove()
    await User.updateMany({}, { tickets: [] })
    await Event.updateMany({}, { tickets: [] })
    return res.json({ ok: true, status: 'all tickets deleted' })
  },
  async deleteAllTicketsByEvent (req, res) {
    const { eventId } = req.params
    const eventRegistred = await findEvent(eventId)

    eventRegistred.tickets = []
    await eventRegistred.save()

    if (eventRegistred === null) {
      return res.status(400).json({ status: 'error' })
    }

    await Ticket.deleteMany({ eventId: req.params.eventId })
    return res.json({ ok: true, status: 'ticket deleted' })
  },
  async getAllTicketsByEventId (req, res) {
    const { eventId } = req.params
    const tickets = await Ticket.find({ eventId }).sort('createdAt')
    return res.json({ ok: true, tickets })
  },
  async buyTicketByUserId (req, res) {
    try {
      const { userId } = req.params
      const user = await User.findById(userId)
      const { tickets } = req.body

      for (const ticket of tickets) {
        const newTicket = await Ticket.findOneAndUpdate({ _id: ticket }, { userId: userId })
        newTicket.save()
      }
      return res.status(200).json({ status: 'success, purchased tickets', user: user.name })
    } catch (error) {
      console.log(error)
      return res.status(200).json({ status: 'error', error })
    }
  },
  async getAllTicketsByUserId (req, res) {
    const { userId } = req.params
    const tickets = await Ticket.find({ userId }).populate('eventId')
    return res.json({ ok: true, tickets })
  }
}

function checkRequest (request) {
  const { name, price } = request

  const invalidFields = []

  if (!name) {
    invalidFields.push('Campo name vazio')
  }
  if (!price) {
    invalidFields.push('Campo price vazio')
  }

  return { requestValid: invalidFields.length === 0, invalidFields }
}

async function createNewTicket (request) {
  const { price, name, eventId } = request
  const ticket = await Ticket.create({
    name,
    eventId,
    price
  })

  return ticket
}

async function findEvent (id) {
  const event = await Event.findById(id)
  return event
}
