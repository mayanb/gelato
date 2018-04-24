import React from 'react'
import EditButton from './EditButton'
import SelectUserWithInput from './SelectUserWithInput'
import { View, Text, TouchableOpacity } from 'react-native'

export default class UserCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			editing: false,
		}

		this.handleSelectUser = this.handleSelectUser.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
	}

	handleEdit() {
		this.setState({ editing: true })
	}

	handleSelectUser(user) {
		console.log('selected user: ', user)
    this.setState({ editing: false })
    this.props.onSubmit(user.id)
	}

	render() {
		const { isLoadingTask, value } = this.props
		const { editing } = this.state
		if (isLoadingTask) return null

		return editing ? (
			<SelectUserWithInput
				initialValue={value}
				onSelect={this.handleSelect}
				onSelectUser={this.handleSelectUser}
			/>
		) : (
			<NotEditingDisplay
				onEdit={this.handleEdit}
				value={value}
			/>
		)
	}
}

function NotEditingDisplay({ onEdit, value }) {
	if (attributeBlank(value)) {
		return <EditButton onEdit={onEdit} />
	} else {
		return (
			<TouchableOpacity onPress={onEdit} hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}>
				<Text>{value}</Text>
			</TouchableOpacity>
		)
	}
}

function attributeBlank(value) {
	return value === undefined || value === null
}
