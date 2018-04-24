import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import ModalAlert from '../ModalAlert'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function ShouldUpdateModal() {
	let message = (
		<View style={{ padding: 16, alignItems: 'center', flexDirection: 'column' }}>
			<Text style={styles.title}>Your app needs updates!</Text>
			<Text style={styles.text}>
				Double-press the hardware home button and swipe up on the Polymer app.
				&nbsp;Reopen the app to install updates. You might have to do this
				&nbsp; a few times.
			</Text>
		</View>
	)
	return (
		<View style={styles.container}>
			<ModalAlert message={message} />
		</View>
	)
}

const styles = StyleSheet.create({
	title: {
		fontWeight: 'bold',
		fontSize: 17,
		textAlign: 'center',
		marginBottom: 16,
	},
	text: {
		lineHeight: 24,
		fontSize: 17,
		textAlign: 'center',
	},
	container: {
		position: 'absolute',
		justifyContent: 'flex-end',
		alignItems: 'center',
		top: 0,
		left: 0,
		height: height,
		width: width,
	},
})
