import update from 'immutability-helper'
import { BasicReducer } from './BasicReducer'
import Compute from '../resources/Compute'

export const UPDATE_ATTRIBUTE_SUCCESS = 'UPDATE_ATTRIBUTE_SUCCESS'
export const UPDATE_ATTRIBUTE_FAILURE = 'UPDATE_ATTRIBUTE_FAILURE'
export const RESET_JUST_CREATED = 'RESET_JUST_CREATED'

export function _taskAttribute(state, action) {
	let ns = BasicReducer(state, action)
	switch(action.type) {
		case UPDATE_ATTRIBUTE_SUCCESS:
      		return updateAttributeSuccess(ns, action)
		case UPDATE_ATTRIBUTE_FAILURE:
			return updateAttributeFailure(ns, action)
		case RESET_JUST_CREATED: 
			return resetJustCreated(ns, action)
		default:
	    	return ns
	}
	return ns
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