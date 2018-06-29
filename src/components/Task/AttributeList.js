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
							/>
						)
					})}

					<View>
						<Text style={styles.endOfListMessage}>That’s all for this task!</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	endOfListMessage: {
		color: Colors.lightGray,
		flex: 1,
		fontSize: 17,
		margin: 22,
		paddingBottom: 300,
		textAlign: 'center',
	},
})
