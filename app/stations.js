'use strict'

const allStations = require('vbb-stations/simple')
const cleanStationName = require('db-clean-station-name')

// create stations index
const stationsById = new Map()
allStations.forEach(station => {
	const name = cleanStationName(station.name || '')
	if (name) {
		stationsById.set(station.id, {
			...station,
			name,
		})
	}
})

module.exports = stationsById
