// Copyright 2018 Addison Leong

import {connect} from 'react-redux'
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
import { DateFormatter } from '../resources/Utility'
import * as actions from '../actions/TaskListActions'

class Task extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		this.props.dispatch(actions.resetJustCreated())
	}

	render() {
		let sections = [
			{key: 'attributes', title: 'Task data', data: this.props.task.organized_attributes}
		]
		console.log(this.props.task.organized_attributes)
		return (
			<View style={styles.container}>
				<SectionList 
					style={styles.table} 
					renderItem={this.renderRow} 
					renderSectionHeader={this.renderSectionHeader} 
					sections={sections} 
					keyExtractor={this.keyExtractor} 
				/>
			</View>
		)
	}

	renderRow = ({item}) => (
		<AttributeRow
			title={item.display}
			key={item.id}
			id={item.id}
			name={item.name}
			value={item.value.value || ""}
			onSubmitEditing={this.handleSubmitEditing.bind(this)}
		/>
	)

	handleSubmitEditing(id, newValue) {
		task = this.props.task
		this.props.dispatch(actions.updateAttribute(task, id, newValue))
	}


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

const mapStateToProps = (state, props) => {
	let arr = props.open ? state.openTasks.data : state.completedTasks.data
	return {
		task: arr.find(e => Compute.equate(e.id, props.id))
	}
}

export default connect(mapStateToProps)(Task)