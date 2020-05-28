var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

async function sendEmailService (email, code) {
  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Código para alteração de senha.',
    text: `Seu código de alteração de senha é: ${code}`
  }

  const { response } = await transporter.sendMail(mailOptions).catch(error => error)
  return response.search('OK') !== -1
}

module.exports = { sendEmailService }
