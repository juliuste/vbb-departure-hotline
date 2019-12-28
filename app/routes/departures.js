'use strict'

const createXml = require('xml')

const { x, say, hangup, withDoctype } = require('../helpers')
const stationsById = require('../stations')

const departuresRoute = (req, res, next) => {
	const elements = []
	const selectedStation = stationsById.get(req.query.station || '')
	if (!selectedStation) {
		elements.push(say('Leider ist ein unerwarteter Fehler aufgetreten, bitte versuchen Sie es später erneut.'))
		elements.push(hangup())
	} else {
		elements.push(say(`Abfahrten für Station ${selectedStation.name}.`))
		elements.push(say('Schönen Tag noch.'))
		elements.push(hangup())
	}

	const xml = createXml(x('Response', null, elements))
	res.set('Content-Type', 'text/xml')
	res.end(withDoctype(xml))
}

module.exports = departuresRoute
