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
		allAttributes.forEach((attr, i) => {
			let attribute_value = task.attribute_values.find(e =>
				Compute.equate(e.attribute, attr.id)
			)
			if (!attribute_value) {
				attribute_value = ''
			}
			let filled_attribute = update(attr, {
				$merge: { value: attribute_value.value },
			})
			attributes.push(filled_attribute)
		})
		attributes.sort(function(obj1, obj2) {
			return obj1.rank - obj2.rank
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
			is_ancestor_flagged: false,
			label_index: 0,
			custom_display: '',
			is_trashed: false,
		}
		return task
	}

	static isFlagged(semantic) {
		return semantic === IS_FLAGGED_INPUT
	}
	static isAncestorFlagged(semantic) {
		return semantic === IS_ANCESTOR_FLAGGED_INPUT
	}

	static getQRSemantic(mode, foundQR, currentTask, isDandelion) {
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

			console.log(input_task.product_type.id)
			console.log(currentTask.product_type.id)
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
		if (data.startsWith('dande.li/ics')) {
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
			default:
				return null
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

	static getDisplayFromUsername(username) {
		return !!username ? username.split('_')[0] : ''
	}

	static getFirstNameWithLastNameInitial(last_name, first_name = '') {
		if (last_name) {
			return `${last_name.charAt(0)}.`
		} else {
			const firstName = first_name.split(' ')[0]
      const lastName = first_name.split(' ')[1]
			return lastName ? `${firstName} ${lastName.charAt(0)}.` : `${firstName}`
		}
	}

	static postAttributeUpdate(taskID, attributeID, value) {
		let payload = {
			task: taskID,
			attribute: attributeID,
			value: value,
		}
		return Networking.post('/ics/taskAttributes/create/').send(payload)
	}

	static getSearchResults(text, teamID) {
		const r = Networking.get('/ics/tasks/search/').query({
			label: text,
			team: teamID,
		})
		return r
	}

	static markExistingInputsInSearchResults(taskToAddInputsTo, searchResults) {
		const existingInputItemIDs = new Set(
			taskToAddInputsTo.inputs.map(input => parseInt(input.input_item))
		)
		return searchResults.filter(task => {
			task.containsAlreadyAddedInput = task.items.some(item =>
				existingInputItemIDs.has(item.id)
			)
			return task.id !== taskToAddInputsTo.id
		})
	}

	static updateAllSearchVectors(list) {
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
		let r = new RegExp(`\\b${text.toLowerCase()}`)
		return arr.filter(e => e.search.search(r) !== -1)
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
}
