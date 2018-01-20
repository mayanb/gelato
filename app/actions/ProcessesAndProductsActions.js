import { Storage } from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import Compute from '../resources/Compute'
import { 
	REQUEST, 
	REQUEST_SUCCESS, 
	REQUEST_FAILURE 
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
	return (dispatch) => {
	    dispatch(request(name))
			return Networking.get(`/ics/${endpoint}/`)
				.query({team_created_by: 1})
				.end(function(err, res) {
					if (err || !res.ok) {
						dispatch(requestFailure(name, err))
					} else {
						dispatch(requestSuccess(name, res.body))
					}
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
		data: data
	}
}

function requestFailure(name, err) {
	return {
		type: REQUEST_FAILURE,
		name: name,
		error: err
	}
}

export function updateAttribute(task, attribute_id, new_value) {
	let name = task.is_open ? OPEN_TASKS : COMPLETED_TASKS
	return (dispatch) => {
		let payload = {
			task: task.id,
			attribute: attribute_id, 
			value: new_value,
		}

		return Networking.post('/ics/taskAttributes/create/')
			.send(payload)
			.end(function(err, res) {
				if (err || !res.ok) {
					dispatch(updateAttributeFailure(name, err))
				} else {
					dispatch(updateAttributeSuccess(name, res.body))
				}
			})

  	}
}

function updateAttributeSuccess(name, data) {
	return {
		name: name,
		type: UPDATE_ATTRIBUTE_SUCCESS,
		data: data,
	}
}

function updateAttributeFailure(name, err) {
	return {
		name: name,
		type: UPDATE_ATTRIBUTE_FAILURE,
		error: err
	}
}