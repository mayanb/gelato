// Copyright 2018 Addison Leong for Polymerize, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	FlatList,
	StyleSheet,
	View,
	Text,
	ActivityIndicator,
} from 'react-native'
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

const TASK_REFRESH_INTERVAL_MINUTES = 10 // minutes
const TASK_REFRESH_INTERVAL_MILLI = 60 * 1000 * TASK_REFRESH_INTERVAL_MINUTES // milli

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
		this.fetchRecentTasks = this.fetchRecentTasks.bind(this)
		this.handleLoadMore = this.handleLoadMore.bind(this)
		this.state = {
			loadingMoreTasks: false,
			noMoreTasks: false,
			page: 1,
			flatListRef: null,
		}
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
		const { isFetchingTasksData } = this.props
		if (isFetchingTasksData) {
			return
		}
		const page = 1
		this.props.dispatch(actions.fetchRecentTasks(page)).finally(() => {
			this.setState({
				noMoreTasks: false,
			})
		})
	}

	refreshTasksOnBack() {
		const { timeOfLastTaskRefresh } = this.props
		const timeSinceLastTaskRefresh = Date.now() - timeOfLastTaskRefresh
		if (
			!timeSinceLastTaskRefresh ||
			timeSinceLastTaskRefresh > TASK_REFRESH_INTERVAL_MILLI
		) {
			this.props.dispatch(actions.fetchRecentTasks())
			// scroll to top of list
			this.flatListRef.scrollToIndex({ animated: true, index: '0' })
		}
	}

	fetchProcesses() {
		let { dispatch } = this.props
		dispatch(processActions.fetchProcesses()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	handleLoadMore() {
		const { isFetchingTasksData } = this.props
		const { loadingMoreTasks, noMoreTasks } = this.state
		if (isFetchingTasksData || loadingMoreTasks || noMoreTasks) {
			return
		}
		const newPage = this.state.page + 1
		this.setState({ loadingMoreTasks: true })
		this.props
			.dispatch(actions.fetchRecentTasks(newPage))
			.then(() => this.setState({ page: newPage, loadingMoreTasks: false }))
			.catch(e => {
				if (e.status === 404) {
					this.setState({ noMoreTasks: true, loadingMoreTasks: false })
				} else {
					throw e
				}
			})
	}

	handlePress(i) {
		if (ACTION_OPTIONS[i] === 'Logout') {
			Storage.clear()
			clearUser()
		}
	}

	handleSearch() {
		this.props.navigation.navigate('Search')
	}

	renderFooter = (data, isFetchingTasksData, loadingMoreTasks) => {
		if (!isFetchingTasksData && data.length === 0) {
			const text = `No recent tasks. Tap the + button to create a new task.`
			return (
				<View style={styles.emptyFooterContainer}>
					<Text style={styles.emptyFooterText}>{text}</Text>
				</View>
			)
		} else if (loadingMoreTasks) {
			return (
				<ActivityIndicator
					size="large"
					color={Colors.base}
					style={styles.indicator}
				/>
			)
		} else {
			return <TaskRowHeader />
		}
	}

	render() {
		let data = this.props.recentTasks
		const { isFetchingTasksData } = this.props
		const { loadingMoreTasks } = this.state
		return (
			<View style={styles.container}>
				<ActionSheet
					ref={o => (this.ActionSheet = o)}
					title={ACTION_TITLE}
					options={ACTION_OPTIONS}
					cancelButtonIndex={CANCEL_INDEX}
					onPress={this.handlePress}
				/>
				{data.length && (
					<FlatList
						data={data}
						style={styles.table}
						ref={ref => this.flatListRef = ref}
						renderItem={this.renderRow}
						ListHeaderComponent={this.renderHeader}
						keyExtractor={this.keyExtractor}
						ListFooterComponent={() =>
							this.renderFooter(data, isFetchingTasksData, loadingMoreTasks)
						}
						onRefresh={this.fetchRecentTasks}
						refreshing={isFetchingTasksData}
						onEndReached={this.handleLoadMore}
						onEndReachedThreshold={0.5 /* ie "load more at half a screen height from curr list end" */}
					/>
				)}
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
	renderHeader = () => <TaskRowHeader title="RECENT TASKS" />

	// Extracts keys - required for indexing
	keyExtractor = (item, index) => String(item.id)

	// Event for navigating to task detail page
	openTask(id, name, open, imgpath, title, date) {
		this.props.navigation.navigate('Task', {
			id: id,
			backFn: this.refreshTasksOnBack.bind(this),
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
	indicator: {
		alignSelf: 'center',
		marginTop: 20,
		marginBottom: 20,
	},
})

const mapStateToProps = (state, props) => {
	const recentTasks = state.tasks.recentIDs.map(id => state.tasks.dataByID[id])
	const fetchingData = state.tasks.ui.isFetchingTasksData
	return {
		recentTasks: recentTasks,
		isFetchingTasksData: !!fetchingData,
		timeOfLastTaskRefresh: state.tasks.ui.timeOfLastTaskRefresh,
	}
}

export default connect(mapStateToProps)(Main)
