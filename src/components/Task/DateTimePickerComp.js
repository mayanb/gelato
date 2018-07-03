import React, { Component } from 'react'
import { Keyboard } from 'react-native'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Colors from '../../resources/Colors'
import { DateFormatter } from '../../resources/Utility'

// Note: this component must be shown/hidden by parent components. It can hide itself, but we're not using it.
export default class DateTimePickerComp extends Component {
	componentDidMount() {
		Keyboard.dismiss()
	}

	hideDateTimePicker = () => {
		this.props.onCancel(false)
	}

	handleDatePicked = jsDateString => {
		const ISODateString = moment(new Date(jsDateString)).toISOString()
		this.props.onDatePicked(ISODateString)
	}

	render() {
		const { title, time_format, dateToDisplayWhenOpened /* string */ } = this.props
		const is24Hour = time_format !== 'n'
		let date = DateFormatter.isValidISODate(dateToDisplayWhenOpened) ? new Date(dateToDisplayWhenOpened) : new Date()
		return (
			<DateTimePicker
				confirmTextIOS="Select date"
				mode="datetime"
				titleStyle={{
					fontSize: 17,
					fontWeight: 'bold',
					color: Colors.textBlack,
				}}
				is24Hour={is24Hour}
				titleIOS={title}
				date={date}
				datePickerModeAndroid="spinner"
				isVisible={true}
				onConfirm={this.handleDatePicked}
				onCancel={this.hideDateTimePicker}
			/>
		)
	}
}

export function getDateDisplay(value) {
	const displayDate = DateFormatter.monthDayYearWithTime(value) // returns null on fail
	// Handle special special case: date input manually before DatePicker existed
	return displayDate ? displayDate : value
}
