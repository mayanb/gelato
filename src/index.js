import React from 'react'
import moment from 'moment'
import request from 'superagent'
import { StatusBar, View } from 'react-native'
import { AppLoading } from 'expo'
import { StackNavigator } from 'react-navigation'
import { setUser, withUser } from 'react-native-authentication-helpers'
import Colors from './resources/Colors'
import Storage from './resources/Storage'
import Login from './screens/Login'
import Main from './screens/Main'
import Ingredients from './screens/Ingredients'
import CreateTask from './screens/CreateTask'
import Task from './screens/Task'
import Settings from './screens/Settings'
import Search from './screens/Search'
import Snackbar from './components/Snackbar'
import ShouldUpdateModal from './components/Main/ShouldUpdateModal'
import { connect } from 'react-redux'
import Networking from './resources/Networking-superagent'

let { releaseChannel, publishedTime} = Expo.Constants.manifest
const LATEST_MANIFEST_URL = `https://expo.io/@polymer/polymer/index.exp?release-channel=${releaseChannel || 'staging'}&sdkVersion=26.0.0`

class App extends React.Component {
	state = {
		mostRecentBundle: false,
		ready: false,
		loggedIn: false,
		hasLatestUpdates: false,
		requiredUpdate: false,
	}

	_onStartup = async () => {
		this._loadLatestBundle()
		await this._loadUserInformation()
	}

	_loadLatestBundle = async () => {
		const currentPublishedTime = moment(publishedTime)
		const latestManifest = await request.get(LATEST_MANIFEST_URL)
		const latestPublishedTime = moment(latestManifest.body.publishedTime)
		const requiredUpdate = latestManifest.body.extra.requiredUpdate
		this.setState({ requiredUpdate: true })

		if (latestPublishedTime.isAfter(currentPublishedTime)) {
			Expo.Util.reload()
		} else {
			this.setState({ hasLatestUpdates: true })
		}
	}

	_loadUserInformation = async () => {
		const [token, userID] = await Promise.all([
			Storage.get('token'),
			Storage.get('userID'),
		])
		const loggedIn = !!token

		if (loggedIn) {
			const [username, team, teamID, userProfileRes] = await Promise.all([
				Storage.get('username'),
				Storage.get('teamName'),
				Storage.get('teamID'),
				Networking.get(`/ics/userprofiles/${userID}/`),
			])

			// NOTE(brent): one could move all data that is currently stored in
			// Storage into the user via react-native-authentication-helpers and
			// delete a lot of code

			// On error, just return zero, the first option
			const body = userProfileRes.body || {}
			const task_label_type = body.task_label_type || 0
			const time_format = body.time_format || 'm'
			setUser({ username, team, teamID, token, task_label_type, time_format })
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user && !this.props.user) {
			this.setState({ loggedIn: true })
		} else if (!nextProps.user && this.props.user) {
			this.setState({ loggedIn: false })
		}
	}

	render() {
		let { errors, user } = this.props
		if (!this.state.ready) {
			return (
				<AppLoading
					startAsync={this._onStartup.bind(this)}
					onError={console.warn}
					onFinish={() => this.setState({ ready: true })}
				/>
			)
		}

		let shouldUpdate = !this.state.hasLatestUpdates && this.state.requiredUpdate
		return (
			<View style={{ flex: 1 }}>
				{this.state.loggedIn ? <Navigation screenProps={user} /> : <Login />}
				{!!shouldUpdate && <ShouldUpdateModal />}
				{!!errors.data.length && (
					<Snackbar>{errors.data[errors.data.length - 1].errorType}</Snackbar>
				)}
				<StatusBar barStyle="light-content" />
			</View>
		)
	}
}

const MainStack = StackNavigator(
	{
		Main: { screen: Main },
		CreateTask: { screen: CreateTask },
		Task: { screen: Task },
		Settings: { screen: Settings },
	},
	{
		initialRouteName: 'Main',
		//initialRouteParams: { id: 14408 },
		navigationOptions: {
			headerStyle: {
				backgroundColor: Colors.base,
				borderBottomWidth: 0,
			},
			headerTintColor: Colors.white,
		},
		transitionConfig: () => ({
			screenInterpolator: sceneProps => {
				//console.log('sceneProps', sceneProps)
				const { layout, position, scene } = sceneProps
				const { index } = scene
				const width = layout.initWidth

				const sceneParams = scene.route.params || {}
				//console.log('sceneParams', sceneParams)

				const slideFromLeft = {
					transform: [{
						translateX: position.interpolate({
							inputRange: [index-1, index+1],
							outputRange: [-width, width],
						}),
					}]
				}
				const slideFromRight = {
					opacity: position.interpolate({
						inputRange: [index - 1, index, index + 1],
						outputRange: [ 0, 1, 0],
					}),
					transform: [{
						translateX: position.interpolate({
							inputRange: [index - 1, index, index + 1],
							outputRange: [width, 0, -width],
						}),
					}]
				}
				
				if (sceneParams.transitionDirection == 'left') {
					return slideFromLeft
				}
				return slideFromRight
			},
		}),
	}
)

const Navigation = StackNavigator(
	{
		MainStack: { screen: MainStack },
		Ingredients: { screen: Ingredients },
		Search: { screen: Search },
	},
	{
		initialRouteName: 'MainStack',
		mode: 'modal',
		navigationOptions: {
			header: null,
			gesturesEnabled: false,
		},
	}
)

const mapStateToProps = (state /*, props */) => {
	return {
		errors: state.errors,
	}
}

let connected = connect(mapStateToProps)(App)
export default withUser(connected)
