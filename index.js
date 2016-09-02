const request = require('request')
const cheerio = require('cheerio')
const checksum = require('checksum')

const twilioClient = require('./lib/twilio-client')

const smsRecipientNr = process.env.SMS_RECIPIENT_NUMBER
const gaardsNr = process.env.GAARDS_NR
const bruksNr = process.env.BRUKS_NR
const url = `http://lokaldemokrati.asker.kommune.no/byggsak\?utf8\=%E2%9C%93\&query\=\&ndoktype\=\&saksaar\=\&saksnr\=\&enhet\=\&gnr\=${gaardsNr}\&bnr\=${bruksNr}\&from_date\=02.03.2016\&to_date\=\&commit\=s%C3%B8k`

const oneHour = 1000 * 60 * 60 // second -> minute -> hour

let lastChecksum

function pollAndNotify() {
  console.log('Polling for updates')

  request(url, (err, res, document) => {
    if (err) {
      return console.error('Error while requesting URL', err)
    }

    const $ = cheerio.load(document)

    const content = $('table').last().text()
    const newChecksum = checksum(content)

    if (lastChecksum && lastChecksum !== newChecksum) {
      twilioClient.sendSms(smsRecipientNr, 'Det har kommet oppdateringer i byggesaken!')
    }

    lastChecksum = newChecksum
  })
}

// perform initial poll at startup of application
pollAndNotify()
// then start to poll every hour for updates
setInterval(pollAndNotify, oneHour)

twilioClient.sendSms(smsRecipientNr, 'notify-innsyn-byggsaker is alive and kicking!')
