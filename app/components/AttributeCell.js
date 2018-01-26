import React from 'react'
import { 
	View, 
	Text,
	TextInput,
	Dimensions,
	StyleSheet
} from 'react-native'
import Colors from '../resources/Colors'

export default class AttributeCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			typedValue: this.props.value,
		}
	}

	render() {
		let {name, id, onSubmitEditing} = this.props
		return (
			<View style={styles.container}>
				<Text style={styles.name}>{name}</Text>
				<TextInput 
					style={styles.value} 
					onChangeText={this.handleChangeText.bind(this)}
					onSubmitEditing={() => onSubmitEditing(id, this.state.typedValue)} 
					onBlur={() => onSubmitEditing(id, this.state.typedValue)}
					returnKeyType='done'
					value={this.state.typedValue}
				/>
			</View>
		)
	}

	handleChangeText(text) {
		this.setState({ typedValue: text })
	}
}


const width= Dimensions.get('window').width;
const styles = StyleSheet.create({
	container: {
		width: width,
		minHeight: 60,
		borderBottomWidth: 1,
		borderBottomColor: Colors.ultraLightGray,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 16,
		paddingRight: 16,
		display: 'flex',
		flexDirection: 'row',
		fontSize: 17,
		backgroundColor: Colors.white,
	},
	name: {
		color: Colors.lightGray,
		flex: 1,
		fontSize: 17,
	},
	value: {
		fontSize: 17,
		color: Colors.textBlack,
		flex: 1,
		textAlign: 'right',
	}
})