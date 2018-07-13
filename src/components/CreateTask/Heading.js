import React from 'react'
import Colors from '../../resources/Colors'
import {
	StyleSheet,
	Text,
} from 'react-native'

export default function Heading({ children, customMargin = 0 }) {
	const styles = StyleSheet.create({
		text: {
			fontSize: 14,
			color: Colors.lightGray,
			textAlign: 'center',
			marginTop: customMargin,
		},
	})
	return (
		<Text style={styles.text}>
			{children}
		</Text>
	)
}