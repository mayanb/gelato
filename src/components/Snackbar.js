import React from 'react'
import { Text, View } from 'react-native'

export default function Snackbar(props) {
	return (
		<View>
			<Text>{props.children}</Text>
		</View>
	)
}
