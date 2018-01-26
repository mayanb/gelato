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
import {systemIcon}	from '../resources/ImageUtility'

class QRScanner extends Component {
	constructor(props) {
		super(props)
		this.state = {
			expanded: false,
			barcode: false,
			foundQR: null,
			semantic: "", // semantic is a string that indicates what to display out of the various options
			amount: props.task.process_type.default_amount,
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
				<View style={styles.button}>
				<TouchableOpacity
					onPress={this.handleClose.bind(this)}
				>
					<Image 
						style={styles.close}
						source={systemIcon('close_camera')}
						title=""
						color="white"
					/>
				</TouchableOpacity>
				</View>
				{ (expanded || barcode) ? this.renderScrim() : null }
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

	/* CALL THIS FUNCTION IF YOU WANT TO TEST onBarCodeRead() on the simulator!
	 * ----
	 * Eg. you can put a button that calls this function, so you can test the 
	 * flow fo what happens when you read a barcode.
	 */
	testBarCodeRead() {
		setTimeout(() => this.onBarCodeRead({data: 'hgjkdhfjgklds'}), 1000)
	}

	renderScrim() {
		return (
			<TouchableOpacity onPress={this.closeModal.bind(this)}>
				<View style={styles.scrim} />
			</TouchableOpacity>
		)
	}

	closeModal() {
		let amount = this.props.task.process_type.default_amount
		this.setState({barcode: false, foundQR: false, semantic: "", amount: amount, expanded: false})
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

	renderItemListRow({item, index}) {
		let qr = this.props.mode === 'inputs' ? 'input_qr' : 'item_qr'
		return <QRItemListRow 
			qr={item[qr]} 
			task_display={item.input_task_display} 
			onRemove={() => this.handleRemove(index)} 
		/>
	}

	renderQRModal() {
		return (
			<Modal onToggle={this.handleCloseBarcode.bind(this)}>
				{ this.renderQR() }
			</Modal>
		)
	}

	renderQR() {
		let { foundQR, barcode, semantic, isFetching } = this.state
		let { mode, task } = this.props

		if (isFetching) {
			return this.renderQRLoading()
		}

		let creating_task = (foundQR && foundQR.creating_task) ? foundQR.creating_task.display : ''
		let shouldShowAmount = (mode === 'items' && Compute.isOkay(semantic))

		return (
			<QRDisplay 
				barcode={barcode} 
				creating_task={creating_task} 
				semantic={semantic}
				shouldShowAmount={shouldShowAmount}
				default_amount={task.process_type.default_amount}
				onChange={this.setAmount.bind(this)}
				buttonTitle='Add'
				onPress={this.handleAdd.bind(this)}
			/>
		)
	}

	setAmount(text) {
		this.setState({amount: text})
	}

	renderQRLoading() {
		return (
			<Text>Loading...</Text>
		)
	}

	handleAdd() {
		let {mode, task} = this.props
		let {barcode, foundQR ,amount} = this.state
		let success = () => this.handleCloseBarcode()
		let failure = () => {}
		if (mode === 'inputs') {
			this.props.dispatch(actions.addInput(task, foundQR, success, failure))
		} else {
			this.props.dispatch(actions.addOutput(task, barcode, amount, success, failure))
		}
	}

	handleRemove(i) {
		let {mode, task} = this.props
		let item = task[mode][i]
		let success = () => {}
		let failure = () => {}
		if (mode === 'inputs') {
			this.props.dispatch(actions.removeInput(task, item, i, success, failure))
		} else {
			this.props.dispatch(actions.removeOutput(task, item, i, success, failure))
		}
	}

	handleCancel() {
		this.handleCloseBarcode()
	}

	handleToggleItemList() {
		this.setState({expanded: !this.state.expanded})
	}

	handleCloseBarcode() {
		this.setState({barcode: false, foundQR: null, isFetching: false})
	}

	handleClose() {
		this.props.navigator.dismissModal({animationType: 'slide-down'})
	}

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
			if (this.isAlreadyAdded(data)) {
				this.setState({barcode: data, isFetching: false, foundQR: null, semantic: ALREADY_ADDED})
			} else {
				this.setState({barcode: data, isFetching: true})
				this.fetchBarcodeData(data)
			}
		}
	}


	isAlreadyAdded(code) {
		let {inputs, items} = this.props.task
		let found_input = inputs.find(e => e.input_qr === code)
		let found_output = items.find(e => e.item_qr === code)
		return (found_output || found_input)
	}

	fetchBarcodeData(code) {
		let {mode} = this.props
		let success = (data, semantic) => this.setState({foundQR: data, semantic: semantic, isFetching: false})
		let failure = (data) => this.setState({foundQR: null, semantic: "", isFetching: false})
		Networking.get('/ics/items/')
			.query({item_qr: code})
			.end((err, res) => {
				if (err || !res.ok) {
					failure(err)
				} else {
					let found = res.body.length ? res.body[0] : null
					let semantic = Compute.getQRSemantic(mode, found)
					success(found, semantic) 
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
	}, close: {
		position: 'absolute', 
		top: 20 + 16,
		left: 16,
	}
})

const mapStateToProps = (state, props) => {
	let arr = props.open ? state.openTasks.data : state.completedTasks.data
	return {
		task: arr.find(e => Compute.equate(e.id, props.task_id))
	}
}

export default connect(mapStateToProps)(QRScanner)