import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
	Button,
	TouchableOpacity,
	Image,
	TextInput
} from 'react-native'
import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import * as ImageUtility from '../resources/ImageUtility'

export class QRDisplay extends Component {
	render() {
		let {barcode, creating_task, semantic, shouldShowAmount, default_amount, onChange, onPress, onCancel} = this.props
		let styles = StyleSheet.create({
			container: {
				flexDirection: 'column',
				flex: 1,
			}, qr_top: {
				flexDirection: 'row',
				flex: 0,
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				padding: 16,
			}, main: {
				flex: 1,
				padding: 16,
			}, qr_text: {
				flex: 1,
			}, icon: {
				height: 24,
				width: 24,
				marginRight: 8,
			}, semantic: {
				fontSize: 17,
				lineHeight: 24,
				textAlign: 'center'
			}
		})
		return (
			<View style={styles.container}>
				<TouchableOpacity
					disabled={!this.props.onOpenTask}
					onPress={() => this.props.onOpenTask()}
					style={styles.qr_top}
				>
					<Image source={ImageUtility.requireIcon('qr_icon')} style={styles.icon} />
					<Text style={styles.qr_text}>{barcode.substring(barcode.length - 6)}</Text>
					<Text>{creating_task}</Text>
				</TouchableOpacity>
				<View style={styles.main}>
					<Text style={styles.semantic}>{Compute.getTextFromSemantic(semantic)}</Text>
					{
						shouldShowAmount ?
						<QRInput
							placeholder={default_amount}
							autoCapitalize="none"
							autoCorrect={false}
							onChangeText={onChange}
						/> :
						null
					}
				</View>
				{ renderButtons(semantic, onPress, onCancel) }
			</View>
		)
	}
}

function renderButtons(semantic, onPress, onCancel) {
	let btnstyle = StyleSheet.create({
		button: {
			flex: 0,
			backgroundColor: Colors.base,
			borderBottomLeftRadius: 4,
			borderBottomRightRadius: 4,
			padding: 16,
		}, secondary: {
			flex: 0,
			borderBottomLeftRadius: 4,
			borderBottomRightRadius: 4,
			padding: 16,
			borderTopWidth: 1,
			borderTopColor: Colors.ultraLightGray,
		}
	})

	if (Compute.isOkay(semantic)) {
		return (
			<View style={btnstyle.button}>
				<Button title="Add" onPress={onPress} color="white" />
			</View>
		)
	} else {
		return (
			<View style={btnstyle.secondary}>
				<Button title="Cancel" onPress={onCancel} color={Colors.base} />
			</View>
		)
	}
}

function QRInput(props) {
	let styles = StyleSheet.create({
		container: {
			flexDirection: 'column',
			alignItems: 'stretch',
		},
		help: {
			textAlign: 'center',
		},
		input: {
			borderRadius: 4,
			backgroundColor: Colors.white,
			borderColor: Colors.lightGray,
			borderWidth: 1,
			borderRadius: 3,
			fontSize: 15,
			color: Colors.gray,
			marginBottom: 20,
			padding: 10,
			textAlign: 'center',
			marginTop: 4,
		}
	})
	return (
		<View style={styles.container}>
			<Text style={styles.help}>Enter amount</Text>
			<TextInput style={styles.input} {...props} />
		</View>
	)
}
