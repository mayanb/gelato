import React, { Component } from 'react'
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

export default function TaskHeader({ name, onPress }) {
	const width = Dimensions.get('window').width
	const styles = StyleSheet.create({
		text_container: {
			maxWidth: width / 2.4,
		},
		name: {
			fontSize: 17,
			color: 'white',
			fontWeight: 'bold',
		},
	})
	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.text_container}
				onPress={onPress}
				hitSlop={{ top: 10, left: 20, bottom: 20 }}>
				<Text style={styles.name} numberOfLines={1}>
					{name}
				</Text>
			</TouchableOpacity>
		</View>
	)
}
