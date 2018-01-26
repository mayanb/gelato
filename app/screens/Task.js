// Copyright 2018 Addison Leong for Polymerize, Inc.
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {
	Dimensions,
	Keyboard,
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	Alert,
	AlertIOS
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import * as actions from '../actions/TaskListActions'
import { TaskRowHeader, AttributeHeaderCell } from '../components/Cells'
import AttributeCell from '../components/AttributeCell'
import ActionButton from 'react-native-action-button'
import Flag from '../components/Flag'
import {systemIcon} from '../resources/ImageUtility'

const ACTION_TITLE = 'More'
const ACTION_OPTIONS = ['Cancel', 'Rename', 'Flag', 'Delete',]
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 3

class Task extends Component { 
	static navigatorButtons = {
		rightButtons: [
			{
				title: 'More',
				icon: systemIcon('more_vert'),
				id: 'more',
				disabled: false,
				showAsAction: 'ifRoom',
				buttonColor: 'white',
				buttonFontSize: 15,
				buttonFontWeight: '600',
			}, 
		]
	}

	constructor(props) {
		super(props)
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
		this.showActionSheet = this.showActionSheet.bind(this)
		this.handlePress = this.handlePress.bind(this)
		this.showCamera = this.showCamera.bind(this)
		this.printTask = this.printTask.bind(this)
		console.log(this.props)
	}

	onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
			if (event.id === 'more') { // this is the same id field from the static navigatorButtons definition
				this.showActionSheet()
			} 
		// else if (event.id === 'camera') {
			// this.showCamera()
		// }
		}
	}

	showActionSheet() {
		this.ActionSheet.show()
	}

	showCustomNameAlert() {
		AlertIOS.prompt(
			'Enter a value',
			null,
			text => this.props.dispatch(actions.requestRenameTask(this.props.task, text, this.props.taskSearch)),
			'plain-text', 
			this.props.task.display,
		)
	}

	showConfirmDeleteAlert() {
		let {task} = this.props
		// Works on both iOS and Android
		Alert.alert(
			`Delete ${task.display}`,
			`Are you sure you want to delete ${task.display}?`,
			[
				{text: 'Cancel', onPress: () => {}, style: 'cancel'},
				{text: 'Yes, delete', onPress: this.handleDeleteTask.bind(this), style: 'destructive'},
			],
			{ cancelable: false }
		)
	}

	handlePress(i) {
		if(ACTION_OPTIONS[i] === 'Rename') {
			this.showCustomNameAlert()
		}
		if(ACTION_OPTIONS[i] === 'Flag') {
			this.props.dispatch(actions.requestFlagTask(this.props.task, this.props.taskSearch))
		}
		if(ACTION_OPTIONS[i] === 'Delete') {
			this.showConfirmDeleteAlert()
		}
	}

	handleDeleteTask() {
		let success = () => {
				this.props.navigator.pop({
					animated: true,
				})
			}
			this.props.dispatch(actions.requestDeleteTask(this.props.task, this.props.taskSearch, success))
	}

	showCamera(mode) {
		this.props.navigator.showModal({
			screen: "gelato.QRScanner",
			passProps: {
				task_id: this.props.task.id,
				open: this.props.task.is_open,
				taskSearch: this.props.taskSearch,
				mode: mode
			},
			navigatorStyle: { navBarHidden: true, statusBarTextColorScheme: 'light' },
			animationType: 'slide-up' 
		})
	}

	printTask(mode) {
		this.props.navigator.push({
			screen: 'gelato.Print',
			title: "Print labels",
			animated: true,
			passProps: {selectedTask: this.props.task}
		});
	}

	componentDidMount() {
		this.props.dispatch(actions.resetJustCreated())
		if(this.props.taskSearch) {
			this.props.dispatch(actions.fetchTask(this.props.id))
		}

	}

	render() {
		let {task} = this.props
		if(!task) {
			return null
		}

		let sections = [
			{key: 'attributes', title: this.props.title, imgpath: this.props.imgpath, date: this.props.date, data: task.organized_attributes, type: "Top"},
			{key: 'bottom', type: 'Bottom', title: "That's all for this task!", data: []}
		]

		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<View style={styles.container}>
					<ActionSheet
						ref={o => this.ActionSheet = o}
						title={ACTION_TITLE}
						options={ACTION_OPTIONS}
						cancelButtonIndex={CANCEL_INDEX}
						onPress={this.handlePress}
					/>
					{ task.is_flagged && <Flag /> }
					<SectionList 
						style={styles.table} 
						renderItem={this.renderRow} 
						renderSectionHeader={this.renderSectionHeader} 
						sections={sections} 
						keyExtractor={this.keyExtractor} 
					/>
					<ActionButton buttonColor={Colors.base} activeOpacity={0.5}>
						<ActionButton.Item
							buttonColor={'green'}
							title="Add Inputs"
							onPress={() => this.showCamera('inputs')}
						>
							<Text/>
						</ActionButton.Item>
						<ActionButton.Item
							buttonColor={'blue'}
							title="Add Outputs"
							onPress={() => this.showCamera('items')}
						>
							<Text/>
						</ActionButton.Item>
					  <ActionButton.Item
						  buttonColor={'purple'}
						  title="Print Task Label"
						  onPress={() => this.printTask()}
					  >
						  <Text/>
					  </ActionButton.Item>
					</ActionButton>
				</View>
			</TouchableWithoutFeedback>
		)
	}

	renderRow = ({item}) => (
		<AttributeCell
			title={item.display}
			key={item.id}
			id={item.id}
			name={item.name}
			value={item.value.value || ""}
			onSubmitEditing={this.handleSubmitEditing.bind(this)}
		/>
	)

	handleSubmitEditing(id, newValue) {
		let task = this.props.task
		let attributeIndex = task.organized_attributes.findIndex(e => Compute.equate(e.id, id))
		let currValue = task.organized_attributes[attributeIndex].value
		if (newValue === currValue) {
			return
		}
		this.props.dispatch(actions.updateAttribute(task, id, newValue, this.props.taskSearch))
	}


	renderSectionHeader = ({section}) => (
		<AttributeHeaderCell name={section.title} imgpath={section.imgpath} date={section.date} type={section.type} />
	)

	keyExtractor = (item, index) =>  { item.id }

	static navigatorStyle = {
		navBarHidden: false,
		navBarBackgroundColor: Colors.base,
		navBarNoBorder: true,
		navBarTextColor: Colors.white,
		navBarButtonColor: Colors.white
	}


}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: Colors.bluishGray,
	}
});

const mapStateToProps = (state, props) => {
	let {taskSearch, open} = props
	let arr = state.searchedTasks.data
	if (!taskSearch && open) {
		arr = state.openTasks.data		
	} else if (!taskSearch) {
		arr = state.completedTasks.data
	}

	return {
		task: arr.find(e => Compute.equate(e.id, props.id))
	}
}

export default connect(mapStateToProps)(Task)