import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Colors from '../../resources/Colors'
import { fieldIsBlank, DateFormatter } from '../../resources/Utility'
import EditButton from './EditButton'
import DateTimePickerComp from './DateTimePickerComp'
import { AttributeName } from './AttributeCell'

export default class DateTimeCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = { editing: false }

		this.handleDatePicked = this.handleDatePicked.bind(this)
		this.toggleEdit = this.toggleEdit.bind(this)
	}

	handleDatePicked(date) {
		this.setState({ editing: false })
		this.props.onSubmit(date)
	}

	toggleEdit() {
		this.setState({ editing: !this.state.editing })
	}

	render() {
		const { isLoadingTask, value } = this.props
		const { editing } = this.state

		if (isLoadingTask) {
			return null
		}
		const { name, loading } = this.props
		const showEditButton = !this.state.editing && fieldIsBlank(value)
		return (
			<TouchableOpacity onPress={this.toggleEdit} style={styles.container}>
				<AttributeName name={name} loading={loading} />
				{showEditButton ? (
					<EditButton onEdit={this.toggleEdit} />
				) : (
					<Text style={styles.display}>
						{value && this.getDateDisplay(value)}
					</Text>
				)}
				{editing && (
					<DateTimePickerComp
						title={`Edit '${name}'`}
						onDatePicked={this.handleDatePicked}
						onCancel={this.toggleEdit}
					/>
				)}
			</TouchableOpacity>
		)
	}

	getDateDisplay(value) {
		const displayDate = DateFormatter.mmddyyWithTime(value) // returns '' on fail
		// Handle special special case: date input manually before DatePicker existed
		return displayDate ? displayDate : value
	}
}

const styles = {
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	display: {
		fontSize: 17,
		color: Colors.textBlack,
		flex: 1,
		textAlign: 'right',
	},
}