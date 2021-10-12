'use strict'

const createXml = require('xml')

const { x, say, redirect, withDoctype } = require('../helpers')
const { searchPath, searchResultsPath } = require('../paths')

const searchRoute = (req, res, next) => {
	const elements = []
	const gatherElements = [
		say('Bitte suchen Sie nach einer Station mit Hilfe der Buchstaben auf ihrer Telefontastatur. Wählen sie zum Beispiel 9, 6, 6 für Z, O, O. Für Leerzeichen benutzen Sie bitte die 0.'),
	]
	elements.push(x('Gather', {
		action: searchResultsPath,
		method: 'GET',
		input: 'dtmf',
		actionOnEmptyResult: false,
	}, gatherElements))

	// loop if nothing was selected
	elements.push(redirect(searchPath))

	const xml = createXml(x('Response', null, elements))
	res.set('Content-Type', 'text/xml')
	res.end(withDoctype(xml))
}

module.exports = searchRoute
