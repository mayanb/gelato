import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, Text, View, Button, FlatList, Image, TouchableOpacity } from 'react-native'
import Camera from 'react-native-camera'
import ActionButton from 'react-native-action-button'
import Compute from '../resources/Compute'
import Colors from '../resources/Colors'
import Networking from '../resources/Networking-superagent'
import {ALREADY_ADDED, INVALID_QR} from '../resources/QRSemantics'
import * as ImageUtility from '../resources/ImageUtility'
import Modal from '../components/Modal'
import {QRItemListRow, QRDisplay} from '../components/QRComponents'
import * as actions from '../actions/TaskListActions'

class Search extends Component {
	constructor(props) {
		super(props)
		this.state = {
			expanded: false,
			barcode: false,
			foundQR: null,
			semantic: "", // semantic is a string that indicates what to display out of the various options
		}
		// this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
	}


	render() {
		let {expanded, barcode } = this.state
		let { mode, task } = this.props
		return (
			<View style={styles.container}>
				<Camera
					ref={(cam) => { this.camera = cam }}
					onBarCodeRead={this.onBarCodeRead.bind(this)}
					style={styles.preview}
					aspect={Camera.constants.Aspect.fill}>
				</Camera>
				<Button onPress={() => {setTimeout(() => this.onBarCodeRead({data: 'dande.li/ics/e1290d6d-93ac-4523-9268-46225f5d8e48'}), 1000)}} title="hello" />
			</View>
		)
	}




	// renderQRModal() {
	// 	return (
	// 		<Modal onToggle={this.handleCloseBarcode.bind(this)}>
	// 			{ this.renderQR() }
	// 		</Modal>
	// 	)
	// }

	// renderQR() {
	// 	let { foundQR, barcode, semantic, isFetching } = this.state
	// 	let { mode, task } = this.props

	// 	if (isFetching) {
	// 		return this.renderQRLoading()
	// 	}

	// 	let creating_task = (foundQR && foundQR.creating_task) ? foundQR.creating_task.display : ''
	// 	let shouldShowAmount = (mode === 'items' && Compute.isOkay(semantic))

	// 	return (
	// 		<QRDisplay 
	// 			barcode={barcode} 
	// 			creating_task={creating_task} 
	// 			semantic={semantic}
	// 			shouldShowAmount={shouldShowAmount}
	// 			default_amount={task.process_type.default_amount}
	// 			onChange={this.setAmount.bind(this)}
	// 			buttonTitle='Add'
	// 			onPress={this.handleAdd.bind(this)}
	// 		/>
	// 	)
	// }

	// setAmount(text) {
	// 	this.setState({amount: text})
	// }

	// renderQRLoading() {
	// 	return (
	// 		<Text>Loading...</Text>
	// 	)
	// }

	// handleAdd() {
	// 	let {mode, task} = this.props
	// 	let {barcode, foundQR ,amount} = this.state
	// 	let success = () => this.handleCloseBarcode()
	// 	let failure = () => {}
	// 	if (mode === 'inputs') {
	// 		this.props.dispatch(actions.addInput(task, foundQR, success, failure))
	// 	} else {
	// 		this.props.dispatch(actions.addOutput(task, barcode, amount, success, failure))
	// 	}
	// }

	// handleRemove(i) {
	// 	let {mode, task} = this.props
	// 	let item = task[mode][i]
	// 	let success = () => {}
	// 	let failure = () => {}
	// 	if (mode === 'inputs') {
	// 		this.props.dispatch(actions.removeInput(task, item, i, success, failure))
	// 	} else {
	// 		this.props.dispatch(actions.removeOutput(task, item, i, success, failure))
	// 	}
	// }

	// handleCancel() {
	// 	this.handleCloseBarcode()
	// }

	// handleToggleItemList() {
	// 	this.setState({expanded: !this.state.expanded})
	// }

	// handleCloseBarcode() {
	// 	this.setState({barcode: false, foundQR: null, isFetching: false})
	// }

	// handleClose() {
	// 	this.props.navigator.dismissModal({animationType: 'slide-down'})
	// }

	onBarCodeRead(e) {
		let {type, data} = e
		let {expanded, barcode} = this.state
		if (expanded || barcode) {
			return
		}

		let valid = Compute.validateQR(data)
		if (!valid) {
			this.setState({barcode: data, isFetching: false, foundQR: null, semantic: INVALID_QR})
		} else {
			this.setState({barcode: data, isFetching: true})
			// alert(data)
			this.fetchBarcodeData(data)
		}
	}

	fetchBarcodeData(code) {
		let {mode} = this.props

		let nav = this.props.navigator
		let disp = this.props.dispatch
		let s = this.state
		let success = (data, semantic) => {
			// this.setState({foundQR: data, semantic: semantic, isFetching: false})
			//navigate to task page
		}
		let failure = (data) => this.setState({foundQR: null, semantic: "", isFetching: false})
		Networking.get('/ics/items/')
			.query({item_qr: code})
			.end(function(err, res) {
				if (err || !res.ok) {
					failure(err)
				} else {
					let found = res.body.length ? res.body[0] : null
					let semantic = Compute.getQRSemantic(mode, found)
					success(found, semantic)
					// disp(actions.fetchTask(found.creating_task.id))
					nav.pop({
		  				animated: false,
					})
					nav.push({
						screen: 'gelato.Task',
						title: found.creating_task.display,
						animated: true,
						passProps: {
							id: found.creating_task.id, 
							name: found.creating_task.display,
							open: found.creating_task.open,
							task: found.creating_task,
							taskSearch: true,
						}
					})
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
	scrim: {
		position: 'absolute',
		justifyContent: 'flex-end',
		alignItems: 'center',
		top: 0,
		left: 0,
		height: height,
		width: width,
		backgroundColor: 'rgba(255,0,0,0.5)',
	}, button: {
		position: 'absolute', 
		top: 24,
		left: 24,
	}
})

const mapStateToProps = (state, props) => {
	return {
		openTasks: state.openTasks,
		completedTasks: state.completedTasks,
		task: state.task,
	}
}

export default connect(mapStateToProps)(Search)