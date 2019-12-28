'use strict'

const express = require('express')
const http = require('http')
const corser = require('corser')
const compression = require('compression')

const { greetingPath, searchPath, searchResultsPath, searchResultSelectedPath, departuresPath } = require('./paths')
const greetingRoute = require('./routes/greeting')
const searchRoute = require('./routes/search')
const searchResultsRoute = require('./routes/search-results')
const searchResultSelectedRoute = require('./routes/search-result-selected')
const departuresRoute = require('./routes/departures')

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

const port = +process.env.PORT || 3000
server.listen(port, error => {
	if (error) {
		console.error(error)
		process.exit(1)
	}
	console.log(`Listening on port ${port}.`)
})
