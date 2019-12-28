'use strict'

const { VoiceResponse } = require('twilio').twiml
const { searchPath } = require('./search')

const greetingPath = '/greeting'
const greetingRoute = (req, res, next) => {
	const response = new VoiceResponse()
	response.say('Herzlich Willkommen bei der VBB-Abfahrtshotline!', { voice: 'Polly.Marlene' })
	response.redirect({ method: 'GET' }, searchPath)
	res.set('Content-Type', 'text/xml')
	res.end(response.toString())
}

module.exports = { greetingPath, greetingRoute }
