import Colors from '../resources/Colors';
import Images from '../resources/Images'
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

export class TaskRow extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const width = Dimensions.get('window').width;
		const styles = StyleSheet.create({
			container: {
				width: width,
				minHeight: 30,
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				alignItems: 'flex-start',
				justifyContent: 'center',
				paddingTop: 10,
				paddingBottom: 10,
				paddingLeft: 20,
				paddingRight: 20
			},
			title: {
				marginBottom: 5
			},
			display: {
				fontWeight: 'bold',
				fontSize: 17,
				marginBottom: 5
			},
			date: {
				fontSize: 13,
				color: Colors.lightGray
			},
			process_icon: {
				width: 50,
				height: 50,
			}
		});
		return (
			<TouchableOpacity activeOpacity={0.5} onPress={this.openTask.bind(this)}>
				<View style={{flex: 1, flexDirection: 'row'}}>
					<View style={styles.process_icon}>
						<Image source={this.requireProcessIcon(this.props.imgpath)} />
					</View>
					<View style={styles.container}>
						<Text style={styles.display}>{this.props.name}</Text>
						<Text style={styles.title}>{this.props.title}</Text>
						<Text style={styles.date}>{this.props.date}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
	openTask() {
		this.props.onPress(this.props.id, this.props.title, this.props.organized_attributes);
	}

	requireProcessIcon(process_icon) {
		img = ''
		switch(process_icon) {
			case "roast.png":
				img = require('../resources/assets/processicons/roast.png')
				break;
			case "melange.png":
				img = require('../resources/assets/processicons/melange.png')
				break;
			case "ballmill.png":
				img = require('../resources/assets/processicons/ballmill.png')
				break;
			case "breakandwinnow.png":
				img = require('../resources/assets/processicons/breakandwinnow.png')
				break;
			case "conche.png":
				img = require('../resources/assets/processicons/conche.png')
				break;	
			case "foil.png":
				img = require('../resources/assets/processicons/foil.png')
				break;
			case "grind.png":
				img = require('../resources/assets/processicons/grind.png')
				break;
			case "hold.png":
				img = require('../resources/assets/processicons/hold.png')
				break;
			case "label.png":
				img = require('../resources/assets/processicons/label.png')
				break;
			case "melangerpull.png":
				img = require('../resources/assets/processicons/melangerpull.png')
				break;
			case "move.png":
				img = require('../resources/assets/processicons/move.png')
				break;
			case "pack.png":
				img = require('../resources/assets/processicons/pack.png')
				break;
			case "package.png":
				img = require('../resources/assets/processicons/package.png')
				break;	
			case "prep.png":
				img = require('../resources/assets/processicons/prep.png')
				break;
			case "prerefine.png":
				img = require('../resources/assets/processicons/prerefine.png')
				break;
			case "rcpull.png":
				img = require('../resources/assets/processicons/rcpull.png')
				break;
			case "rotaryconche.png":
				img = require('../resources/assets/processicons/rotaryconche.png')
				break;
			case "rotaryconchepull.png":
				img = require('../resources/assets/processicons/rotaryconchepull.png')
				break;
			case "ship.png":
				img = require('../resources/assets/processicons/ship.png')
				break;		
			case "temper.png":
				img = require('../resources/assets/processicons/temper.png')
				break;
			case "winnow.png":
				img = require('../resources/assets/processicons/winnow.png')
				break;				
			default:
				img = require('../resources/assets/processicons/default.png')
		}
		return img

	}

}

export class TaskRowHeader extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const width = Dimensions.get('window').width;
		const styles = StyleSheet.create({
			container: {
				width: width,
				height: 75,
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				alignItems: 'flex-start',
				justifyContent: 'flex-end',
				paddingTop: 10,
				paddingBottom: 10,
				paddingLeft: 20,
				paddingRight: 20,
				backgroundColor: Colors.bluishGray
			},
			title: {
				fontSize: 15,
				color: Colors.lightGray
			}
		});
		return (
			<View style={styles.container}>
				<Text style={styles.title}>{this.props.title}</Text>
			</View>
		);
	}
}

export class AttributeRow extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const width= Dimensions.get('window').width;
		const styles = StyleSheet.create({
			container: {
				width: width,
				minHeight: 30,
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				alignItems: 'flex-start',
				justifyContent: 'center',
				paddingTop: 10,
				paddingBottom: 10,
				paddingLeft: 20,
				paddingRight: 20
			},
			title: {
				fontSize: 15,
				colors: Colors.lightGray
			}
		})
		return (
			<View style={styles.container}>
				<Text style={styles.title}>{this.props.title}</Text>
				<Text style={styles.value}>{this.props.value}</Text>
			</View>
		)
	}
}