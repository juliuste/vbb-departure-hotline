'use strict'

import express from 'express'
import http from 'http'
import corser from 'corser'
import compression from 'compression'

import { greetingPath, searchPath, searchResultsPath, searchResultSelectedPath, departuresPath } from './paths.js'
import greetingRoute from './routes/greeting.js'
import searchRoute from './routes/search.js'
import searchResultsRoute from './routes/search-results.js'
import searchResultSelectedRoute from './routes/search-result-selected.js'
import departuresRoute from './routes/departures.js'

const getEnv = name => {
	const value = (process.env[name] || '').trim()
	if (!value) throw new Error(`missing env: ${name}`)
	return value
}

const api = express()
const server = http.createServer(api)

// setup gzip compression
api.use(compression())

// setup cors
const allowed = corser.simpleRequestHeaders.concat(['User-Agent'])
api.use(corser.create({ requestHeaders: allowed }))

api.get(greetingPath, greetingRoute)
api.get(searchPath, searchRoute)
api.get(searchResultsPath, searchResultsRoute)
api.get(searchResultSelectedPath, searchResultSelectedRoute)
api.get(departuresPath, departuresRoute)

const port = getEnv('PORT')
server.listen(port, error => {
	if (error) {
		console.error(error)
		process.exit(1)
	}
	console.log(`Listening on port ${port}.`)
})
