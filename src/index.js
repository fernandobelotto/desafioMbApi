require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const api = express()

api.use(cors())
api.use(express.json())
api.use(express.urlencoded({ extended: true }))
api.use(morgan('dev'))
api.use(require('./routes'))

api.listen(process.env.PORT || 3000)
