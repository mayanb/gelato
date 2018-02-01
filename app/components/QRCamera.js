import React, { Component } from 'react'
import { Dimensions, StyleSheet, Text, View, Button, FlatList, Image, TouchableOpacity } from 'react-native'
import Camera from 'react-native-camera'
import * as ImageUtility from '../resources/ImageUtility'

export default class QRCamera extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Camera
					ref={(cam) => { this.camera = cam }}
					onBarCodeRead={this.props.onBarCodeRead}
					style={styles.preview}
					aspect={Camera.constants.Aspect.fill}>
				</Camera>
				<View style={styles.button}>
					<TouchableOpacity onPress={this.props.onClose} style={styles.closeTouchableOpacity}>
						<Image 
							source={ImageUtility.systemIcon('close_camera')}
							title=""
							color="white"
						/>
					</TouchableOpacity>
					</View>
			</View>
		)
	}
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'absolute',
		top: 0,
		left: 0,
		height: height,
		width: width,
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
	closeTouchableOpacity: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 50,
		height: 50,
	},
	button: {
		position: 'absolute',
		top: 20 + 8,
		left: 16,
	},
	text: {
		color: 'white',
		marginTop: 20,
	}
})