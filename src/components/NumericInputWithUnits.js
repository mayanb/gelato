import React, { Component } from 'react'
import {
	View,
	TextInput,
	StyleSheet,
	Text,
} from 'react-native'

import Colors from '../resources/Colors'

export default class NumericInputWithUnits extends Component {
	render() {
		let { unit, value, onChangeText } = this.props
		return (
			<View>
				<TextInput
					style={styles.textInput}
					onChangeText={onChangeText}
					value={value}
					autoCorrect={false}
					keyboardType="numeric"
				/>
				<Text style={styles.unit}>{unit}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	textInput: {
		marginTop: 20,
		padding: 16,
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
	unit: {
		position: 'absolute',
		right: 24,
		bottom: 20,
		fontSize: 17,
		color: Colors.lightGray,
	},
})
