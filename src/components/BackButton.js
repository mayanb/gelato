import React from 'react'
import { connect } from 'react-redux'
import { Text, TouchableOpacity } from 'react-native'
import * as taskActions from '../actions/TaskActions'

/*
 * Imitates React Navigation default back button but additionally
 * refreshes the task list onPress. This keeps the Main page up to date.
 */

// Props received from React Navigation
class BackButton extends React.Component {
	render() {
		const { onPress, tintColor, title } = this.props
		return (
			<TouchableOpacity onPress={() => this.handlePress(onPress)}>
				<Text style={{ color: tintColor }}>{title}</Text>
			</TouchableOpacity>
		)
	}

	handlePress(onPress) {
		this.props.dispatch(taskActions.fetchRecentTasks())
		onPress() // Navigate back
	}
}

export default connect()(BackButton)
