import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import NavHeader from 'react-navigation-header-buttons'
import * as taskActions from '../actions/TaskActions'
import Colors from "../resources/Colors";

/*
 * Imitates React Navigation default back button but additionally
 * refreshes the task list onPress. This keeps the Main page up to date.
 */

// Props received from React Navigation
class BackButton extends React.Component {
	render() {
		const styles = StyleSheet.create({
			container: {
				display: 'flex',
				flexDirection: 'row',
				marginLeft: -4,
			},
			textContainer: {
				marginLeft: -4,
				marginBottom: 1.5,
				justifyContent: 'center',
				alignItems: 'center',
			},
			text: {
				fontSize: 17,
				color: 'white',
			},
		})
		const { onPress, title } = this.props
		return (
			<TouchableOpacity onPress={() => this.handlePress(onPress)} style={styles.container}>
				{this.backArrow()}
				<View style={styles.textContainer}>
					<Text style={styles.text} numberOfLines={1}>{title}</Text>
				</View>
			</TouchableOpacity>
		)
	}

	handlePress() {
		this.props.dispatch(taskActions.fetchRecentTasks())
		this.props.onPress() // Navigate back
	}

	backArrow() {
		return (
			<NavHeader IconComponent={Ionicons} size={25} color={Colors.white}>
				<NavHeader.Item
					iconName="ios-arrow-back"
					label="Back"
					onPress={() => this.handlePress()} // Arrow fn binds this context
					buttonStyle={{
						fontSize: 34,
						marginHorizontal: 0,
						marginLeft: 13,
						marginRight: 4,
					}}
				/>
			</NavHeader>
		)
	}
}

export default connect()(BackButton)