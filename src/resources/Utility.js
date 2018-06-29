import pluralize from 'pluralize'
import moment from 'moment'

export class DateFormatter {
	// yyyy-MM-dd-THH:mm:ss.SSSSSSZ
	static pad(value) {
		if (parseInt(value) < 10) {
			return '0' + value
		} else {
			return value
		}
	}
	// Manually create formatted date
	static format(date) {
		const months = [
			'01',
			'02',
			'03',
			'04',
			'05',
			'06',
			'07',
			'08',
			'09',
			'10',
			'11',
			'12',
		]
		const hours = [
			'01',
			'02',
			'03',
			'04',
			'05',
			'06',
			'07',
			'08',
			'09',
			'10',
			'11',
			'12',
			'13',
			'14',
			'15',
			'16',
			'17',
			'18',
			'19',
			'20',
			'21',
			'22',
			'23',
			'24',
		]
		let result =
			date.getUTCFullYear() +
			'-' +
			months[date.getUTCMonth()] +
			'-' +
			date.getUTCDate() +
			'-T' +
			hours[date.getUTCHours()] +
			':' +
			this.pad(date.getUTCMinutes()) +
			':' +
			this.pad(date.getUTCSeconds()) +
			'.' +
			this.pad(date.getUTCMilliseconds()) +
			'000+0000'
		return result
	}

	static monthDayYearWithTime(dateString, time_format) {
		if (!this.isValidISODate(dateString)) {
			return null
		}
		let format = time_format === 'n' ? "MMM D, hh:mm a" : "MMM D, HH:mm"
		return moment(dateString).format(format)
	}
	
	static isValidISODate(dateString) {
		return moment(dateString, moment.ISO_8601, true).isValid()
	}
}

export function fieldIsBlank(value) {
	return value === undefined || value === null || value === ''
}

export function formatNumber(amount) {
	return Number(amount).toLocaleString()
}

export function formatAmount(amount, unit) {
	return `${formatNumber(amount)} ${pluralize(unit, Number(amount))}`
}

export function validTaskNameLength(taskName) {
  return taskName.length >= 1 && taskName.length <= 50
}
