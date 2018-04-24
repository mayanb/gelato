import React from 'react'
import EditButton from './EditButton'
import SelectUserWithInput from './SelectUserWithInput'
import { View, Text } from 'react-native'

export default class UserCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			editing: false,
		}

		this.handleSubmitText = this.handleSubmitText.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
	}

	handleSubmitText() {
		this.setState({ editing: false })
		this.props.onSubmit(this.state.searchText)
	}

	handleEdit() {
		this.setState({ editing: true }, () => {
			if (this.input) this.input.focus()
		})
	}

	handleSelect(user) {
		console.log('selected user: ', user)
	}

	render() {
		const { isLoadingTask, value } = this.props
		const { editing } = this.state
		if (isLoadingTask) return null

		return editing ? (
			<SelectUserWithInput
				initialValue={value}
				onSelect={this.handleSelect}
			/>
		) : (
			<NotEditingDisplay onEdit={this.handleEdit} value={value} />
		)
	}
}

function NotEditingDisplay({ onEdit, value }) {
	if (attributeBlank(value)) {
		return <EditButton onEdit={onEdit} />
	} else {
		return (
			<View>
				<Text>{value}</Text>
			</View>
		)
	}
}

function attributeBlank(value) {
	return value === undefined || value === null
}
