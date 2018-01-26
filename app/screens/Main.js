// Copyright 2018 Addison Leong for Polymerize, Inc.
import { connect } from 'react-redux'
import { TaskRow, TaskRowHeader } from '../components/Cells'
import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import React, { Component } from 'react'
import {
	Dimensions,
	Image,
	Platform,
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import Networking from '../resources/Networking'
import Storage from '../resources/Storage'
import { DateFormatter } from '../resources/Utility'
import * as actions from '../actions/TaskListActions'
import ActionButton from 'react-native-action-button'
import ActionSheet from 'react-native-actionsheet'

const ACTION_TITLE = 'Settings'
const ACTION_OPTIONS = ['Close', 'Logout']
const CANCEL_INDEX = 0

class Main extends Component {
	static navigatorButtons = {
		leftButtons: [
			{
				title: 'Settings',
				id: 'settings',
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
		console.disableYellowBox = true
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
		this.showActionSheet = this.showActionSheet.bind(this)
		this.handlePress = this.handlePress.bind(this)
		// Storage.clear()
	}

	componentDidMount() {
		this.props.dispatch(actions.fetchOpenTasks())
		this.props.dispatch(actions.fetchCompletedTasks())
	}


	onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
			if (event.id === 'settings') { // this is the same id field from the static navigatorButtons definition
				this.showActionSheet()
			} 
		}
	}

	showActionSheet() {
	  this.ActionSheet.show()
	}

	handlePress(i) {

		if(ACTION_OPTIONS[i] === 'Logout') {
			Storage.clear()
			this.props.navigator.resetTo({
				screen: 'gelato.Login',
				animated: true,
			});

		}
	}


	render() {



		let sections = this.loadData()
		return (
			<View style={styles.container}>
				<ActionSheet
					ref={o => this.ActionSheet = o}
					title={ACTION_TITLE}
					options={ACTION_OPTIONS}
					cancelButtonIndex={CANCEL_INDEX}
					onPress={this.handlePress}
				/>
				<SectionList 
					style={styles.table} 
					renderItem={this.renderRow} 
					renderSectionHeader={this.renderSectionHeader} 
					sections={sections} 
					keyExtractor={this.keyExtractor} 
				/>
				<ActionButton buttonColor={Colors.base} activeOpacity={0.5} onPress={this.handleCreateTask.bind(this)} />
			</View>
		);
	}

	handleCreateTask() {
		this.props.navigator.push({
			screen: 'gelato.CreateTask',
			title: "Create Task",
			animated: true,
			passProps: {}
		});
	}

	loadData() {
		// // Make the request
		// const teamData = await Compute.classifyTasks(this.props.teamID); // Gets all of the task data
		// // Send the data into our state
		// await this.setState({tasks: teamData});
		let open = this.props.openTasks.data
		let completed = this.props.completedTasks.data
		return [
			{
				data: open,
				key: "open",
				title: "OPEN TASKS"
			},
			{
				data: completed,
				key: "completed",
				title: "RECENTLY COMPLETED"
			},
			{
				data: [],
				key: "space",
				title: "SPACE"
			}
		];
	}

	// Helper function to render individual task cells
	renderRow = ({item}) => {
		return (
		<TaskRow
			title={item.display}
			key={item.id}
			id={item.id}
			imgpath={item.process_type.icon}
			open={item.is_open}
			name={item.process_type.name}
			date={DateFormatter.shorten(item.updated_at)}
			onPress={this.openTask.bind(this)}
		/>
		)
	}

	// Helper function to render headers
	renderSectionHeader = ({section}) => (
		<TaskRowHeader title={section.title} />
	)

	// Extracts keys - required for indexing
	keyExtractor = (item, index) => item.id;

	// Event for navigating to task detail page
	openTask(id, name, open, imgpath, title, date) {
		this.props.navigator.push({
			screen: 'gelato.Task',
			title: name,
			animated: true,
			passProps: {
				id: id, 
				name: name,
				open: open,
				imgpath: imgpath,
				title: title,
				date: date
			}
		})
	}
	static navigatorStyle = {
		navBarHidden: false,
		navBarBackgroundColor: Colors.base,
		navBarNoBorder: true,
		navBarTextColor: Colors.white,
		navBarButtonColor: Colors.white
	}
}

const width =Dimensions.get('window').width

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: Colors.white
	},
})

const mapStateToProps = (state, props) => {
	return {
		openTasks: state.openTasks,
		completedTasks: state.completedTasks,
	}
}

export default connect(mapStateToProps)(Main)