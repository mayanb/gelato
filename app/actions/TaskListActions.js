import { Storage } from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import Compute from '../resources/Compute'
import { DateFormatter } from '../resources/Utility';
import { 
	REQUEST, 
	REQUEST_SUCCESS, 
	REQUEST_FAILURE,
	REQUEST_CREATE_SUCCESS,
	REQUEST_CREATE_FAILURE,
	FAILURE,
} from '../reducers/BasicReducer'
import {
	UPDATE_ATTRIBUTE_SUCCESS,
	UPDATE_ATTRIBUTE_FAILURE,
	RESET_JUST_CREATED,
	ADD_INPUT_SUCCESS,
	ADD_OUTPUT_SUCCESS,
	START_ADDING,
	ADD_FAILURE,
	REMOVE_OUTPUT_SUCCESS, 
	REMOVE_INPUT_SUCCESS
} from '../reducers/TaskAttributeReducerExtension'

const OPEN_TASKS = 'OPEN_TASKS'
const COMPLETED_TASKS = 'COMPLETED_TASKS'

export function fetchOpenTasks() {
  	return (dispatch) => {
	    dispatch(requestTasks(OPEN_TASKS))

		let open = []
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		
		// Get all open tasks
		const openPayload = {
			team: 1, //Storage.get('teamID'),
			ordering: "-updated_at",
			is_open: true,
			start: DateFormatter.format(yesterday),
			end: DateFormatter.format((new Date()))
		}
		
		return Networking.get('/ics/tasks/')
			.query(openPayload)
			.end(function(err, res) {
				if (err || !res.ok) {
					dispatch(requestTasksFailure(OPEN_TASKS, err))
				} else {
					let organized = Compute.organizeAttributesForTasks(res.body)
					console.log(organized)
					dispatch(requestTasksSuccess(OPEN_TASKS, organized))
				}
			})
  	}
}

export function fetchCompletedTasks() {
  	return (dispatch) => {
	    dispatch(requestTasks(COMPLETED_TASKS))

		let completed = []
		const completedPayload = {
			team: 1, //Storage.get('teamID'),
			ordering: "-updated_at",
			is_open: false
		};
		
		return Networking.get('/ics/tasks/search')
			.query(completedPayload)
			.end(function(err, res) {
				if (err || !res.ok) {
					dispatch(requestTasksFailure(COMPLETED_TASKS, err))
				} else {
					let organized = Compute.organizeAttributesForTasks(res.body.results)
					dispatch(requestTasksSuccess(COMPLETED_TASKS, organized))
				}
			})
  	}
}


function requestTasks(name) {
	return {
		type: REQUEST,
		name: name,
	}
}

function requestTasksSuccess(name, data) {
	return {
		type: REQUEST_SUCCESS,
		name: name,
		data: data
	}
}

function requestTasksFailure(name, err) {
	return {
		type: REQUEST_FAILURE,
		name: name,
		error: err
	}
}

export function updateAttribute(task, attribute_id, new_value) {
	let name = task.is_open ? OPEN_TASKS : COMPLETED_TASKS
	return (dispatch) => {
		let payload = {
			task: task.id,
			attribute: attribute_id, 
			value: new_value,
		}

		return Networking.post('/ics/taskAttributes/create/')
			.send(payload)
			.end(function(err, res) {
				if (err || !res.ok) {
					dispatch(updateAttributeFailure(name, err))
				} else {
					dispatch(updateAttributeSuccess(name, res.body))
				}
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
		error: err
	}
}

export function requestCreateTask(data) {
	return (dispatch) => {
		let payload = Compute.generateNewTask(data)

		return Networking.post('/ics/tasks/create/')
			.send(payload)
			.end(function(err, res) {
				if (err || !res.ok) {
					dispatch(createTaskFailure(OPEN_TASKS, err))
				} else {
					console.log(data)
					res.body.process_type = data.processType
					res.body.product_type = data.productType
					res.body.attribute_values = []
					res.body.organized_attributes = Compute.organizeAttributes(res.body)
					dispatch(createTaskSuccess(res.body))
				}
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

// export function requestDeleteTask() {
// 	return (dispatch) => {
// 		return Networking.put('/ics/tasks/edit/')
// 			.send({is_trashed: }
// 			.end(function(err, res) {
// 				if (err || !res.ok) {
// 					dispatch(createTaskFailure(OPEN_TASKS, err))
// 				} else {
// 					res.body.process_type = data.processType
// 					res.body.product_type = data.productType
// 					res.body.attribute_values = []
// 					res.body.organized_attributes = Compute.organizeAttributes(res.body)
// 					dispatch(createTaskSuccess(res.body))
// 				}
// 			})
//   	}
// }

export function addInput(task, item, success, failure) {
	let payload = {task: task.id, input_item: item.id }
	return (dispatch) => {
		return Networking.post('/ics/inputs/create/')
			.send(payload)
			.end((err, res) => {
				if (err || !res.ok) {
					dispatch(addFailure(err))
					failure(err)
				} else {
					res.body.input_item = item
					dispatch(addSuccess(ADD_INPUT_SUCCESS, task, res.body))
					success(res.body)
				}
			})
	}
}

export function addOutput(task, qr, amount, success, failure) {
	let payload = {creating_task: task.id, item_qr: qr, amount: amount }
	return (dispatch) => {
		dispatch(startAdding(task))
		return Networking.post('/ics/items/create/')
			.send(payload)
			.end((err, res) => {
				if (err || !res.ok) {
					dispatch(addFailure(err))
					failure(err)
				} else {
					dispatch(addSuccess(ADD_OUTPUT_SUCCESS, task, res.body))
					success(res.body)
				}
			})
	}
}

export function startAdding(task) {
	let name = task.is_open ? OPEN_TASKS : COMPLETED_TASKS
	return {
		name: name,
		type: START_ADDING, 
	}
}

function addSuccess(type, task, item) {
	let name = task.is_open ? OPEN_TASKS : COMPLETED_TASKS
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
		error: err
	}
}

export function removeOutput(task, item, index, success, failure) {
	return (dispatch) => {
		return Networking.del('/ics/items/', item.id)
			.end((err, res) => {
				if (err || !res.ok) {
					dispatch(removeFailure(err))
					failure(err)
				} else {
					dispatch(removeSuccess(REMOVE_OUTPUT_SUCCESS, task, index))
					success(res.body)
				}
			})
	}
}

export function removeInput(task, input, index, success, failure) {
	return (dispatch) => {
		return Networking.del('/ics/inputs/', input.id)
			.end((err, res) => {
				if (err || !res.ok) {
					//dispatch(removeFailure(err))
					failure(err)
				} else {
					dispatch(removeSuccess(REMOVE_INPUT_SUCCESS, task, index))
					success(res.body)
				}
			})
	}
}

function removeSuccess(type, task, index) {
	let name = task.is_open ? OPEN_TASKS : COMPLETED_TASKS
	return {
		type: type, 
		name: name,
		task_id: task.id,
		index: index
	}
}
