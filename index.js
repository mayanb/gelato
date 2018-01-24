// Copyright 2018 Addison Leong
import store from './create_store.js'
import {Provider} from 'react-redux'

import { AppRegistry } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './app/start'; // This is where we register all screens
import Storage from './app/resources/Storage';

registerScreens(store, Provider); // Register the screens

// We package the startup code into an async function to handle awaits inside
async function startup() {
	// Set the screen to load
	// await Storage.remove("token");
	let startScreen = "gelato.Login";
	// Data to pass into screen
	let passProps = {};

	// Check user login state
	const loggedIn = await Storage.get("token");

	if (loggedIn === null) {
		startScreen = "gelato.Login";
	} else {
		startScreen = "gelato.Main";
		const username = await Storage.get("username");
		const team = await Storage.get("teamName");
		const teamID = await Storage.get("teamID");
		passProps = {
			username: username,
			team: team,
			teamID: teamID
		};
	}
	Navigation.startSingleScreenApp({
		screen: {
			title: passProps !== {} ? (passProps.team) : null,
			screen: startScreen,
			navigatorStyle: {}
		},
		animationType: 'none',
		appStyle: {
			orientation: 'portrait'
		},
		portraitOnlyMode: true,
		passProps: passProps
	});
}

startup();