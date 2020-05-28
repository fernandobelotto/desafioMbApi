const User = require('../models/User')
const ConfirmationCode = require('../models/ConfirmationCode')
const { encrypt } = require('../utils/crypto')
const validator = require('email-validator')
const moment = require('moment')

module.exports = {

  async getUserById(req, res) {
    const { id } = req.params
    const user = await User.findById(id)
    return res.json(user)
  },
  async getAllUsers(req, res) {
    const users = await User.find().sort('createdAt')
    return res.json(users)
  },
  async createUser(req, res) {
    try {
      const { email, password, loginOption } = req.body

      const { requestValid } = checkRequest(req.body)
      if (!requestValid) return res.status(400).json({ status: 'error' })

      const userRegistred = await checkIfEmailIsRegistred(email)
      if (userRegistred) return res.status(400).json({ status: 'error' })

      const emailIsValid = validator.validate(email)
      if (!emailIsValid) return res.status(400).json({ status: 'error' })

      const encryptedPassword = checkLoginOption(loginOption, password)
      if (encryptedPassword) req.body.password = encryptedPassword

      const user = await createNewUser(req.body)

      return res.status(200).json({ status: 'success', userId: user._id })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error' })
    }
  },
  async deleteUserById(req, res) {
    await User.deleteOne({ _id: req.params.id })
    return res.json({ ok: true })
  },
  async login(req, res) {
    try {
      const { email, password, loginOption } = req.body

      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ status: 'error' })

      if (user.loginOption === 'email') {
        const passwordChecked = checkPassword(user, password)
        if (!passwordChecked) return res.status(400).json({ status: 'error' })
      } else {
        if (user.loginOption !== loginOption) return res.status(400).json({ status: 'error' })
      }

      return res.status(200).json({ status: 'success', userId: user.id, name: user.name })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error' })
    }
  }
}

function checkRequest(request) {
  const { name, email, password, loginOption } = request

  const invalidFields = []

  if (!name) {
    invalidFields.push('Campo nome vazio')
  }
  if (!email) {
    invalidFields.push('Campo email vazio')
  }
  if (!(loginOption === 'google' || loginOption === 'facebook') && !password) {
    invalidFields.push('Campo password vazio')
  }
  if (loginOption !== 'email' && loginOption !== 'google' && loginOption !== 'facebook') {
    invalidFields.push('Campo loginOption inválido')
  }

  return { requestValid: invalidFields.length === 0, invalidFields }
}

async function checkIfEmailIsRegistred(email) {
  const userRegistred = await User.find({ email })
  return userRegistred.length > 0
}

async function createNewUser(request) {
  const { email, name, password, loginOption } = request

  const user = await User.create({
    email,
    name,
    password,
    loginOption
  })

  return user
}

function checkLoginOption(loginOption, password) {
  if (loginOption === 'email') {
    return encrypt(password)
  }
  return false
}

function checkPassword(user, password) {
  const encryptedPassword = encrypt(password)

  return user.password === encryptedPassword
}
