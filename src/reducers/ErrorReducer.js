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
		ui: {
			$merge: { cleared: false },
		},
	})
}

function clearError(state, action) {
	let errors = state.data

	if (!errors.length) {
		return state
	}

	// if the currently displaying error isn't even this one
	// and we're not forcing it to clear
	if (
		!action.force &&
		action.error.errorID !== errors[errors.length - 1].errorID
	) {
		return state
	}

	// there's an error to clear, and we're either forcing it to clear
	// OR we know which error to clear
	return update(state, {
		ui: {
			$merge: { cleared: true },
		},
	})
}
