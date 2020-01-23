const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
})

const sendEmail = async (mailerOptions) => {

  const mailOptions = {
    from: process.env.EMAIL,
    to: mailerOptions.email,
    subject: mailerOptions.subject,
    html: mailerOptions.html
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })

}

module.exports = { sendEmail }