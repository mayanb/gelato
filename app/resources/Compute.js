import Networking from './Networking';
import { DateFormatter } from './Utility';

export default class Compute {
	constructor() {}

	static equate(id1, id2) {
		return parseInt(id1, 10) === parseInt(id2, 10)
	}

	static classifyTasks(teamID) {

	}

	static organizeAttributes(task) {
		var attributes = [];
		return attributes
		// let all_attributes = task.process_type.attributes
		// for (attribute in all_attributes) {
		// 	let attribute_value = task.attribute_values.find(e => equate(e.attribute, attribute.id))
		// 	let filled_attribute = { ...attribute, attribute_value: (attribute_value || "") }
		// 	attributes.push(filled_attribute)
		// }
		// return organizeAttributes
	}

	static async getOpenTasks(teamID) {
		// Get yesterday's date
		let open = []
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		
		// Get all open tasks
		const openPayload = {
			team: teamID,
			ordering: "-updated_at",
			is_open: true,
			start: DateFormatter.format(yesterday),
			end: DateFormatter.format((new Date()))
		};
		const openData = await Networking.request('ics/v7/tasks/', 'GET', openPayload);
		// Check response code
		if (openData && openData.status >= 200 && openData.status < 300) {
			const data = await openData.json(); // Convert response to JSON
			for (i = 0; i < data.length; i++) {
				data[i].organized_attributes = Compute.organizeAttributes(data[i])
				open.push(data[i]);
			}
		}

		return open
	}

	static async getCompletedTasks(teamID) {
		// Get recently completed tasks
		let completed = []
		const completedPayload = {
			team: teamID,
			ordering: "-updated_at",
			is_open: false
		};
		const completedData = await Networking.request('ics/v7/tasks/search', 'GET', completedPayload);
		// Check response code
		if (completedData && completedData.status >= 200 && completedData.status < 300) {
			const data = await completedData.json(); // Convert response to JSON
			for (i = 0; i < data.results.length; i++) {
				// This needs to be fixed
				// TODO: request update to API where this information is included in search
				const task = await Networking.request('ics/v7/tasks/'+data.results[i].id, 'GET', {});
				if (task) {
					const taskJSON = await task.json(); // Convert response to JSON
					taskJSON.organized_attributes = Compute.organizeAttributes(taskJSON)
					completed.push(taskJSON);
				}
			}
		}
		return completed
	}

	// Separate tasks into open and completed
	static async classifyTasks(teamID) {
		var open = [];
		var completed = [];

		// Get yesterday's date
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		
		// Get all open tasks
		const openPayload = {
			team: teamID,
			ordering: "-updated_at",
			is_open: true,
			start: DateFormatter.format(yesterday),
			end: DateFormatter.format((new Date()))
		};
		const openData = await Networking.request('ics/v7/tasks/', 'GET', openPayload);
		// Check response code
		if (openData && openData.status >= 200 && openData.status < 300) {
			const data = await openData.json(); // Convert response to JSON
			for (i = 0; i < data.length; i++) {
				data[i].organized_attributes = Compute.organizeAttributes(data[i])
				open.push(data[i]);
			}
		}

		// Get recently completed tasks
		const completedPayload = {
			team: teamID,
			ordering: "-updated_at",
			is_open: false
		};
		const completedData = await Networking.request('ics/v7/tasks/search', 'GET', completedPayload);
		// Check response code
		if (completedData && completedData.status >= 200 && completedData.status < 300) {
			const data = await completedData.json(); // Convert response to JSON
			for (i = 0; i < data.results.length; i++) {
				// This needs to be fixed
				// TODO: request update to API where this information is included in search
				const task = await Networking.request('ics/v7/tasks/'+data.results[i].id, 'GET', {});
				if (task) {
					const taskJSON = await task.json(); // Convert response to JSON
					taskJSON.organized_attributes = Compute.organizeAttributes(taskJSON)
					completed.push(taskJSON);
				}
			}
		}

		// Return the data in header format
		return [
			{
				data: open,
				key: "open",
				title: "OPEN TASKS"
			},
			{
				data: completed,
				key: "completed",
				title: "RECENTLY COMPLETED"
			},
			{
				data: [],
				key: "space"
			}
		];
	}

	static async getTask(taskID) {
		const data = await Networking.request('ics/v7/taskAttributes/', 'GET', {task: taskID});
		if (data && data.status >= 200 && data.status < 300) {
			const dataJSON = await data.json();
			return dataJSON;
		}
		return [];
	}
}