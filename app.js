'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

let channelsHistory = []

app.set('view engine', 'pug')
app.enable('view cache')

app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('index', {channelsHistory})
})

app.post('/sakura_outgoing', bodyParser.json(), (req, res) => {
  if (req.body.payload &&
      req.body.payload.channels) {
    const channels = req.body.payload.channels

    channelsHistory.unshift(channels)
    if (channelsHistory.length > 10) {
      channelsHistory.pop()
    }

    postToThingSpeak(channels)
    res.send('OK')
  } else {
    res.status(404)
    res.send('NG')
  }
})


const postToThingSpeak = (channels) => {
  const thingSpeakApiKey = process.env.thingSpeakApiKey || null
  if (thingSpeakApiKey == null) {
    return
  }
  const panelVolt = valueFromChannels(channels, 0)
  const chargeAmp = valueFromChannels(channels, 1)
  const batteryVolt = valueFromChannels(channels, 2)
  const chargeWatt = valueFromChannels(channels, 3)

  let requestOptions = {
    method: 'post',
    url: 'https://api.thingspeak.com/update.json',
    json: {
      api_key: thingSpeakApiKey,
      field1: panelVolt,
      field2: chargeAmp,
      field3: batteryVolt,
      field4: chargeWatt
    }}

  request(requestOptions, (err, response, body) => {
    if (err) {
      console.log('Error at posting to ThingSpeak')
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
