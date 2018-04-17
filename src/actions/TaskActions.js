import Storage from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import Compute from '../resources/Compute'

import {
	REQUEST,
	REQUEST_FAILURE,
	REQUEST_CREATE_FAILURE,
	REQUEST_DELETE_FAILURE,
	REQUEST_EDIT_ITEM_FAILURE,
} from '../reducers/BasicReducer'
import {
	UPDATE_ATTRIBUTE_SUCCESS,
	UPDATE_ATTRIBUTE_FAILURE,
	ADD_INPUT_SUCCESS,
	ADD_OUTPUT_SUCCESS,
	START_ADDING,
	ADD_FAILURE,
	REMOVE_INPUT_SUCCESS,
	REQUEST_TASK_DETAIL_SUCCESS,
	REQUEST_CREATE_TASK_SUCCESS,
	REQUEST_EDIT_TASK_SUCCESS,
	REQUEST_DELETE_TASK_SUCCESS,
	REQUEST_TASKS,
	REQUEST_TASKS_SUCCESS,
	REQUEST_TASKS_FAILURE,
	REQUEST_EDIT_TASK_INGREDIENT,
	REQUEST_EDIT_TASK_INGREDIENT_SUCCESS,
	REQUEST_EDIT_TASK_INGREDIENT_FAILURE,
} from '../reducers/TaskReducerExtension'

const TASKS = 'TASKS'

export function fetchRecentTasks() {
	return dispatch => {
		dispatch(requestTasks(TASKS))

		// Get all open tasks
		let payload = {
			team: 1,
			ordering: '-updated_at',
		}

		return Storage.multiGet(['teamID', 'userID']).then(values => {
			let localStorage = {}
			values.forEach((element, i) => {
				let key = element[0]
				let val = element[1]
				localStorage[key] = val
			})
			payload['team'] = localStorage['teamID']
			return Networking.get('/ics/tasks/simple/')
				.query(payload)
				.then(res => {
					dispatch(requestTasksSuccess(TASKS, res.body.results))
				})
				.catch(e => {
					dispatch(requestTasksFailure(TASKS, e))
					throw e
				})
		})
	}
}

function requestTasks(name) {
	return {
		type: REQUEST_TASKS,
		name: name,
	}
}

function requestTasksSuccess(name, data, append = false) {
	return {
		type: REQUEST_TASKS_SUCCESS,
		name: TASKS,
		data: data,
		append: append,
	}
}

function requestTasksFailure(name, err) {
	console.error(err)
	return {
		type: REQUEST_TASKS_FAILURE,
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
		name: TASKS,
	}
}

function requestTaskSuccess(data) {
	return {
		type: REQUEST_TASK_DETAIL_SUCCESS,
		name: TASKS,
		data: data,
	}
}

function requestTaskFailure(err) {
	return {
		type: REQUEST_FAILURE,
		name: TASKS,
		error: err,
	}
}

export function updateAttribute(task, attribute_id, new_value) {
	return dispatch => {
		let payload = {
			task: task.id,
			attribute: attribute_id,
			value: new_value,
		}

		return Networking.post('/ics/taskAttributes/create/')
			.send(payload)
			.then(res => dispatch(updateAttributeSuccess(res.body)))
			.catch(e => {
				dispatch(updateAttributeFailure(e))
				throw e
			})
	}
}

function updateAttributeSuccess(data) {
	return {
		name: TASKS,
		type: UPDATE_ATTRIBUTE_SUCCESS,
		data: data,
	}
}

function updateAttributeFailure(err) {
	return {
		name: TASKS,
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
				dispatch(createTaskFailure(TASKS, e))
				throw e
			})
	}
}

function createTaskSuccess(data) {
	return {
		name: TASKS,
		type: REQUEST_CREATE_TASK_SUCCESS,
		task: data,
	}
}

function createTaskFailure(err) {
	return {
		name: TASKS,
		type: REQUEST_CREATE_FAILURE,
		error: err,
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

export function addOutput(task, qr, amount) {
	let payload = { creating_task: task.id, item_qr: qr, amount: amount, is_generic: true }
	return dispatch => {
		dispatch(startAdding())
		return Networking.post('/ics/items/create/')
			.send(payload)
			.then(res => {
				dispatch(addSuccess(ADD_OUTPUT_SUCCESS, task, res.body))
				return task
			})
			.catch(e => {
				dispatch(addFailure(e))
				throw e
			})
	}
}

export function updateTaskIngredientAmount(taskIngredientID, amount) {
	let payload = { actual_amount: amount }
	return dispatch => {
		dispatch(requestEditTaskIngredient())
		return Networking.patch(`/ics/taskIngredients/${taskIngredientID}/`)
			.send(payload)
			.then(res => {
				dispatch(requestEditTaskIngredientSuccess(res.body.id, res.body.task, res.body.actual_amount))
			})
			.catch(e => {
				console.error(e)
				dispatch(requestEditTaskIngredientFailure())
			})
	}
}

function requestEditTaskIngredient() {
	return {
		name: TASKS,
		type: REQUEST_EDIT_TASK_INGREDIENT,
	}
}

function requestEditTaskIngredientSuccess(taskIngredientID, taskID, amount) {
	return {
		name: TASKS,
		type: REQUEST_EDIT_TASK_INGREDIENT_SUCCESS,
		id: taskIngredientID,
		taskID: taskID,
		amount: amount,
	}
}

function requestEditTaskIngredientFailure() {
	return {
		name: TASKS,
		type: REQUEST_EDIT_TASK_INGREDIENT_FAILURE,
	}
}

export function startAddingInput() {
	return {
		name: TASKS,
		type: START_ADDING,
	}
}

function addInputSuccess(task, input) {
	return {
		type: ADD_INPUT_SUCCESS,
		name: TASKS,
		input: input,
		taskID: task.id,
		taskIngredients: input.input_task_ingredients,
	}
}

function addInputFailure(err) {
	return {
		type: ADD_FAILURE,
		name: TASKS,
		error: err,
	}
}

export function startAdding() {
	return {
		name: TASKS,
		type: START_ADDING,
	}
}

function addSuccess(type, task, item) {
	return {
		type: type,
		name: TASKS,
		item: item,
		task_id: task.id,
	}
}

function addFailure(err) {
	return {
		type: ADD_FAILURE,
		name: TASKS,
		error: err,
	}
}

export function removeInput(inputID, taskID) {
	return dispatch => {
		return Networking.del(`/ics/inputs/${inputID}/`)
			.then((res) => {
				dispatch(removeInputSuccess(inputID, taskID))
			})
			.catch(e => {
				//dispatch(removeFailure(e))
				throw e
			})
	}
}

function removeInputSuccess(inputID, taskID) {
	return {
		type: REMOVE_INPUT_SUCCESS,
		name: TASKS,
		taskID: taskID,
		inputID: inputID,
	}
}

export function requestDeleteTask(task, success) {
	let payload = { is_trashed: true }
	return dispatch => {
		return Networking.put(`/ics/tasks/edit/${task.id}/`)
			.send(payload)
			.then(() => {
				dispatch(deleteTaskSuccess(task))
				success()
			})
			.catch(e => {
				dispatch(deleteTaskFailure(e))
				throw e
			})
	}
}

function deleteTaskSuccess(data) {
	return {
		name: TASKS,
		type: REQUEST_DELETE_TASK_SUCCESS,
		task: data,
	}
}

function deleteTaskFailure(err) {
	return {
		name: TASKS,
		type: REQUEST_DELETE_FAILURE,
		error: err,
	}
}

export function requestFlagTask(task) {
	let payload = { is_flagged: true }
	return dispatch => {
		return Networking.put(`/ics/tasks/edit/${task.id}/`)
			.send(payload)
			.then(() => {
				dispatch(requestEditItemSuccess(task, 'is_flagged', true))
			})
			.catch(e => {
				dispatch(requestEditItemFailure(e))
				throw e
			})
	}
}

function requestEditItemFailure(err) {
	return {
		name: TASKS,
		type: REQUEST_EDIT_ITEM_FAILURE,
		error: err,
	}
}

function requestEditItemSuccess(task, key, value) {
	return {
		name: TASKS,
		type: REQUEST_EDIT_TASK_SUCCESS,
		task: task,
		field: key,
		value: value,
	}
}

export function requestRenameTask(task, custom_display) {
	let payload = { custom_display: custom_display }
	return dispatch => {
		return Networking.put(`/ics/tasks/edit/${task.id}/`)
			.send(payload)
			.then(() => {
				let key = custom_display.length ? 'display' : 'custom_display'
				dispatch(requestEditItemSuccess(task, key, custom_display))
			})
			.catch(e => {
				dispatch(requestEditItemFailure(e))
				throw e
			})
	}
}
