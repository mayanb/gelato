import Compute from './Compute'
import { DateFormatter } from './Utility'
import Networking from './Networking-superagent'
import Storage from './Storage'

export async function OpenTasks() {
	try {
		var yesterday = new Date()
		yesterday.setDate(yesterday.getDate() - 1)

		let teamID = await Storage.get('teamID')
		let userID = await Storage.get('userID')
		let payload = {
			ordering: '-updated_at',
			is_open: true,
			start: DateFormatter.format(yesterday),
			end: DateFormatter.format(new Date()),
			team: teamID
		}
		let result = await Networking.get('/ics/tasks/simple/').query(payload)
		// let organized = Compute.organizeAttributesForTasks(result.body)
		return result.body
	} catch (e) {
		throw e
	}
}

export async function CompletedTasks() {
	try {
		var yesterday = new Date()
		yesterday.setDate(yesterday.getDate() - 1)

		let teamID = await Storage.get('teamID')
		let userID = await Storage.get('userID')
		let payload = {
			ordering: '-updated_at',
			is_open: false,
			team: teamID
		}
		let result = await Networking.get('/ics/tasks/simple/').query(payload)
		// let organized = Compute.organizeAttributesForTasks(result.body)
		return result.body
	} catch (e) {
		throw e
	}
}