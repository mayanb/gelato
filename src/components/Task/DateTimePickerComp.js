import React, { Component } from 'react'
import { Keyboard } from 'react-native'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Colors from '../../resources/Colors'
import { DateFormatter } from '../../resources/Utility'

export default class DateTimePickerComp extends Component {
	constructor(props) {
		super(props)
		this.state = { isDateTimePickerVisible: true }
	}

	componentDidMount() {
		Keyboard.dismiss()
	}

	hideDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: false })
		this.props.onCancel()
	}

	handleDatePicked = jsDateString => {
		this.hideDateTimePicker()
		const ISODateString = moment(new Date(jsDateString)).toISOString()
		this.props.onDatePicked(ISODateString)
	}

	render() {
		const { title, dateToDisplayWhenOpened /* defaults to new Date() */ } = this.props
		return (
			<DateTimePicker
				confirmTextIOS="Select date"
				mode="datetime"
				titleStyle={{
					fontSize: 17,
					fontWeight: 'bold',
					color: Colors.textBlack,
				}}
				titleIOS={title}
				date={dateToDisplayWhenOpened}
				datePickerModeAndroid="spinner"
				isVisible={this.state.isDateTimePickerVisible}
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