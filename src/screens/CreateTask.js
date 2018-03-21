import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'

import Colors from '../resources/Colors'
import { Dropdown } from '../components/Dropdown'
import * as actions from '../actions/ProcessesAndProductsActions'
import * as errorActions from '../actions/ErrorActions'
import * as taskActions from '../actions/TaskListActions'
import * as ImageUtility from '../resources/ImageUtility'
import paramsToProps from '../resources/paramsToProps'
import { DateFormatter } from '../resources/Utility'
import Compute from '../resources/Compute'

class CreateTask extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedProcess: { name: 'Choose a process', id: -1 },
			selectedProduct: { name: 'Choose a product', id: -1 },
			isCreatingTask: false
		}
	}

	componentDidMount() {
		let { dispatch } = this.props
		dispatch(actions.fetchProcesses()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
		dispatch(actions.fetchProducts()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	componentWillReceiveProps(np) {
		if (np.hasJustCreatedItem) {
			this.openCreatedTask(np.hasJustCreatedItem)
		}
	}

	render() {
		let { processes, products } = this.props
		let { selectedProduct, selectedProcess } = this.state
		return (
			<View style={styles.container} testID="create-task-screen">
				<ScrollView style={styles.scroll}>
					<Text style={styles.title}>I want to...</Text>
					<Dropdown
						selectedItem={selectedProcess}
						data={processes}
						onSelect={item => this.handleSelect('processes', item)}
						style={styles.dropdown}
						testID="CTS-process-dropdown"
					/>
					<Text style={styles.title}>{"I'm working with..."}</Text>
					<Dropdown
						selectedItem={selectedProduct}
						data={products}
						onSelect={item => this.handleSelect('products', item)}
					/>
				</ScrollView>
				{this.shouldShowNext() && (
					<ActionButton
						buttonColor={Colors.base}
						activeOpacity={0.5}
						onPress={this.handleCreate.bind(this)}
						buttonText=">"
						icon={<Image source={ImageUtility.requireIcon('rightarrow.png')} 
						testID="CTS-confirm" />}
					/>
				)}
			</View>
		)
	}

	shouldShowNext() {
		let { selectedProcess, selectedProduct, isCreatingTask } = this.state
		return (
			selectedProcess.id !== -1 && selectedProduct.id !== -1 && !isCreatingTask
		)
	}

	handleCreate() {
		let { dispatch } = this.props
		let { selectedProduct, selectedProcess } = this.state
		let data = { processType: selectedProcess, productType: selectedProduct }
		this.setState({ isCreatingTask: true })
		dispatch(taskActions.requestCreateTask(data)).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
			this.setState({ isCreatingTask: false })
		})
	}

	openCreatedTask(task) {
		this.props.navigation.goBack()

		this.props.navigation.navigate('Task', {
			id: task.id,
			name: task.display,
			open: true,
			task: task,
			date: DateFormatter.shorten(task.created_at),
			taskSearch: false,
			title: task.display,
		})
	}

	handleSelect(type, item) {
		let key = type === 'processes' ? 'selectedProcess' : 'selectedProduct'
		this.setState({ [key]: item })
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F8F8F8',
		flex: 1,
		paddingTop: 25,
	},
	scroll: {
		// height: height
	},
	autocompleteContainer: {
		marginLeft: 10,
		marginRight: 10,
	},
	title: {
		fontSize: 17,
		marginLeft: 16,
		color: Colors.textblack,
		opacity: 0.9,
		marginBottom: 10,
		marginTop: 50,
	},
	dropdown: {
		padding: 30,
	},
})

const mapStateToProps = (state /*, props */) => {
	return {
		processes: state.processes.data,
		products: state.products.data,
		hasJustCreatedItem: state.openTasks.ui.hasJustCreatedItem,
	}
}

export default paramsToProps(connect(mapStateToProps)(CreateTask))
