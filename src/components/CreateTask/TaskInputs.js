import React, { Component } from 'react'
import { View, Image, StyleSheet, Platform } from "react-native";
import ActionButton from 'react-native-action-button'
import * as ImageUtility from '../../resources/ImageUtility'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Colors from '../../resources/Colors'
import SelectTypes from './SelectTypes'
import SelectBatchSize from './SelectBatchSize'
import pluralize from 'pluralize'

const RM = 'rm'

export default class TaskInputs extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedProcess: null,
			selectedProduct: null,
			isCreatingTask: false,
			batchSize: null,
			cost: '',
		}

		this.handleBatchSizeInput = this.handleBatchSizeInput.bind(this)
		this.handleCostInput = this.handleCostInput.bind(this)
		this.handleSelect = this.handleSelect.bind(this)
		this.handleNext = this.handleNext.bind(this)
	}

	render() {
		let { selectedProduct, selectedProcess } = this.state
		const isIOS = Platform.OS === 'ios'
		const heightOfDropdown = 130
		const extraScrollHeight = isIOS ? 0 : heightOfDropdown
		return (
			<View style={styles.container}>
				<KeyboardAwareScrollView
					enableOnAndroid={true}
					enableAutoAutomaticScroll={isIOS}
					extraScrollHeight={extraScrollHeight}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}>
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
							category={selectedProcess.category}
							onCostAmountInput={this.handleCostInput}
							cost={this.state.cost}
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
		const isCostEntered =
			selectedProcess !== null &&	(selectedProcess.category !== RM || ( selectedProcess.category === RM && this.state.cost !== ''))
		// if(selectedProcess){
		// 	var isCostEntered = this.selectedProcess.category === RM && this.state.cost !== ''
		// } 
		if (this.props.isDandelion && selectedProcess && selectedProcess.name.toLowerCase === "package") {
			return selectedProcess && selectedProduct && !isCreatingTask
		} else {
			return (
				selectedProcess &&
				selectedProduct &&
				!isCreatingTask &&
				isBatchSizeEntered &&
				isCostEntered
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

	handleCostInput(num) {
		this.setState({ cost: num })
	}

	handleNext() {
		// console.log(this.state)
		this.props.onNext(
			this.state.selectedProcess,
			this.state.selectedProduct,
			this.state.batchSize,
			this.state.cost
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

