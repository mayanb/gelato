// Copyright 2018 Addison Leong

import update from 'immutability-helper'
import {connect} from 'react-redux'
import { CreateTaskSelect } from '../components/Cells';
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
import * as actions from '../actions/ProcessesAndProductsActions'

class CreateTask extends Component {
	constructor(props) {
		super(props)
		this.state = {
			processes: {isExpanded: false, selected: ''},
			products: {isExpanded: false, selected: ''},
		}
	}

	componentDidMount() {
		this.props.dispatch(actions.fetchProcesses())
		this.props.dispatch(actions.fetchProducts())
	}

	render() {
		let processData = this.createSection('processes') 
		let productData = this.createSection('products')
		console.log(processData)
		console.log(productData)
		return (
			<View style={styles.container}>
				<SectionList 
					style={styles.table} 
					renderItem={this.renderRow} 
					renderSectionHeader={this.renderSectionHeader} 
					sections={processData} 
					keyExtractor={this.keyExtractor} 
				/>
				<SectionList 
					style={styles.table} 
					renderItem={this.renderRow} 
					renderSectionHeader={this.renderSectionHeader} 
					sections={productData} 
					keyExtractor={this.keyExtractor} 
				/>
			</View>
		)
	}

	createSection(key) {
		let data = []
		console.log(this.state[key].isExpanded)
		if (this.state[key].isExpanded) {
			data = this.props[key]
		}
		return [
			{
				key: key,
				isExpanded: this.state[key].isExpanded,
				selected: this.state[key].selected,
				data: data,
			}
		]
	}

	handleToggleSection(key) {
		let otherKey = key === 'processes' ? 'products' : 'processes'
		let current = this.state[key].isExpanded

		let ns = update(this.state, {
			[key]: {$merge: {isExpanded: !current}},
			[otherKey]: {$merge: {isExpanded: false}}
		})
		console.log(ns)
		this.setState(ns) 
	}

	handleSelectRow(index, key) {
		let ns = update(this.state, {
			[key]: {$merge: {selected: index}}
		})
		this.setState(ns)
		this.handleToggleSection(key)
	}

	renderRow = ({item, index, section}) => {
		console.log(item.id)
		return (
		<CreateTaskSelect
			name={item.name}
			key={item.id}
			id={item.id}
			imgpath={item.icon}
			onPress={() => this.handleSelectRow(index, section.key)}
		/>
	)
	}

	renderSectionHeader = ({section}) => {
		if (section.selected === '') {
			return <CreateTaskSelect 
				name={'Choose a task'} 
				key={-1} 
				id={-1} 
				onPress={() => this.handleToggleSection(section.key)}
			/>
		}

		let item = this.props[section.key][section.selected]
		return (
			<CreateTaskSelect
				name={item.name}
				key={item.id}
				id={item.id}
				imgpath={item.icon}
				onPress={() => this.handleToggleSection(section.key)}
			/>
		)
	}

	keyExtractor = (item, index) =>  { item.name+"-"+item.id }

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
	console.log(state.processes.data)
	return {
		processes: state.processes.data,
		products: state.products.data,
	}
}

export default connect(mapStateToProps)(CreateTask)