import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	Dimensions,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Button
} from 'react-native'
import { Camera } from 'expo'
import ActionButton from 'react-native-action-button'
import Compute from '../resources/Compute'
import Colors from '../resources/Colors'
import Networking from '../resources/Networking-superagent'
import {
	ALREADY_ADDED_INPUT,
	ALREADY_ADDED_OUTPUT,
	INVALID_QR,
	ALREADY_ADDED_MOVE_ITEM,
} from '../resources/QRSemantics'
import * as ImageUtility from '../resources/ImageUtility'
import Modal from '../components/Modal'
import QRDisplay from '../components/QRDisplay'
import {
	InputItemListModal,
	OutputItemListModal,
} from '../components/ItemListModals'
import {
	MoveItemListModal,
} from '../components/MoveItemListModals'
import * as actions from '../actions/TaskListActions'
import paramsToProps from '../resources/paramsToProps'

class Move extends Component {
	static navigationOptions = ({ navigation }) => {
		const params = navigation.state.params || {}
		const { showActionSheet } = params

		return {
			title: params.name,
		}
	}

	constructor(props) {
		super(props)

		this.state = {
			expanded: false,
			barcode: false,
			foundQR: null,
			semantic: '',
			scanned_items: [],
		}
	}

	// MARK: - RENDERERS
	render() {
		let { expanded, barcode, scanned_items } = this.state
		let { mode, task } = this.props
		return (
			<View style={styles.container}>
				<Camera
					ref={cam => {
						this.camera = cam
					}}
					onBarCodeRead={this.handleBarCodeRead.bind(this)}
					style={styles.preview}
				/>
				<View style={styles.button}>
					<View style={styles.title}>{this.renderInputsOutputsLabel()}</View>
					{!expanded && !barcode && scanned_items.length > 0 ? <Button style={styles.nextButton} onPress={() => this.navigateToNext()} title="Next" /> : null}
					<TouchableOpacity
						onPress={this.handleClose.bind(this)}
						style={styles.closeTouchableOpacity}>
						<Image
							style={styles.close}
							source={ImageUtility.systemIcon('close_camera')}
							title=""
							color="white"
						/>
					</TouchableOpacity>
				</View>

				{expanded || barcode ? this.renderModal() : null}
				{scanned_items.length && !(expanded || barcode)
					? this.renderActiveItemListButton(scanned_items)
					: this.renderDisabledItemListButton(scanned_items)}
				<Button onPress={() => {setTimeout(() => this.handleBarCodeRead({data: 'dande.li/ics/84a8c86e-2d23-47c8-996f-92f6834e27ed'}), 1000)}} title="hello" />
			</View>
		)
	}

	renderActiveItemListButton(items) {
		return (
			<ActionButton
				buttonColor={Colors.base}
				activeOpacity={0.5}
				buttonText={String(items.length)}
				position="left"
				onPress={this.handleToggleItemList.bind(this)}
			/>
		)
	}

	renderDisabledItemListButton(items) {
		return (
			<ActionButton
				buttonColor={Colors.gray}
				activeOpacity={1}
				buttonText={String(items.length)}
				position="left"
			/>
		)
	}

	renderInputsOutputsLabel() {
		return <Image source={ImageUtility.requireIcon('add_inputs_text.png')} />
	}

	renderModal() {
		if (this.state.expanded) {
			return this.renderItemListModal()
		} else if (this.state.barcode) {
			return this.renderQRModal()
		}
	}

	renderItemListModal() {
		return (
			<MoveItemListModal
				task={this.props.task}
				processUnit={this.props.processUnit}
				onCloseModal={this.handleCloseModal.bind(this)}
				onRemove={this.handleRemoveInput.bind(this)}
				onOpenTask={this.handleOpenTask.bind(this)}
				items={this.state.scanned_items}
			/>
		)
	}

	renderQRModal() {
		let { foundQR, isFetching } = this.state

		if (isFetching) {
			return this.renderQRLoading()
		}

		let creatingTask =
			foundQR && foundQR.creating_task ? foundQR.creating_task : {}

		return (
			<Modal onPress={this.handleCloseModal.bind(this)}>
					{this.renderInputQR(creatingTask)}
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
				onChange={this.handleSetAmount.bind(this)}
				onOpenTask={() => this.handleOpenTask(creatingTask)}
				onPress={this.handleAddInput.bind(this)}
				onCancel={this.handleCloseModal.bind(this)}
			/>
		)
	}


	renderQRLoading() {
		return <Text>Loading...</Text>
	}

	// MARK: - EVENT HANDLERS

	dispatchWithError(f) {
		let { dispatch } = this.props
		return dispatch(f).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	handleCloseModal() {
		this.setState({
			barcode: false,
			foundQR: false,
			semantic: '',
			amount: this.state.default_amount,
			expanded: false,
			isFetching: false,
		})
	}

	handleSetAmount(text) {
		this.setState({ amount: text })
	}

	handleAddInput() {
		let scanned_items = this.state.scanned_items.concat([this.state.foundQR])
		this.setState({scanned_items: scanned_items})
		this.handleCloseModal()

		// this.dispatchWithError(
		// 	actions.addInput(
		// 		this.props.task,
		// 		this.state.foundQR,
		// 		this.props.taskSearch
		// 	)
		// ).then(() => this.handleCloseModal())
	}

	handleRemoveInput(i) {
		let { task } = this.props
		let { scanned_items } = this.state
		
		// let item = task['inputs'][i]
		const success = () => {
			// if (this.props.task.inputs.length === 0) {
			if (scanned_items.length === 0) {
				this.handleCloseModal()
			}
		}
		scanned_items.splice(i, 1)
		this.setState({scanned_items: scanned_items})
		success()
	}

	handleToggleItemList() {
		this.setState({ expanded: !this.state.expanded })
	}

	handleClose() {
		this.props.navigation.goBack()
	}

	handleOpenTask(creatingTask) {
		this.props.navigation.goBack()
		this.props.navigation.navigate('Task', {
			id: creatingTask.id,
			name: creatingTask.display,
			open: creatingTask.open,
			task: creatingTask,
			date: creatingTask.created_at,
			taskSearch: true,
			title: creatingTask.display,
			imgpath: creatingTask.process_type.icon,
		})
	}

	handleBarCodeRead(e) {
		let { data } = e
		let { expanded, barcode, scanned_items } = this.state
		if (expanded || barcode) {
			return
		}

		let valid = Compute.validateQR(data)
		if (!valid) {
			// not a valid qr code
			this.setState({
				barcode: data,
				isFetching: false,
				foundQR: null,
				semantic: INVALID_QR,
			})
		} else if (scanned_items.map(a => a.item_qr).includes(data)) {
			// its already an input to this task
			this.setState({
				barcode: data,
				isFetching: false,
				foundQR: null,
				semantic: ALREADY_ADDED_MOVE_ITEM,
			})
		} else {
			// fetch all the data about this qr code
			this.setState({ barcode: data, isFetching: true })
			this.fetchBarcodeData(data)
		}
	}

	fetchBarcodeData(code) {
		let { mode } = this.props
		let success = (data, semantic) => {
			this.setState({ foundQR: data, semantic: semantic, isFetching: false})
		}
		let failure = () =>
			this.setState({ foundQR: null, semantic: '', isFetching: false })
		Networking.get('/ics/items/')
			.query({ item_qr: code })
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

	navigateToNext() {
		this.props.navigation.navigate('ChooseTeam', {
			name: "Move",
			items: this.state.scanned_items,
		})
	}

	// MARK: - DEBUG

	/* CALL THIS FUNCTION IF YOU WANT TO TEST onBarCodeRead() on the simulator!
	 * ----
	 * Eg. you can put a button that calls this function, so you can test the 
	 * flow fo what happens when you read a barcode.
	 */
	testBarCodeRead() {
		let barcode = 'dande.li/ics/79b664eb-ae27-460c-80b3-8f98fb1da0fa'
		setTimeout(() => this.handleBarCodeRead({ data: barcode }), 1000)
	}
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
	},
	close: {
		position: 'absolute',
		top: 20 + 16,
		left: 16,
	},
	closeTouchableOpacity: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 50,
		height: 80,
	},
	title: {
		alignItems: 'center',
		marginTop: 20 + 16,
	},
	nextButton: {
		left: width-50,
	}
})

const mapStateToProps = (state, props) => {
	return {
		
	}
}

export default paramsToProps(connect(mapStateToProps)(Move))
