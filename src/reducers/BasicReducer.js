import update from 'immutability-helper'
import Compute from '../resources/Compute'
export const REQUEST = 'REQUEST'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
export const REQUEST_FAILURE = 'REQUEST_FAILURE'
export const REQUEST_CREATE = 'REQUEST_CREATE'
export const REQUEST_CREATE_SUCCESS = 'REQUEST_CREATE_SUCCESS'
export const REQUEST_CREATE_FAILURE = 'REQUEST_CREATE_FAILURE'
export const REQUEST_DELETE = 'REQUEST_DELETE'
export const REQUEST_DELETE_SUCCESS = 'REQUEST_DELETE_SUCCESS'
export const REQUEST_DELETE_FAILURE = 'REQUEST_DELETE_FAILURE'
export const REQUEST_EDIT_ITEM = 'REQUEST_EDIT_ITEM'
export const REQUEST_EDIT_ITEM_SUCCESS = 'REQUEST_EDIT_ITEM_SUCCESS'
export const REQUEST_EDIT_ITEM_FAILURE = 'REQUEST_EDIT_ITEM_FAILURE'
export const REQUEST_REORDER = 'REQUEST_REORDER'
export const REQUEST_REORDER_SUCCESS = 'REQUEST_REORDER_SUCCESS'
export const REQUEST_REORDER_FAILURE = 'REQUEST_REORDER_FAILURE'
export const SELECT = 'SELECT'
export const PAGE = 'PAGE'
export const TOGGLE_EDITING = 'TOGGLE_EDITING'

export const FAILURE = 'FAILURE'

export function BasicReducer(state, action) {
	switch (action.type) {
		case REQUEST:
			return request(state, action)
		case REQUEST_SUCCESS:
			return requestSuccess(state, action)
		case REQUEST_FAILURE:
			return requestFailure(state, action)

		case REQUEST_CREATE:
			return requestCreate(state, action)
		case REQUEST_CREATE_SUCCESS:
			return requestCreateSuccess(state, action)
		case REQUEST_CREATE_FAILURE:
			return requestCreateFailure(state, action)

		case REQUEST_DELETE:
			return requestDelete(state, action)
		case REQUEST_DELETE_SUCCESS:
			return requestDeleteSuccess(state, action)
		case REQUEST_DELETE_FAILURE:
			return requestDeleteFailure(state, action)

		case REQUEST_EDIT_ITEM:
			return requestEditItem(state, action)
		case REQUEST_EDIT_ITEM_SUCCESS:
			return requestEditItemSuccess(state, action)
		case REQUEST_EDIT_ITEM_FAILURE:
			return requestEditItemFailure(state, action)

		case REQUEST_REORDER:
			return requestReorder(state, action)
		case REQUEST_REORDER_SUCCESS:
			return requestReorderSuccess(state, action)
		case REQUEST_REORDER_FAILURE:
			return requestReorderFailure(state, action)

		case SELECT:
			return select(state, action)
		case PAGE:
			return page(state, action)
		case TOGGLE_EDITING:
			return toggleEditing(state, action)
		default:
			return state
	}
}

function toggleEditing(state, action) {
	let old_val = state.ui.isEditing
	return update(state, {
		ui: {
			isEditing: {
				$set: !old_val,
			},
		},
	})
}

function request(state, action) {
	return update(state, {
		ui: {
			isFetchingData: {
				$set: true,
			},
		},
	})
}

function requestSuccess(state, action) {
	if (action.append) {
		return update(state, {
			ui: {
				$merge: { isFetchingData: false },
			},
			data: {
				$push: action.data,
			},
		})
	}

	return update(state, {
		ui: {
			$merge: {
				isFetchingData: false,
			},
		},
		data: {
			$set: action.data,
		},
	})
}

function requestFailure(state, action) {
	return update(state, {
		ui: {
			$merge: {
				isFetchingData: false,
				error: action.error,
			},
		},
	})
}

function requestCreate(state, action) {
	return update(state, {
		ui: {
			isCreatingItem: {
				$set: true,
			},
		},
	})
}

function requestCreateSuccess(state, action) {
	let position = state.data.find(e => e.id === action.item.id) || 0
	return update(state, {
		ui: {
			$merge: {
				isCreatingItem: false,
			},
		},
		data: {
			$splice: [[position, 0, action.item]],
		},
	})
}

function requestCreateFailure(state, action) {
	console.error('API Error', action)
	alert('Oh no! Something went wrong!\n' + JSON.stringify(action.error))
	return update(state, {
		ui: {
			$merge: {
				isFetchingData: false,
				error: action.error,
			},
		},
	})
}

function requestDelete(state, action) {
	return update(state, {
		ui: {
			isDeletingItem: {
				$set: true,
			},
		},
	})
}

function requestDeleteSuccess(state, action) {
	let task_index = state.data.findIndex(e =>
		Compute.equate(e.id, action.item.id)
	)
	if (task_index === -1) return state
	return update(state, {
		data: {
			$splice: [[task_index, 1]],
		},
		ui: {
			isDeletingItem: {
				$set: false,
			},
		},
	})
}

function requestDeleteFailure(state, action) {
	return update(state, {
		ui: {
			$merge: {
				isDeletingData: false,
				error: action.error,
			},
		},
	})
}

function requestEditItem(state, action) {
	return update(state, {
		ui: {
			isEditingItem: {
				$set: true,
			},
		},
	})
}

function requestEditItemSuccess(state, action) {
	let task_index = state.data.findIndex(e =>
		Compute.equate(e.id, action.item.id)
	)
	if (task_index === -1) return state
	let obj = { [action.field]: action.value }
	return update(state, {
		ui: {
			isEditingItem: {
				$set: false,
			},
		},
		data: {
			[task_index]: {
				$merge: obj,
			},
		},
	})
}

function requestEditItemFailure(state, action) {
	return update(state, {
		ui: {
			$merge: {
				isEditingItem: false,
				error: action.error,
			},
		},
	})
}

function requestReorder(state /*, action */) {
	return update(state, {
		ui: {
			isReordering: { $set: true },
		},
	})
}

function requestReorderSuccess(state, action) {
	let old_data = state.data
	let old_rank = old_data.findIndex(e => e.id === action.id)
	let item = old_data[old_rank]

	// actually reorder the  array
	let ns = update(state, {
		data: {
			$splice: [[old_rank, 1], [action.new_rank, 0, item]],
		},
		ui: {
			isReordering: { $set: false },
		},
	})

	// update all the ranks to match the new order in the array
	for (var i = 0; i < ns.data.length; i++) {
		ns.data[i].rank = i
	}

	// return
	return ns
}

function requestReorderFailure(state /*, action */) {
	return update(state, {
		ui: {
			isReordering: { $set: false },
		},
	})
}

function select(state, action) {
	// get the page number:
	let index = action.index
	let pageNumber = Math.trunc(index / state.ui.page_size)
	return update(state, {
		ui: {
			$merge: {
				selectedItem: index,
				currentPage: pageNumber,
			},
		},
	})
}

function page(state, action) {
	return update(state, {
		ui: {
			currentPage: {
				$set: state.ui.currentPage + action.direction,
			},
		},
	})
}
