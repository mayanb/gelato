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
			foundTask: null,
			inputError: null,

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
				{this.state.foundTask && this.renderConfirmModal()}
				{this.state.inputError && this.renderErrorModal()}
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

	handleSelectTaskFromDropdown(task) {
		if (task.items.length) {
			const genericItem = task.items[0]
			genericItem.creating_task = task
			const errorSemantic = Compute.getQRSemantic('inputs', genericItem, this.props.task)
			if (errorSemantic) {
				this.setInputError(errorSemantic, genericItem.item_qr, task.display)
			} else {
				this.setState({
					searchData: [],
				})
				this.setState({ foundTask: task })
			}
		} else {
			this.setInputError(NO_OUTPUT_ITEMS, '', task.display)
		}
	}

	renderConfirmModal() {
		const { foundTask } = this.state
		const item = foundTask.items[0]

		return (
			<Modal onPress={this.handleCloseModal.bind(this)}>
				<QRDisplay
					unit={null}
					barcode={item.item_qr}
					creating_task_display={foundTask.display}
					semantic={''}
					shouldShowAmount={false}
					onChange={() => null}
					onPress={() => this.handleAddInput(foundTask)}
					onCancel={this.handleCloseModal.bind(this)}
					amount={null}
				/>
			</Modal>
		)
	}

	renderErrorModal() {
		let { inputError, isFetchingItem, foundTask } = this.state
		if (isFetchingItem) {
			return this.renderQRLoading()
		}

		return (
			<Modal onPress={this.handleCloseModal.bind(this)}>
				<QRDisplay
					unit={null}
					barcode={inputError.barcode}
					creating_task_display={inputError.taskName}
					semantic={inputError.semantic}
					shouldShowAmount={false}
					onChange={() => null}
					onPress={() => this.handleAddInput(foundTask)}
					onCancel={this.handleCloseModal.bind(this)}
					amount={null}
				/>
			</Modal>
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
			inputError: null,
			foundTask: null,
			expanded: false,
		})
	}

	handleAddInput(task) {
		this.setState({ isAddingInput: true, foundTask: null })
		return this.dispatchWithError(actions.addInput(this.props.task, task.items[0]))
			.then(() => this.setState({ expanded: true }))
			.catch(err => console.error('Error adding input', err))
			.finally(() => this.setState({ isAddingInput: false }))
	}

	handleRemoveInput(inputID) {
		this.dispatchWithError(actions.removeInput(inputID, this.props.task.id))
	}

	handleClose() {
		this.props.navigation.goBack()
	}

	handleOpenTask(taskID) {
		this.props.navigation.goBack()
		this.props.navigation.navigate('Task', { id: taskID })
	}

	handleBarCodeRead(e) {
		const data = e.data.trim() // for some reason the qr code printed has some spaces sometimes
		const { expanded, inputError, isFetchingItem, isAddingInput } = this.state
		if (expanded || inputError || isFetchingItem || isAddingInput) {
			return
		}

		let errorSemantic
		const valid = Compute.validateQR(data)
		if (!valid) {
			// not a valid qr code
			errorSemantic = INVALID_QR
		} else if (Compute.isAlreadyInput(data, this.props.task)) {
			// its already an input to this task
			errorSemantic = ALREADY_ADDED_INPUT
		} else if (Compute.isAlreadyOutput(data, this.props.task)) {
			// its already an output to this task
			errorSemantic = ALREADY_ADDED_OUTPUT
		}

		if (errorSemantic) {
			this.setInputError(errorSemantic, data)
		} else {
			// fetch all the data about this qr code
			this.fetchBarcodeData(data)
		}
	}

	fetchBarcodeData(code) {
		this.setState({ isFetchingItem: true })
		Networking.get('/ics/items/')
			.query({ item_qr: code })
			.then(res => {
				const item = res.body.length ? res.body[0] : null
				const task = item.creating_task
				const errorSemantic = Compute.getQRSemantic('inputs', item, this.props.task)
				if (errorSemantic) {
					this.setInputError(errorSemantic, code, task.display)
				} else {
					this.setState({ foundTask: task })
				}
			})
			.catch(err => {
				console.error('Error fetching barcode data', err)
				this.setInputError(SCAN_ERROR, code)
			})
			.finally(() => this.setState({ isFetchingItem: false }))
	}

	setInputError(errorSemantic, barcode, taskName) {
		this.setState({
			inputError: {
				semantic: errorSemantic,
				barcode: barcode,
				taskName: taskName
			},
		})
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
