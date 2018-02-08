import React from 'react'
import { Dimensions, Text, StyleSheet, View } from 'react-native'
import Colors from '../resources/Colors'

export default function Snackbar(props) {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>{props.children}</Text>
		</View>
	)
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.darkGray,
		padding: 16,
	}, 
	text: {
		color: Colors.white,
		fontSize: 17,
		lineHeight: 20,
	}
})
