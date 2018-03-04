// Copyright 2018 Addison Leong for Polymerize, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SectionList, StyleSheet, View, Text } from 'react-native'
import ActionButton from 'react-native-action-button'
import ActionSheet from 'react-native-actionsheet'
import NavHeader from 'react-navigation-header-buttons'
import { clearUser } from 'react-native-authentication-helpers'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TaskRow, TaskRowHeader } from '../components/Cells'
import Colors from '../resources/Colors'
import Storage from '../resources/Storage'
import { DateFormatter } from '../resources/Utility'
import * as actions from '../actions/TaskListActions'
import * as errorActions from '../actions/ErrorActions'
import Compute from '../resources/Compute'
import { OpenTasks, CompletedTasks } from '../resources/Wafflecone'

const ACTION_TITLE = 'Settings'
const ACTION_OPTIONS = ['Close', 'Logout']
const CANCEL_INDEX = 0

class Main extends Component {
	static navigationOptions = ({ navigation, screenProps }) => {
		const params = navigation.state.params || {}
		const { showActionSheet, showSearch } = params

		return {
			title: screenProps.team,
			headerLeft: (
				<NavHeader IconComponent={Ionicons} size={25} color={Colors.white}>
					<NavHeader.Item
						label=""
						iconName="md-settings"
						onPress={showActionSheet}
					/>
				</NavHeader>
			),
			headerRight: (
				<NavHeader IconComponent={Ionicons} size={25} color={Colors.white}>
					<NavHeader.Item iconName="md-search" label="" onPress={showSearch} />
				</NavHeader>
			),
		}
	}

	constructor(props) {
		super(props)
		console.disableYellowBox = true
		this.handlePress = this.handlePress.bind(this)
		this.handleSearch = this.handleSearch.bind(this)
		this.refreshTasks = this.refreshTasks.bind(this)
		this.state = {
			refreshing: false,
			data: [
				{
					data: [],
					key: 'open',
					title: 'OPEN TASKS'
				},
				{
					data: [],
					key: 'completed',
					title: 'RECENTLY COMPLETED'
				},
				{
					data: [],
					key: 'space',
				},
			]
		}
		this.load()
		// Storage.clear()
	}

	componentWillMount() {
		this.props.navigation.setParams({
			showActionSheet: () => this.ActionSheet.show(),
			showSearch: () => this.handleSearch(),
		})
	}

	componentDidMount() {
		this.fetchOpenTasks()
		this.fetchCompletedTasks()
	}

	fetchOpenTasks() {
		let { dispatch } = this.props
		dispatch(actions.fetchOpenTasks()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	fetchCompletedTasks() {
		let { dispatch } = this.props
		dispatch(actions.fetchCompletedTasks()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	refreshTasks() {
		this.setState({ refreshing: true })
		this.fetchOpenTasks()
		this.fetchCompletedTasks()
	}

	handlePress(i) {
		if (ACTION_OPTIONS[i] === 'Logout') {
			Storage.clear()
			clearUser()
		}
		if (ACTION_OPTIONS[i] === 'Search') {
			this.props.navigation.navigate('Search')
		}
	}

	handleSearch() {
		this.props.navigation.navigate('Search')
	}

	renderSectionFooter = ({ section }) => {
		if (!section.isLoading && section.data.length === 0) {
			const text =
				section.key === 'open'
					? `No open tasks. Tap the + button to create a new task.`
					: `That's all your recently completed tasks.`
			return (
				<View style={styles.emptyFooterContainer}>
					<Text style={styles.emptyFooterText}>{text}</Text>
				</View>
			)
		}
	}

	render() {
		let sections = this.loadData()
		let openRefreshing = this.props.openTasks.ui.isFetchingData
		let completedRefreshing = this.props.completedTasks.ui.isFetchingData
		let isRefreshing = openRefreshing || completedRefreshing || false
		return (
			<View style={styles.container}>
				<ActionSheet
					ref={o => (this.ActionSheet = o)}
					title={ACTION_TITLE}
					options={ACTION_OPTIONS}
					cancelButtonIndex={CANCEL_INDEX}
					onPress={this.handlePress}
				/>
				<SectionList
					style={styles.table}
					renderItem={this.renderRow}
					renderSectionHeader={this.renderSectionHeader}
					renderSectionFooter={this.renderSectionFooter}
					sections={sections}
					keyExtractor={this.keyExtractor}
					ListFooterComponent={<TaskRowHeader/>}
					onRefresh={this.refreshTasks}
					refreshing={isRefreshing}
				/>
				<ActionButton
					buttonColor={Colors.base}
					activeOpacity={0.5}
					onPress={this.handleCreateTask.bind(this)}
				/>
			</View>
		)
	}

	handleCreateTask() {
		this.props.navigation.navigate('CreateTask')
	}

	async load() {
		let openTasks = await OpenTasks()
		let completedTasks = await CompletedTasks()
		this.setState({data: [
			{
				data: openTasks,
				key: 'open',
				title: 'OPEN TASKS'
			},
			{
				data: completedTasks,
				key: 'completed',
				title: 'RECENTLY COMPLETED'
			},
			{
				data: [],
				key: 'space',
			},
		]})
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
				key: 'open',
				title: 'OPEN TASKS',
				isLoading: this.props.openTasks.ui.isFetchingData,
			},
			{
				data: completed,
				key: 'completed',
				title: 'RECENTLY COMPLETED',
				isLoading: this.props.completedTasks.ui.isFetchingData,
			},
			{
				data: [],
				key: 'space',
			},
		]
	}

	// Helper function to render individual task cells
	renderRow = ({ item }) => {
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
	renderSectionHeader = ({ section }) => (
		<TaskRowHeader title={section.title} isLoading={section.isLoading} />
	)

	// Extracts keys - required for indexing
	keyExtractor = (item, index) => item.id

	// Event for navigating to task detail page
	openTask(id, name, open, imgpath, title, date) {
		this.props.navigation.navigate('Task', {
			id: id,
			name: name,
			open: open,
			imgpath: imgpath,
			title: title,
			date: date,
		})
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: Colors.bluishGray,
	},
	emptyFooterContainer: {
		flexDirection: 'row',
		paddingTop: 16,
		paddingLeft: 20,
		paddingRight: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	emptyFooterText: {
		fontSize: 18,
		color: Colors.lightGray,
		textAlign: 'center',
	}
})

const mapStateToProps = (state, props) => {
	return {
		openTasks: state.openTasks,
		completedTasks: state.completedTasks,
	}
}

export default connect(mapStateToProps)(Main)
