// Copyright 2018 Addison Leong for Polymerize, Inc.
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {
	Dimensions,
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import * as actions from '../actions/TaskListActions'
import { AttributeRow, TaskRowHeader } from '../components/Cells'

const ACTION_TITLE = 'More'
const ACTION_OPTIONS = ['Cancel', 'Rename', 'Flag', 'Delete',]
const CANCEL_INDEX = 0

class Task extends Component { 
	static navigatorButtons = {
		rightButtons: [
			{
				title: 'Camera',
				id: 'camera',
				disabled: false,
				showAsAction: 'ifRoom',
				buttonColor: 'white',
				buttonFontSize: 15,
				buttonFontWeight: '600',
			}, 
			{
				title: 'More',
				id: 'more',
				disabled: false,
				showAsAction: 'ifRoom',
				buttonColor: 'white',
				buttonFontSize: 15,
				buttonFontWeight: '600',
			}, 
		]
	}

	constructor(props) {
		super(props)
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
		this.showActionSheet = this.showActionSheet.bind(this)
		this.showCamera = this.showCamera.bind(this)
	}

	onNavigatorEvent(event) {
	  if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
    	if (event.id === 'more') { // this is the same id field from the static navigatorButtons definition
      	this.showActionSheet()
    	} else if (event.id === 'camera') {
  			this.showCamera()
    	}
		}
	}

	showActionSheet() {
	  this.ActionSheet.show()
	}

	showCamera() {
		this.props.navigator.showModal({
		  screen: "gelato.QRScanner",
		  passProps: {},
		  navigatorStyle: { navBarHidden: true },
		  animationType: 'slide-up' 
		})
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
				<ActionSheet
          ref={o => this.ActionSheet = o}
          title={ACTION_TITLE}
          options={ACTION_OPTIONS}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={this.handlePress}
        />
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