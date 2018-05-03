import React from 'react'
import Compute from '../../resources/Compute'
import { fieldIsBlank } from '../../resources/Utility'
import EditButton from './EditButton'
import SelectUserWithInput from './SelectUserWithInput'
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Colors from '../../resources/Colors'

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
		const { isLoadingTask, value } = this.props
		const { editing } = this.state
		if (isLoadingTask) {
			return null
		}

		return (
			<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: 60 }}>
				{editing ? (
					<SelectUserWithInput
						usernameDisplay={value}
						onCancel={this.toggleEditing}
						onSelectUser={this.handleSelectUser}
					/>
				) : (
					<NonEditingDisplay onEdit={this.toggleEditing} value={value} />
				)}
			</View>
		)
	}
}

function NonEditingDisplay({ onEdit, value }) {
	if (fieldIsBlank(value)) {
		return <EditButton onEdit={onEdit} />
	} else {
		return (
			<TouchableOpacity
				onPress={onEdit}
				hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}>
				<Text style={styles.display} numberOfLines={1}>
					{value}
				</Text>
			</TouchableOpacity>
		)
	}
}

const width = Dimensions.get('window').width
const styles = {
	display: {
		fontSize: 17,
		color: Colors.textBlack,
		maxWidth: width / 2,
	},
}
