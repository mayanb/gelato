import React from 'react'
import {
	Text,
	StyleSheet,
	ScrollView,
} from 'react-native'
import Colors from '../../resources/Colors'
import AttributeCell from './AttributeCell'

export default class AttributeList extends React.Component {
	render() {
		let data = this.props.data || []
		return (
			<ScrollView keyboardShouldPersistTaps="always">
				{data.map(item => {
					return (
						<AttributeCell
							key={item.id}
							id={item.id}
							name={item.name}
							value={item.value}
							type={item.datatype}
							onSubmitEditing={this.props.onSubmitEditing}
							isLoadingTask={this.props.isLoadingTask}
						/>
					)
				})}
				<Text style={styles.endOfListMessage}>That’s all for this task!</Text>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	endOfListMessage: {
		color: Colors.lightGray,
		flex: 1,
		fontSize: 17,
		margin: 22,
		textAlign: 'center',
	},
})
