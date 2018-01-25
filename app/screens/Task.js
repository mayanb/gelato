// Copyright 2018 Addison Leong for Polymerize, Inc.
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {
	Dimensions,
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	AlertIOS
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import * as actions from '../actions/TaskListActions'
import { AttributeRow, TaskRowHeader } from '../components/Cells'
import ActionButton from 'react-native-action-button'

const ACTION_TITLE = 'More'
const ACTION_OPTIONS = ['Cancel', 'Rename', 'Flag', 'Delete',]
const CANCEL_INDEX = 0

class Task extends Component { 
	static navigatorButtons = {
		rightButtons: [
			// {
			// 	title: 'Camera',
			// 	id: 'camera',
			// 	disabled: false,
			// 	showAsAction: 'ifRoom',
			// 	buttonColor: 'white',
			// 	buttonFontSize: 15,
			// 	buttonFontWeight: '600',
			// }, 
			{
				title: 'More',
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
			text => this.props.dispatch(actions.requestRenameTask(this.props.task, text)),
			'plain-text', 
			this.props.task.display,
		)
	}

	handlePress(i) {
		if(ACTION_OPTIONS[i] === 'Rename') {
			this.showCustomNameAlert()
		}
		if(ACTION_OPTIONS[i] === 'Flag') {
			this.props.dispatch(actions.requestFlagTask(this.props.task))
		}
		if(ACTION_OPTIONS[i] === 'Delete') {
			let success = () => {
				this.props.navigator.pop({
					animated: true,
				})
			}
			this.props.dispatch(actions.requestDeleteTask(this.props.task, success))
		}
	}


	showCamera(mode) {
		this.props.navigator.showModal({
			screen: "gelato.QRScanner",
			passProps: {
				task_id: this.props.task.id,
				open: this.props.task.is_open,
				mode: mode
			},
			navigatorStyle: { navBarHidden: true },
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
	}

	render() {
		if(!this.props.task) {
			return null
		}
		let sections = [
			{key: 'attributes', title: 'Task data', data: this.props.task.organized_attributes}
		]
		console.log(this.props.task.organized_attributes)
		return (
			<View style={styles.container}>
				<ActionSheet
					ref={o => this.ActionSheet = o}
					title={ACTION_TITLE}
					options={ACTION_OPTIONS}
					cancelButtonIndex={CANCEL_INDEX}
					onPress={this.handlePress}
				/>
				<Text>{`Flagged is ${this.props.task.is_flagged}`}</Text>
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
		)
	}

	renderRow = ({item}) => (
		<AttributeRow
			title={item.display}
			key={item.id}
			id={item.id}
			name={item.name}
			value={item.value.value || ""}
			onSubmitEditing={this.handleSubmitEditing.bind(this)}
		/>
	)

	handleSubmitEditing(id, newValue) {
		task = this.props.task
		this.props.dispatch(actions.updateAttribute(task, id, newValue))
	}


	renderSectionHeader = ({section}) => (
		<TaskRowHeader title={section.title} />
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
		backgroundColor: Colors.white
	}
});

const mapStateToProps = (state, props) => {
	let arr = props.open ? state.openTasks.data : state.completedTasks.data
	return {
		task: arr.find(e => Compute.equate(e.id, props.id))
	}
}

export default connect(mapStateToProps)(Task)