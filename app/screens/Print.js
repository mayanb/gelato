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
	View,
	TextInput,
} from 'react-native';
import { Navigation } from 'react-native-navigation'
import Networking from '../resources/Networking'
import Storage from '../resources/Storage'
import { PrintButton, PrintNumberInput } from '../components/Forms';
import ActionButton from 'react-native-action-button'
import ActionSheet from 'react-native-actionsheet'
import RNPrint from 'react-native-print'
import QRCode from 'qrcode'
import { Dropdown } from '../components/Dropdown'
import uuid from 'uuid/v4'


export default class Print extends Component {

	constructor(props) {
		super(props);
		console.log(props.selectedTask)
        this.state = {
			selectedPrinter: null,
			updatedUrl: "hi",
			numberLabels: 1,
			// selectedTask: {name: "", qrcode: ""},
		}
		this.printHTML = this.printHTML.bind(this)
		this.onChangedNumber = this.onChangedNumber.bind(this)
		// this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
		// this.showTaskSearch = this.showTaskSearch.bind(this)
    }

	makeid(num_labels) {
		let text = "dande.li/ics/"
		const data = Array(num_labels).fill(0).map(() => uuid())
		const data_urls = data.map(x => (text + x))
		console.log(data_urls)
		return data_urls
	}


	generateQRCode(data, qrdocument) {
		console.log("hi")
		let text = `<style>#rotate-text { margin-left: 100px; margin-bottom: 200px; width: 200px; transform: rotate(90deg); transform-origin: top left; font-size:30px;}</style><div id="rotate-text"><p>${this.props.selectedTask.display}</p></div>`
		return new Promise((resolve, reject)=>{
			QRCode.toString(data, function(err, string) {
				if(err) {
					console.log("error")
					console.log(err)
					reject(err)
				} else {
					let updatedUrl = string.slice(0, 4) + ` height="130px" width="130px"` + string.slice(4)
					updatedUrl += text
					console.log(updatedUrl)
					qrdocument.push(updatedUrl)
					resolve(updatedUrl)
				}
			})
		})
	}


	repeatFunction(num_qrs, qrdocument) {
		let pictexts = this.makeid(num_qrs)
		var promises = []
		for (var i=0; i < num_qrs; i++) {
			promises.push(this.generateQRCode(pictexts[i], qrdocument))
		}
		return Promise.all(promises)
	}

	printHTML() {
		let qrdoc = []
		let numLabels = this.state.numberLabels
		// const numLabels = 4
		this.repeatFunction(numLabels, qrdoc).then(function(results) {
			results.join("")
			RNPrint.print({html: `${results}`})
			// console.log(JSON.stringify(results))
		}, function(err) {
			console.log(err)
		})
	}

	onChangedNumber(num) {
		let numLabels = (num !== "") ? parseInt(num) : 0
		this.setState({numberLabels: numLabels})
	}

	render() {
		console.log(this.state)
		console.log(this.props)
		return (
			<View style={styles.container}>
				<Text style={styles.taskTitle}>{this.props.selectedTask.display}</Text>
				<Text style={styles.inputTitle}>Select the number of labels to print</Text>
				<PrintNumberInput keyboardType = 'numeric' placeholder="1" autoCapitalize="none" autoCorrect={false} onChangeText={(text)=> this.onChangedNumber(text)} returnKeyType='done'/>
				<PrintButton onPress={this.printHTML} buttonText={`Print ${this.state.numberLabels} Labels`} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: Colors.white,
		marginTop: 48,
	},
	inputTitle: {
		fontSize: 16,
		color: Colors.black,
		marginBottom: 10,
		alignSelf: 'center'
	},
	taskTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 24,
		marginTop: 12,
		alignSelf: 'center',
	}
});

