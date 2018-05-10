import React, { Component } from 'react'
import DateTimePicker from 'react-native-modal-datetime-picker'

export default class DateTimePickerComp extends Component {
	constructor(props) {
		super(props)
		this.state = { isDateTimePickerVisible: true }
	}

	hideDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: false })
		this.props.onCancel()
	}

	handleDatePicked = date => {
		this.hideDateTimePicker()
		this.props.onDatePicked(date)
	}

	render() {
		return (
			<DateTimePicker
				isVisible={this.state.isDateTimePickerVisible}
				onConfirm={this.handleDatePicked}
				onCancel={this.hideDateTimePicker}
				confirmTextIOS="Select date"
				mode="datetime"
			/>
		)
	}
}
