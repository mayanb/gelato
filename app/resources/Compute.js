import Networking from './Networking';
import { DateFormatter } from './Utility';

export default class Compute {
	constructor() {}

	// Separate tasks into open and completed
	static async classifyTasks(teamID) {
		var open = [];
		var completed = [];

		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		// "2018-01-17-T03:52:39.513000+0000"
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
			const data = await openData.json();
			for (i = 0; i < data.length; i++) {
				open.push(data[i]);
			}
		}

		const completedPayload = {
			team: teamID,
			ordering: "-updated_at",
			is_open: false
		};
		const completedData = await Networking.request('ics/v7/tasks/search', 'GET', completedPayload);
		// Check response code
		if (completedData && completedData.status >= 200 && completedData.status < 300) {
			const data = await completedData.json();
			for (i = 0; i < data.results.length; i++) {
				// This needs to be fixed
				const task = await Networking.request('ics/v7/tasks/'+data.results[i].id, 'GET', {});
				if (task) {
					const taskJSON = await task.json();
					completed.push(taskJSON);
				}
			}
		}

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
			}
		];
	}
}