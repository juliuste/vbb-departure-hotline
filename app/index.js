'use strict'

const express = require('express')
const http = require('http')
const corser = require('corser')
const compression = require('compression')

const { greetingPath, greetingRoute } = require('./routes/greeting')
const { searchPath, searchRoute } = require('./routes/search')

const api = express()
const server = http.createServer(api)

// setup gzip compression
api.use(compression())

// setup cors
const allowed = corser.simpleRequestHeaders.concat(['User-Agent'])
api.use(corser.create({ requestHeaders: allowed }))

api.get(greetingPath, greetingRoute)
api.get(searchPath, searchRoute)

const port = +process.env.PORT || 3000
server.listen(port, error => {
	if (error) {
		console.error(error)
		process.exit(1)
	}
	console.log(`Listening on port ${port}.`)
})
