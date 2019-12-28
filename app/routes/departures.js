'use strict'

const createXml = require('xml')
const { departures } = require('bvg-hafas')('juliuste/vbb-departures')
const cleanStationName = require('db-clean-station-name')
const get = require('lodash/get')
const { DateTime } = require('luxon')
const timeout = require('p-timeout')

const { x, say, hangup, pause, withDoctype } = require('../helpers')
const stationsById = require('../stations')

const productName = product => {
	if (product === 'suburban') return 'S-Bahn'
	if (product === 'subway') return 'U-Bahn'
	if (product === 'tram') return 'Straßenbahn'
	if (product === 'bus') return 'Bus'
	if (product === 'ferry') return 'Fähre'
	if (product === 'regional') return 'Zug'
	throw new Error(`unexpected product: ${product}`)
}

const departuresRoute = async (req, res, next) => {
	const elements = []
	const selectedStation = stationsById.get(req.query.station || '')
	if (!selectedStation) {
		elements.push(say('Leider ist ein unerwarteter Fehler aufgetreten, bitte versuchen Sie es später erneut.'))
		elements.push(hangup())
	} else {
		elements.push(say(`Nächste Abfahrten für ${selectedStation.name}:`))
		try {
			const departuresAtStation = await timeout(departures(selectedStation.id, {
				remarks: false,
				stopovers: false
			}), 4500)
			departuresAtStation
				.map(departure => ({
					...departure,
					direction: cleanStationName(departure.direction || '') || null
				}))
				.filter(departure => (departure.when || (departure.cancelled && departure.scheduledWhen)) && get(departure, 'line.product') && get(departure, 'line.name') && departure.direction) // @todo direction required?
				.filter(departure => get(departure, 'line.product') !== 'express') // @todo
				.forEach(departure => {
					// @todo: remarks
					// cancelled
					if (departure.cancelled) {
						const message = [
							productName(get(departure, 'line.product')),
							' ',
							get(departure, 'line.name'),
							' Richtung ',
							departure.direction,
							'. Ursprüngliche Abfahrtszeit: ',
							DateTime.fromISO(departure.when || departure.scheduledWhen, { setZone: true }).toFormat('HH:mm'),
							' Uhr, fällt heute leider aus.'
						].join('')
						elements.push(say(message))
					} else {
						// not cancelled
						const baseMessage = [
							productName(get(departure, 'line.product')),
							' ',
							get(departure, 'line.name'),
							' Richtung ',
							departure.direction,
							'. Abfahrt heute: ',
							DateTime.fromISO(departure.when, { setZone: true }).toFormat('HH:mm'),
							' Uhr.'
						].join('')
						const delayInMinutes = Number.isInteger(departure.delay) ? Math.round(Math.abs(departure.delay) / 60) : null
						const delayMessage = Number.isInteger(delayInMinutes) ? [
							(delayInMinutes === 0) ? 'Kommt pünktlich.' : null,
							(departure.delay > 0) ? `${delayInMinutes} Minute${delayInMinutes !== 1 ? 'n' : ''} verspätet.` : null,
							(departure.delay < 0) ? `${delayInMinutes} Minute${delayInMinutes !== 1 ? 'n' : ''} zu früh.` : null
						].filter(Boolean).join('') : ''
						const message = [baseMessage, delayMessage].filter(Boolean).join(' ')
						elements.push(say(message))
					}
					elements.push(pause(0.3))
				})
		} catch (error) {
			elements.push('Leider ist bei der Abfrage ein Fehler aufgetreten, bitte versuchen Sie es später erneut.')
			elements.push(pause(0.3))
		}
		elements.push(say('Wir danken für Ihren Anruf und wünschen Ihnen noch einen angenehmen Tag.'))
		elements.push(hangup())
	}

	const xml = createXml(x('Response', null, elements))
	res.set('Content-Type', 'text/xml')
	return res.end(withDoctype(xml))
}

module.exports = departuresRoute
