const express = require('express')
const routes = express.Router()

const UserController = require('./controllers/UserController')
const TicketController = require('./controllers/TicketController')
const EventController = require('./controllers/EventController')

routes.post('/user/login', UserController.login)
routes.post('/user', UserController.createUser)
routes.get('/user/all', UserController.getAllUsers)
routes.get('/user/:id', UserController.getUserById)
routes.delete('/user/:id', UserController.deleteUserById)

routes.post('/ticket/:userId', TicketController.buyTicketByUserId)

routes.post('/ticket', TicketController.createTicket)
routes.post('/ticket/list', TicketController.createTicketsByList)
routes.post('/ticket/refund:id', TicketController.refundTicketById)
routes.get('/ticket/all', TicketController.getAllTickets)
routes.delete('/ticket/all', TicketController.deleteAllTickets)
routes.get('/ticket/:userId', TicketController.getAllTicketsByUserId)
routes.get('/ticket/:eventId/all', TicketController.getAllTicketsByEventId)
routes.get('/ticket/:id', TicketController.getTicketById)
routes.delete('/ticket/:id', TicketController.deleteTicketById)
routes.delete('/ticket/:eventId/all', TicketController.deleteAllTicketsByEvent)

routes.post('/event', EventController.createEvent)
routes.get('/event/all', EventController.getAllEvents)
routes.delete('/event/all', EventController.deleteAllEvents)
routes.get('/event/:id', EventController.getEventById)
routes.delete('/event/:id', EventController.deleteEventById)

module.exports = routes
