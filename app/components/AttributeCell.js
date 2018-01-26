import React from 'react'
import {
	Image,
	View, 
	Text,
	TextInput,
	Dimensions,
	StyleSheet,
	TouchableOpacity
} from 'react-native'
import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'

export default class AttributeCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			typedValue: this.props.value,
			editing: this.props.value !== ""
		}
		this.edit = this.edit.bind(this)
	}

	render() {
		let {name, id, onSubmitEditing} = this.props
		name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
		return (
			<View style={styles.container}>
				<Text style={styles.name}>{name}</Text>
				{ this.state.editing &&
					<TextInput 
						style={styles.value} 
						onChangeText={this.handleChangeText.bind(this)}
						onSubmitEditing={() => onSubmitEditing(id, this.state.typedValue)} 
						onBlur={() => onSubmitEditing(id, this.state.typedValue)}
						returnKeyType='done'
						value={this.state.typedValue}
						placeholder="Value"
					/>
				}
				{ !this.state.editing &&
					<TouchableOpacity activeOpacity={0.5} onPress={this.edit}>
						<Image source={ImageUtility.uxIcon("edit")} />
					</TouchableOpacity>
				}
			</View>
		)
	}

	handleChangeText(text) {
		this.setState({ typedValue: text })
	}

	edit() {
		this.setState({editing: true})
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