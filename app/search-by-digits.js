'use strict'

const search = require('vbb-stations-t9')
const stationsById = require('./stations')

const searchByDigits = (digits) => {
	const matching = search(digits, 5)
	return matching
		.map(m => stationsById.get(m.id) || null)
		.filter(Boolean)
}

module.exports = searchByDigits
