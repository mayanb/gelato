import React, { Component } from 'react'
import {
	Alert,
	AlertIOS,
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import Compute from '../resources/Compute'
import * as actions from '../actions/TaskListActions'


const ACTION_OPTIONS = ['Cancel', 'Rename', 'Delete', 'Flag']
const ACTION_TITLE = 'More'
const CANCEL_INDEX = 0

export default class TaskMenu extends Component {
	constructor(props) {
		super(props)
		this.handlePress = this.handlePress.bind(this)
	}

	dispatchWithError(f) {
		let { dispatch } = this.props
		return dispatch(f).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	showCustomNameAlert() {
		AlertIOS.prompt(
			'Enter a value',
			null,
			this.handleRenameTask,
			'plain-text',
			this.props.task.display
		)
	}

	showConfirmDeleteAlert() {
		console.log('props', this.props)
		let { task } = this.props
		// Works on both iOS and Android
		Alert.alert(
			`Delete ${task.display}`,
			`Are you sure you want to delete ${task.display}?`,
			[
				{
					text: 'Cancel',
					onPress: () => {
					},
					style: 'cancel',
				},
				{
					text: 'Yes, delete',
					onPress: this.handleDeleteTask.bind(this),
					style: 'destructive',
				},
			],
			{ cancelable: false }
		)
	}

	handleRenameTask(text) {
		this.dispatchWithError(
			actions.requestRenameTask(this.props.task, text, this.props.taskSearch)
		)
		this.props.navigation.setParams({ name: text })
	}

	handleDeleteTask() {
		let success = () => {
			this.props.navigation.goBack()
		}
		this.dispatchWithError(
			actions.requestDeleteTask(this.props.task, this.props.taskSearch, success)
		)
	}

	render() {
		let { task } = this.props
		const actionOptions = task.is_flagged
			? ACTION_OPTIONS.filter(o => o !== 'Flag')
			: ACTION_OPTIONS

		return (

			<ActionSheet
				ref={o => (this.ActionSheet = o)}
				title={ACTION_TITLE}
				options={actionOptions}
				cancelButtonIndex={CANCEL_INDEX}
				onPress={this.handlePress}
			/>
		)
	}

	handlePress(i) {
		if (ACTION_OPTIONS[i] === 'Rename') {
			this.showCustomNameAlert()
		}
		if (ACTION_OPTIONS[i] === 'Flag') {
			this.dispatchWithError(
				actions.requestFlagTask(this.props.task, this.props.taskSearch)
			)
		}
		if (ACTION_OPTIONS[i] === 'Delete') {
			this.showConfirmDeleteAlert()
		}
	}

}
