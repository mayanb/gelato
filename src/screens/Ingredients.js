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
import * as actions from '../actions/TaskListActions'
import QRCamera from '../components/QRCamera'

import PanelExpander from '../components/Ingredients/PanelExpander'
import TaskIngredient from '../components/Ingredients/TaskIngredient'

import * as processesAndProductsActions from "../actions/ProcessesAndProductsActions"

class Ingredients extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expanded: false,
			scanError: null,
			isFetching: false,

			// search stuff
			isLoading: false,
			searchData: [],
			request: null,
		}

	}

	componentDidMount() {
		this.props.dispatch(actions.fetchTask('14406'))
		this.props.dispatch(processesAndProductsActions.fetchProcesses())
		this.testBarCodeRead()
	}

	// MARK: - RENDERERS
	render() {
		let { mode, task } = this.props
		if (task == null || mode == null) {
			return <View />
		}

		return (
			<View style={{ flex: 1 }}>
				{this.state.scanError && this.renderQRModal()}
				<PanelExpander
					open={this.state.expanded}
					camera={this.renderCamera()}
					ingredientsContent={this.renderContent()}
				/>
			</View>
		)
	}

	renderCamera() {
		return (
			<QRCamera
				searchable={this.props.mode !== 'items'}
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
				{task.task_ingredients.map(ta => <TaskIngredient taskIngredient={ta} key={ta.id} />)}
			</ScrollView>
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
			const errorSemantic = Compute.getQRSemantic(this.props.mode, genericItem)
			if (errorSemantic) {
				this.setInputError(errorSemantic, genericItem.item_qr, task.display)
			}
			this.setState({
				semantic: Compute.getQRSemantic(this.props.mode, genericItem),
				searchData: [],
				expanded: true,
			})
			this.handleAddInput(task)
		} else {
			this.setInputError(NO_OUTPUT_ITEMS, '', task.display)
		}
	}

	renderQRModal() {
		let { scanError, isFetching } = this.state
		if (isFetching) {
			return this.renderQRLoading()
		}

		return (
			<Modal onPress={this.handleCloseModal.bind(this)}>
				<QRDisplay
					unit={null}
					barcode={scanError.barcode}
					creating_task_display={scanError.taskName}
					semantic={scanError.semantic}
					shouldShowAmount={false}
					onChange={() => null}
					onPress={() => null}
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
			scanError: null,
			expanded: false,
		})
	}

	handleAddInput(task) {
		return this.dispatchWithError(
			actions.addInput(
				this.props.task,
				task.items[0],
				this.props.taskSearch,
				null,
			)
		)
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
		const data = e.data.trim() // for some reason the qr code printed has some spaces sometimes
		const { expanded } = this.state
		if (expanded) {
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
		let { mode } = this.props
		this.setState({ isFetching: true })
		Networking.get('/ics/items/')
			.query({ item_qr: code })
			.then(res => {
				let found = res.body.length ? res.body[0] : null
				let errorSemantic = Compute.getQRSemantic(mode, found)
				if (errorSemantic) {
					this.setInputError(errorSemantic, code, data.display)
				} else {
					this.setState({
						expanded: true,
					})
					this.handleAddInput(data)
				}
			})
			.catch(err => this.setInputError(SCAN_ERROR, code))
			.finally(() => this.setState({ isFetching: false }))
	}

	setInputError(errorSemantic, barcode, taskName) {
		this.setState({
			scanError: {
				semantic: errorSemantic,
				barcode: barcode,
				taskName: taskName
			},
		}, () => console.log('setting input error', this.state))
	}

	// MARK: - DEBUG

	/* CALL THIS FUNCTION IF YOU WANT TO TEST onBarCodeRead() on the simulator!
	 * ----
	 * Eg. you can put a button that calls this function, so you can test the 
	 * flow fo what happens when you read a barcode.
	 */
	testBarCodeRead() {
		let barcode = 'dande.li/ics/5dd1995d-b80b-4952-bf3a-4a88bee70e7a'
		//setTimeout(() => this.handleBarCodeRead({ data: barcode }), 2000)
	}
}

const mapStateToProps = (state, props) => {
	console.log('state', state)
	let { taskSearch, open } = props
	let arr = state.searchedTasks.data
	if (!taskSearch && open) {
		arr = state.openTasks.data
	} else if (!taskSearch) {
		arr = state.completedTasks.data
	}

	return {
		//task: arr.find(e => Compute.equate(e.id, props.task_id)),
		task: state.taskDetailsByID.data[14406],
		processes: state.processes.data,
		mode: 'inputs'
	}
}

export default paramsToProps(connect(mapStateToProps)(Ingredients))
