import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, Text, View, Button, FlatList, Image, TouchableOpacity } from 'react-native'
import Camera from 'react-native-camera'
import ActionButton from 'react-native-action-button'
import Compute from '../resources/Compute'
import Colors from '../resources/Colors'
import Networking from '../resources/Networking-superagent'
import {ALREADY_ADDED_INPUT, ALREADY_ADDED_OUTPUT, INVALID_QR} from '../resources/QRSemantics'
import * as ImageUtility from '../resources/ImageUtility'
import Modal from '../components/Modal'
import {QRItemListRow, QRDisplay} from '../components/QRComponents'
import * as actions from '../actions/TaskListActions'
import {systemIcon}	from '../resources/ImageUtility'
import pluralize from 'pluralize'

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
					<View style={styles.title}>
						{ this.showInputsOutputsLabel() }
					</View>
					<TouchableOpacity
						onPress={this.handleClose.bind(this)} style={styles.closeTouchableOpacity}
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
				<Button title="Hello" onPress={this.testBarCodeRead.bind(this)} />
				<ActionButton 
					buttonColor={item_array.length ? Colors.base : Colors.gray}
					activeOpacity={item_array.length ? 0.5 : 1}
					buttonText={String(item_array.length)}
					position="left"
					onPress={item_array.length ? this.handleToggleItemList.bind(this): () => {}}
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
		setTimeout(() => this.onBarCodeRead({data: 'dsasadsdagfdfdasc'}), 1000)
	}

	showInputsOutputsLabel() {
		if (this.props.mode === 'inputs') {
			return <Image source={ImageUtility.requireIcon("add_inputs_text.png")} />
		} else {
			return <Image source={ImageUtility.requireIcon("add_outputs_text.png")} />
		}
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
					renderItem={this.props.mode === 'inputs' ?
						this.renderInputItemListRow.bind(this) :
						this.renderOutputItemListRow.bind(this)}
					data={item_array}
					keyExtractor={this.keyExtractor} 
				/>
			</Modal>
		)
	}


	renderInputItemListRow({item, index}) {
		return <QRItemListRow
			qr={item['input_qr']}
			task_display={item.input_task_display}
			onRemove={() => this.handleRemoveInput(index)}
			onOpenTask={() => this.handleOpenTask(item.input_task_n)}
		/>
	}

	renderOutputItemListRow({item, index}) {
		let itemAmount = parseInt(item.amount) + " " + pluralize(this.props.processUnit, item.amount)
		return <QRItemListRow
			qr={item['item_qr']}
			task_display={item.input_task_display}
			onRemove={() => this.handleRemoveOutput(index)}
			itemAmount={itemAmount}
		/>
	}

	renderQRModal() {
		let { foundQR, isFetching } = this.state

		if (isFetching) {
			return this.renderQRLoading()
		}

		let creatingTask = (foundQR && foundQR.creating_task) ? foundQR.creating_task : {}

		return (
			<Modal onToggle={this.handleCloseBarcode.bind(this)}>
				{ this.props.mode === 'inputs' ?
					this.renderInputQR(creatingTask) :
					this.renderOutputQR(creatingTask)
				}
			</Modal>
		)
	}

	renderInputQR(creatingTask) {
		let { barcode, semantic } = this.state

		return (
			<QRDisplay
				barcode={barcode}
				creating_task={creatingTask.display}
				semantic={semantic}
				shouldShowAmount={false}
				default_amount={this.props.task.process_type.default_amount}
				onChange={this.setAmount.bind(this)}
				onOpenTask={() => this.handleOpenTask(creatingTask)}
				onPress={this.handleAddInput.bind(this)}
				onCancel={this.handleCloseBarcode.bind(this)}
			/>
		)
	}

	renderOutputQR(creatingTask) {
		let { barcode, semantic } = this.state

		return (
			<QRDisplay
				barcode={barcode}
				creating_task={creatingTask.display}
				semantic={semantic}
				shouldShowAmount={Compute.isOkay(semantic)}
				default_amount={this.props.task.process_type.default_amount}
				onChange={this.setAmount.bind(this)}
				onPress={this.handleAddOutput.bind(this)}
				onCancel={this.handleCloseBarcode.bind(this)}
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

	handleAddInput() {
		let success = () => this.handleCloseBarcode()
		let failure = () => {}
		this.props.dispatch(actions.addInput(this.props.task, this.state.foundQR, this.props.taskSearch, success, failure,))
	}

	handleAddOutput() {
		let {barcode, amount} = this.state
		let success = () => this.handleCloseBarcode()
		let failure = () => {}
		this.props.dispatch(actions.addOutput(this.props.task, barcode, amount, this.props.taskSearch, success, failure))
	}

	handleRemoveInput(i) {
		let {task} = this.props
		let item = task['inputs'][i]
		let success = () => {}
		let failure = () => {}
		this.props.dispatch(actions.removeInput(task, item, i, this.props.taskSearch, success, failure))
	}

	handleRemoveOutput(i) {
		let {task} = this.props
		let item = task['items'][i]
		let success = () => {}
		let failure = () => {}
		this.props.dispatch(actions.removeOutput(task, item, i, this.props.taskSearch, success, failure))
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

	handleOpenTask(creatingTask) {
		this.props.navigator.push({
			screen: 'gelato.Task',
			title: creatingTask.display,
			animated: true,
			passProps: {
				task: creatingTask,
				taskSearch: true,
				id: creatingTask.id,
				open: creatingTask.is_open,
				title: creatingTask.display,
				date: creatingTask.created_at,
				imgpath: null
			}
		})
	}

	onBarCodeRead(e) {
		let {type, data} = e
		let {expanded, barcode} = this.state
		if (expanded || barcode) {
			return
		}

		let valid = Compute.validateQR(data)
		if (!valid) {
			// not a valid qr code
			this.setState({barcode: data, isFetching: false, foundQR: null, semantic: INVALID_QR})
		} else if (Compute.isAlreadyInput(data, this.props.task)) {
			// its already an input to this task
			this.setState({barcode: data, isFetching: false, foundQR: null, semantic: ALREADY_ADDED_INPUT})
		} else if (Compute.isAlreadyOutput(data, this.props.task)) {
			// its already an output to this task
			this.setState({barcode: data, isFetching: false, foundQR: null, semantic: ALREADY_ADDED_OUTPUT})
		} else {
			// fetch all the data about this qr code
			this.setState({barcode: data, isFetching: true})
			this.fetchBarcodeData(data)
		}
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
	}, closeTouchableOpacity: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 50,
		height: 80,
	},
	title: {
		alignItems: 'center',
		marginTop: 20 + 16,
	}
})

const mapStateToProps = (state, props) => {
	let {taskSearch, open} = props
	let arr = state.searchedTasks.data
	if (!taskSearch && open) {
		arr = state.openTasks.data		
	} else if (!taskSearch) {
		arr = state.completedTasks.data
	}
	
	return {
		task: arr.find(e => Compute.equate(e.id, props.task_id))
	}
}

export default connect(mapStateToProps)(QRScanner)