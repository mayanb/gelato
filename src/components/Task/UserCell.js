import React from 'react'
import { fieldIsBlank } from '../../resources/Utility'
import EditButton from './EditButton'
import SelectUserWithInput from './SelectUserWithInput'
import { Dimensions, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from '../../resources/Colors'
import { AttributeName } from './AttributeCell'

export default class UserCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			editing: false,
		}

		this.handleSelectUser = this.handleSelectUser.bind(this)
		this.toggleEditing = this.toggleEditing.bind(this)
	}

	toggleEditing() {
		this.setState({ editing: !this.state.editing })
	}

	handleSelectUser(username) {
		this.setState({ editing: false })
		this.props.onSubmit(username)
	}

	render() {
		const { isLoadingTask, value, name, loading } = this.props
		const { editing } = this.state
		if (isLoadingTask) {
			return null
		}

		return (
			<TouchableOpacity
				style={styles.container}
				onPress={this.toggleEditing}
			>
				<AttributeName name={name} loading={loading} />
				{editing ? (
					<SelectUserWithInput
						usernameDisplay={value}
						onCancel={this.toggleEditing}
						onSelectUser={this.handleSelectUser}
					/>
				) : (
					<NonEditingDisplay onEdit={this.toggleEditing} value={value} />
				)}
			</TouchableOpacity>
		)
	}
}

function NonEditingDisplay({ value }) {
	if (fieldIsBlank(value)) {
		return <EditButton />
	} else {
		return (
			<Text style={styles.display} numberOfLines={1}>
				{value}
			</Text>
		)
	}
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	display: {
		fontSize: 17,
		color: Colors.textBlack,
		maxWidth: width / 2,
	},
})
