'use strict'

const x = (tagName, attr, children) => {
	const element = {}
	const childNodes = []
	if (attr) childNodes.push({ _attr: attr })
	if (children && Array.isArray(children)) childNodes.push(...children)
	if (children && !Array.isArray(children)) childNodes.push(children)
	element[tagName] = childNodes
	return element
}

const say = text => x('Say', { voice: 'Polly.Marlene' }, text)
const redirect = path => x('Redirect', { method: 'GET' }, path)
const hangup = () => x('Hangup')
const pause = length => x('Pause', { length })

const withDoctype = xml => ['<?xml version="1.0" encoding="UTF-8"?>', xml].join('\n')

module.exports = { x, say, redirect, hangup, pause, withDoctype }
