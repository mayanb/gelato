import { connect } from 'react-redux'
import { TaskRow, TaskRowHeader } from '../components/Cells'
import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import React, { Component } from 'react'
import {
	AppRegistry,
	Button,
	StyleSheet,
	NativeModules,
	Platform,
	Text,
	View
} from 'react-native';
import { Navigation } from 'react-native-navigation'
import Networking from '../resources/Networking'
import Storage from '../resources/Storage'
import ActionButton from 'react-native-action-button'
import ActionSheet from 'react-native-actionsheet'
import RNPrint from 'react-native-print'
import QRCode from 'qrcode'


export default class Print extends Component {
	state = {
		selectedPrinter: null,
	}

	selectPrinter = async () => {
		const selectedPrinter = await RNPrint.selectPrinter()
		this.setState({ selectedPrinter })
	}

	silentPrint = async () => {
		if (!this.state.selectedPrinter) {
			alert('Must Select Printer First')
		}
		const jobName = await RNPrint.print({
			printerURL: this.state.selectedPrinter.url,
			html: '<h1>Silent Print</h1>'
		})
	}

	async printHTML() {
		let url = await QRCode.toString('asdfasdfadsf', {type: "svg"})
		let updatedUrl = url.slice(0, 4) + ` height="150px" width="150px"` + url.slice(4)
		await console.log(updatedUrl)
		await RNPrint.print({
			html: `${updatedUrl}`
		})

	}

	customOptions = () => {
		return (
			<View>
				{this.state.selectedPrinter &&
					<View>
						<Text>{`Selected Printer Name: ${this.state.selectedPrinter.name}`}</Text>
						<Text>{`Selected Printer URI: ${this.state.selectedPrinter.url}`}</Text>
					</View>
				}
				<Button onPress={this.selectPrinter} title="Select Printer" />
				<Button onPress={this.silentPrint} title="Silent Print" />
			</View>


		)
	}

	render() {
		console.log(this.state)
		console.log(this.props)
		return (
			<View style={styles.container}>
				{Platform.OS === 'ios' && this.customOptions()}
				<Button onPress={this.printHTML} title="Print HTML" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
});

