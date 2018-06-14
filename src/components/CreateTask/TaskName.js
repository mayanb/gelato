import React, { Component } from 'react'
import {
	View,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
} from 'react-native'
import ActionButton from 'react-native-action-button'
import * as ImageUtility from '../../resources/ImageUtility'
import Heading from './Heading'
import Colors from '../../resources/Colors'
import { validTaskNameLength } from '../../resources/Utility'

export default class TaskName extends Component {
	constructor(props) {
		super(props)
		this.state = {
			newName: this.props.name,
		}

		this.handleChangeText = this.handleChangeText.bind(this)
		this.handleSubmitName = this.handleSubmitName.bind(this)
	}

	render() {
		const nameIsValid = validTaskNameLength(this.state.newName)
		return (
			<View style={styles.container}>
				<ScrollView>
					<Heading>Your task name</Heading>
					<EditableName
						onChangeText={this.handleChangeText}
						onSubmitName={this.handleSubmitName}
						{...this.state}
					/>
					<Text style={styles.instructions}>
						Write this on the container(s) that hold the output.
					</Text>
					{!nameIsValid && (
						<View>
							<Text style={styles.invalidName}>
								The task name should be between 1 and 50 characters.
							</Text>
						</View>
					)}
				</ScrollView>
				{nameIsValid && (
					<ActionButton
						buttonColor={Colors.base}
						activeOpacity={0.5}
						onPress={() => this.handleSubmitName()}
						buttonText=">"
						renderIcon={() => (
							<Image source={ImageUtility.requireIcon('rightarrow.png')} />
						)}
					/>
				)}
			</View>
		)
	}

	handleChangeText(name) {
		this.setState({ newName: name })
	}

	handleSubmitName() {
		this.props.onSubmitName(this.state.newName)
	}
}

function EditableName({ newName, onChangeText }) {
	return (
		<View style={styles.nameContainer}>
			<TextInput
				underlineColorAndroid="transparent"
				style={styles.name}
				placeholder="Enter a task name"
				autoCapitalize="none"
				returnKeyType="done"
				autoCorrect={false}
				value={newName}
				onChangeText={onChangeText}
			/>
		</View>
	)
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
	invalidName: {
		margin: 16,
		textAlign: 'center',
		color: Colors.red,
		fontSize: 17,
	},
})
