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
import { Navigation } from 'react-native-navigation';

export default class Login extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<View style={styles.container}>
				
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
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: Colors.base
	}
});