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

  // This fixes the issues in testing: cannot log after tests are done

  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        reject(true)
      } else {
        console.log('Email sent: ' + info.response)
        resolve(true)
      }
    })
  })
}

module.exports = { sendEmail }