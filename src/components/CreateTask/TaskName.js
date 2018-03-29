import React, { Component } from 'react'
import { View, Image, ScrollView, StyleSheet, Text } from 'react-native'
import ActionButton from 'react-native-action-button'
import * as ImageUtility from '../../resources/ImageUtility'
import Heading from './Heading'

import Colors from '../../resources/Colors'

export default class TaskName extends Component {

	render() {
		let { onNext, name } = this.props
		return (
			<View style={styles.container}>
				<ScrollView>
					<Heading>Your task name</Heading>
					<View style={styles.nameContainer}>
						<Text style={styles.name}>
							{name}
						</Text>
					</View>
					<Text style={styles.instructions}>
						Write this on the container(s) that hold the output.
					</Text>
				</ScrollView>
				<ActionButton
					buttonColor={Colors.base}
					activeOpacity={0.5}
					onPress={() => onNext()}
					buttonText=">"
					renderIcon={() => (<Image source={ImageUtility.requireIcon('rightarrow.png')} />)}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F8F8F8',
		flex: 1,
		paddingTop: 20,
		paddingLeft: 16,
		paddingRight: 16,
	},
	nameContainer: {
		marginTop: 20,
		padding: 16,
		alignSelf: 'stretch',
		height: 60,
		backgroundColor: Colors.white,
		borderRadius: 4,
		shadowColor: 'rgba(0, 0, 0, 0.07)',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowRadius: 4,
		shadowOpacity: 1,
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.08)',
	},
	name: {
		fontSize: 20,
		color: Colors.black,
		textAlign: 'center',
	},
	instructions: {
		marginTop: 16,
		width: 250,
		alignSelf: 'center',
		textAlign: 'center',
		color: Colors.lightGray,
		fontSize: 17,
	},
})
