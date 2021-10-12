'use strict'

import createXml from 'xml'

import { x, say, redirect, withDoctype } from '../helpers.js'
import { searchPath } from '../paths.js'

export default (req, res, next) => {
	console.info(`retrieving call from ${req.query.Caller || 'unknown'}`)

	const elements = []
	elements.push(say('Herzlich Willkommen bei der VBB-Abfahrtshotline!'))
	elements.push(redirect(searchPath))

	const xml = createXml(x('Response', null, elements))
	res.set('Content-Type', 'text/xml')
	res.end(withDoctype(xml))
}
