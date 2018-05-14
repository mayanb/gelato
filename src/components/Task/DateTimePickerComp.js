import React, { Component } from 'react'
import DateTimePicker from 'react-native-modal-datetime-picker'
import Colors from '../../resources/Colors'

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
		const { title } = this.props
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
				isVisible={this.state.isDateTimePickerVisible}
				onConfirm={this.handleDatePicked}
				onCancel={this.hideDateTimePicker}
			/>
		)
	}
}
