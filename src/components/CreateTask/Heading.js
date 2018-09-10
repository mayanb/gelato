import React from 'react'
import Colors from '../../resources/Colors'
import {
	StyleSheet,
	Text,
} from 'react-native'

export default function Heading({ children }) {
	const styles = StyleSheet.create({
		text: {
			fontSize: 14,
			color: Colors.lightGray,
			textAlign: 'center',
		},
	})
	return (
		<Text style={styles.text}>
			{children}
		</Text>
	)
}