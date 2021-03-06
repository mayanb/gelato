import { SET_ERROR, CLEAR_ERROR } from '../reducers/ErrorReducer'

export function handleError(err_type, err_time = 5000) {
	return dispatch => {
		let err_id = parseInt(Math.random() * 1000)
		dispatch(setError(err_type, err_id))
		return window.setTimeout(() => dispatch(clearError(err_id)), err_time)
	}
}

function setError(err_type, err_id) {
	return {
		name: 'ERROR',
		type: SET_ERROR,
		error: { errorType: err_type, errorID: err_id },
	}
}

function clearError(err_id) {
	return {
		name: 'ERROR',
		type: CLEAR_ERROR,
		errorID: err_id,
	}
}
