// Copyright 2018 Addison Leong for Polymerize, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatList, StyleSheet, View, Text } from 'react-native'
import ActionButton from 'react-native-action-button'
import ActionSheet from 'react-native-actionsheet'
import NavHeader from 'react-navigation-header-buttons'
import { clearUser } from 'react-native-authentication-helpers'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TaskRow, TaskRowHeader } from '../components/Cells'
import Colors from '../resources/Colors'
import Storage from '../resources/Storage'
import * as actions from '../actions/TaskActions'
import * as processActions from '../actions/ProcessesAndProductsActions'
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
		this.state = {
			refreshing: false,
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
		this.fetchRecentTasks()
		this.fetchProcesses()
	}

	fetchRecentTasks() {
		this.props.dispatch(actions.fetchRecentTasks())
			.finally(() => this.setState({ refreshing: false }))
	}

	fetchProcesses() {
		let { dispatch } = this.props
		dispatch(processActions.fetchProcesses()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	refreshTasks() {
		this.setState({ refreshing: true })
		this.fetchRecentTasks()
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
				name: 'Scan Items',
				mode: 'move',
			})
		}
	}

	handleSearch() {
		this.props.navigation.navigate('Search')
	}

	renderFooter = (data, isRefreshing)  => {
		if (!isRefreshing && data.length === 0) {
			const text = `No recent tasks. Tap the + button to create a new task.`
			return (
				<View style={styles.emptyFooterContainer}>
					<Text style={styles.emptyFooterText}>{text}</Text>
				</View>
			)
		} else {
			return <TaskRowHeader />
		}
	}

	render() {
		let data = this.props.recentTasks
		let isRefreshing = this.props.loading || false
		return (
			<View style={styles.container}>
				<ActionSheet
					ref={o => (this.ActionSheet = o)}
					title={ACTION_TITLE}
					options={ACTION_OPTIONS}
					cancelButtonIndex={CANCEL_INDEX}
					onPress={this.handlePress}
				/>
				<FlatList
					data={data}
					style={styles.table}
					renderItem={this.renderRow}
					ListHeaderComponent={this.renderHeader}
					keyExtractor={this.keyExtractor}
					ListFooterComponent={() => this.renderFooter(data, isRefreshing)}
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
				is_flagged={item.is_flagged}
				is_ancestor_flagged={item.num_flagged_ancestors > 0}
				date={item.updated_at}
				onPress={this.openTask.bind(this)}
			/>
		)
	}

	// Helper function to render headers
	renderHeader = () => (
		<TaskRowHeader title='RECENT TASKS' />
	)

	// Extracts keys - required for indexing
	keyExtractor = (item, index) => String(item.id)

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
		justifyContent: 'center',
	},
	emptyFooterText: {
		fontSize: 18,
		color: Colors.lightGray,
		textAlign: 'center',
	},
})

const mapStateToProps = (state, props) => {
	const recentTasks = state.tasks.recentIDs.map(id => state.tasks.dataByID[id])
	return {
		recentTasks: recentTasks,
		loading: state.tasks.ui.isFetchingTasksData,
	}
}

export default connect(mapStateToProps)(Main)
