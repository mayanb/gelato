import React from 'react'
import { View, TouchableWithoutFeedback, Text, Switch } from "react-native";
import { AttributeName } from './AttributeCell'

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
		const { isLoadingTask, value, name, loading } = this.props
		if (isLoadingTask) return null

		const booleanValue = value === 'true'
		const label = booleanValue ? 'Yes' : 'No'

		//Using TouchableWithoutFeedback to allow scrolling (not sure why we need this)
		return (
			<TouchableWithoutFeedback style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
			}}>
				<View style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}>
					<AttributeName name={name} loading={loading} />
					<Text style={{ marginRight: 20 }}>{label}</Text>
					<Switch value={booleanValue} onValueChange={this.handleChange} />
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

