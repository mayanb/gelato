import Storage from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import Compute from '../resources/Compute'
import { DateFormatter } from '../resources/Utility'

import {
	REQUEST,
	REQUEST_SUCCESS,
	REQUEST_FAILURE,
	REQUEST_CREATE_SUCCESS,
	REQUEST_CREATE_FAILURE,
	REQUEST_DELETE_SUCCESS,
	REQUEST_DELETE_FAILURE,
	REQUEST_EDIT_ITEM_SUCCESS,
	REQUEST_EDIT_ITEM_FAILURE,
} from '../reducers/BasicReducer'
import {
	UPDATE_ATTRIBUTE_SUCCESS,
	UPDATE_ATTRIBUTE_FAILURE,
	RESET_JUST_CREATED,
	ADD_INPUT_SUCCESS,
	ADD_OUTPUT_SUCCESS,
	START_ADDING,
	ADD_FAILURE,
	REMOVE_INPUT_SUCCESS,
	REQUEST_TASK_SUCCESS,
} from '../reducers/TaskAttributeReducerExtension'

const OPEN_TASKS = 'OPEN_TASKS'
const COMPLETED_TASKS = 'COMPLETED_TASKS'
const SEARCHED_TASKS = 'SEARCHED_TASKS'
const TASK_DETAILS = 'TASK_DETAILS'

export function fetchOpenTasks() {
	return dispatch => {
		dispatch(requestTasks(OPEN_TASKS))
		var yesterday = new Date()
		yesterday.setDate(yesterday.getDate() - 1)

		// Get all open tasks
		let openPayload = {
			team: 1,
			ordering: '-updated_at',
			is_open: true,
			start: DateFormatter.format(yesterday),
			end: DateFormatter.format(new Date()),
		}

		return Storage.multiGet(['teamID', 'userID']).then(values => {
			let localStorage = {}
			values.forEach((element, i) => {
				let key = element[0]
				let val = element[1]
				localStorage[key] = val
			})
			openPayload['team'] = localStorage['teamID']
			return Networking.get('/ics/tasks/')
				.query(openPayload)
				.then(res => {
					let organized = Compute.organizeAttributesForTasks(res.body)
					dispatch(requestTasksSuccess(OPEN_TASKS, organized))
				})
				.catch(e => {
					dispatch(requestTasksFailure(OPEN_TASKS, e))
					throw e
				})
		})
	}
}

export function fetchCompletedTasks() {
	return dispatch => {
		dispatch(requestTasks(COMPLETED_TASKS))

		const completedPayload = {
			team: 1,
			ordering: '-updated_at',
			is_open: false,
		}

		return Storage.multiGet(['teamID', 'userID']).then(values => {
			let localStorage = {}
			values.forEach(element => {
				let key = element[0]
				let val = element[1]
				localStorage[key] = val
			})
			completedPayload['team'] = localStorage['teamID']
			return Networking.get('/ics/tasks/search/')
				.query(completedPayload)
				.then(res => {
					let organized = Compute.organizeAttributesForTasks(res.body.results)
					dispatch(requestTasksSuccess(COMPLETED_TASKS, organized))
				})
				.catch(e => {
					dispatch(requestTasksFailure(COMPLETED_TASKS, e))
					throw e
				})
		})
	}
}

function requestTasks(name) {
	return {
		type: REQUEST,
		name: name,
	}
}

function requestTasksSuccess(name, data, append = false) {
	return {
		type: REQUEST_SUCCESS,
		name: name,
		data: data,
		append: append,
	}
}

function requestTasksFailure(name, err) {
	return {
		type: REQUEST_FAILURE,
		name: name,
		error: err,
	}
}

export function fetchTask(task_id) {
	return dispatch => {
		dispatch(requestTask())
		return Storage.multiGet(['teamID', 'userID']).then(values => {
			let localStorage = {}
			values.forEach(element => {
				let key = element[0]
				let val = element[1]
				localStorage[key] = val
			})

			return Networking.get(`/ics/tasks/${task_id}/`)
				.then(res => {
					let organized = Compute.organizeAttributes(res.body)
					res.body.organized_attributes = organized
					return dispatch(requestTaskSuccess(res.body))
				})
				.catch(e => {
					dispatch(requestTaskFailure(e))
					throw e
				})
		})
	}
}

function requestTask() {
	return {
		type: REQUEST,
		name: TASK_DETAILS,
	}
}

function requestTaskSuccess(data) {
	return {
		type: REQUEST_TASK_SUCCESS,
		name: TASK_DETAILS,
		data: data,
	}
}

function requestTaskFailure(err) {
	return {
		type: REQUEST_FAILURE,
		name: TASK_DETAILS,
		error: err,
	}
}

export function updateAttribute(task, attribute_id, new_value, isSearched) {
	let name = findReducer(task, isSearched)
	return dispatch => {
		let payload = {
			task: task.id,
			attribute: attribute_id,
			value: new_value,
		}

		return Networking.post('/ics/taskAttributes/create/')
			.send(payload)
			.then(res => dispatch(updateAttributeSuccess(name, res.body)))
			.catch(e => {
				dispatch(updateAttributeFailure(name, e))
				throw e
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
		error: err,
	}
}

export function requestCreateTask(data) {
	return dispatch => {
		let payload = Compute.generateNewTask(data)

		return Networking.post('/ics/tasks/create/')
			.send(payload)
			.then(res => {
				res.body.process_type = data.processType
				res.body.product_type = data.productType
				res.body.attribute_values = []
				res.body.organized_attributes = Compute.organizeAttributes(res.body)
				dispatch(createTaskSuccess(res.body))
				return res.body
			})
			.catch(e => {
				dispatch(createTaskFailure(OPEN_TASKS, e))
				throw e
			})
	}
}

function createTaskSuccess(data) {
	return {
		name: OPEN_TASKS,
		type: REQUEST_CREATE_SUCCESS,
		item: data,
	}
}

function createTaskFailure(err) {
	return {
		name: OPEN_TASKS,
		type: REQUEST_CREATE_FAILURE,
		error: err,
	}
}

export function resetJustCreated() {
	return {
		name: OPEN_TASKS,
		type: RESET_JUST_CREATED,
	}
}

export function addInput(task, item) {
	let payload = { task: task.id, input_item: item.id }
	return dispatch => {
		dispatch(startAddingInput())
		return Networking.post('/ics/inputs/create-without-amount/')
			.send(payload)
			.then(res => {
				dispatch(addInputSuccess(task, res.body))
			})
			.catch(e => {
				dispatch(addInputFailure(e))
				throw e
			})
	}
}

export function addOutput(task, qr, amount, isSearched) {
	let payload = { creating_task: task.id, item_qr: qr, amount: amount, is_generic: true }
	return dispatch => {
		dispatch(startAdding(task, isSearched))
		return Networking.post('/ics/items/create/')
			.send(payload)
			.then(res => {
				dispatch(addSuccess(ADD_OUTPUT_SUCCESS, task, res.body, isSearched))
				return task
			})
			.catch(e => {
				dispatch(addFailure(e))
				throw e
			})
	}
}

export function startAddingInput() {
	return {
		name: TASK_DETAILS,
		type: START_ADDING,
	}
}

function addInputSuccess(task, input) {
	return {
		type: ADD_INPUT_SUCCESS,
		name: TASK_DETAILS,
		input: input,
		taskID: task.id,
		taskIngredients: input.input_task_ingredients,
	}
}

function addInputFailure(err) {
	return {
		type: ADD_FAILURE,
		name: TASK_DETAILS,
		error: err,
	}
}

export function startAdding(task, isSearched) {
	let name = findReducer(task, isSearched)
	return {
		name: name,
		type: START_ADDING,
	}
}

function addSuccess(type, task, item, isSearched) {
	let name = findReducer(task, isSearched)
	return {
		type: type,
		name: name,
		item: item,
		task_id: task.id,
	}
}

function addFailure(err) {
	return {
		type: ADD_FAILURE,
		name: OPEN_TASKS,
		error: err,
	}
}

export function removeInput(task, input, index, isSearched) {
	return dispatch => {
		return Networking.del('/ics/inputs/', input.id)
			.then(() => {
				dispatch(removeSuccess(REMOVE_INPUT_SUCCESS, task, index, isSearched))
			})
			.catch(e => {
				//dispatch(removeFailure(e))
				throw e
			})
	}
}

function removeSuccess(type, task, index, isSearched) {
	let name = findReducer(task, isSearched)
	return {
		type: type,
		name: name,
		task_id: task.id,
		index: index,
	}
}

export function requestDeleteTask(task, isSearched, success) {
	let name = findReducer(task, isSearched)
	let payload = { is_trashed: true }
	return dispatch => {
		return Networking.put(`/ics/tasks/edit/${task.id}/`)
			.send(payload)
			.then(() => {
				dispatch(deleteTaskSuccess(name, task))
				success()
			})
			.catch(e => {
				dispatch(deleteTaskFailure(name, e))
				throw e
			})
	}
}

function deleteTaskSuccess(name, data) {
	return {
		name: name,
		type: REQUEST_DELETE_SUCCESS,
		item: data,
	}
}

function deleteTaskFailure(name, err) {
	return {
		name: name,
		type: REQUEST_DELETE_FAILURE,
		error: err,
	}
}

export function requestFlagTask(task, isSearched) {
	let name = findReducer(task, isSearched)
	let payload = { is_flagged: true }
	return dispatch => {
		return Networking.put(`/ics/tasks/edit/${task.id}/`)
			.send(payload)
			.then(() => {
				dispatch(requestEditItemSuccess(name, task, 'is_flagged', true))
			})
			.catch(e => {
				dispatch(requestEditItemFailure(name, e))
				throw e
			})
	}
}

function requestEditItemFailure(name, err) {
	return {
		name: name,
		type: REQUEST_EDIT_ITEM_FAILURE,
		error: err,
	}
}

function requestEditItemSuccess(name, item, key, value) {
	return {
		name: name,
		type: REQUEST_EDIT_ITEM_SUCCESS,
		item: item,
		field: key,
		value: value,
	}
}

export function requestRenameTask(task, custom_display, isSearched) {
	let name = findReducer(task, isSearched)
	let payload = { custom_display: custom_display }
	return dispatch => {
		return Networking.put(`/ics/tasks/edit/${task.id}/`)
			.send(payload)
			.then(() => {
				let key = custom_display.length ? 'display' : 'custom_display'
				dispatch(requestEditItemSuccess(name, task, key, custom_display))
			})
			.catch(e => {
				dispatch(requestEditItemFailure(name, e))
				throw e
			})
	}
}

function findReducer(task, isSearched) {
	let name = SEARCHED_TASKS
	if (!isSearched && task.is_open) {
		name = OPEN_TASKS
	} else if (!isSearched) {
		name = COMPLETED_TASKS
	}
	return name
}

