import Colors from '../resources/Colors'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CreateTaskSelect } from './Cells'

export default function TaskSearchResultItem(item) {
	return (
		<SearchResultCell
			name={item.display}
			key={item.id}
			id={item.id}
			containsAlreadyAddedInput={item.containsAlreadyAddedInput}
		/>
	)
}

function SearchResultCell({ onPress, containsAlreadyAddedInput, name }) {
	return containsAlreadyAddedInput ? (
		<DisabledCell name={name} />
	) : (
		<ClickableCell name={name} onPress={onPress} />
	)
}

function ClickableCell({ name, onPress }) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.result}>
				<Text style={styles.resultText}>{name}</Text>
			</View>
		</TouchableOpacity>
	)
}

function DisabledCell({ name }) {
	return (
		<TouchableOpacity disabled={true}>
			<View style={styles.result}>
				<Text style={styles.disabledText}>{name} is added</Text>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	result: {
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,0.5)',
		padding: 16,
	},
	resultText: {
		color: 'white',
		fontSize: 17,
		lineHeight: 24,
	},
	disabledText: {
		color: Colors.gray,
		fontSize: 17,
		lineHeight: 24,
	},
})
