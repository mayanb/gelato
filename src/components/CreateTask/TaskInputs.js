import React, { Component } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'
import * as ImageUtility from '../../resources/ImageUtility'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Colors from '../../resources/Colors'
import SelectTypes from './SelectTypes'
import SelectBatchSize from './SelectBatchSize'
import pluralize from 'pluralize'

class TaskInputs extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedProcess: { name: 'Select a process type', id: -1 },
			selectedProduct: { name: 'Select a product type', id: -1 },
			isCreatingTask: false,
			batchSize: null,
		}

		this.handleBatchSizeInput = this.handleBatchSizeInput.bind(this)
		this.handleNext = this.handleNext.bind(this)
		this.handleSelect = this.handleSelect.bind(this)
	}

	render() {
		let { selectedProduct, selectedProcess } = this.state
		return (
			<View style={styles.container}>
				<KeyboardAwareScrollView style={styles.scroll} extraScrollHeight={20}>
					<SelectTypes
						selectedProcess={selectedProcess}
						selectedProduct={selectedProduct}
						onSelect={this.handleSelect}
					/>
					{this.shouldShowBatchSize() && (
						<SelectBatchSize
							onBatchSizeInput={this.handleBatchSizeInput}
							unit={pluralize(selectedProcess.unit)}
							batchSize={this.state.batchSize}
						/>
					)}
				</KeyboardAwareScrollView>
				{this.shouldShowNext() && (
					<ActionButton
						buttonColor={Colors.base}
						activeOpacity={0.5}
						onPress={this.handleNext}
						buttonText=">"
						renderIcon={() => (
							<Image source={ImageUtility.requireIcon('rightarrow.png')} />
						)}
					/>
				)}
			</View>
		)
	}

	shouldShowBatchSize() {
		let { selectedProcess, selectedProduct, isCreatingTask } = this.state
		if (
			selectedProcess.id !== -1 &&
			selectedProduct.id !== -1 &&
			!isCreatingTask &&
			!this.props.isDandelion
		) {
			return true
		} else {
			return false
		}
	}

	shouldShowNext() {
		let { selectedProcess, selectedProduct, isCreatingTask } = this.state
		const isBatchSizeEntered =
			this.state.batchSize !== null && this.state.batchSize !== ''
		if(this.props.isDandelion) {
			return(
				selectedProcess.id !== -1 &&
				selectedProduct.id !== -1 &&
				!isCreatingTask
			)
		} else {
			return (
			selectedProcess.id !== -1 &&
			selectedProduct.id !== -1 &&
			!isCreatingTask &&
			isBatchSizeEntered
			)
		}
	}

	handleSelect(type, item) {
		const key = type === 'processes' ? 'selectedProcess' : 'selectedProduct'
		if (key === 'selectedProcess') {
			this.setState({ batchSize: parseFloat(item.default_amount) })
		}
		this.setState({ [key]: item })
	}

	handleBatchSizeInput(num) {
		this.setState({ batchSize: num })
	}

	handleNext() {
		this.props.onNext(
			this.state.selectedProcess,
			this.state.selectedProduct,
			this.state.batchSize
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F8F8F8',
		flex: 1,
		paddingLeft: 16,
		paddingRight: 16,
	},
	scroll: {
		paddingTop: 20,
		paddingBottom: 40,
		position: 'relative',
		flex: 1,
	},
	dropdownContainer: {
		marginTop: 20,
	},
})

const mapStateToProps = (state /*, props */) => {
	return {
		hasJustCreatedItem: state.openTasks.ui.hasJustCreatedItem,
	}
}

export default connect(mapStateToProps)(TaskInputs)
