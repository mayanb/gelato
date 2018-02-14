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
	FlatList
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ActionButton from 'react-native-action-button'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import NavHeader from 'react-navigation-header-buttons'

import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import * as actions from '../actions/TaskListActions'
import { AttributeHeaderCell, BottomTablePadding } from '../components/Cells'
import AttributeCell from '../components/AttributeCell'
import Flag from '../components/Flag'
import * as ImageUtility from '../resources/ImageUtility'
import { DateFormatter } from '../resources/Utility'
import paramsToProps from '../resources/paramsToProps'
import * as errorActions from '../actions/ErrorActions'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import update from 'immutability-helper'
import Networking from '../resources/Networking-superagent'

const ACTION_TITLE = 'More'
const ACTION_OPTIONS = ['Cancel', 'Rename', 'Delete', 'Flag']
const CANCEL_INDEX = 0

class Task extends Component {
	static navigationOptions = ({ navigation }) => {
		const params = navigation.state.params || {}
		const { showActionSheet } = params

		return {
			title: params.name,
			headerRight: (
				<NavHeader IconComponent={Ionicons} size={25} color={Colors.white}>
					<NavHeader.Item
						iconName="md-more"
						label=""
						onPress={showActionSheet}
					/>
				</NavHeader>
			),
		}
	}

	constructor(props) {
		super(props)
		this.handlePress = this.handlePress.bind(this)
		this.showCamera = this.showCamera.bind(this)
		this.printTask = this.printTask.bind(this)
		this.handleRenameTask = this.handleRenameTask.bind(this)

		/* 
		it didn't work if i intiially set organized_attributes to be 
		props.task.organized_attributes. It just wouldn't update after 
		componentDidMount() if I set it to that initially. 
		If you change it to process_type.attributes it works, but that
		data is formatted a little differently
		*/
		let attrs = this.props.task.organized_attributes
		attrs.map(e => e.loading = true)

		this.state = {
			organized_attributes: attrs,
			hash: -1,
			test: "Initial"
		}
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
			'Where do I see scanned QR codes?',
			`** Tap the QR code button on the bottom right 
			\n ** Select inputs or outputs 
			\n ** Tap the button with the # of scanned codes on the bottom left of the camera screen`
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

	printTask() {
		this.props.navigation.navigate('Print', {
			selectedTask: this.props.task,
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

	componentWillMount() {
		this.props.navigation.setParams({
			showActionSheet: () => this.ActionSheet.show(),
		})
	}

	componentDidMount() {
		this.props.dispatch(actions.resetJustCreated())
		Networking.get(`/ics/tasks/${this.props.task.id}`)
			.then(res => {
				let organized = Compute.organizeAttributes(res.body)
				this.setState({ organized_attributes: organized, hash: Math.random() * 100, test: "Mounted" })
			})
			.catch(e => {
				console.log(e)
				throw e
			})
	}

	render() {
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
					<ActionSheet
						ref={o => (this.ActionSheet = o)}
						title={ACTION_TITLE}
						options={actionOptions}
						cancelButtonIndex={CANCEL_INDEX}
						onPress={this.handlePress}
					/>
					{task.is_flagged && <Flag />}
					<Text>{this.state.test}</Text>
					<FlatList
						style={styles.table}
						data={this.state.organized_attributes}
						renderItem={this.renderRow}
						ListHeaderComponent={() => this.renderHeader(task)}
						ListFooterComponent={<BottomTablePadding />}
						extraData={{ hash: this.state.hash }}
					/>
					<View style={styles.help}>
						<Button onPress={this.showHelpAlert.bind(this)} title="Help" color={Colors.white} />
					</View>
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
				</View>
			</TouchableWithoutFeedback>
		)
	}

	renderRow = ({ item, index }) => (
		<AttributeCell
			key={item.id}
			id={item.id}
			task_id={this.props.task.id}
			name={item.name}
			value={item.value.value}
			type={item.datatype}
			loading={item.loading}
			onSubmitEditing={this.handleSubmitEditing.bind(this)}
			onChange={this.handleChange.bind(this)}
			index={index}
		/>
	)

	handleChange(index, text) {
		this.updateAttributeStore(index, {
			typedValue: text,
		})
	}

	handleSubmitEditing(id, newValue) {
		let task = this.props.task
		let attributeIndex = this.state.organized_attributes.findIndex(e =>
			Compute.equate(e.id, id)
		)
		let currValue = this.state.organized_attributes[attributeIndex].value
		if (newValue === currValue || newValue === currValue.value) {
			return
		}

		let payload = {
			task: task.id,
			attribute: id,
			value: newValue,
		}

		this.postUpdateAttribute(attributeIndex, payload)
		// return this.dispatchWithError(
		// 	actions.updateAttribute(task, id, newValue, this.props.taskSearch)
		// ).finally(() => this.setState({hash: Math.random()}))
	}

	postUpdateAttribute(attributeIndex, payload) {
		this.updateAttributeStore(attributeIndex, { loading: true })
		Networking.post('/ics/taskAttributes/create/')
			.send(payload)
			.then(() =>
				this.updateAttributeStore(attributeIndex, {
					value: { value: payload.value },
				})
			)
			.catch(e => console.log(e))
			.finally(() => 
				this.updateAttributeStore(attributeIndex, {
					loading: false,
				})
			)
	}

	updateAttributeStore(attributeIndex, obj) {
		let ns = update(this.state.organized_attributes, {
			[attributeIndex]: {
				$merge: obj,
			},
		})
		this.setState({ organized_attributes: ns, hash: Math.random() })
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
	}
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
