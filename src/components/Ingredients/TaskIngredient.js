import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, AlertIOS } from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'
import Colors from '../../resources/Colors'
import { formatNumber, formatAmount } from '../../resources/Utility'
import pluralize from 'pluralize'
import InputsContainer from './InputsContainer'

export default class TaskIngredient extends Component {
	constructor(props) {
		super(props)

		this.handleEdit = this.handleEdit.bind(this)
	}


	handleEdit() {
		const ingredient = this.props.taskIngredient.ingredient
		const formattedAmount = String(Number(this.props.taskIngredient.actual_amount))
		const subtitle = `${pluralize(ingredient.process_type.unit)} of ${ingredientName(ingredient)}`
		AlertIOS.prompt(
			'Enter amount used',
			subtitle,
			(amount) => this.props.onEditAmount(this.props.taskIngredient.id, amount),
			'plain-text',
			formattedAmount,
			'numeric',
		)
	}

	render() {
		const styles = StyleSheet.create({
			container: {
				marginBottom: 12,
			},
			topContainer: {
				flexDirection: 'row',
				backgroundColor: Colors.white,
			},
			mainContent: {
				flex: 1,
				paddingTop: 12,
				paddingBottom: 12,
			},
		})
		const { taskIngredient, onRemoveInput, onOpenTask } = this.props
		const { ingredient, inputs, scaled_amount, actual_amount } = taskIngredient
		const { process_type } = ingredient
		return (
			<View style={styles.container}>
				<View style={styles.topContainer}>
					<View style={styles.mainContent}>
						<TitleRow ingredient={ingredient} />
						<AmountRow
							actual={actual_amount}
							expected={scaled_amount}
							unit={process_type.unit}
						/>
					</View>
					<EditButton onEdit={this.handleEdit} />
				</View>
				<InputsContainer inputs={inputs} onRemove={onRemoveInput} onOpenTask={onOpenTask} />
			</View>
		)
	}
}

function ingredientName(ingredient) {
	const { process_type, product_type } = ingredient
	return `${process_type.name} ${product_type.name}`
}

function TitleRow({ ingredient }) {
	const styles = StyleSheet.create({
		titleRow: {
			flexDirection: 'row',
		},
		processIcon: {
			height: 16,
			width: 16,
			marginLeft: 8,
			marginRight: 8,
		},
		title: {
			fontSize: 17,
			fontWeight: 'bold',
			paddingBottom: 8,
		},
	})
	return (
		<View style={styles.titleRow}>
			<Image source={ImageUtility.requireIcon(ingredient.process_type.icon)} style={styles.processIcon} />
			<Text style={styles.title}>{ingredientName(ingredient)}</Text>
		</View>
	)
}

function AmountRow({ actual, expected, unit }) {
	const styles = StyleSheet.create({
		container: {
			flexDirection: 'row',
			paddingLeft: 32,
			alignItems: 'center',
		},
		actualAmount: {
			fontSize: 17,
		},
		expectedAmount: {
			fontSize: 14,
			color: Colors.red,
		},
	})
	const expectedText = actual !== expected ? ` (expected ${formatNumber(expected)})` : ''
	return (
		<View style={styles.container}>
			<Text style={styles.actualAmount}>{formatAmount(actual, unit)}</Text>
			<Text style={styles.expectedAmount}>{expectedText}</Text>
		</View>
	)
}

function EditButton({ onEdit }) {
	const styles = StyleSheet.create({
		container: {
			width: 52,
			flex: 0,
			justifyContent: 'center',
			alignItems: 'center',
		},
		icon: {
			height: 12,
			width: 12,
		},
	})
	return (
		<TouchableOpacity style={styles.container} onPress={onEdit}>
			<Image style={styles.icon} source={ImageUtility.uxIcon('edit')} />
		</TouchableOpacity>
	)
}


