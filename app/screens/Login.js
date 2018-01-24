// Copyright 2018 Addison Leong

import Colors from '../resources/Colors';
// import Fonts from '../resources/Fonts';
// import Images from '../resources/Images';
import React, { Component } from 'react';
import {
	Dimensions,
	Image,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { LoginButton, LoginInput } from '../components/Forms';
import { Navigation } from 'react-native-navigation';
import Networking from '../resources/Networking-superagent'
import Storage from '../resources/Storage';
import {connect} from 'react-redux'

import { 
	REQUEST, 
	REQUEST_SUCCESS, 
	REQUEST_FAILURE 
} from '../reducers/BasicReducer'

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			team: null,
			username: null,
			password: null
		};
		// Bind our functions for external use
		this.setTeam = this.setTeam.bind(this);
		this.setUsername = this.setUsername.bind(this);
		this.setPassword = this.setPassword.bind(this);
		this.login = this.login.bind(this);
		this.checkInputs = this.checkInputs.bind(this);

	}
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.bottom}>
					<View style={styles.inputArea}>
						<Text style={styles.inputTitle}>Team</Text>
						<LoginInput placeholder="Team" autoCapitalize="none" autoCorrect={false} onChangeText={this.setTeam} returnKeyType='next'/>
						<Text style={styles.inputTitle}>Username</Text>
						<LoginInput placeholder="Username" autoCapitalize="none" autoCorrect={false} onChangeText={this.setUsername} returnKeyType='next' />
						<Text style={styles.inputTitle}>Password</Text>
						<LoginInput placeholder="Password" autoCapitalize="none" autoCorrect={false} isPassword={true} onChangeText={this.setPassword} returnKeyType='done'/>
						<LoginButton onPress={this.login} />
					</View>
				</View>
			</View>
		);
	}
	static navigatorStyle = {
		navBarHidden: true,
		navBarBackgroundColor: Colors.base,
		navBarNoBorder: true,
		navBarTextColor: Colors.white,
		navBarButtonColor: Colors.white
	}
	// Check if all inputs are valid
	checkInputs() {
		let validInputs = this.state.team && this.state.username && this.state.password;
		return validInputs;
	}

	// Set corresponding states
	async setTeam(team) {
		await this.setState({team: team});
		this.checkInputs();
	}
	async setUsername(username) {
		await this.setState({username: username});
		this.checkInputs();
	}
	async setPassword(password) {
		await this.setState({password: password});
		this.checkInputs();
	}

	// Check the login information
	// Log the user in if their information is valid
	async login() {
		dispatch = this.props.dispatch
		nav = this.props.navigator
		if (this.checkInputs()) {
			// Make the request
			const loginPayload = {
				username: this.state.username + "_" + this.state.team,
				password: this.state.password
			};

			dispatch(request('LOGIN'))
			Networking.post(`/auth/login/`)
			.send(loginPayload)
			.end(function(err, res) {
				if (err || !res.ok) {
					dispatch(requestFailure('LOGIN', err))
				} else {
					dispatch(requestSuccess('LOGIN', res.body))
					data = res.body
					Storage.save("token", data.token);
					Storage.save("token", data.token);
					Storage.save("username", data.user.username_display);
					Storage.save("teamID", data.user.team);
					Storage.save("userID", data.user.profile_id);
					Storage.save("accountType", data.user.account_type);
					Storage.save("teamName", data.user.team_name);
					nav.resetTo({
						screen: 'gelato.Main',
						animated: true,
						passProps: {
							username: data.user.username_display,
							team: data.user.team,
							teamID: data.user.team,
						}
					});

				}
			})

	  	} else {
			// Display error message
		}
	}
}


export function request(name) {
	return {
		type: REQUEST,
		name: name,
	}
}

export function requestSuccess(name, data) {
	return {
		type: REQUEST_SUCCESS,
		name: name,
		data: data
	}
}

export function requestFailure(name, err) {
	return {
		type: REQUEST_FAILURE,
		name: name,
		error: err
	}
}

const mapStateToProps = (state, props) => {
	return {
	}
}

export default connect(mapStateToProps)(Login)



const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: Colors.base
	},
	header: {
		fontSize: 25,
		color: Colors.white,
		marginTop: 30,
		marginBottom: 10,
		fontWeight: 'bold'
	},
	bottom: {
		flex: 1,
		marginTop: 50,
	},
	inputTitle: {
		fontSize: 18,
		color: Colors.white,
		marginBottom: 10,
		alignSelf: 'center'
	}
});