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
} from 'react-native';
import { Navigation } from 'react-native-navigation'
import Networking from '../resources/Networking'
import { DateFormatter } from '../resources/Utility'
import * as actions from '../actions/TaskListActions'
import ActionButton from 'react-native-action-button'

class Main extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.props.dispatch(actions.fetchOpenTasks())
		this.props.dispatch(actions.fetchCompletedTasks())
	}

	// <ActionButton buttonColor={Colors.base} onPress={() => console.log("FAB!!")} />

	render() {
		let sections = this.loadData()
		console.log(sections)
		return (
			<View style={styles.container}>
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
			title: "Create a new task",
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
		console.log(open)
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
	openTask(id, name, open) {
		this.props.navigator.push({
			screen: 'gelato.Task',
			title: name,
			animated: true,
			passProps: {
				id: id, 
				name: name,
				open: open,
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

const width =Dimensions.get('window').width;

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