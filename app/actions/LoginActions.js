import {
	REQUEST,
	REQUEST_SUCCESS,
	REQUEST_FAILURE
} from '../reducers/BasicReducer'

export function request(name) {
	return {
		type: REQUEST,
		name: name,
	}
}

export function requestSuccess(name, data) {
	return {
		type: REQUEST_SUCCESS,
		name: name,
		data: data
	}
}

export function requestFailure(name, err) {
	return {
		type: REQUEST_FAILURE,
		name: name,
		error: err
	}
}

