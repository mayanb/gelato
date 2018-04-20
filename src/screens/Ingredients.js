import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ScrollView } from 'react-native'
import paramsToProps from '../resources/paramsToProps'
import Compute from '../resources/Compute'
import Storage from '../resources/Storage'
import Colors from '../resources/Colors'
import Networking from '../resources/Networking-superagent'
import * as errorActions from '../actions/ErrorActions'
import {
	ALREADY_ADDED_INPUT,
	ALREADY_ADDED_OUTPUT,
	INVALID_QR,
	NO_OUTPUT_ITEMS,
	SCAN_ERROR,
} from '../resources/QRSemantics'
import Modal from '../components/Modal'
import QRDisplay from '../components/QRDisplay'
import * as actions from '../actions/TaskActions'
import QRCamera from '../components/QRCamera'

import PanelExpander from '../components/Ingredients/PanelExpander'
import TaskIngredient from '../components/Ingredients/TaskIngredient'


class Ingredients extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expanded: false,
			foundItem: null,
			semantic: '',

			isFetchingItem: false,
			isAddingInput: false,

			// search stuff
			isFetchingSearch: false,
			searchData: [],
			request: null,
		}

		this.handleAddInput = this.handleAddInput.bind(this)
		this.handleEditAmount = this.handleEditAmount.bind(this)
		this.handleRemoveInput = this.handleRemoveInput.bind(this)
		this.handleOpenTask = this.handleOpenTask.bind(this)
	}

	componentDidMount() {
		//this.props.dispatch(actions.fetchTask(14406))
		//this.testBarCodeRead()
	}

	// MARK: - RENDERERS
	render() {
		let { task } = this.props
		if (!task) {
			return <View />
		}

		return (
			<View style={{ flex: 1 }}>
				{(this.state.foundItem || this.state.semantic) && this.renderQRModal()}
				<PanelExpander
					expanded={this.state.expanded}
					setExpanded={expanded => this.setState({ expanded: expanded })}
					camera={this.renderCamera()}
					ingredientsContent={this.renderContent()}
				/>
			</View>
		)
	}

	renderCamera() {
		return (
			<QRCamera
				searchable={true}
				onBarCodeRead={this.handleBarCodeRead.bind(this)}
				onClose={this.handleClose.bind(this)}
				searchData={this.state.searchData}
				onChangeText={this.handleChangeText.bind(this)}
				onSelectFromDropdown={this.handleSelectTaskFromDropdown.bind(this)}
			/>
		)
	}

	renderContent() {
		let { task } = this.props
		return (
			<ScrollView style={{ backgroundColor: Colors.ultraLightGray, flex: 1, }}>
				{task.task_ingredients.map(ta => <TaskIngredient
					taskIngredient={ta}
					key={ta.id}
					onEditAmount={this.handleEditAmount}
					onRemoveInput={this.handleRemoveInput}
					onOpenTask={this.handleOpenTask}
				/>)}
			</ScrollView>
		)
	}

	handleEditAmount(taskIngredientID, amount) {
		this.props.dispatch(actions.updateTaskIngredientAmount(taskIngredientID, amount))
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
				const updatedSearchResults = Compute.markExistingInputsInSearchResults(this.props.task, searchResults)
				this.setState({ searchData: updatedSearchResults })
			})
			.catch(err => console.error('Error retrieving search results', err))
			.finally(() => this.setState({ isFetchingSearch: false }))

		this.setState({ request: r, isFetchingSearch: true, searchData: [] })
	}

	handleSelectTaskFromDropdown(inputTask) {
		let { mode, task } = this.props
		if (inputTask.items.length) {
			const genericItem = inputTask.items[0]
			genericItem.creating_task = inputTask
			this.setState({
				barcode: genericItem.item_qr,
				foundItem: genericItem,
				semantic: Compute.getQRSemantic(mode, genericItem, task),
				searchData: [],
				amount: genericItem.amount,
			})
		} else {
			this.setState({ semantic: NO_OUTPUT_ITEMS })
		}
	}

	handleSetAmount(text) {
		this.setState({ amount: text })
	}

	renderQRModal() {
		let { foundItem, isFetching } = this.state
		if (isFetching) {
			return this.renderQRLoading()
		}

		let creatingTask =
			foundItem && foundItem.creating_task ? foundItem.creating_task : {}

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
			throw e
		})
	}

	handleCloseModal() {
		this.setState({
			barcode: null,
			foundItem: null,
			semantic: '',
			amount: '',
			expanded: false,
		})
	}

	handleAddInput() {
		this.setState({ isAddingInput: true })
		return this.dispatchWithError(actions.addInput(this.props.task, this.state.foundItem, this.state.amount))
			.then(() => this.handleCloseModal())
			.then(() => this.setState({ expanded: true }))
			.catch(err => console.error('Error adding input', err))
			.finally(() => this.setState({ isAddingInput: false, foundItem: null, barcode: null }))
	}

	handleRemoveInput(inputID) {
		this.dispatchWithError(actions.removeInput(inputID, this.props.task.id))
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
			//actions.removeOutput(task, item, i, this.props.taskSearch)
		).then(success)
	}

	handleClose() {
		this.props.navigation.goBack()
	}

	handleOpenTask(taskID) {
		this.props.navigation.goBack()
		this.props.navigation.navigate('Task', { id: taskID })
	}

	handleBarCodeRead(e) {
		const barcode = e.data.trim() // for some reason the qr code printed has some spaces sometimes
		const { expanded, foundItem, semantic, isFetchingItem, isAddingInput } = this.state
		if (expanded || foundItem || semantic || isFetchingItem || isAddingInput) {
			return
		}

		let errorSemantic
		const valid = Compute.validateQR(barcode)
		if (!valid) {
			// not a valid qr code
			errorSemantic = INVALID_QR
		} else if (Compute.isAlreadyInput(barcode, this.props.task)) {
			// its already an input to this task
			errorSemantic = ALREADY_ADDED_INPUT
		} else if (Compute.isAlreadyOutput(barcode, this.props.task)) {
			// its already an output to this task
			errorSemantic = ALREADY_ADDED_OUTPUT
		}

		if (errorSemantic) {
			this.setState({
				barcode: barcode,
				semantic: errorSemantic,
			})
		} else {
			// fetch all the data about this qr code
			this.fetchBarcodeData(barcode)
		}
	}

	fetchBarcodeData(barcode) {
		const { mode } = this.props
		this.setState({ isFetchingItem: true, barcode: barcode })
		Networking.get('/ics/items/')
			.query({ item_qr: barcode })
			.then(res => {
				const item = res.body.length ? res.body[0] : null
				const creatingTask = item.creating_task
				const amount = item ? item.amount : creatingTask.process_type.default_amount
				const errorSemantic = Compute.getQRSemantic(mode, item, this.props.task)
				this.setState({ foundItem: item, barcode: item.item_qr, amount: amount, semantic: errorSemantic })
			})
			.catch(err => {
				console.error('Error fetching barcode data', err)
				this.setState({ semantic: SCAN_ERROR })
			})
			.finally(() => this.setState({ isFetchingItem: false }))
	}

	// MARK: - DEBUG

	/* CALL THIS FUNCTION IF YOU WANT TO TEST onBarCodeRead() on the simulator!
	 * ----
	 * Eg. you can put a button that calls this function, so you can test the 
	 * flow fo what happens when you read a barcode.
	 */
	testBarCodeRead() {
		let barcode = 'dande.li/ics/5dd1995d-b80b-4952-bf3a-4a88bee70e7a'
		setTimeout(() => this.handleBarCodeRead({ data: barcode }), 2000)
	}
}

const mapStateToProps = (state, props) => {
	return {
		task: state.tasks.dataByID[props.taskID],
		//task: state.tasks.dataByID[14406],
	}
}

export default paramsToProps(connect(mapStateToProps)(Ingredients))
