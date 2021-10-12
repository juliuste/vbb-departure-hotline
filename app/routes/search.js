'use strict'

import createXml from 'xml'

import { x, say, redirect, withDoctype } from '../helpers.js'
import { searchPath, searchResultsPath } from '../paths.js'

export default (req, res, next) => {
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
