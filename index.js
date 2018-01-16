// Copyright 2018 Addison Leong

import { AppRegistry } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './app/start'; // This is where we register all screens
import Storage from './app/resources/Storage';

registerScreens(); // Register the screens

// We package the startup code into an async function to handle awaits inside
async function startup() {
	// Set the screen to load
	let startScreen = "gelato.Login";
	// Data to pass into screen
	let passProps = {};

	// Check user login state
	const loggedIn = await Storage.get("TeamID");

	if (loggedIn === null) {
		startScreen = "gelato.Login";
	} else {
		startScreen = "gelato.Main";
	}
	Navigation.startSingleScreenApp({
		screen: {
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