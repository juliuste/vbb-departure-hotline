'use strict'

export const x = (tagName, attr, children) => {
	const element = {}
	const childNodes = []
	if (attr) childNodes.push({ _attr: attr })
	if (children && Array.isArray(children)) childNodes.push(...children)
	if (children && !Array.isArray(children)) childNodes.push(children)
	element[tagName] = childNodes
	return element
}

export const say = text => x('Say', { voice: 'Polly.Marlene' }, text)
export const redirect = path => x('Redirect', { method: 'GET' }, path)
export const hangup = () => x('Hangup')
export const pause = length => x('Pause', { length })

export const withDoctype = xml => ['<?xml version="1.0" encoding="UTF-8"?>', xml].join('\n')

export const digitsOnly = x => (String(x) || '').replace(/[^0-9]+/gi, '')
export const phoneKeysOnly = x => (String(x) || '').replace(/[^0-9#*]+/gi, '')
