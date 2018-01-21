import * as Networking from './Networking-superagent'
import update from 'immutability-helper'
import moment from 'moment'

import { NOT_OUTPUT, ALREADY_OUTPUT, ALREADY_ADDED, INVALID_QR} from './QRSemantics'

export default class Compute {
	constructor() {}

	static equate(id1, id2) {
		return parseInt(id1, 10) === parseInt(id2, 10)
	}

	static organizeAttributesForTasks(data) {
		let org =  data.map((t, i) => {
			t.organized_attributes = Compute.organizeAttributes(t)
			return t
		})
		return org
	}

	static organizeAttributes(task) {
		console.log(task)
		var attributes = []
		let allAttributes = task.process_type.attributes
		allAttributes.forEach((attr, i) => {
			let attribute_value = task.attribute_values.find(e => Compute.equate(e.attribute, attr.id))
			if (!attribute_value) {
				attribute_value = {}
			}
			let filled_attribute = update(attr, { $merge: {value: attribute_value}})
			attributes.push(filled_attribute)
		})
		return attributes
	}


	static generateNewTask(data) {
		let date = moment().format('MMDD')
		let label = [data.processType.code, data.productType.code, date].join('-')
		let task = {
			process_type: data.processType.id,
			product_type: data.productType.id,
			label: label,
			is_open: true,
			is_flagged: false, 
			label_index: 0, 
			custom_display: '', 
			is_trashed: false
		}
		return task
	}

	static getQRSemantic(mode, foundQR) {
		if (mode === 'inputs') {
			// if this QR code wasn't from any task
			if (!foundQR) {
				return NOT_OUTPUT
			}
		}

		if (mode === 'items') {
			// if this QR code WAS from a task
			if (foundQR) {
				return ALREADY_OUTPUT
			}
		}

		return ''
	}

	static isOkay(semantic) {
		return !semantic.length
	}

	// VALIDATE THE QR CODE SEQ
	static validateQR(data) {
		return true
	}

	// static async getOpenTasks(teamID) {
	// 	// Get yesterday's date
	// 	let open = []
	// 	var yesterday = new Date();
	// 	yesterday.setDate(yesterday.getDate() - 1);
		
	// 	// Get all open tasks
	// 	const openPayload = {
	// 		team: teamID,
	// 		ordering: "-updated_at",
	// 		is_open: true,
	// 		start: DateFormatter.format(yesterday),
	// 		end: DateFormatter.format((new Date()))
	// 	}

	// 	return Networking.get('ics/tasks/')
	// 		.end(function(err, res) {
	// 			if (err || !res.ok) {
	// 				dispatch(getOpenTasksFailure(err))
	// 			} else {
	// 				dispatch(getOpenTasksSuccess(res.body))
	// 			}
	// 		})



	// 	const openData = await Networking.request('ics/v7/tasks/', 'GET', openPayload);
	// 	// Check response code
	// 	if (openData && openData.status >= 200 && openData.status < 300) {
	// 		const data = await openData.json(); // Convert response to JSON
	// 		for (i = 0; i < data.length; i++) {
	// 			data[i].organized_attributes = Compute.organizeAttributes(data[i])
	// 			open.push(data[i]);
	// 		}
	// 	}

	// 	return open
	// }

	// static async getCompletedTasks(teamID) {
	// 	// Get recently completed tasks
	// 	let completed = []
	// 	const completedPayload = {
	// 		team: teamID,
	// 		ordering: "-updated_at",
	// 		is_open: false
	// 	};
	// 	const completedData = await Networking.request('ics/v7/tasks/search', 'GET', completedPayload);
	// 	// Check response code
	// 	if (completedData && completedData.status >= 200 && completedData.status < 300) {
	// 		const data = await completedData.json(); // Convert response to JSON
	// 		for (i = 0; i < data.results.length; i++) {
	// 			// This needs to be fixed
	// 			// TODO: request update to API where this information is included in search
	// 			const task = await Networking.request('ics/v7/tasks/'+data.results[i].id, 'GET', {});
	// 			if (task) {
	// 				const taskJSON = await task.json(); // Convert response to JSON
	// 				taskJSON.organized_attributes = Compute.organizeAttributes(taskJSON)
	// 				completed.push(taskJSON);
	// 			}
	// 		}
	// 	}
	// 	return completed
	// }

	// // Separate tasks into open and completed
	// static async classifyTasks(teamID) {
	// 	var open = [];
	// 	var completed = [];

	// 	// Get yesterday's date
	// 	var yesterday = new Date();
	// 	yesterday.setDate(yesterday.getDate() - 1);
		
	// 	// Get all open tasks
	// 	const openPayload = {
	// 		team: teamID,
	// 		ordering: "-updated_at",
	// 		is_open: true,
	// 		start: DateFormatter.format(yesterday),
	// 		end: DateFormatter.format((new Date()))
	// 	};
	// 	const openData = await Networking.request('ics/v7/tasks/', 'GET', openPayload);
	// 	// Check response code
	// 	if (openData && openData.status >= 200 && openData.status < 300) {
	// 		const data = await openData.json(); // Convert response to JSON
	// 		for (i = 0; i < data.length; i++) {
	// 			data[i].organized_attributes = Compute.organizeAttributes(data[i])
	// 			open.push(data[i]);
	// 		}
	// 	}

	// 	// Get recently completed tasks
	// 	const completedPayload = {
	// 		team: teamID,
	// 		ordering: "-updated_at",
	// 		is_open: false
	// 	};
	// 	const completedData = await Networking.request('ics/v7/tasks/search', 'GET', completedPayload);
	// 	// Check response code
	// 	if (completedData && completedData.status >= 200 && completedData.status < 300) {
	// 		const data = await completedData.json(); // Convert response to JSON
	// 		for (i = 0; i < data.results.length; i++) {
	// 			// This needs to be fixed
	// 			// TODO: request update to API where this information is included in search
	// 			const task = await Networking.request('ics/v7/tasks/'+data.results[i].id, 'GET', {});
	// 			if (task) {
	// 				const taskJSON = await task.json(); // Convert response to JSON
	// 				taskJSON.organized_attributes = Compute.organizeAttributes(taskJSON)
	// 				completed.push(taskJSON);
	// 			}
	// 		}
	// 	}

	// 	// Return the data in header format
	// 	return [
	// 		{
	// 			data: open,
	// 			key: "open",
	// 			title: "OPEN TASKS"
	// 		},
	// 		{
	// 			data: completed,
	// 			key: "completed",
	// 			title: "RECENTLY COMPLETED"
	// 		},
	// 		{
	// 			data: [],
	// 			key: "space"
	// 		}
	// 	];
	// }

	// static async getTask(taskID) {
	// 	const data = await Networking.request('ics/v7/taskAttributes/', 'GET', {task: taskID});
	// 	if (data && data.status >= 200 && data.status < 300) {
	// 		const dataJSON = await data.json();
	// 		return dataJSON;
	// 	}
	// 	return [];
	// }
}