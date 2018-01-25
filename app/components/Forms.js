
import Colors from '../resources/Colors';
// import Fonts from '../../resources/Fonts';
import React, { Component } from 'react';
import {
	Dimensions,
	Image,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

export class LoginInput extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const width = Dimensions.get('window').width;
		return(
			<TextInput style={[this.props.style, {
				width: width * 0.8,
				height: 40,
				backgroundColor: Colors.white,
				borderRadius: 3,
				fontSize: 15,
				color: Colors.gray,
				marginBottom: 20,
				padding: 10,
				textAlign: 'center'
			}]} 
			returnKeyType={this.props.returnKeyType}
			keyboardType={this.props.keyboardType}
			placeholder={this.props.placeholder}
			onChangeText={this.props.onChangeText}
			secureTextEntry={this.props.isPassword}
			autoCapitalize={this.props.autoCapitalize}
			autoCorrect={this.props.autoCorrect}
			underlineColorAndroid="transparent" />
		);
	}
}

export class PrintNumberInput extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const width = Dimensions.get('window').width;
		return(
			<View style={{borderLeftWidth: 1, 
				borderRightWidth: 1, 
				borderTopWidth: 1, 
				borderBottomWidth: 1, 
				height: 42,
				borderColor: Colors.lightGray}}>
			<TextInput style={[this.props.style, {
				width: width * 0.8 - 2,
				height: 40,
				backgroundColor: Colors.white,
				borderRadius: 3,
				fontSize: 15,
				color: Colors.gray,
				marginBottom: 20,
				padding: 10,
				textAlign: 'center'
			}]} 
			returnKeyType={this.props.returnKeyType}
			keyboardType={this.props.keyboardType}
			placeholder={this.props.placeholder}
			onChangeText={this.props.onChangeText}
			secureTextEntry={this.props.isPassword}
			autoCapitalize={this.props.autoCapitalize}
			autoCorrect={this.props.autoCorrect}
			underlineColorAndroid="transparent" />
			</View>
		);
	}
}

export class LoginButton extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const width = Dimensions.get('window').width;
		const styles = StyleSheet.create({
			button: {
				maxWidth: 0.8*width,
				width: 300,
				height: 55,
				backgroundColor: Colors.darkBlue,
				justifyContent: 'center',
				alignItems: 'center',
				borderRadius: 3,
				marginTop: 10
			},
			title: {
				fontSize: 18,
				color: Colors.white
			}
		});
		return(
			<TouchableOpacity activeOpacity={0.5} onPress={this.props.onPress}>
				<View style={styles.button}>
					<Text style={styles.title}>LOGIN</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

export class PrintButton extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const width = Dimensions.get('window').width;
		const styles = StyleSheet.create({
			button: {
				maxWidth: 0.8*width,
				width: 300,
				height: 55,
				backgroundColor: Colors.darkBlue,
				justifyContent: 'center',
				alignItems: 'center',
				borderRadius: 3,
				marginTop: 10
			},
			title: {
				fontSize: 18,
				color: Colors.white
			}
		});
		return(
			<TouchableOpacity activeOpacity={0.5} onPress={this.props.onPress}>
				<View style={styles.button}>
					<Text style={styles.title}>{this.props.buttonText}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}