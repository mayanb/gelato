// Copyright 2018 Addison Leong

import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { setUser } from 'react-native-authentication-helpers'

import Colors from '../resources/Colors'
import { LoginButton, LoginInput } from '../components/Forms'
import Networking from '../resources/Networking-superagent'
import Storage from '../resources/Storage'

import * as actions from '../actions/LoginActions'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      team: null,
      username: null,
      password: null,
    }
    // Bind our functions for external use
    this.setTeam = this.setTeam.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.login = this.login.bind(this)
    this.checkInputs = this.checkInputs.bind(this)
    this.loginSuccess = this.loginSuccess.bind(this)
    this.loginFailure = this.loginFailure.bind(this)

    this.inputs = {}
    this.focusNextField = this.focusNextField.bind(this)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bottom}>
          <KeyboardAwareScrollView>
            <View style={styles.inputArea}>
              <Text style={styles.inputTitle}>Team</Text>
              <LoginInput
                placeholder="Team"
                onChangeText={this.setTeam}
                returnKeyType="next"
                registerInput={this.registerInputFunction('Team')}
                blurOnSubmit={false}
                onSubmitEditing={() => this.focusNextField('Username')}
              />
              <Text style={styles.inputTitle}>Username</Text>
              <LoginInput
                placeholder="Username"
                onChangeText={this.setUsername}
                returnKeyType="next"
                registerInput={this.registerInputFunction('Username')}
                blurOnSubmit={false}
                onSubmitEditing={() => this.focusNextField('Password')}
              />
              <Text style={styles.inputTitle}>Password</Text>
              <LoginInput
                placeholder="Password"
                isPassword={true}
                onChangeText={this.setPassword}
                returnKeyType="done"
                registerInput={this.registerInputFunction('Password')}
                onSubmitEditing={this.login}
              />
              <LoginButton onPress={this.login} />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    )
  }

  registerInputFunction(name) {
    return input => (this.inputs[name] = input)
  }

  focusNextField(key) {
    this.inputs[key].focus()
  }

  // Check if all inputs are valid
  checkInputs() {
    let validInputs =
      this.state.team && this.state.username && this.state.password
    return validInputs
  }

  // Set corresponding states
  async setTeam(team) {
    await this.setState({ team: team })
    this.checkInputs()
  }
  async setUsername(username) {
    await this.setState({ username: username })
    this.checkInputs()
  }
  async setPassword(password) {
    await this.setState({ password: password })
    this.checkInputs()
  }

  // Check the login information
  // Log the user in if their information is valid
  async login() {
    dispatch = this.props.dispatch
    if (this.checkInputs()) {
      // Make the request
      const loginPayload = {
        username: this.state.username + '_' + this.state.team,
        password: this.state.password,
      }

      dispatch(actions.request('LOGIN'))
      Networking.post(`/auth/login/`)
        .send(loginPayload)
        .then(this.loginSuccess)
        .catch(this.loginFailure)
    } else {
      alert('Please enter a team, username, and password')
    }
  }

  loginSuccess(res) {
    dispatch(actions.requestSuccess('LOGIN', res.body))
    const data = res.body
		const task_label_type = String(data.user.task_label_type)
    Storage.save('token', data.token)
    Storage.save('token', data.token)
    Storage.save('username', data.user.username_display)
    Storage.save('teamID', data.user.team)
    Storage.save('userID', data.user.profile_id)
    Storage.save('userAccountID', data.user.user_id)
    Storage.save('accountType', data.user.account_type)
    Storage.save('teamName', data.user.team_name)
		Storage.save('task_label_type', task_label_type)

    setUser({
      token: data.token,
      username: data.user.username_display,
      team: data.user.team_name,
      teamID: data.user.team,
			task_label_type: task_label_type,
    })
  }

  loginFailure(err) {
    dispatch(actions.requestFailure('LOGIN', err))
    let message =
      err.status === 400
        ? 'Unable to log in with provided credentials'
        : 'Problem logging in'
    alert(message)
  }
}

export default connect()(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.base,
  },
  header: {
    fontSize: 25,
    color: Colors.white,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  bottom: {
    flex: 1,
    marginTop: 50,
  },
  inputTitle: {
    fontSize: 18,
    color: Colors.white,
    marginBottom: 10,
    alignSelf: 'center',
  },
})
