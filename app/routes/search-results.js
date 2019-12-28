'use strict'

const createXml = require('xml')

const { searchPath, searchResultSelectedPath, departuresPath } = require('../paths')
const { x, say, redirect, pause, withDoctype } = require('../helpers')
const searchByDigits = require('../search-by-digits')

const searchResultsRoute = (req, res, next) => {
	const elements = []

	const digits = String(req.query.Digits || req.query.originalDigits || '')
	const searchResults = searchByDigits(digits)
	if (searchResults.length === 0) {
		elements.push(say('Für ihre Eingabe wurden leider keine Ergebnisse gefunden.'))
		elements.push(redirect(searchPath))
	} else if (searchResults.length === 1) {
		elements.push(redirect(`${departuresPath}?station=${searchResults[0].id}`)) // @todo make this clean
	} else {
		const gatherElements = []
		gatherElements.push(say('Bitte wählen Sie:'))
		searchResults.forEach((result, index) => {
			gatherElements.push(say(`Für ${result.name}: Die ${index + 1}.`))
			gatherElements.push(pause(0.3))
		})
		gatherElements.push(say('Oder drücken Sie die Rautetaste, um nach einer anderen Station zu suchen.'))
		gatherElements.push(pause(0.3))
		gatherElements.push(say('Um diese Ansage zu wiederholen, drücken Sie bitte die Sterntaste.'))

		elements.push(x('Gather', {
			action: `${searchResultSelectedPath}?originalDigits=${digits}`, // @todo make this clean
			method: 'GET',
			input: 'dtmf',
			numDigits: 1,
			actionOnEmptyResult: false
		}, gatherElements))
	}

	const xml = createXml(x('Response', null, elements))
	res.set('Content-Type', 'text/xml')
	res.end(withDoctype(xml))
}

module.exports = searchResultsRoute
