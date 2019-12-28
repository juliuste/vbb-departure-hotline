'use strict'

const { VoiceResponse } = require('twilio').twiml

const searchPath = '/search'
const searchRoute = (req, res, next) => {
	const response = new VoiceResponse()
	response.say('Dies ist die Suche.', { voice: 'Polly.Marlene' })
	response.pause(2)
	response.say('Schönen Tag noch.', { voice: 'Polly.Marlene' })
	response.hangup()
	res.set('Content-Type', 'text/xml')
	res.end(response.toString())
}

module.exports = { searchPath, searchRoute }
