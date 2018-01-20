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
			}
		});
		return (
			<TouchableOpacity activeOpacity={0.5} onPress={this.openTask.bind(this)}>
				<View style={styles.container}>
					<Text style={styles.display}>{this.props.name}</Text>
					<Text style={styles.title}>{this.props.title}</Text>
					<Text style={styles.date}>{this.props.date}</Text>
				</View>
			</TouchableOpacity>
		);
	}
	openTask() {
		this.props.onPress(this.props.id, this.props.title, this.props.organized_attributes);
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