// Copyright 2018 Addison Leong for Polymerize, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, SectionList, StyleSheet, View, Text } from 'react-native'
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

const ACTION_TITLE = 'Settings'
const ACTION_OPTIONS = ['Close', 'Logout', 'Move Items']
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
						iconName="md-menu"
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
		this.loadMore = this.loadMore.bind(this)
		this.state = {
			refreshing: false,
			page: 1,
			data: []
		}
		// Storage.clear()
	}

	componentWillMount() {
		this.props.navigation.setParams({
			showActionSheet: () => this.ActionSheet.show(),
			showSearch: () => this.handleSearch(),
		})
	}

	componentDidMount() {
		this.fetchAllTasks(this.state.page)
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

	fetchAllTasks(page) {
		let { dispatch } = this.props
		dispatch(actions.fetchAllTasks(page)).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	refreshTasks() {
		this.setState({ refreshing: true })
		this.fetchAllTasks(this.state.page)
	}

	handlePress(i) {
		if (ACTION_OPTIONS[i] === 'Logout') {
			Storage.clear()
			clearUser()
		}
		if (ACTION_OPTIONS[i] === 'Search') {
			this.props.navigation.navigate('Search')
		}
		if (ACTION_OPTIONS[i] === 'Move Items') {
			this.props.navigation.navigate('Move', {
				name: "Scan Items",
				mode: "move",
			})
		}
	}

	handleSearch() {
		this.props.navigation.navigate('Search')
	}

	// Helper function to render headers
	renderSectionHeader = ({ section }) => (
		<TaskRowHeader title={section.title} isLoading={false} />
	)

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
		let refreshing = this.props.tasks.ui.isFetchingData
		let isRefreshing = refreshing || false
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
					onEndReached={this.loadMore} // Function to call for infinite scroll
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

	// Loads more data when the end threshold is reached.
	// The data flow is as follows:
	//	- Fetch data, render to section list
	//	- When more data is fetched:
	//		- Commit current prop data (from Redux) to state by appending it to the current state
	//		- Get new data, append that data to section list state
	//	Note that the way this works is based on the fact that the latest data is stored in this.props.tasks.data
	async loadMore() {
		if (!this.props.tasks.ui.isFetchingData) {
			await this.setState({data: [...this.state.data, ...this.props.tasks.data]}) // Append new data to state
			await this.setState({page: this.state.page + 1}) // Set current page
			this.fetchAllTasks(this.state.page)
			this.loadData()
		}
	}

	// In order to implement infinite scroll, we need to load data into state.
	loadData() {
		let data = this.props.tasks.data
		return [
			{
				data: [...this.state.data, ...data], // Append new data to current list data
				key: 'completed',
				title: 'RECENT TASKS',
				isLoading: this.props.tasks.ui.isFetchingData,
			}
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
		tasks: state.allTasks
	}
}

export default connect(mapStateToProps)(Main)
