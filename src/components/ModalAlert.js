import Colors from '../resources/Colors'
import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import Modal from './Modal'

export default class ModalAlert extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Modal>
				<View style={styles.message}>
					{this.props.message}
				</View>
				{this.props.onPress && (
					<View style={styles.button}>
						<Button
							onPress={this.props.onPress}
							title={this.props.buttonText}
							color="white"
						/>
					</View>
				)}
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	message: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	button: {
    flex: 0,
    backgroundColor: Colors.base,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 16,
  },
})
