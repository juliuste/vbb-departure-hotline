'use strict'

import allStations from 'vbb-stations/simple.js'
import cleanStationName from 'db-clean-station-name'

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

export default stationsById
