const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
  process.env.EMAILCLIENTID, // ClientID
  process.env.EMAILCLIENTSECRET, // Client Secret
  process.env.EMAILURL // Redirect URL
)

oauth2Client.setCredentials({
  refresh_token: process.env.EMAILREFRESHTOKEN
})

const accessToken = oauth2Client.getAccessToken()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    clientId: process.env.EMAILCLIENTID,
    clientSecret: process.env.EMAILCLIENTSECRET,
    refreshToken: process.env.EMAILREFRESHTOKEN,
    accessToken: accessToken
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
        return reject(true)
      } else {
        console.log('Email sent: ' + info.response)
        return resolve(true)
      }
    })
  })
}

module.exports = { sendEmail }