'use strict'

const createXml = require('xml')

const { x, say, redirect, withDoctype } = require('../helpers')
const { searchPath } = require('../paths')

const greetingRoute = (req, res, next) => {
	console.info(`retrieving call from ${req.query.Caller || 'unknown'}`)

	const elements = []
	elements.push(say('Herzlich Willkommen bei der VBB-Abfahrtshotline!'))
	elements.push(redirect(searchPath))

	const xml = createXml(x('Response', null, elements))
	res.set('Content-Type', 'text/xml')
	res.end(withDoctype(xml))
}

module.exports = greetingRoute
