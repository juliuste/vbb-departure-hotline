'use strict'

import createXml from 'xml'
import createHafas from 'bvg-hafas'
import cleanStationName from 'db-clean-station-name'
import get from 'lodash/get.js'
import pick from 'lodash/pick.js'
import last from 'lodash/last.js'
import { stringify } from 'querystring'
import { DateTime } from 'luxon'
import timeout from 'p-timeout'

import { x, say, hangup, pause, withDoctype, digitsOnly } from '../helpers.js'
import { departuresPath } from '../paths.js'
import stationsById from '../stations.js'

const { departures } = createHafas('juliuste/vbb-departure-hotline')

const productName = product => {
	if (product === 'suburban') return 'S-Bahn'
	if (product === 'subway') return 'U-Bahn'
	if (product === 'tram') return 'Straßenbahn'
	if (product === 'bus') return 'Bus'
	if (product === 'ferry') return 'Fähre'
	if (product === 'regional') return 'Zug'
	throw new Error(`unexpected product: ${product}`)
}

export default async (req, res, next) => {
	const query = pick(req.query, ['station', 'time'])

	const elements = []
	const selectedStation = stationsById.get(digitsOnly(query.station) || '')
	if (!selectedStation) {
		elements.push(say('Leider ist ein unerwarteter Fehler aufgetreten, bitte versuchen Sie es später erneut.'))
		elements.push(hangup())
	} else {
		if (!query.time) elements.push(say(`Nächste Abfahrten für ${selectedStation.name}:`))
		try {
			const departuresAtStation = await timeout(departures(selectedStation.id, {
				when: query.time || undefined,
				remarks: false,
				stopovers: false,
			}), 4500)
			const validDepartures = departuresAtStation
				.map(departure => ({
					...departure,
					direction: cleanStationName(departure.direction || '') || null,
				}))
				.filter(departure => (departure.prognosedWhen || departure.when || departure.plannedWhen) && get(departure, 'line.product') && get(departure, 'line.name') && departure.direction) // @todo direction required?
				.filter(departure => get(departure, 'line.product') !== 'express') // @todo

			if (validDepartures.length === 0) {
				elements.push(say(`Aktuell scheint es keine Abfahrten von ${selectedStation.name} zu geben. Versuchen Sie es gegebenenfalls zu einem späteren Zeitpunkt erneut.`))
				elements.push(pause(0.3))
			}

			validDepartures
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
							DateTime.fromISO(departure.plannedWhen, { setZone: true }).toFormat('HH:mm'),
							' Uhr, fällt heute leider aus.',
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
							DateTime.fromISO(departure.prognosedWhen || departure.when || departure.plannedWhen, { setZone: true }).toFormat('HH:mm'),
							' Uhr.',
						].join('')
						const delayInMinutes = Number.isInteger(departure.delay) ? Math.round(Math.abs(departure.delay) / 60) : null
						const delayMessage = Number.isInteger(delayInMinutes)
							? [
								(delayInMinutes === 0) ? 'Kommt pünktlich.' : null,
								(departure.delay > 0) ? `${delayInMinutes} Minute${delayInMinutes !== 1 ? 'n' : ''} verspätet.` : null,
								(departure.delay < 0) ? `${delayInMinutes} Minute${delayInMinutes !== 1 ? 'n' : ''} zu früh.` : null,
							].filter(Boolean).join('')
							: ''
						const message = [baseMessage, delayMessage].filter(Boolean).join(' ')
						elements.push(say(message))
					}
					elements.push(pause(0.3))
				})

			// @todo check if there are laterThan/earlierThan pointers available
			// in hafas for departure requests, like the ones for journeys
			if (departuresAtStation.length > 0) {
				const { when: lastDepartureTime } = last(departuresAtStation)
				const laterTime = DateTime.fromISO(lastDepartureTime, { setZone: true })
					.plus({ minutes: 1 })
					.toISO({ suppressMilliseconds: true })

				elements.push(x('Gather', {
					action: `${departuresPath}?${stringify({ ...query, time: laterTime })}`, // @todo make this clean
					method: 'GET',
					input: 'dtmf',
					numDigits: 1,
					finishOnKey: '',
					actionOnEmptyResult: false,
				}, say('Für weitere Abfahrten drücken Sie bitte eine beliebige Taste.')))
			}
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
