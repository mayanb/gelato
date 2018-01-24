// Copyright 2018 Addison Leong

import update from 'immutability-helper'
import {connect} from 'react-redux'
import { Dropdown } from '../components/Dropdown';
import Colors from '../resources/Colors';
import Compute from '../resources/Compute';
// import Fonts from '../resources/Fonts';
// import Images from '../resources/Images';
import React, { Component } from 'react';
import {
	Dimensions,
	Image,
	Platform,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { Navigation } from 'react-native-navigation'
import Networking from '../resources/Networking'
import { DateFormatter } from '../resources/Utility'
import ActionButton from 'react-native-action-button'
import * as actions from '../actions/ProcessesAndProductsActions'
import * as taskActions from '../actions/TaskListActions'

class CreateTask extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedProcess: {name: "choose", id: -1},
			selectedProduct: {name: "choose", id: -1},
		}
	}

	componentDidMount() {
		this.props.dispatch(actions.fetchProcesses())
		this.props.dispatch(actions.fetchProducts())
	}

	componentWillReceiveProps(np) {
		if (np.hasJustCreatedItem) {
			this.openCreatedTask(np.hasJustCreatedItem)
		}
	}

	render() {
		let {processes, products } = this.props
		let { selectedProduct, selectedProcess } = this.state

		return (
			<View style={styles.container}>
				<Dropdown 
					selectedItem={selectedProcess} 
					data={processes} 
					onSelect={(item) => this.handleSelect('processes', item)} 
				/>
				<Dropdown 
					selectedItem={selectedProduct} 
					data={products} 
					onSelect={(item) => this.handleSelect('products', item)} 
				/>
				{ 
					this.shouldShowNext() ? 
					<ActionButton 
						buttonColor={Colors.base} 
						activeOpacity={0.5} 
						onPress={this.handleCreate.bind(this)} 
						buttonText='>'
					/> :
					null
				}
			</View>
		)
	}

	shouldShowNext() {
		let {selectedProcess, selectedProduct} = this.state
		return (selectedProduct.id !== -1 && selectedProduct.id !== -1)
	}

	handleCreate() {
		let {selectedProduct, selectedProcess} = this.state
		let data = {processType: selectedProcess, productType: selectedProduct}
		this.props.dispatch(taskActions.requestCreateTask(data))
	}

	openCreatedTask(task) {
		this.props.navigator.pop({
		  animated: false,
		});

		this.props.navigator.push({
			screen: 'gelato.Task',
			title: task.display,
			animated: true,
			passProps: {
				id: task.id, 
				name: task.display,
				open: true,
				shouldPopCreateTaskScreen: true,
			}
		});
	}

	handleSelect(type, item) {
		let key = type === 'processes' ? 'selectedProcess' : 'selectedProduct'
		this.setState({[key]: item})
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
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 25,
    paddingBottom: 100,
  },
  autocompleteContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
})

const mapStateToProps = (state, props) => {
	return {
		processes: state.processes.data,
		products: state.products.data,
		hasJustCreatedItem: state.openTasks.ui.hasJustCreatedItem
	}
}

export default connect(mapStateToProps)(CreateTask)