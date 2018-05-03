import React from 'react'
import { View, Text, Switch, StyleSheet } from "react-native";

export default class BooleanCell extends React.Component {
	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(value) {
		const storedValue = value ? 'true' : ''
		this.props.onSubmit(storedValue)
	}

	render() {
		if (this.props.isLoadingTask) return null

		const booleanValue = this.props.value === 'true'
		const label = booleanValue ? 'Yes' : 'No'

		return (
			<View
				style={styles.container}>
				<Text style={{ marginRight: 20 }}>{label}</Text>
				<Switch value={booleanValue} onValueChange={this.handleChange} />
			</View>
		)
	}
}

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 60,
	}
}
