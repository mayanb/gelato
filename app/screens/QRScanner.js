import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	AppRegistry,
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Button,
	FlatList,
	Image
} from 'react-native'
import Camera from 'react-native-camera'
import ActionButton from 'react-native-action-button'
import Compute from '../resources/Compute'
import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'
import Modal from '../components/Modal'
import Networking from '../resources/Networking-superagent'

const NOT_OUTPUT = 'Not output'
const ALREADY_OUTPUT = 'ALREADY_OUTPUT'
const ALREADY_ADDED = 'ALREADY_ADDED'
const INVALID_QR = 'INVALID_QR'

class QRScanner extends Component {
	constructor(props) {
		super(props)
		this.state = {
			expanded: false,
			barcode: false,
		}
	}

	render() {
		let {expanded, barcode } = this.state
		let { mode, task } = this.props
		let item_array = task[mode] || []
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
				{ expanded ? this.renderItemListModal() : null }
				{ barcode ? this.renderQRModal() : null }
				<ActionButton 
					buttonColor={Colors.base} 
					activeOpacity={0.5}
					buttonText={item_array.length}
					position="left"
					onPress={this.handleToggleItemList.bind(this)}
				/>
			</View>
		)
	}

	renderItemListModal() {
		let { mode, task } = this.props
		let item_array = task[mode] || []
		return (
			<Modal onToggle={this.handleToggleItemList.bind(this)}>
				<FlatList 
					style={styles.table} 
					renderItem={this.renderItemListRow.bind(this)}  
					data={item_array}
					keyExtractor={this.keyExtractor} 
				/>
			</Modal>
		)
	}

	renderItemListRow({item}) {
		console.log(item)
		let styles = StyleSheet.create({
			container: {
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				padding: 8,
				flexDirection: 'row',
				display: 'flex',
			}, textContainer: {
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
			}, img : {
				height: 16,
				width: 16,
				marginRight: 8,
			}, subTitleText: {
				color: Colors.lightGray,
			}
		})
		let qr = this.props.mode === 'inputs' ? item.input_qr : item.item_qr
		return (
			<View style={styles.container}>
				<Image source={ImageUtility.requireIcon('qr_icon')} style={styles.img} />
				<View style={styles.textContainer}>
					<Text>{qr.substring(qr.length - 6)}</Text>
					<Text style={styles.subTitleText}>{item.task_display}</Text>
				</View>
				<Button title="Remove" />
			</View>
		)
	}

	renderQRModal() {
		let {isFetching} = this.state
		let content = this.renderQRLoading()
		if (!isFetching) {
			content = this.renderQR()
		}
		return (
			<Modal onToggle={this.handleCloseBarcode.bind(this)}>
				{content}
			</Modal>
		)
	}

	renderQRLoading() {
		return (
			<Text>Loading...</Text>
		)
	}

	getErrorMessage() {
		let { mode } = this.props
		let { foundQR } = this.state

		// if its already added
		if (this.isAlreadyAdded(foundQR.item_qr)) {
			return ALREADY_ADDED
		}

		if (mode === 'inputs') {
			// if this QR code wasn't from any task
			if (!foundQR) {
				return NOT_OUTPUT
			}
		}

		if (mode === 'items') {
			// if this QR code WAS from a task
			if (foundQR) {
				return ALREADY_OUTPUT
			}
		}

		return null
	}

	isAlreadyAdded(code) {
		let {inputs, items} = this.props.task
		let found_input = inputs.find(e => e.input_qr === code)
		let found_output = items.find(e => e.item_qr === code)
		return (found_output || found_input)
	}

	renderQR() {
		let { foundQR, barcode } = this.state
		let { creating_task, item_qr } = foundQR
		let error = this.getErrorMessage()

		return (
			<View>
				<View>
					<Image source={ImageUtility.requireIcon('qr_icon')} />
					<Text>{creating_task ? creating_task.display : ""}</Text>
					<Text>{barcode.substring(barcde.length - 6)}</Text>
				</View>
				<View>
					<Text>{ error }</Text>
				</View>
				{ error ? null : <Button title='Add' /> }
			</View>
		)
	}

	handleToggleItemList() {
		this.setState({expanded: !this.state.expanded})
	}

	handleCloseBarcode() {
		this.setState({barcode: false})
	}

	handleClose() {
		this.props.navigator.dismissModal({animationType: 'slide-down'})
	}

	onBarCodeRead(e) {
		let {type, data} = e
		let {expanded, barcode} = this.state
		// if ( type !== 'qr' ) {
		// 	return
		// }
		if (expanded || barcode) {
			return
		}

		let valid = this.validateQR(data)
		this.setState({barcode: data, isFetching: valid})
		if (valid) {
			this.fetchBarcodeData(data)
		} else {
			this.setState({foundQR: INVALID_QR})
		}
	}

	// VALIDATE THE QR CODE SEQ
	validateQR(data) {
		return true
	}

	fetchBarcodeData(code) {
		let success = (data) => this.setState({foundQR: data, isFetching: false})
		let failure = (data) => this.setState({foundQR: null, isFetching: false})
		Networking.get('/ics/items/')
			.query({item_qr: code})
			.end((err, res) => {
				if (err || !res.ok) {
					failure(err)
				} else {
					success(res.body)
				}
			})
	}

	keyExtractor = (item, index) => item.id;
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


const styles = StyleSheet.create({
	container: {
		flex: 1,
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

const mapStateToProps = (state, props) => {
	let arr = props.open ? state.openTasks.data : state.completedTasks.data
	return {
		task: arr.find(e => Compute.equate(e.id, props.task_id))
	}
}

export default connect(mapStateToProps)(QRScanner)