import React, { Component } from 'react'
import { Button, View, StyleSheet } from 'react-native'
import Colors from '../resources/Colors'

export function CancelButton({ onCancel, style, ...rest }) {
	let styles = StyleSheet.create({
		buttonContainer: {
			borderTopWidth: 1,
			borderTopColor: Colors.ultraLightGray,
		},
	})
	return (
			<ModalButton
				onPress={onCancel}
				backgroundColor="transparent"
				color={Colors.base}
				title="Cancel"
				style={[styles.buttonContainer, style]}
				{...rest}
			/>
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
		let { disabled, ...rest } = this.props
		const backgroundColor = disabled ? Colors.darkGray : Colors.base
		return (
			<ModalButton
				onPress={this.handlePress}
				backgroundColor={backgroundColor}
				color="white"
				title="Add"
				disabled={this.state.isAdding || disabled}
				{...rest}
			/>
		)
	}

	handlePress() {
		this.setState({ isAdding: true }, () => {
			this.props.onAdd().finally(() => this.setState({ isAdding: false }))
		})
	}
}

function ModalButton({ backgroundColor, style, ...rest }) {
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
		<View style={[styles.button, style]}>
			<Button {...rest} />
		</View>
	)
}
