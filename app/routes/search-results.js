'use strict'

const createXml = require('xml')
const pick = require('lodash/pick')
const { stringify } = require('querystring')

const { searchPath, searchResultsPath, searchResultSelectedPath, departuresPath } = require('../paths')
const { x, say, redirect, pause, withDoctype, phoneKeysOnly } = require('../helpers')
const searchByDigits = require('../search-by-digits')

const searchResultsRoute = (req, res, next) => {
	const query = pick(req.query, ['Digits', 'originalDigits'])
	const elements = []

	const digits = String(phoneKeysOnly(query.Digits) || phoneKeysOnly(query.originalDigits) || '')
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
		gatherElements.push(say('Oder drücken Sie die 0, um nach einer anderen Station zu suchen.'))
		gatherElements.push(pause(0.3))
		gatherElements.push(say('Um diese Ansage zu wiederholen, drücken Sie bitte die Sterntaste.'))

		elements.push(x('Gather', {
			action: `${searchResultSelectedPath}?originalDigits=${digits}`, // @todo make this clean
			method: 'GET',
			input: 'dtmf',
			numDigits: 1,
			finishOnKey: '',
			actionOnEmptyResult: false
		}, gatherElements))

		// loop if nothing was selected
		elements.push(redirect(`${searchResultsPath}?${stringify(query)}`))
	}

	const xml = createXml(x('Response', null, elements))
	res.set('Content-Type', 'text/xml')
	res.end(withDoctype(xml))
}

module.exports = searchResultsRoute
