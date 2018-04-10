// Copyright 2018 Addison Leong for Polymerize, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	Keyboard,
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Alert,
	AlertIOS,
	Image,
	Button,
	Text,
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ActionButton from 'react-native-action-button'
import NavHeader from 'react-navigation-header-buttons'

import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import * as actions from '../actions/TaskListActions'
import { AttributeHeaderCell, BottomTablePadding } from '../components/Cells'
import { Flag } from '../components/Flag'
import * as ImageUtility from '../resources/ImageUtility'
import { DateFormatter } from '../resources/Utility'
import paramsToProps from '../resources/paramsToProps'
import * as errorActions from '../actions/ErrorActions'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import AttributeList from '../components/Task/AttributeList'
import Networking from '../resources/Networking-superagent'
import update from 'immutability-helper'

const ACTION_TITLE = 'More'
const ACTION_OPTIONS = ['Cancel', 'Rename', 'Delete', 'Flag']
const CANCEL_INDEX = 0

class Task extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoadingTask: false
		}
		this.handlePress = this.handlePress.bind(this)
		//this.addInputs = this.addInputs.bind(this)
		this.showCamera = this.showCamera.bind(this)
		this.handleRenameTask = this.handleRenameTask.bind(this)
		this.state = {
			organized_attributes: props.task && props.task.process_type.attributes,
		}
	}

	static navigationOptions = ({ navigation }) => {
		const params = navigation.state.params || {}
		const { showActionSheet } = params

		return {
			title: params.name,
			headerRight: (
				<NavHeader
					IconComponent={Ionicons}
					size={25}
					color={Colors.white}>
					<NavHeader.Item
						iconName="md-print"
						label="Print"
						onPress={() =>
							navigation.navigate('Print', { selectedTask: params.task })
						}
					/>
					<NavHeader.Item
						iconName="md-more"
						label="More"
						onPress={showActionSheet}
					/>
				</NavHeader>
			),
		}
	}

	componentWillMount() {
		this.props.navigation.setParams({
			showActionSheet: () => this.ActionSheet.show(),
		})
	}

	componentDidMount() {
		this.props.dispatch(actions.resetJustCreated())
		if (this.props.taskSearch) {
			this.dispatchWithError(actions.fetchTask(this.props.id))
		}
		this.setState({ isLoadingTask: true })
		Networking.get(`/ics/tasks/${this.props.id}`)
			.then(res => {
				this.props.navigation.setParams({ task: res.body })
				let organized = Compute.organizeAttributes(res.body)
				this.setState({ organized_attributes: organized, isLoadingTask: false })
			})
			.catch(e => console.log(e))
	}

	render() {
		let { organized_attributes } = this.state
		let { task } = this.props
		if (!task) {
			return null
		}
		const isLabel = task.process_type.name.toLowerCase() === 'label'
		let outputButtonName = 'Outputs'
		if (isLabel) {
			outputButtonName = 'Label Items'
		}
		const actionOptions = task.is_flagged
			? ACTION_OPTIONS.filter(o => o !== 'Flag')
			: ACTION_OPTIONS

		return (
			<TouchableWithoutFeedback
				onPress={() => Keyboard.dismiss()}
				accessible={false}>
				<View style={styles.container}>
					{task.is_flagged && <Flag />}
					{this.renderHeader(task)}
					<AttributeList
						data={organized_attributes}
						onSubmitEditing={this.handleSubmitEditing.bind(this)}
						isLoadingTask={this.state.isLoadingTask}
					/>
					<View style={styles.help}>
						<Button
							onPress={this.showHelpAlert.bind(this)}
							title="Help"
							color={Colors.white}
						/>
					</View>
					<ActionSheet
						ref={o => (this.ActionSheet = o)}
						title={ACTION_TITLE}
						options={actionOptions}
						cancelButtonIndex={CANCEL_INDEX}
						onPress={this.handlePress}
					/>
					{this.renderActionButton(isLabel, outputButtonName)}
				</View>
			</TouchableWithoutFeedback>
		)
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

	showHelpAlert() {
		AlertIOS.alert(
			'Where do I see already scanned QR codes for this task?',
			`** Tap the blue input button on the bottom right
			\n ** Then tap the button with the # of scanned codes on the bottom left of the camera screen`
		)
	}

	showConfirmDeleteAlert() {
		let { task } = this.props
		// Works on both iOS and Android
		Alert.alert(
			`Delete ${task.display}`,
			`Are you sure you want to delete ${task.display}?`,
			[
				{
					text: 'Cancel',
					onPress: () => {},
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

	// addInputs() {
	// 	this.props.navigation.navigate('QRScanner', {
	// 		task_id: this.props.task.id,
	// 		open: this.props.open,
	// 		taskSearch: this.props.taskSearch,
	// 		processUnit: this.props.task.process_type.unit,
	// 		onOpenTask: this.handleOpenTask.bind(this),
	// 	})
	// }

	showCamera(mode) {
		this.props.navigation.navigate('QRScanner', {
			task_id: this.props.task.id,
			open: this.props.open,
			taskSearch: this.props.taskSearch,
			mode: mode,
			processUnit: this.props.task.process_type.unit,
			onOpenTask: this.handleOpenTask.bind(this),
		})
	}

	handleOpenTask(task) {
		//let x = 'hi'
		this.props.navigation.navigate({
			screen: 'gelato.Task',
			title: task.display,
			animated: true,
			passProps: {
				task: task,
				taskSearch: true,
				id: task.id,
				open: task.is_open,
				title: task.display,
				date: task.created_at,
				imgpath: null,
			},
		})
	}

	handleSubmitEditing(id, newValue) {
		let { organized_attributes } = this.state
		let attributeIndex = organized_attributes.findIndex(e =>
			Compute.equate(e.id, id)
		)

		// if there's no change, return
		let currValue = organized_attributes[attributeIndex].value
		if (newValue === currValue) {
			return
		}

		// else, do optimistic update
		this.updateAttributeValue(attributeIndex, newValue)
		return Compute.postAttributeUpdate(this.props.id, id, newValue).catch(e =>
			this.updateAttributeValue(attributeIndex, currValue)
		)
	}

	updateAttributeValue(index, newValue) {
		let ns = update(this.state.organized_attributes, {
			[index]: {
				$merge: { value: newValue },
			},
		})
		this.setState({ organized_attributes: ns })
	}

	renderHeader = task => {
		let imgpath = this.props.imgpath
			? this.props.imgpath
			: task.process_type.icon
		let date = this.props.taskSearch
			? DateFormatter.shorten(this.props.date)
			: this.props.date
		let outputAmount = task.items.reduce((total, current) => {
			return total + parseFloat(current.amount)
		}, 0)
		return (
			<AttributeHeaderCell
				name={Compute.getReadableTaskDescriptor(task)}
				imgpath={imgpath}
				date={date}
				type="Top"
				outputAmount={outputAmount}
				outputUnit={task.process_type.unit}
			/>
		)
	}

	renderActionButton(isLabel, outputButtonName) {
		if(Compute.isDandelion(this.props.screenProps.team)) {
			return (
				<ActionButton
					buttonColor={Colors.base}
					activeOpacity={0.5}
					icon={
						<FAIcon name="qrcode" size={24} color="white" />
					}>
					{!isLabel && (
						<ActionButton.Item
							buttonColor={'green'}
							title="Inputs"
							onPress={() => this.showCamera('inputs')}>
							<Image source={ImageUtility.requireIcon('inputs.png')} />
						</ActionButton.Item>
					)}
					<ActionButton.Item
						buttonColor={'blue'}
						title={outputButtonName}
						onPress={() => this.showCamera('items')}>
						<Image source={ImageUtility.requireIcon('outputs.png')} />
					</ActionButton.Item>
				</ActionButton>
			)
		} else {
			return (
				<ActionButton
					activeOpacity={0.5}
					buttonColor={Colors.base}
					title="Inputs"
					onPress={() => this.showCamera('inputs')}
					renderIcon={() => <Image source={ImageUtility.requireIcon('inputs.png')} />}
				/>
			)
		}
	}
}

const helpSize = 150
const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.bluishGray,
		display: 'flex',
		height: '100%',
	},
	help: {
		position: 'absolute',
		bottom: -1 * helpSize / 2,
		left: -1 * helpSize / 2,
		borderRadius: helpSize / 2,
		height: helpSize,
		width: helpSize,
		paddingLeft: helpSize / 4 + 20,
		paddingTop: helpSize / 4 - 20,
		backgroundColor: Colors.darkGray,
	},
})

const mapStateToProps = (state, props) => {
	let { taskSearch, open } = props
	let arr = state.searchedTasks.data
	if (!taskSearch && open) {
		arr = state.openTasks.data
	} else if (!taskSearch) {
		arr = state.completedTasks.data
	}

	return {
		task: arr.find(e => Compute.equate(e.id, props.id)),
	}
}

export default paramsToProps(connect(mapStateToProps)(Task))
