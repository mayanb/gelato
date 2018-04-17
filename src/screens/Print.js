import Colors from '../resources/Colors'
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { PrintButton, PrintNumberInput } from '../components/Forms'
//import RNPrint from 'react-native-print'
import QRCode from 'qrcode'
import paramsToProps from '../resources/paramsToProps'

class Print extends Component {
	static navigationOptions = {
		title: 'Print labels',
	}

	constructor(props) {
		super(props)
		this.state = {
			selectedPrinter: null,
			updatedUrl: '',
			numberLabels: 1,
			// selectedTask: {name: "", qrcode: ""},
		}
		this.printHTML = this.printHTML.bind(this)
		this.onChangedNumber = this.onChangedNumber.bind(this)
		// this.showTaskSearch = this.showTaskSearch.bind(this)
	}

  makeid(numLabels) {
	  let { selectedTask } = this.props
	  let qrtext = selectedTask.items[0].item_qr
		let data_urls = Array.apply(null, Array(numLabels)).map(function() { return qrtext })
    return data_urls
  }

	generateQRCode(data, qrdocument) {
		console.log('hi')
		let text = `
      <style>
        #rotate-text { 
          margin-left: 100px; 
          margin-bottom: 200px; 
          width: 200px; 
          transform: rotate(90deg); 
          transform-origin: top left; 
          font-size:30px;
        }
      </style>
      <div id="rotate-text"><p>${this.props.selectedTask.display}</p></div>`
		return new Promise((resolve, reject) => {
			QRCode.toString(data, function(err, string) {
				if (err) {
					console.log('error')
					console.log(err)
					reject(err)
				} else {
					let updatedHTML =
						string.slice(0, 4) +
						` height="130px" width="130px"` +
						string.slice(4)
					updatedHTML += text
					qrdocument.push(updatedHTML)
					resolve(updatedHTML)
				}
			})
		})
	}

	repeatFunction(num_qrs, qrdocument) {
		let pictexts = this.makeid(num_qrs)
		var promises = []
		for (var i = 0; i < num_qrs; i++) {
			promises.push(this.generateQRCode(pictexts[i], qrdocument))
		}
		return Promise.all(promises)
	}

  printHTML() {
    let qrdoc = []
    let numLabels = this.state.numberLabels
    // const numLabels = 4
    this.repeatFunction(numLabels, qrdoc).then(
      function(results) {
        results.join('')
        //alert('TODO!')
        // RNPrint.print({ html: `${results}` })
        Expo.DangerZone.Print.printAsync({ html: `${results}` })
        // console.log(JSON.stringify(results))
      },
      function(err) {
        console.log(err)
      }
    )
  }

	onChangedNumber(num) {
		let numLabels = num !== '' ? parseInt(num) : 0
		this.setState({ numberLabels: numLabels })
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.taskTitle}>{this.props.selectedTask.display}</Text>
				<Text style={styles.inputTitle}>
					Select the number of labels to print
				</Text>
				<PrintNumberInput
					keyboardType="numeric"
					placeholder="1"
					autoCapitalize="none"
					autoCorrect={false}
					onChangeText={text => this.onChangedNumber(text)}
					returnKeyType="done"
				/>
				<PrintButton
					onPress={this.printHTML}
					buttonText={`Print ${this.state.numberLabels} Labels`}
				/>
			</View>
		)
	}
}

export default paramsToProps(Print)

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
		alignSelf: 'center',
	},
	taskTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 24,
		marginTop: 12,
		alignSelf: 'center',
	},
})
