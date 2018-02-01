import {
	REQUEST,
	REQUEST_SUCCESS,
	REQUEST_FAILURE,
	USER_LOGOUT
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

export function logout() {
	return {
		type: USER_LOGOUT
	}
}

