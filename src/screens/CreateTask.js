import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions/ProcessesAndProductsActions'
import * as errorActions from '../actions/ErrorActions'
import * as taskActions from '../actions/TaskActions'
import paramsToProps from '../resources/paramsToProps'
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
		this.handleCreateTaskDandelion = this.handleCreateTaskDandelion.bind(this)
		this.handleOpenTask = this.handleOpenTask.bind(this)
		this.handleSubmitName = this.handleSubmitName.bind(this)
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
		switch (this.state.currentStep) {
			case 0:
				return this.renderTaskInputs()
			case 1:
				return this.renderTaskName()
		}
	}

	renderTaskInputs() {
		if (Compute.isDandelion(this.props.screenProps.team)) {
			return (
				<TaskInputs
					onNext={this.handleCreateTaskDandelion}
					isDandelion={true}
				/>
			)
		}
		return <TaskInputs onNext={this.handleCreateTask} isDandelion={false} />
	}

	renderTaskName() {
		return (
			<TaskName
				newTask={this.state.newTask}
				name={this.state.newTask.label}
				onSubmitName={this.handleSubmitName}
			/>
		)
	}

	handleSubmitName(editingName) {
		if (editingName !== this.state.newTask.label) { // task name changed
			this.props
				.dispatch(
					taskActions.requestRenameTask(this.state.newTask, editingName)
				)
				.then(() => this.handleOpenTask())
				.catch(e => console.error('Error updating task name', e))
		} else { // task name un-changed
			this.handleOpenTask()
		}
	}
  
  handleOpenTask() {
    let { newTask } = this.state
    this.props.navigation.goBack()
    
    this.props.navigation.navigate('Task', { id: newTask.id })
  }

	handleCreateTask(processType, productType, batchSize) {
		if (this.state.isCreatingTask) {
			return
		}

		let { dispatch } = this.props
		let taskData = {
			processType: processType,
			productType: productType,
			batch_size: batchSize,
		}
		this.setState({ isCreatingTask: true })
		dispatch(taskActions.requestCreateTask(taskData))
			.then(task => this.setState({ currentStep: 1, newTask: task }))
			.catch(e => dispatch(errorActions.handleError(Compute.errorText(e))))
			.finally(() => this.setState({ isCreatingTask: false }))
	}

	handleCreateTaskDandelion(processType, productType, batchSize) {
		if (this.state.isCreatingTask) {
			return
		}
		if (processType.name.toLowerCase() === 'package') {
			let { dispatch } = this.props
			let taskData = {
				processType: processType,
				productType: productType,
				batch_size: 0,
			}
			this.setState({ isCreatingTask: true })
			Promise.all([dispatch(taskActions.requestCreatePackageTask(taskData))])
				.then(([task]) => this.setState({ currentStep: 1, newTask: task }))
				.catch(e => dispatch(errorActions.handleError(Compute.errorText(e))))
				.finally(() => this.setState({ isCreatingTask: false }))
		} else {
			this.handleCreateTask(processType, productType, batchSize)
		}
	}
}

const mapStateToProps = (state) => {
	return {
		processes: state.processes.data,
		products: state.products.data,
	}
}

export default paramsToProps(connect(mapStateToProps)(CreateTask))
