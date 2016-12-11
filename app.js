'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const thingSpeakApiKey = process.env.thingSpeakApiKey

const app = express()
app.listen(process.env.Port || 3000, process.env.HOST || '0.0.0.0')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('hello')
})

app.post('/sakura_outgoing', bodyParser.json(), (req, res) => {
  if (req.body.payload &&
      req.body.payload.channels) {
    const channels = req.body.payload.channels
    console.log(channels)
    postToThingSpeak(channels)
    res.send('OK')
  } else {
    res.status(404)
    res.send('NG')
  }
})

const postToThingSpeak = (channels) => {
  const panelVolt = valueFromChannels(channels, 0)
  const chargeAmp = valueFromChannels(channels, 1)
  const batteryVolt = valueFromChannels(channels, 2)
  const chargeWatt = valueFromChannels(channels, 3)

  request({
    method: 'post',
    url: 'https://api.thingspeak.com/update.json',
    // url: 'https://asuki.webscript.io/sakura',
    json: {
      api_key: process.env.thingspeakApiKey,
      field1: panelVolt,
      field2: chargeAmp,
      field3: batteryVolt,
      field4: chargeWatt
    }}, (err, response, body) => {
      console.log('sent to server')
      if (err) {
        console.log('err')
        console.log('body', body)
      }
    })
}

const valueFromChannels = (channels, channel) => {
  const candidates = channels.filter((c) => {return c.channel == channel})
  if (candidates.length > 0) {
    return candidates[0].value
  }
}
