import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View, ScrollView, TouchableWithoutFeedback } from 'react-native'
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
import OutputItemList from '../components/Ingredients/OutputItemList'


class Ingredients extends Component {
	constructor(props) {
		super(props)
		default_amount = this.getDefaultOutputAmount(this.props.task, this.props.mode)


		this.state = {
			expanded: false,
			foundItem: null,
			semantic: '',

			isFetchingItem: false,
			isAddingInput: false,

			// search stuff
			isFetchingSearch: false,
			searchData: [],
			typeSearch: false,
			request: null,

			outputAmount: default_amount,
		}

		this.handleAddInput = this.handleAddInput.bind(this)
		this.handleEditAmount = this.handleEditAmount.bind(this)
		this.handleRemoveInput = this.handleRemoveInput.bind(this)
		this.handleOpenTask = this.handleOpenTask.bind(this)
		this.handleTypeSearchChange = this.handleTypeSearchChange.bind(this)
	}

	componentDidMount() {
		this.props.dispatch(actions.fetchTask(this.props.taskID))
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
				{(this.state.barcode || this.state.semantic) && this.renderQRModal()}
				<PanelExpander
					expanded={this.state.expanded}
					setExpanded={expanded => this.setState({ expanded: expanded })}
					camera={this.renderCamera()}
					ingredientsContent={this.renderContent()}
					typeSearch={this.state.typeSearch}
				/>
			</View>
		)
	}

	renderCamera() {
		return (
			<QRCamera
				onBarCodeRead={this.handleBarCodeRead.bind(this)}
				onClose={this.handleClose.bind(this)}
				searchData={this.state.searchData}
				typeSearch={this.state.typeSearch}
				onTypeSearchChange={this.handleTypeSearchChange}
				onChangeText={this.handleChangeText.bind(this)}
				onSelectFromDropdown={this.handleSelectTaskFromDropdown.bind(this)}
			/>
		)
	}

	renderContent() {
		let { task } = this.props
		if (!task.task_ingredients)
			return null

		if (this.props.mode === 'items') {
			return (
				<OutputItemList
					task={task}
					processUnit={task.process_type.unit}
					onRemove={this.handleRemoveOutput.bind(this)}
					onOpenTask={this.handleOpenTask.bind(this)}
					items={task.items}
				/>
			)
		} else if(task.task_ingredients.length === 0) {
			return <ZeroIngredientsState />
		}

		const hasRecipe = task.task_ingredients.some(ta => ta.ingredient.recipe_id)
		return (
			<ScrollView style={{ backgroundColor: Colors.ultraLightGray, flex: 1, }}>
				<TouchableWithoutFeedback>{/**Need this to make scrolling work (not sure why)*/}
					<View>
						{task.task_ingredients.map(ta => <TaskIngredient
							taskIngredient={ta}
							key={ta.id}
							onEditAmount={this.handleEditAmount}
							onRemoveInput={this.handleRemoveInput}
							onOpenTask={this.handleOpenTask}
							hasRecipe={hasRecipe}
						/>)}
					</View>
				</TouchableWithoutFeedback>
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
				let results = Compute.annotateWithMissingOutputs(res.body.results)
				results = Compute.annotateWithExistingInputs(results, this.props.task)
				this.setState({ searchData: results })
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
			})
		} else {
			this.setState({ semantic: NO_OUTPUT_ITEMS })
		}
	}

	handleTypeSearchChange(newVal) {
		this.setState({ typeSearch: newVal, searchData: [] })
	}

	handleSetAmount(text) {
		this.setState({ outputAmount: text })
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
		let { barcode, semantic } = this.state

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
				amount={null}
			/>
		)
	}

	renderOutputQR(creatingTask) {
		let { barcode, semantic } = this.state
		default_amount = this.getDefaultOutputAmount(this.props.task, this.props.mode)

		return (
			<QRDisplay
				unit={this.props.task.process_type.unit}
				barcode={barcode}
				creating_task_display={''}
				semantic={semantic}
				amount={default_amount}
				onChange={this.handleSetAmount.bind(this)}
				onPress={this.handleAddOutput.bind(this)}
				onCancel={this.handleCloseModal.bind(this)}
				shouldShowAmount={true}
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
		default_amount = this.getDefaultOutputAmount(this.props.task, this.props.mode)
		this.setState({
			barcode: null,
			foundItem: null,
			semantic: '',
			expanded: false,
			outputAmount: default_amount,
		})
	}

	handleAddInput() {
		this.setState({ isAddingInput: true })
		return this.dispatchWithError(actions.addInput(this.props.task, this.state.foundItem))
			.then(() => this.handleCloseModal())
			.then(() => this.setState({ expanded: true }))
			.catch(err => console.error('Error adding input', err))
			.finally(() => this.setState({ expanded: false, isAddingInput: false, foundItem: null, barcode: null }))
	}

	handleRemoveInput(inputID) {
		this.dispatchWithError(actions.removeInput(inputID, this.props.task.id))
	}

	handleAddOutput() {
		let { barcode, outputAmount } = this.state
		return this.dispatchWithError(
			actions.addOutput(this.props.task, barcode, outputAmount)
		).then(() => this.handleCloseModal())
	}

	handleRemoveOutput(i) {
		let { task } = this.props
		let item = task['items'][i]
		this.dispatchWithError(actions.removeOutput(task.id, item, i))
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
		this.setState({ isFetchingItem: true })
		Networking.get('/ics/items/')
			.query({ item_qr: barcode })
			.then(res => {
				const item = res.body.length ? res.body[0] : null
				const errorSemantic = Compute.getQRSemantic(mode, item, this.props.task)
				this.setState({ foundItem: item, semantic: errorSemantic, barcode: barcode })
			})
			.catch(err => {
				console.error('Error fetching barcode data', err)
				this.setState({ semantic: SCAN_ERROR, barcode: barcode })
			})
			.finally(() => this.setState({ isFetchingItem: false }))
	}

	getDefaultOutputAmount(task, mode) {
		let default_amount = 0
		if (task && mode === 'items') {
			if (task.process_type) {
				if (task.process_type.default_amount) {
					default_amount = task.process_type.default_amount
				}
			}
		}
		return default_amount
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

function ZeroIngredientsState() {
	return (
		<View style={{
			padding: 12,
			alignItems: 'center',
		}}>
			<Text>
				Add an ingredient by scanning a QR code or searching for a task
			</Text>
		</View>
		)
}

const mapStateToProps = (state, props) => {
	return {
		task: state.tasks.dataByID[props.taskID],
		//task: state.tasks.dataByID[14406],
	}
}

export default paramsToProps(connect(mapStateToProps)(Ingredients))
