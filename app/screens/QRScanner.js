import React, { Component } from 'react'
import {
	AppRegistry,
	Dimensions,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	Button
} from 'react-native'
import Camera from 'react-native-camera'
import ActionButton from 'react-native-action-button'

export default class Scanner extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Camera
					ref={(cam) => { this.camera = cam }}
					onBarCodeRead={this.onBarCodeRead.bind(this)}
					style={styles.preview}
					aspect={Camera.constants.Aspect.fill}>
				</Camera>
				<Button 
					style={styles.button}
					onPress={this.handleClose.bind(this)}
					title="Close"
					color="white"
				/>

			</View>
		)
	}

	handleClose() {
		this.props.navigator.dismissModal({animationType: 'slide-down'})
	}

	onBarCodeRead(e) {
		console.log("hi")
	}
}


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


const styles = StyleSheet.create({
	container: {
	},
	preview: {
		position: 'absolute', 
		justifyContent: 'flex-end',
		alignItems: 'center',
		top: 0,
		left: 0,
		height: height,
		width: width,
	},
})