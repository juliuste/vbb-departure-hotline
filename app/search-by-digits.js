'use strict'

import search from 'vbb-stations-t9'
import stationsById from './stations.js'

export default (digits) => {
	const matching = search(digits, 5)
	return matching
		.map(m => stationsById.get(m.id) || null)
		.filter(Boolean)
}
