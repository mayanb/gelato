import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	Keyboard,
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Alert,
	Image,
} from 'react-native'
import Prompt from 'rn-prompt'
import ActionSheet from 'react-native-actionsheet'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ActionButton from 'react-native-action-button'
import NavHeader from 'react-navigation-header-buttons'

import BackButton from '../components/BackButton'
import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import Print from '../resources/PrintFormat'
import * as actions from '../actions/TaskActions'
import TaskHeader from '../components/Task/TaskHeader'
import { Flag, AncestorFlag } from '../components/Flag'
import * as ImageUtility from '../resources/ImageUtility'
import paramsToProps from '../resources/paramsToProps'
import * as errorActions from '../actions/ErrorActions'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import { fieldIsBlank, validTaskNameLength } from '../resources/Utility'
import AttributeList from '../components/Task/AttributeList'
import update from 'immutability-helper'
import QRCode from 'qrcode'
import RecipeInstructions from '../components/Task/RecipeInstructions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NavbarEditableTaskName from '../components/Task/NavbarEditableTaskName'

const ACTION_TITLE = 'More'
const ACTION_OPTIONS = ['Cancel', 'Rename', 'Delete', 'Flag', 'Edit batch size']
const CANCEL_INDEX = 0

class Task extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoadingTask: false,
		}
		this.handlePress = this.handlePress.bind(this)
		this.showCamera = this.showCamera.bind(this)
		this.handleRenameTask = this.handleRenameTask.bind(this)
		this.showEditBatchSizePrompt = this.showEditBatchSizePrompt.bind(this)
		this.handleEditBatchSize = this.handleEditBatchSize.bind(this)
		this.showRenamePrompt = this.showRenamePrompt.bind(this)

		this.state = {
			organized_attributes:
				props.task &&
				props.task.process_type &&
				props.task.process_type.attributes,
			action_options: ACTION_OPTIONS,
			showRenamePrompt: false,
		}
	}

	static navigationOptions = ({ navigation }) => {
		const params = navigation.state.params || {}
		const { showActionSheet, printHTML, name, handleEditName, handleGoBack } = params

		return {
			headerLeft: <BackButton onPress={handleGoBack} />,
			// React-Native guide: use "headerTitle" in place of "title" for non-text content
			headerTitle: (
				<NavbarEditableTaskName name={name} onPress={handleEditName} />
			),
			headerRight: (
				<NavHeader IconComponent={Ionicons} size={25} color={Colors.white}>
					<NavHeader.Item
						iconName="md-print"
						label="Print"
						onPress={printHTML}
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

	handleGoBack() {
		this.props.backFn && this.props.backFn()
		this.props.navigation.goBack()
	}

	componentWillMount() {
		const name = this.props.task ? this.props.task.display : ''
		this.props.navigation.setParams({
			showActionSheet: () => this.ActionSheet.show(),
			name: name,
			printHTML: () => this.printHTML(),
			handleEditName: this.showRenamePrompt,
			handleGoBack: this.handleGoBack.bind(this)
		})
	}

	componentWillReceiveProps(np) {
		if (!np.task) return
		if (
			!this.props.task ||
			!this.props.task.task_ingredients ||
			np.task.is_flagged !== this.props.task.is_flagged
		) {
			this.updateActionSheet(np.task)
		}
	}

	componentDidMount() {
		this.setState({
			isDandelion: Compute.isDandelion(this.props.screenProps.team),
		})
		this.setState({ isLoadingTask: true })
		this.props
			.dispatch(actions.fetchTask(this.props.id))
			.then(res => {
				this.props.navigation.setParams({ task: res.data })
				let organized = Compute.organizeAttributes(res.data)
				this.setState({ organized_attributes: organized, isLoadingTask: false })
				this.props.navigation.setParams({ name: res.data.display })
			})
			.catch(e => console.error('Error fetching task', e))

		this.updateActionSheet(this.props.task)
	}

	updateActionSheet(task) {
		if (!task) return
		let action_options = task.is_flagged
			? ACTION_OPTIONS.filter(o => o !== 'Flag')
			: ACTION_OPTIONS

		action_options = !this.allowEditBatchSize(task)
			? action_options.filter(o => o !== 'Edit batch size')
			: action_options

		this.setState({ action_options: action_options })
	}

	allowEditBatchSize(task) {
		let proc = task.process_type.name.toLowerCase()
		const hasRecipe =
			task.task_ingredients &&
			task.task_ingredients.length &&
			task.task_ingredients[0].ingredient.recipe_id
		return (
			task.items &&
			task.items.length === 1 &&
			!(this.state.isDandelion && proc === 'package') &&
			!hasRecipe
		)
	}

	printHTML() {
		const { task } = this.props
		const qrtext = task.items[0] && task.items[0].item_qr
		if (qrtext) {
			QRCode.toString(qrtext, (err, string) => {
				if (err) {
					console.error('Error converting QR Code to string', err)
				} else {
					let updatedSVG = `${string.slice(0, 4)} height="204px" ${string.slice(
						4
					)}`
					let updatedHTML = Print.generateHTML(updatedSVG, task)
					Expo.DangerZone.Print.printAsync({ html: updatedHTML })
				}
			})
		} else {
			Alert.alert('There are no outputs for this task', '')
		}
	}

	render() {
		let { organized_attributes, action_options } = this.state
		let { task } = this.props
		//Check that full task object is loaded
		if (!task || task.items === undefined) {
			return null
		}
		const isLabel = task.process_type.name.toLowerCase() === 'label'
		let outputButtonName = 'Outputs'
		if (isLabel) {
			outputButtonName = 'Label Items'
		}
		const heightOfUserAttributeDropdown = 150
		return (
			<TouchableWithoutFeedback
				onPress={() => Keyboard.dismiss()}
				accessible={false}>
				<View style={styles.container}>
					{task.is_flagged && <Flag />}
					{!task.is_flagged &&
						task.num_flagged_ancestors > 0 && <AncestorFlag />}
					{this.renderHeader(task)}
					<KeyboardAwareScrollView
						keyboardShouldPersistTaps="handled"
						extraScrollHeight={heightOfUserAttributeDropdown}>
						{task.recipe_instructions && (
							<RecipeInstructions instructions={task.recipe_instructions} />
						)}
						<AttributeList
							data={organized_attributes}
							onSubmitEditing={this.handleSubmitEditing.bind(this)}
							isLoadingTask={this.state.isLoadingTask}
						/>
					</KeyboardAwareScrollView>
					<ActionSheet
						ref={o => (this.ActionSheet = o)}
						title={ACTION_TITLE}
						options={action_options}
						cancelButtonIndex={CANCEL_INDEX}
						onPress={this.handlePress}
					/>
					{this.renderActionButton(isLabel, outputButtonName)}
					{this.renderRenamePrompt(task)}
					{this.renderEditBatchSizePrompt(task)}
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

	showRenamePrompt() {
		if (!this.state.showRenamePrompt) {
			this.setState({ showRenamePrompt: true })
		}
	}

	renderRenamePrompt(task) {
		return (
			<Prompt
				title="Enter a new task name"
				placeholder="Type new task name"
				defaultValue={task.display}
				visible={this.state.showRenamePrompt}
				onCancel={() => this.setState({ showRenamePrompt: false })}
				onSubmit={this.handleRenameTask}
			/>
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

	showEditBatchSizePrompt() {
		if (!this.state.showEditBatchSizePrompt) {
			this.setState({ showEditBatchSizePrompt: true })
		}
	}

	renderEditBatchSizePrompt(task) {
		return (
			<Prompt
				textInputProps={{ keyboardType: 'numeric' }}
				title={`Enter a new batch size (${task.process_type.unit})`}
				placeholder="Type new batch size"
				defaultValue={String(parseFloat(task.total_amount))}
				visible={this.state.showEditBatchSizePrompt}
				onCancel={() => this.setState({ showEditBatchSizePrompt: false })}
				onSubmit={this.handleEditBatchSize}
			/>
		)
	}

	handleEditBatchSize(text) {
		if (fieldIsBlank(text)) {
			Alert.alert('Invalid batch size', 'Batch size cannot be blank.')
			return
		}
		this.setState({ showEditBatchSizePrompt: false })
		this.dispatchWithError(
			actions.editBatchSize(this.props.task, text, this.props.taskSearch)
		)
	}

	handlePress(i) {
		let { action_options } = this.state
		if (action_options[i] === 'Rename') {
			this.showRenamePrompt()
		} else if (action_options[i] === 'Flag') {
			this.dispatchWithError(actions.requestFlagTask(this.props.task))
		} else if (action_options[i] === 'Delete') {
			this.showConfirmDeleteAlert()
		} else if (action_options[i] === 'Edit batch size') {
			this.showEditBatchSizePrompt()
		}
	}

	handleRenameTask(_newTaskName) {
		const { task, dispatch } = this.props
		let newTaskName = _newTaskName.trim()

		if (fieldIsBlank(newTaskName)) {
			Alert.alert('Invalid task name', 'Task name cannot be blank.')
			return
		}
		this.setState({ showRenamePrompt: false })
		if (newTaskName === task.display || newTaskName === task.custom_display) {
			return
		}
		if (validTaskNameLength(newTaskName)) {
			dispatch(actions.requestRenameTask(task, newTaskName))
				.then(name_already_exists => {
					if (name_already_exists) {
						this.handleInvalidNameSubmit(newTaskName)
					} else {
						// successfully updated name!
						this.props.navigation.setParams({ name: newTaskName })
					}
				})
				.catch(e => console.error('Error updating task name', e))
		} else {
			Alert.alert(
				'Invalid name',
				'The task name should be between 1 and 50 characters.'
			)
		}
	}

	handleInvalidNameSubmit(newTaskName) {
		Alert.alert(
			`Whoops! Look like another task already exists named ${newTaskName}. Please try another name.`
		)
	}

	handleDeleteTask() {
		let success = () => {
			this.props.navigation.goBack()
		}
		this.dispatchWithError(actions.requestDeleteTask(this.props.task, success))
	}

	showCamera(mode) {
		this.props.navigation.navigate('Ingredients', {
			taskID: this.props.task.id,
			isDandelion: this.state.isDandelion,
			mode: mode,
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
		let imgpath = task.process_type.icon
		let outputAmount = parseFloat(task.total_amount || 0)
		return (
			<TaskHeader
				name={Compute.getReadableTaskDescriptor(task)}
				imgpath={imgpath}
				date={task.created_at}
				type="Top"
				outputAmount={outputAmount}
				outputUnit={task.process_type.unit}
				onPress={this.showEditBatchSizePrompt}
			/>
		)
	}

	renderActionButton(isLabel, outputButtonName) {
		if (
			this.state.isDandelion &&
			this.props.task.process_type.name.toLowerCase() === 'package'
		) {
			return (
				<ActionButton
					buttonColor={Colors.base}
					activeOpacity={0.5}
					icon={<FAIcon name="qrcode" size={24} color="white" />}>
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
					renderIcon={() => (
						<Image source={ImageUtility.requireIcon('inputs.png')} />
					)}
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
	return {
		task: state.tasks.dataByID[props.id],
	}
}

export default paramsToProps(connect(mapStateToProps)(Task))
