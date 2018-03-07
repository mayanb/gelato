import React from 'react'
import { StatusBar, View, Text } from 'react-native'
import { AppLoading } from 'expo'
import { StackNavigator } from 'react-navigation'
import { setUser, withUser } from 'react-native-authentication-helpers'

import Colors from './resources/Colors'
import Storage from './resources/Storage'
import Login from './screens/Login'
import Main from './screens/Main'
import QRScanner from './screens/QRScanner'
import CreateTask from './screens/CreateTask'
import Task from './screens/Task'
import Print from './screens/Print'
import Search from './screens/Search'
import Move from './screens/Move'
import ChooseTeam from './screens/ChooseTeam'
import Snackbar from './components/Snackbar'

import paramsToProps from './resources/paramsToProps'
import { connect } from 'react-redux'

class App extends React.Component {
	state = {
		ready: false,
		loggedIn: false,
	}

	_loadDataAsync = async () => {
		const token = await Storage.get('token')
		const loggedIn = !!token

		if (loggedIn) {
			const [username, team, teamID] = await Promise.all([
				Storage.get('username'),
				Storage.get('teamName'),
				Storage.get('teamID'),
			])

			// NOTE(brent): one could move all data that is currently stored in
			// Storage into the user via react-native-authentication-helpers and
			// delete a lot of code
			setUser({ username, team, teamID, token })
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
		let {errors, user} = this.props
		console.log(errors)
		if (!this.state.ready) {
			return (
				<AppLoading
					startAsync={this._loadDataAsync}
					onError={console.warn}
					onFinish={() => this.setState({ ready: true })}
				/>
			)
		}

		return (
			<View style={{ flex: 1 }}>
				{this.state.loggedIn ? (
					<Navigation screenProps={user} />
				) : (
					<Login />
				)}
				{errors.data.length ? (
					<Snackbar>{errors.data[errors.data.length-1].errorType}</Snackbar>
				) : (
					false
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
		Print: { screen: Print },
		Move: { screen: Move },
		ChooseTeam: { screen: ChooseTeam },

	},
	{
		navigationOptions: {
			headerStyle: {
				backgroundColor: Colors.base,
				borderBottomWidth: 0,
			},
			headerTintColor: Colors.white,
		},
	}
)

const Navigation = StackNavigator(
	{
		MainStack: { screen: MainStack },
		QRScanner: { screen: QRScanner },
		Search: { screen: Search },
		
	},
	{
		mode: 'modal',
		navigationOptions: {
			header: null,
			gesturesEnabled: false,
		},
	}
)

const mapStateToProps = (state /*, props */) => {
	return {
		errors: state.errors
	}
}

let connected = connect(mapStateToProps)(App)
export default withUser(connected)
