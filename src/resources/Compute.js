import Networking from './Networking-superagent'
import update from 'immutability-helper'
import moment from 'moment'
import {
	NOT_OUTPUT,
	ALREADY_OUTPUT,
	ALREADY_ADDED_INPUT,
	ALREADY_ADDED_OUTPUT,
	INVALID_QR,
	ALREADY_ADDED_MOVE_ITEM,
	IS_FLAGGED_INPUT,
	NO_OUTPUT_ITEMS,
	SCAN_ERROR,
	IS_ANCESTOR_FLAGGED_INPUT,
	UNLIKELY_INPUT,
} from './QRSemantics'
import { PROGRAM_ERROR } from './ErrorTypes'

export default class Compute {
	constructor() {}

	static isDandelion(teamName) {
		return (
			teamName.toLowerCase() === 'valencia' ||
			teamName.toLowerCase() === 'alabama'
		)
	}

	static equate(id1, id2) {
		return parseInt(id1, 10) === parseInt(id2, 10)
	}

	static organizeAttributesForTasks(data) {
		let org = data.map((t, i) => {
			t.organized_attributes = Compute.organizeAttributes(t)
			return t
		})
		return org
	}

	static organizeAttributes(task) {
		var attributes = []
		let allAttributes = task.process_type.attributes
		const attributeValues = task.attribute_values
		return this.attributesWithValues(allAttributes, attributeValues)
	}

	/*
	 * Matches each attribute (ProcessType.Attribute) with its TaskAttributes.
	 * If an Task's attribute has never been filled in, it has no taskAttributes.
	 * Recurring tasks can have an arbitrary number of taskAttributes, though non-recurring may have multiple for legacy reasons (so we use the most recent).
	 * attribute.values = [taskAttributeA, taskAttributeB, ... taskAttributeN]
	 * taskAttribute.attribute is the attribute ID of the ProcessType.Attribute the taskAttribute is holding the value for.
	*/
	static attributesWithValues(attributes, taskAttributes) {
		// Hash Attributes by id
		const attrByID = {}
		attributes.forEach(attr => {
			attr.values = []
			attrByID[attr.id] = attr
		})
		// Cluster recurring TaskAttributes into their respective Attributes
		taskAttributes.forEach(taskAttribute => {
			const attr = attrByID[taskAttribute.attribute]
			attr && attr.values.push(taskAttribute)
		})
		// Sort Attributes in user-specified order (rank)
		const _attributesWithValues = Object.values(attrByID).sort((a, b) => a.rank - b.rank)
		// (In place) sort each attribute's values (TaskAttributes) newest to oldest -- lets us display them properly, and predictably pre-pend new values to the start
		_attributesWithValues.forEach(attribute => attribute.values.sort((TA1, TA2) => new Date(TA2.created_at) - new Date(TA1.created_at)))
		// filter to show both attributes that are active (not trashed) and attributes that are trashed but have data in them
		return _attributesWithValues.filter(attr => {
			if (attr.is_recurrent) {
				return !attr.is_trashed || attr.values.length
			} else {
				return !attr.is_trashed || (attr.values.length && attr.values[attr.values.length - 1].value.length)
			}
		})
	}

	static updateTaskAttributeValue(index, newValue, taskAttributeIndexInValues, organized_attributes) {
		// Optimistically set PATCHED newValue as value of most recent taskAttribute
		return update(organized_attributes, {
			[index]: {
				values: {
					[taskAttributeIndexInValues]: {
						$merge: { value: newValue },
					},
				},
			},
		})
	}

	static storeNewTaskAttribute(index, newTaskAttribute, organized_attributes) {
		// Set created newTaskAttribute as the first (most recent) taskAttribute in values
		return update(organized_attributes, {
			[index]: {
				values: {
					$unshift: [newTaskAttribute],
				},
			},
		})
	}

	static generateNewTask(data) {
		let date = moment().format('MMDD')
		let label = [data.processType.code, data.productType.code, date].join('-')
		const totalCost = data.cost === '' ? null : data.cost
		let task = {
			process_type: data.processType.id,
			product_type: data.productType.id,
			batch_size: data.batch_size,
			label: label,
			is_open: true,
			is_flagged: false,
			is_ancestor_flagged: false,
			label_index: 0,
			custom_display: '',
			is_trashed: false,
			cost: totalCost,
			cost_set_by_user: totalCost,
		}
		return task
	}

	static isFlagged(semantic) {
		return semantic === IS_FLAGGED_INPUT
	}
	static isAncestorFlagged(semantic) {
		return semantic === IS_ANCESTOR_FLAGGED_INPUT
	}

	static getQRSemantic(mode, foundQR, currentTask) {
		const isDandelion =
			currentTask &&
			Compute.isDandelion(currentTask.process_type.team_created_by_name)
		if (mode === 'inputs') {
			// if this QR code wasn't from any task
			if (!foundQR) {
				return NOT_OUTPUT
			}

			const input_task = foundQR.creating_task

			// if the input is flagged
			if (input_task.is_flagged) {
				return IS_FLAGGED_INPUT
			}
			if (input_task.num_flagged_ancestors > 0) {
				return IS_ANCESTOR_FLAGGED_INPUT
			}

			// if the product types don't match
			if (input_task.product_type.id !== currentTask.product_type.id) {
				if (isDandelion) {
					return UNLIKELY_INPUT
				}
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
		return !semantic.length || Compute.isWarning(semantic)
	}

	static isWarning(semantic) {
		return semantic === UNLIKELY_INPUT
	}

	// VALIDATE THE QR CODE SEQ
	static validateQR(data) {
		// if (data.startsWith('dande.li/ics')) {
		if (data.startsWith('dande')) {
			return true
		} else {
			return false
		}
	}

	static errorText() {
		return PROGRAM_ERROR
	}

	static getTextFromSemantic(semantic) {
		switch (semantic) {
			case ALREADY_OUTPUT:
				return 'This QR code was used as an output for a different task. Please find a new QR code.'
			case ALREADY_ADDED_OUTPUT:
				return "Hooray! You've already added this item as an output."
			case ALREADY_ADDED_INPUT:
				return "Hooray! You've already scanned this item in as an input."
			case NOT_OUTPUT:
				return "This QR code hasn't been associated with a task yet. Scan this QR as an output for a task before using it as an input."
			case INVALID_QR:
				return 'This QR code is invalid.'
			case ALREADY_ADDED_MOVE_ITEM:
				return "Hooray! You've already chosen this item to be moved."
			case IS_FLAGGED_INPUT:
				return 'This task is flagged. Please ask an admin before using it.'
			case IS_ANCESTOR_FLAGGED_INPUT:
				return 'This task has a flagged ancestor. Please ask an admin before using it.'
			case UNLIKELY_INPUT:
				return "This origin doesn't match. Are you sure you want to add it?"
			case NO_OUTPUT_ITEMS:
				return "This task doesn't have any output items."
			case SCAN_ERROR:
				return 'There was an error scanning this QR code.'
			default:
				return ''
		}
	}

	static isAlreadyInput(code, task) {
		let { inputs } = task
		let found_input = inputs.find(e => e.input_qr === code)
		return found_input || false
	}

	static isAlreadyOutput(code, task) {
		let { items } = task
		let found_output = items.find(e => e.item_qr === code)
		return found_output || false
	}

	static getReadableTaskDescriptor(task) {
		return task.process_type.name + ' ' + task.product_type.name
	}

	static parseUsername(username) {
		return !!username ? username.split('_')[0] : ''
	}

	static getFirstNameWithLastNameInitial(first_name, last_name) {
		const firstName = first_name.split(' ')[0]
		const lastName = last_name || first_name.split(' ')[1]
		return lastName ? `${firstName} ${lastName.charAt(0)}.` : `${firstName}`
	}

	static getUsernameDisplay({ first_name, last_name, username_display }) {
		return `${this.getFirstNameWithLastNameInitial(
			first_name,
			last_name
		)} (@${this.parseUsername(username_display)})`
	}

	static postAttributeUpdate(taskID, attributeID, value) {
		let payload = {
			task: taskID,
			attribute: attributeID,
			value: value,
		}
		return Networking.post('/ics/taskAttributes/').send(payload)
	}

	static patchAttributeUpdate(taskAttributeID, value) {
		let payload = {
			value: value,
		}
		return Networking.patch(`/ics/taskAttributes/${taskAttributeID}/`).send(payload)
	}

	static getSearchResults(text, teamID) {
		const r = Networking.get('/ics/tasks/simple/').query({
			label: text,
			team: teamID,
		})
		return r
	}

	static annotateWithExistingInputs(results, taskToAddInputsTo) {
		const existingInputItemIDs = new Set(
			taskToAddInputsTo.inputs.map(input => parseInt(input.input_item))
		)
		return results.filter(task => {
			task.containsAlreadyAddedInput = task.items.some(item =>
				existingInputItemIDs.has(item.id)
			)
			return task.id !== taskToAddInputsTo.id
		})
	}

	static annotateWithMissingOutputs(results) {
		return results.filter(task => task.items && task.items.length)
	}

	static annotateWithSearchVector(list) {
		list.forEach(e => {
			e.search = `${e.search} ${e.name.toLowerCase()} ${e.code.toLowerCase()}`
		})
	}

	static updateAllUserSearchVectors(list) {
		list.forEach(u => {
			u.search = `${
				u.search
			} ${u.first_name.toLowerCase()} ${u.last_name.toLowerCase()} ${u.username.toLowerCase()} ${u.username_display.toLowerCase()}`
		})
	}

	static searchItems(text, arr) {
		return arr.filter(e => e.search.indexOf(text.toLowerCase()) !== -1)
	}

	static searchUsers(text, arr) {
		const isNotUUID = str => {
			const arr = str.split('-')
			return (
				!arr ||
				(arr.length !== 5 ||
					(arr[0].length !== 8 &&
						arr[1].length !== 4 &&
						arr[2].length !== 4 &&
						arr[3].length !== 4 &&
						arr[4].length !== 12))
			)
		}
		return arr.filter(
			e =>
				e.search.indexOf(text.toLowerCase()) !== -1 &&
				isNotUUID(this.parseUsername(e.username_display))
		)
	}

	static sortAlphabeticallyUsing(property) {
		return function(a, b) {
			const A = a[property].toLowerCase()
			const B = b[property].toLowerCase()
			if (A < B) {
				return -1
			} else if (A > B) {
				return 1
			} else {
				return 0
			}
		}
	}

	/*
	 * Takes in 1) an array of task ids and 2) an array of tasks (both sorted recent to oldest)
	 * also 3) tasksHash, which is a hash of taskId -> task for the array of task ids.
	 * Returns an array of UNIQUE task ids sorted newest to oldest.
	 */
	static mergeNewTasks(idArr, tasksArr, tasksHash) {
		let merged = []
		let indexIdArr = 0
		let indexTasksArr = 0
		let current = 0

		while (current < idArr.length + tasksArr.length) {
			const isIdArrDepleted = indexIdArr >= idArr.length
			const isArr2Depleted = indexTasksArr >= tasksArr.length

			const idArrVal = !isIdArrDepleted && tasksHash[idArr[indexIdArr]].updated_at
			const tasksArrVal = tasksArr[indexTasksArr] && tasksArr[indexTasksArr].updated_at
			const AMoreRecentThanB = moment(idArrVal).isAfter(moment(tasksArrVal))

			if (!isIdArrDepleted && (isArr2Depleted || AMoreRecentThanB)) {
				merged[current] = idArr[indexIdArr]
				indexIdArr++
			} else {
				merged[current] = tasksArr[indexTasksArr].id
				indexTasksArr++
			}
			current++
		}
		return Array.from(new Set(merged))
	}
}
