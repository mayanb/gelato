import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import paramsToProps from '../resources/paramsToProps'
import ActionButton from 'react-native-action-button'
import Compute from '../resources/Compute'
import Storage from '../resources/Storage'
import Colors from '../resources/Colors'
import Networking from '../resources/Networking-superagent'
import * as errorActions from '../actions/ErrorActions'
import {
	ALREADY_ADDED_INPUT,
	ALREADY_ADDED_OUTPUT,
	INVALID_QR,
} from '../resources/QRSemantics'
import Modal from '../components/Modal'
import QRDisplay from '../components/QRDisplay'
import {
	InputListModal,
	OutputItemListModal,
} from '../components/InputListModal'
import * as actions from '../actions/TaskListActions'
import QRCamera from '../components/QRCamera'

class QRScanner extends Component {
	constructor(props) {
		super(props)
		let default_amount = props.task
			? parseFloat(props.task.process_type.default_amount).toString()
			: 0

		this.state = {
			expanded: false,
			barcode: false,
			foundQR: null,
			semantic: '',

			// amount stuff ...
			default_amount: default_amount,
			amount: default_amount,

			// search stuff
			isLoading: false,
			searchData: [],
			request: null,
		}
	}

	componentDidMount() {
		//this.testBarCodeRead()
	}

	// MARK: - RENDERERS
	render() {
		let { expanded, barcode, searchData } = this.state
		let { mode, task } = this.props
		let item_array = []
		if (task != null && mode != null) {
			// item_array = task['inputs']
			item_array = task[mode]
		} else {
			return <View />
		}
		return (
			<View style={styles.container}>
				<QRCamera
					searchable={mode !== 'items'}
					onBarCodeRead={this.handleBarCodeRead.bind(this)}
					onClose={this.handleClose.bind(this)}
					searchData={searchData}
					onChangeText={this.handleChangeText.bind(this)}
					onSelectFromDropdown={this.handleSelectTaskFromDropdown.bind(this)}
				/>

				{expanded || barcode ? this.renderModal() : null}
				{item_array.length && !(expanded || barcode)
					? this.renderActiveItemListButton(item_array)
					: this.renderDisabledItemListButton(item_array)}
			</View>
		)
	}

	async handleChangeText(text) {
		const { request } = this.state
		if (request) {
			request.abort()
		}

		const teamID = await Storage.get('teamID')
		const r = Compute.getSearchResults(text, teamID)
		r
			.then(res => {
				const searchResults = res.body.results
				const updatedSearchResults = Compute.markExistingInputsInSearchResults(
					this.props.task,
					searchResults
				)

				this.setState({
					searchData: updatedSearchResults,
					isLoading: false,
				})
			})
			.catch(() => this.setState({ searchData: [], isLoading: false }))

		this.setState({ request: r, isLoading: true })
	}

	handleSelectTaskFromDropdown(task) {
		if (task.items.length) {
			const genericItem = task.items[0]
			genericItem.creating_task = task
			this.setState({
				barcode: genericItem.item_qr,
				foundQR: genericItem,
				semantic: Compute.getQRSemantic(this.props.mode, genericItem),
				searchData: [],
				amount: genericItem.amount,
			})
		}
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

	renderModal() {
		if (this.state.expanded) {
			return this.renderItemListModal()
		} else if (this.state.barcode) {
			return this.renderQRModal()
		}
	}

	renderItemListModal() {
		if (this.props.mode === 'inputs') {
			return (
				<InputListModal
					task={this.props.task}
					processUnit={this.props.processUnit}
					onCloseModal={this.handleCloseModal.bind(this)}
					onRemove={this.handleRemoveInput.bind(this)}
					onOpenTask={this.handleOpenTask.bind(this)}
					inputs={this.props.task.inputs}
				/>
			)
		} else {
			return (
				<OutputItemListModal
					task={this.props.task}
					processUnit={this.props.processUnit}
					onCloseModal={this.handleCloseModal.bind(this)}
					onRemove={this.handleRemoveOutput.bind(this)}
					onOpenTask={this.handleOpenTask.bind(this)}
					items={this.props.task.items}
				/>
			)
		}
	}

	renderQRModal() {
		let { foundQR, isFetching } = this.state
		if (isFetching) {
			return this.renderQRLoading()
		}

		let creatingTask =
			foundQR && foundQR.creating_task ? foundQR.creating_task : {}

		if (foundQR) {
			let proc = this.props.processes.find(
				e =>
					parseInt(e.id, 10) ===
					parseInt(foundQR.creating_task.process_type, 10)
			)
			if (typeof creatingTask.process_type !== 'object') {
				creatingTask.process_type = proc
			}
		}
		return (
			<Modal onPress={this.handleCloseModal.bind(this)}>
				{this.props.mode === 'inputs'
					? this.renderInputQR(creatingTask)
					: this.renderOutputQR(creatingTask)}
			</Modal>
		)
	}

	renderInputQR(creatingTask) {
		let { barcode, semantic, amount } = this.state

		return (
			<QRDisplay
				unit={
					creatingTask.process_type
						? creatingTask.process_type.unit
						: this.props.task.process_type.unit
				}
				barcode={barcode}
				creating_task_display={creatingTask.display}
				semantic={semantic}
				shouldShowAmount={Compute.isOkay(semantic)}
				onChange={this.handleSetAmount.bind(this)}
				onPress={this.handleAddInput.bind(this)}
				onCancel={this.handleCloseModal.bind(this)}
				amount={amount}
			/>
		)
	}

	renderOutputQR(creatingTask) {
		let { barcode, semantic } = this.state

		return (
			<QRDisplay
				unit={this.props.task.process_type.unit}
				barcode={barcode}
				creating_task_display={''}
				semantic={semantic}
				shouldShowAmount={Compute.isOkay(semantic)}
				amount={this.state.amount}
				default_amount={this.state.default_amount}
				onChange={this.handleSetAmount.bind(this)}
				onPress={this.handleAddOutput.bind(this)}
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
			amount: '',
			expanded: false,
			isFetching: false,
			creating_task_for_input: '',
		})
	}

	handleSetAmount(text) {
		this.setState({ amount: text })
	}

	handleAddInput() {
		return this.dispatchWithError(
			actions.addInput(
				this.props.task,
				this.state.foundQR,
				this.props.taskSearch,
				this.state.amount
			)
		)
			.then(() => this.handleCloseModal())
			.catch(e => console.log('error', e))
	}

	handleAddOutput() {
		let { barcode, amount } = this.state
		return this.dispatchWithError(
			actions.addOutput(this.props.task, barcode, amount, this.props.taskSearch)
		).then(() => this.handleCloseModal())
	}

	handleRemoveOutput(i) {
		let { task } = this.props
		let item = task['items'][i]
		const success = () => {
			if (this.props.task.items.length === 0) {
				this.handleCloseModal()
			}
		}
		this.dispatchWithError(
			actions.removeOutput(task, item, i, this.props.taskSearch)
		).then(success)
	}

	handleRemoveInput(i) {
		let { task } = this.props
		let item = task['inputs'][i]
		const success = () => {
			if (this.props.task.inputs.length === 0) {
				this.handleCloseModal()
			}
		}
		this.dispatchWithError(
			actions.removeInput(task, item, i, this.props.taskSearch)
		).then(success)
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
		let data = e.data.trim() // for some reason the qr code printed has some spaces sometimes
		let { expanded, barcode } = this.state
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
		} else if (Compute.isAlreadyInput(data, this.props.task)) {
			// its already an input to this task
			this.setState({
				barcode: data,
				isFetching: false,
				foundQR: null,
				semantic: ALREADY_ADDED_INPUT,
			})
		} else if (Compute.isAlreadyOutput(data, this.props.task)) {
			// its already an output to this task
			this.setState({
				barcode: data,
				isFetching: false,
				foundQR: null,
				semantic: ALREADY_ADDED_OUTPUT,
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
			this.setState({
				foundQR: data,
				semantic: semantic,
				isFetching: false,
				amount: data ? data.amount : this.state.default_amount,
			})
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

	// MARK: - DEBUG

	/* CALL THIS FUNCTION IF YOU WANT TO TEST onBarCodeRead() on the simulator!
	 * ----
	 * Eg. you can put a button that calls this function, so you can test the 
	 * flow fo what happens when you read a barcode.
	 */
	testBarCodeRead() {
		let barcode = 'dande.li/ics/3996ca3c-9696-4cf3-ad34-e9d711aa9b30'
		setTimeout(() => this.handleBarCodeRead({ data: barcode }), 200)
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
})

const mapStateToProps = (state, props) => {
	let { taskSearch, open } = props
	let arr = state.searchedTasks.data
	if (!taskSearch) {
		arr = state.recentTasks.data
	}

	return {
		task: arr.find(e => Compute.equate(e.id, props.task_id)),
		processes: state.processes.data,
	}
}

export default paramsToProps(connect(mapStateToProps)(QRScanner))
