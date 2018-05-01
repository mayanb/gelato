import React, { Component } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import ActionButton from 'react-native-action-button'
import * as ImageUtility from '../../resources/ImageUtility'

import Colors from '../../resources/Colors'
import SelectTypes from './SelectTypes'
import SelectBatchSize from './SelectBatchSize'
import pluralize from 'pluralize'

export default class TaskInputs extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedProcess: null,
			selectedProduct: null,
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
		if(this.props.isDandelion) {
			return(
				selectedProcess &&
				selectedProduct &&
				!isCreatingTask &&
				selectedProcess.name.toLowerCase() !== "package"

			)
		} else {
			return (
				selectedProcess &&
				selectedProduct &&
				!isCreatingTask
			)
		}
		
	}

	shouldShowNext() {
		let { selectedProcess, selectedProduct, isCreatingTask } = this.state
		const isBatchSizeEntered =
			this.state.batchSize !== null && this.state.batchSize !== ''
		if (this.props.isDandelion && selectedProcess && selectedProcess.name.toLowerCase === "package") {
			return selectedProcess && selectedProduct && !isCreatingTask
		} else {
			return (
				selectedProcess &&
				selectedProduct &&
				!isCreatingTask &&
				isBatchSizeEntered
			)
		}

	}

	handleSelect(type, item) {
		const key = type === 'processes' ? 'selectedProcess' : 'selectedProduct'
		if (key === 'selectedProcess' && item) {
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
})

