import update from 'immutability-helper'
const SET_ERROR = 'SET_ERROR'
const CLEAR_ERROR = 'CLEAR_ERROR'

export function ErrorReducer(state, action) {
	switch (action.type) {
		case SET_ERROR:
			return setError(state, action)
		case CLEAR_ERROR:
			return clearError(state, action)
		default:
			return state
	}
}

function setError(state, action) {
	return update(state, {
		data: {
			$push: action.error,
		},
	})
}

function clearError(state, action) {
	let errors = state.data

	if (!errors.length) {
		return state
	}

	let errorIndex = state.data.findIndex(e => e.id === action.error.id)

	return update(state, {
		data: {
			$splice: [[errorIndex, 1]],
		},
	})
}
