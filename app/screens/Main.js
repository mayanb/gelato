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

export default class Main extends Component {
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
				<SectionList style={styles.table} renderItem={this.renderRow} renderSectionHeader={this.renderSectionHeader} sections={this.state.tasks} keyExtractor={this.keyExtractor} />
			</View>
		);
	}

	// Asynchronously load the data
	// Note that this is currently slow due to an inefficient query
	// TODO: See query
	async loadData() {
		// Make the request
		const teamData = await Compute.classifyTasks(this.props.teamID); // Gets all of the task data
		// Send the data into our state
		await this.setState({tasks: teamData});
	}

	// Helper function to render individual task cells
	renderRow = ({item}) => {
		return (
		<TaskRow
			title={item.display}
			key={item.id}
			attributes={item}
			name={item.process_type.name}
			date={DateFormatter.shorten(item.updated_at)}
			onPress={this.openTask.bind(this)}
		/>
		)
	}

	// Helper function to render headers
	renderSectionHeader = ({section}) => (
		<TaskRowHeader title={section.title} />
	)

	// Extracts keys - required for indexing
	keyExtractor = (item, index) => item.id;

	// Event for navigating to task detail page
	openTask(id, name) {

		this.props.navigator.push({
			screen: 'gelato.Task',
			title: name,
			animated: true,
			passProps: {
				id: id, 
				name: name,
			}
		});
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