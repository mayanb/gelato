import update from 'immutability-helper'
import { BasicReducer } from './BasicReducer'
import Compute from '../resources/Compute'

export const UPDATE_ATTRIBUTE_SUCCESS = 'UPDATE_ATTRIBUTE_SUCCESS'
export const UPDATE_ATTRIBUTE_FAILURE = 'UPDATE_ATTRIBUTE_FAILURE'

export const ADD_INPUT_SUCCESS = 'ADD_INPUT_SUCCESS'
export const ADD_OUTPUT_SUCCESS = 'ADD_OUTPUT_SUCCSS'
export const START_ADDING = 'START_ADDING'
export const ADD_FAILURE = 'ADD_FAILURE'
export const REMOVE_INPUT_SUCCESS = 'REMOVE_INPUT_SUCCESS'

export const REQUEST_TASKS = 'REQUEST_TASKS'
export const REQUEST_TASKS_SUCCESS = 'REQUEST_TASKS_SUCCESS'
export const REQUEST_TASKS_FAILURE = 'REQUEST_TASKS_FAILURE'
export const REQUEST_TASK_DETAIL_SUCCESS = 'REQUEST_TASK_DETAIL_SUCCESS'
export const REQUEST_CREATE_TASK_SUCCESS = 'REQUEST_CREATE_TASK_SUCCESS'
export const REQUEST_EDIT_TASK_SUCCESS = 'REQUEST_EDIT_TASK_SUCCESS'
export const REQUEST_DELETE_TASK_SUCCESS = 'REQUEST_DELETE_TASK_SUCCESS'
export const REQUEST_EDIT_TASK_INGREDIENT = 'REQUEST_EDIT_TASK_INGREDIENT'
export const REQUEST_EDIT_TASK_INGREDIENT_SUCCESS = 'REQUEST_EDIT_TASK_INGREDIENT_SUCCESS'
export const REQUEST_EDIT_TASK_INGREDIENT_FAILURE = 'REQUEST_EDIT_TASK_INGREDIENT_FAILURE'

export const REMOVE_OUTPUT_SUCCESS = 'REMOVE_OUTPUT_SUCCESS'

export function _task(state, action) {
	let ns = BasicReducer(state, action)
	switch (action.type) {
		case REQUEST_TASKS:
			return request(state, action, 'isFetchingTasksData')
		case REQUEST_TASKS_SUCCESS:
			return requestTasksSuccess(ns, action)
		case REQUEST_TASKS_FAILURE:
			return requestFailure(state, action, 'isFetchingTasksData')
		case REQUEST_TASK_DETAIL_SUCCESS:
			return requestTaskDetailSuccess(ns, action)
		case REQUEST_CREATE_TASK_SUCCESS:
			return requestCreateTaskSuccess(ns, action)
		case REQUEST_EDIT_TASK_SUCCESS:
			return requestEditTaskSuccess(ns, action)
		case REQUEST_DELETE_TASK_SUCCESS:
			return requestDeleteTaskSuccess(ns, action)
		case UPDATE_ATTRIBUTE_SUCCESS:
			return updateAttributeSuccess(ns, action)
		case UPDATE_ATTRIBUTE_FAILURE:
			return updateAttributeFailure(ns, action)
		case ADD_OUTPUT_SUCCESS:
			return addOutputSuccess(ns, action)
		case ADD_INPUT_SUCCESS:
			return addInputSuccess(ns, action)
		case START_ADDING:
			return startAdding(ns, action)
		case ADD_FAILURE:
			return addFailure(ns, action)
		case REMOVE_INPUT_SUCCESS:
			return removeInputSuccess(ns, action)
		case REQUEST_EDIT_TASK_INGREDIENT:
			return request(state, action, 'isEditingTaskIngredient')
		case REQUEST_EDIT_TASK_INGREDIENT_SUCCESS:
			return requestEditTaskIngredientSuccess(ns, action)
		case REQUEST_EDIT_TASK_INGREDIENT_FAILURE:
			return requestFailure(state, action, 'isEditingTaskIngredient')
		case REMOVE_OUTPUT_SUCCESS:
			return removeOutputSuccess(ns, action)
		default:
			return ns
	}
	return ns
}

function request(state, action, fetchingAttribute) {
	return update(state, {
		ui: {
			[fetchingAttribute]: {
				$set: true,
			},
		},
	})
}

function requestFailure(state, action, fetchingAttribute) {
	return update(state, {
		ui: {
			$merge: {
				[fetchingAttribute]: false,
				error: action.error,
			},
		},
	})
}

function startAdding(state, action) {
	return update(state, {
		ui: {
			isAdding: { $set: true },
		},
	})
}

function addInputsToTaskIngredients(taskIngredients, inputs) {
	return taskIngredients.map(ta => {
		const { ingredient } = ta
		ta.inputs = inputs.filter(input => {
			return ingredient.process_type.id === input.input_task_n.process_type &&
				ingredient.product_type.id === input.input_task_n.product_type
		})
		return ta
	})
}

function requestTasksSuccess(state, action) {
	const baseList = action.append ? state.recentIDs : []
	// If you're not appending to a stale list, then you're doing a full refresh,
	// and should update timeOfLastTaskRefresh
	const newTimeOfLastRefresh = action.append ? state.ui.timeOfLastTaskRefresh : Date.now()
	const recentTaskIDs = Array.from(new Set(baseList.concat(action.data.map(task => task.id))))
	const taskHash = {}
	action.data.forEach(task => {
		taskHash[task.id] = task
	})
	return update(state, {
		ui: {
			$merge: {
				isFetchingTasksData: false,
				timeOfLastTaskRefresh: newTimeOfLastRefresh,
			},
		},
		recentIDs: { $set: recentTaskIDs },
		dataByID: { $merge: taskHash },
	})
}

function requestDeleteTaskSuccess(state, action) {
	return update(state, {
		ui: {
			isDeletingItem: {
				$set: false,
			},
		},
		dataByID: {
			$unset: [action.task.id],
		},
		recentIDs: { $set: state.recentIDs.filter(id => id !== action.task.id) },
		searchedIDs: { $set: state.searchedIDs.filter(id => id !== action.task.id) },
	})
}

function requestCreateTaskSuccess(state, action) {
	return update(state, {
		ui: {
			$merge: {
				isCreatingItem: false,
			},
		},
		dataByID: {
			[action.task.id]: { $set: action.task },
		},
		recentIDs: {
			$unshift: [action.task.id],
		},
	})
}

function requestEditTaskSuccess(state, action) {
	let obj = { [action.field]: action.value }
	return update(state, {
		ui: {
			isEditingItem: {
				$set: false,
			},
		},
		dataByID: {
			[action.task.id]: {
				$merge: obj,
			},
		},
	})
}

function requestTaskDetailSuccess(state, action) {
	const task = action.data
	task.task_ingredients = addInputsToTaskIngredients(task.task_ingredients, task.inputs)

	return update(state, {
		ui: {
			$merge: {
				isFetchingData: false,
			},
		},
		dataByID: {
			[action.data.id]: { $set: task }
		},
	})
}

function updateAttributeSuccess(state, action) {
	let taskIndex = state.data.findIndex(e =>
		Compute.equate(e.id, action.data.task)
	)
	let attributeIndex = state.data[taskIndex].organized_attributes.findIndex(e =>
		Compute.equate(e.id, action.data.attribute)
	)


	return update(state, {
		data: {
			[taskIndex]: {
				organized_attributes: {
					[attributeIndex]: {
						$merge: { value: action.data },
					},
				},
			},
		},
	})
}

function updateAttributeFailure(state, action) {
	return state
}

function addInputSuccess(state, action) {
	const task = state.dataByID[action.taskID]
	task.inputs.push(action.input)
	task.task_ingredients = addInputsToTaskIngredients(action.taskIngredients, task.inputs)
	return update(state, {
		dataByID: {
			[task.id]: {
				$set: task,
			},
		},
		ui: {
			isAdding: { $set: false },
		},
	})
}

function addOutputSuccess(state, action) {
	return update(state, {
		dataByID: {
			[action.task_id]: {
				['items']: {
					$push: [action.item],
				},
			},
		},
		ui: {
			isAdding: { $set: false },
		},
	})
}

function addFailure(state, action) {
	return update(state, {
		ui: {
			isAdding: { $set: false },
		},
	})
}

function removeInputSuccess(state, action, key) {
	const task = state.dataByID[action.taskID]
	const inputs = task.inputs.filter(input => input.id !== action.inputID)
	const taskIngredients = addInputsToTaskIngredients(action.taskIngredients, inputs)
	return update(state, {
		dataByID: {
			[action.taskID]: {
				task_ingredients: { $set: taskIngredients },
				inputs: { $set: inputs },
			},
		},
	})
}

function requestEditTaskIngredientSuccess(state, action) {
	const task = state.dataByID[action.taskID]
	let taskIngredientIndex = task.task_ingredients.findIndex(ta => ta.id === action.id)
	return update(state, {
		dataByID: {
			[action.taskID]: {
				task_ingredients: {
					[taskIngredientIndex]: {
						actual_amount: { $set: action.amount },
					},
				},
			},
		},
		ui: {
			isEditingTaskIngredient: { $set: false },
		},
	})
}

function removeOutputSuccess(state, action) {
	return update(state, {
		dataByID: {
			[action.taskID]: {
				['items']: {
					$splice: [[action.index, 1]],
				},
			},
		},
	})
}