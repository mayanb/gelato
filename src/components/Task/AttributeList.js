import React from 'react'
import { Text, StyleSheet, View, TouchableWithoutFeedback} from 'react-native'
import Colors from '../../resources/Colors'
import AttributeCell from './AttributeCell'

export default class AttributeList extends React.Component {
	render() {
		let data = this.props.data || []
		return (
			<TouchableWithoutFeedback>
				<View>
					{data.map(attribute => {
						return (
							<AttributeCell
								key={attribute.id}
								attribute={attribute}
								onSubmitEditing={this.props.onSubmitEditing}
								isLoadingTask={this.props.isLoadingTask}
								time_format={this.props.time_format}
							/>
						)
					})}
				</View>
			</TouchableWithoutFeedback>
		)
	}
}
