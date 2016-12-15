'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

const thingSpeakApiKey = process.env.thingSpeakApiKey || null
const port = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'
let channelsHistory = []

app.set('view engine', 'pug')
app.enable('view cache')

app.listen(port, host)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('index', {channelsHistory})
})

app.post('/', bodyParser.json(), (req, res) => {
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
  if (thingSpeakApiKey == null) { return }
  console.log('post to ThingSpeak')

  let jsonToPost = {api_key: thingSpeakApiKey}
  for (let i = 0; i < 8; i++) {
    let channelValue = valueFromChannels(channels, i)
    if (channelValue) {
      jsonToPost["field" + (i+1)] = channelValue
    }
  }

  let requestOptions = {
    method: 'post',
    url: 'https://api.thingspeak.com/update.json',
    json: jsonToPost
  }

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
