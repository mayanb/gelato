import Colors from '../resources/Colors'
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { PrintButton, PrintNumberInput } from '../components/Forms'
//import RNPrint from 'react-native-print'
import { DangerZone } from 'expo'
import QRCode from 'qrcode'
import uuid from 'uuid/v4'
import paramsToProps from '../resources/paramsToProps'
import moment from 'moment'

function generateHTML(svg, task) {
	let { process_type, product_type, display, created_at } = task
	let m = 1.2

	// adjust m for scaling, adjust .containerouter height and width for label size 
	let styles = `<style>
	.containerouter {
		min-height: 60vh; 
  	min-width: 100vw;
  	height: 60vh;
  	width: 100vw;
	}
	.container {
	min-width: ${420*m}px;
  min-height: ${300*m}px;
  width: ${420*m}px;
  height: ${300*m}px;
  font-family: monospace;
  font-size: ${13*m}px;
  transform: rotate(90deg); 
  transform-origin: top left;
  margin-left: ${252*m}px;
}

.main {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.info-extended {
  margin-top: ${13*m}px;
}

.info-extended > span {
  display: block;
  font-size: ${19*m}px;
  font-weight: bold;
}

.info-extended > span.info-words {
   font-weight: normal;
   font-size: ${15*m}px;
   display: block;
   margin-top: ${13*m}px;
} 

.lot-code {
  font-size: ${25*m}px;
  margin-left: ${13*m}px;
  font-weight: bold;
  
}</style>`
	return `${styles}<div class='containerouter'><div class='container'>
	  <div class='main'>
	     ${svg}
	     <div class='info-extended'>
	       <span>${process_type.code}</span>
	       <span>${product_type.code}</span>
	       <span>${moment(created_at).format('MMM DD YYYY')}</span>
	       <span class="info-words">${process_type.name} ${product_type.name}</span>
	     </div>
	  </div>
	  <div class='bar'>
	    ---LOT CODE-----------------------------
	  </div>
	  <div class='lot-code'>
	    ${display}
	  </div>
	</div></div>`
}

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
		return new Promise((resolve, reject) => {
			QRCode.toString(data, (err, string) => {
				if (err) {
					console.log('error')
					console.log(err)
					reject(err)
				} else {
					let updatedSVG = string.slice(0, 4) + ` height="204px" ` + string.slice(4)
					let updatedHTML = generateHTML(updatedSVG, this.props.selectedTask)
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
