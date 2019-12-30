'use strict'

const createXml = require('xml')
const range = require('lodash/range')

const { x, say, redirect, withDoctype, phoneKeysOnly } = require('../helpers')

const { searchPath, searchResultsPath, departuresPath } = require('../paths')
const searchByDigits = require('../search-by-digits')

const searchResultSelectedRoute = (req, res, next) => {
	const elements = []

	const selected = String(phoneKeysOnly(req.query.Digits))
	const originalDigits = phoneKeysOnly(req.query.originalDigits)
	const searchResults = searchByDigits(originalDigits)

	if (selected === '0') {
		elements.push(redirect(searchPath))
	} else if (!range(searchResults.length).map(x => String(x + 1)).includes(selected)) {
		if (selected !== '*') elements.push(say('Fehler bei der Eingabe, bitte wählen Sie erneut.'))
		elements.push(redirect(`${searchResultsPath}?originalDigits=${originalDigits}`)) // @todo make this clean
	} else {
		const selectedStation = searchResults[selected - 1]
		elements.push(redirect(`${departuresPath}?station=${selectedStation.id}`)) // @todo make this clean
	}

	const xml = createXml(x('Response', null, elements))
	res.set('Content-Type', 'text/xml')
	res.end(withDoctype(xml))
}

module.exports = searchResultSelectedRoute
