import Storage from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import Compute from '../resources/Compute'
import { DateFormatter } from '../resources/Utility';

import { 
	REQUEST, 
	REQUEST_SUCCESS, 
	REQUEST_FAILURE,
	REQUEST_CREATE_SUCCESS,
	REQUEST_CREATE_FAILURE,
	REQUEST_DELETE_SUCCESS,
	REQUEST_DELETE_FAILURE,
} from '../reducers/BasicReducer'
import {
	UPDATE_ATTRIBUTE_SUCCESS,
	UPDATE_ATTRIBUTE_FAILURE,
	RESET_JUST_CREATED
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
		let openPayload = {
			team: 1,
			ordering: "-updated_at",
			is_open: true,
			start: DateFormatter.format(yesterday),
			end: DateFormatter.format((new Date()))
		}
		


		return Storage.multiGet(['teamID', 'userID']).then((values) => {
			let localStorage = {}
			values.forEach((element, i) => {
				let key = element[0]
				let val = element[1]
				localStorage[key] = val
			})
			openPayload["team"] = localStorage['teamID']
			Networking.get('/ics/tasks/')
			.query(openPayload)
			.end(function(err, res) {
				if (err || !res.ok) {
					dispatch(requestTasksFailure(OPEN_TASKS, err))
				} else {
					let organized = Compute.organizeAttributesForTasks(res.body)
					dispatch(requestTasksSuccess(OPEN_TASKS, organized))
				}
			})
		});
		
  	}
}

export function fetchCompletedTasks() {
  	return (dispatch) => {
	    dispatch(requestTasks(COMPLETED_TASKS))

		let completed = []
		const completedPayload = {
			team: 1,
			ordering: "-updated_at",
			is_open: false
		};
		

		return Storage.multiGet(['teamID', 'userID']).then((values) => {
			let localStorage = {}
			values.forEach((element, i) => {
				let key = element[0]
				let val = element[1]
				localStorage[key] = val
			})
			completedPayload["team"] = localStorage['teamID']
			Networking.get('/ics/tasks/search')
			.query(completedPayload)
			.end(function(err, res) {
				if (err || !res.ok) {
					dispatch(requestTasksFailure(COMPLETED_TASKS, err))
				} else {
					let organized = Compute.organizeAttributesForTasks(res.body.results)
					dispatch(requestTasksSuccess(COMPLETED_TASKS, organized))
				}
			})
		});
		
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

export function requestDeleteTask(task, success) {
	let name = task.is_open ? OPEN_TASKS : COMPLETED_TASKS
	let payload = {is_trashed: true}
	return (dispatch) => {
		return Networking.put(`/ics/tasks/edit/${task.id}/`)
			.send(payload)
			.end(function(err, res) {
				if (err || !res.ok) {
					dispatch(deleteTaskFailure(name, err))
				} else {
					dispatch(deleteTaskSuccess(name, task))
					success()
				}
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


