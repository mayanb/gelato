import Colors from '../resources/Colors';
import * as ImageUtility from '../resources/ImageUtility'
import React, { Component } from 'react';
import {
	Dimensions,
	Image,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	ScrollView,
	View
} from 'react-native'
import {CreateTaskSelect} from './Cells'
import Collapsible from 'react-native-collapsible'

export default class Modal extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.props.onToggle}>
					<View style={styles.container} />
				</TouchableOpacity>
				<View style={styles.modal}>
					{this.props.children}
				</View>
			</View>
		)
	}
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		height: height,
		width: width,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		flexDirection: 'row',
	}, modal: {
		backgroundColor: 'white',
		borderRadius: 4,
		maxHeight: (52 * 5),
		minHeight: (52*5),
		flex: 1,
	}
})