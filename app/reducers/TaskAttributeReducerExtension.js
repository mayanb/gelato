import update from 'immutability-helper'
import { BasicReducer } from './BasicReducer'
import Compute from '../resources/Compute'

export const UPDATE_ATTRIBUTE_SUCCESS = 'UPDATE_ATTRIBUTE_SUCCESS'
export const UPDATE_ATTRIBUTE_FAILURE = 'UPDATE_ATTRIBUTE_FAILURE'
export const RESET_JUST_CREATED = 'RESET_JUST_CREATED'
export const ADD_INPUT_SUCCESS = 'ADD_INPUT_SUCCESS'
export const ADD_OUTPUT_SUCCESS = 'ADD_OUTPUT_SUCCSS'
export const START_ADDING = 'START_ADDING'
export const ADD_FAILURE = 'ADD_FAILURE'
export const REMOVE_INPUT_SUCCESS = 'REMOVE_INPUT_SUCCESS'
export const REMOVE_OUTPUT_SUCCESS = 'REMOVE_OUTPUT_SUCCESS'

export function _taskAttribute(state, action) {
	let ns = BasicReducer(state, action)
	switch(action.type) {
		case UPDATE_ATTRIBUTE_SUCCESS:
      		return updateAttributeSuccess(ns, action)
		case UPDATE_ATTRIBUTE_FAILURE:
			return updateAttributeFailure(ns, action)
		case RESET_JUST_CREATED: 
			return resetJustCreated(ns, action)
		case ADD_OUTPUT_SUCCESS: 
			return addSuccess(ns, action, 'items')
		case ADD_INPUT_SUCCESS:
			return addSuccess(ns, action, 'inputs')
		case START_ADDING:
			return startAdding(ns, action)
		case ADD_FAILURE: 
			return addFailure(ns, action)
		case REMOVE_OUTPUT_SUCCESS:
			return removeSuccess(ns, action, 'items')
		case REMOVE_INPUT_SUCCESS:
			return removeSuccess(ns, action, 'inputs')
		default:
	    	return ns
	}
	return ns
}

function startAdding(state, action) {
	return update(state, {
		ui: {
			isAdding: { $set: true }
		}
	})
}

function updateAttributeSuccess(state, action) {
	let taskIndex = state.data.findIndex(e => Compute.equate(e.id, action.data.task))
	let attributeIndex = state.data[taskIndex].organized_attributes.findIndex(e => Compute.equate(e.id, action.data.attribute))
	return update(state, {
		data: {
			[taskIndex]: {
				organized_attributes: {
					[attributeIndex]: {
						$merge: {value: action.data}
					}
				}
			}
		}
	})
}

function updateAttributeFailure(state, action) {
	console.log('failed')
	return state
}

function resetJustCreated(state, action) {
	return update(state, {
		ui: {
			$merge: { hasJustCreatedItem: false }
		}
	})
}

function addSuccess(state, action, key) {
	let task_index = state.data.findIndex(e => Compute.equate(e.id, action.task_id))
	if (task_index === -1)
		return state
	return update(state, {
		data: {
			[task_index]: {
				[key]: {
					$push: [action.item]
				}
			}
		}, ui: {
			isAdding: {$set: false}
		}
	})
}

function addFailure(state, action) {
	return update(state, {
		ui: {
			isAdding: { $set: false }
		}
	})
}

function removeSuccess(state, action, key) {
	let task_index = state.data.findIndex(e => Compute.equate(e.id, action.task_id))
	console.log(task_index)
	if (task_index === -1)
		return state
	return update(state, {
		data: {
			[task_index]: {
				[key]: {
					$splice: [[action.index, 1]]
				}
			}
		}
	})
}