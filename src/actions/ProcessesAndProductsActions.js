import Storage from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import Compute from '../resources/Compute'
import {
	REQUEST,
	REQUEST_SUCCESS,
	REQUEST_FAILURE,
} from '../reducers/BasicReducer'

const PROCESSES = 'PROCESSES'
const PRODUCTS = 'PRODUCTS'

export function fetchProcesses() {
	return fetch(PROCESSES)
}

export function fetchProducts() {
	return fetch(PRODUCTS)
}

function fetch(name) {
	let endpoint = name === PROCESSES ? 'processes' : 'products'
	return dispatch => {
		dispatch(request(name))

		const payload = {
			team_created_by: 1,
		}

		return Storage.multiGet(['teamID', 'userID', 'selectedTags']).then(values => {
			let localStorage = {}
			values.forEach((element, i) => {
				let key = element[0]
				let val = element[1]
				localStorage[key] = val
			})
			payload['team_created_by'] = localStorage['teamID']
			if (localStorage['selectedTags']) {
				payload['tags'] = JSON.parse(localStorage['selectedTags']).join(',')
				payload['suggestTags'] = true
			}
			 return Networking.get(`/ics/${endpoint}/`)
				.query(payload)
				.then(res => {
					Compute.annotateWithSearchVector(res.body)
					dispatch(requestSuccess(name, res.body))
				})
				.catch(e => {
					dispatch(requestFailure(name, e))
					throw e
				})
		})
	}
}

function request(name) {
	return {
		type: REQUEST,
		name: name,
	}
}

function requestSuccess(name, data) {
	return {
		type: REQUEST_SUCCESS,
		name: name,
		data: data,
	}
}

function requestFailure(name, err) {
	return {
		type: REQUEST_FAILURE,
		name: name,
		error: err,
	}
}
