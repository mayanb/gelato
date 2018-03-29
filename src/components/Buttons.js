import React, { Component } from 'react'
import { Button, View, StyleSheet } from 'react-native'
import Colors from '../resources/Colors'

export function CancelButton({ onCancel }) {
	let styles = StyleSheet.create({
		buttonContainer: {
			borderTopWidth: 1,
			borderTopColor: Colors.ultraLightGray,
		},
	})
	return (
		<View style={styles.buttonContainer}>
			<ModalButton
				onPress={onCancel}
				backgroundColor="transparent"
				color={Colors.base}
				title="Cancel"
			/>
		</View>
	)
}

export class AddButton extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isAdding: false,
		}

		this.handlePress = this.handlePress.bind(this)
	}

	render() {
		return (
			<ModalButton
				onPress={this.handlePress}
				backgroundColor={Colors.base}
				color="white"
				title="Add"
				disabled={this.state.isAdding}
			/>
		)
	}

	handlePress() {
		this.setState({ isAdding: true }, () => {
			this.props.onAdd().finally(() => this.setState({ isAdding: false }))
		})
	}
}

function ModalButton({ backgroundColor, ...rest }) {
	let styles = StyleSheet.create({
		button: {
			flex: 0,
			backgroundColor: backgroundColor,
			borderBottomLeftRadius: 4,
			borderBottomRightRadius: 4,
			padding: 16,
		},
	})
	return (
		<View style={styles.button}>
			<Button {...rest} />
		</View>
	)
}
