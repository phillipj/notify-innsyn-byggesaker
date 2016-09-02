const twilio = require('twilio')

const sid = process.env.TWILIO_ACCOUNT_SID
const token = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_NUMBER

const client = require('twilio')(sid, token)

module.exports.sendSms = function(to, body) {
  client.messages.create({ to, body, from: fromNumber }, function(err, data) {
    if (err) {
      console.error('Could not send SMS')
      console.error(err)
    } else {
      console.log('SMS sent')
    }
  })
}
