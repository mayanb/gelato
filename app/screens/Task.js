// Copyright 2018 Addison Leong

import { TaskRow, TaskRowHeader } from '../components/Cells';
import Colors from '../resources/Colors';
import Compute from '../resources/Compute';
// import Fonts from '../resources/Fonts';
// import Images from '../resources/Images';
import React, { Component } from 'react';
import {
	Dimensions,
	Image,
	Platform,
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Networking from '../resources/Networking';
import { DateFormatter } from '../resources/Utility';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tasks: []
		};
		this.loadData();
	}
	render() {
		return (
			<View style={styles.container}>
				
			</View>
		);
	}
	async loadData() {
		const data = await Compute.getTask(this.props.id);
		console.log(data);
	// 	// Make the request
	// 	const teamData = await Compute.classifyTasks(this.props.teamID);
	// 	// Send the data into our state
	// 	await this.setState({tasks: teamData});
	// }
	// renderRow = ({item}) => (
	// 	<TaskRow
	// 		title={item.display}
	// 		key={item.id}
	// 		id={item.id}
	// 		name={item.process_type.name}
	// 		date={DateFormatter.shorten(item.updated_at)}
	// 		onPress={this.openTask.bind(this)}
	// 	/>
	// );
	// renderSectionHeader = ({section}) => (
	// 	<TaskRowHeader title={section.title} />
	// )
	// keyExtractor = (item, index) => item.id;
	// openTask(id) {
	// 	this.props.navigator.resetTo({
	// 		screen: 'gelato.Task',
	// 		animated: true,
	// 		passProps: {
	// 			id: id
	// 		}
	// 	});
	}
	static navigatorStyle = {
		navBarHidden: false,
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
		backgroundColor: Colors.white
	}
});