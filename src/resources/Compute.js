import * as Networking from './Networking-superagent'
import update from 'immutability-helper'
import moment from 'moment'
import {
	NOT_OUTPUT,
	ALREADY_OUTPUT,
	ALREADY_ADDED_INPUT,
	ALREADY_ADDED_OUTPUT,
	INVALID_QR,
} from './QRSemantics'
import { NETWORK_ERROR, PROGRAM_ERROR } from './ErrorTypes'

export default class Compute {
	constructor() {}

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
				attribute_value = {}
			}
			let filled_attribute = update(attr, {
				$merge: { value: attribute_value },
			})
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
			is_trashed: false,
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
			default:
				return 'Add me'
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
}
