// Copyright 2018 Addison Leong

import { AttributeRow, TaskRowHeader } from '../components/Cells';
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

export default class Task extends Component {
	constructor(props) {
		super(props);
		//this.loadData();
	}
	render() {
		console.log(this.props)
		return (
			<View style={styles.container}>
			</View>
		);
	}
	async loadData() {
		const data = Compute.organizeAttributes(this.props.tasks)
	}

	renderRow = ({item}) => (
		<AttributeRow
			title={item.display}
			key={item.id}
			id={item.id}
			name={item.process_type.name}
			date={DateFormatter.shorten(item.updated_at)}
			onPress={this.openTask.bind(this)}
		/>
	);

	renderSectionHeader = ({section}) => (
		<TaskRowHeader title={section.title} />
	)

	keyExtractor = (item, index) =>  { item.id }

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