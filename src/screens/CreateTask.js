import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions/ProcessesAndProductsActions'
import * as errorActions from '../actions/ErrorActions'
import * as taskActions from '../actions/TaskListActions'
import paramsToProps from '../resources/paramsToProps'
import { DateFormatter } from '../resources/Utility'
import Compute from '../resources/Compute'
import Networking from '../resources/Networking-superagent'

import TaskInputs from '../components/CreateTask/TaskInputs'
import TaskName from '../components/CreateTask/TaskName'

class CreateTask extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentStep: 0,
			newTask: null,
			isCreatingTask: false,
		}

		this.handleCreateTask = this.handleCreateTask.bind(this)
		this.handleOpenTask = this.handleOpenTask.bind(this)
	}

	componentDidMount() {
		let { dispatch } = this.props
		dispatch(actions.fetchProcesses()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
		dispatch(actions.fetchProducts()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	render() {
		switch(this.state.currentStep) {
			case 0:
				return this.renderTaskInputs()
			case 1:
				return this.renderTaskName()
		}
	}

	renderTaskInputs() {
		return (
			<TaskInputs onNext={this.handleCreateTask} />
		)
	}

	renderTaskName() {
		return (
			<TaskName
				onNext={this.handleOpenTask}
				name={this.state.newTask.label}
			/>
		)
	}

	handleCreateTask(processType, productType, batchSize) {
		let { dispatch } = this.props
		let taskData = {
			processType: processType,
			productType: productType,
			amount: batchSize,
		}
		this.setState({ isCreatingTask: true })
		Promise.all([
			dispatch(taskActions.requestCreateTask(taskData)),
			Networking.get('/qr/codes/?count=1'),
		])
			.then(([task, qrcodeRes]) => dispatch(taskActions.addOutput(task, qrcodeRes.text, batchSize)))
			.then(task => this.setState({ currentStep: 1, newTask: task }))
			.catch(e => dispatch(errorActions.handleError(Compute.errorText(e))))
			.finally(() => this.setState({ isCreatingTask: false }))
	}

	handleOpenTask() {
		let { newTask } = this.state
		this.props.navigation.goBack()

		this.props.navigation.navigate('Task', {
			id: newTask.id,
			name: newTask.display,
			open: true,
			task: newTask,
			date: DateFormatter.shorten(newTask.created_at),
			taskSearch: false,
			title: newTask.display,
		})
	}
}

const mapStateToProps = (state /*, props */) => {
	return {
		processes: state.processes.data,
		products: state.products.data,
		hasJustCreatedItem: state.openTasks.ui.hasJustCreatedItem,
	}
}

export default paramsToProps(connect(mapStateToProps)(CreateTask))
