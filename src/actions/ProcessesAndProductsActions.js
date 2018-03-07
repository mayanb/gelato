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

		let team = 1
		return Storage.multiGet(['teamID', 'userID']).then(values => {
			let localStorage = {}
			values.forEach((element, i) => {
				let key = element[0]
				let val = element[1]
				localStorage[key] = val
			})
			team = localStorage['teamID']
			 return Networking.get(`/ics/${endpoint}/`)
				.query({ team_created_by: team })
				.then(res => {
					dispatch(requestSuccess(name, res.body))
				})
				.catch(e => {
					dispatch(requestFailure(name, e))
					throw e
				})
		})
	}
}

export function fetchTeams() {
	let name = 'TEAMS'
	return dispatch => {
		dispatch(request(name))
		return Networking.get(`/ics/teams/`)
			.then(res => {
				let teams = res.body
				console.log(teams)
				if(teams) {
					teams.sort(function(a, b) {
						if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
						if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
						return 0;
					})
					teams.unshift({id: null, name: "other"})
				}
				//filter for Dandelion MVP - only showing the dandelion teams
				teams = teams.filter(team => ['alabama', 'valencia', 'fulfillment', 'productmakers', 'unitedcold', 'other'].includes(team.name))
				dispatch(requestSuccess(name, teams))
			})
			.catch(e => {
				dispatch(requestFailure(name, e))
				throw e
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
