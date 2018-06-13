import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import Prompt from 'rn-prompt'
import * as ImageUtility from '../../resources/ImageUtility'
import Colors from '../../resources/Colors'
import { formatNumber, formatAmount } from '../../resources/Utility'
import pluralize from 'pluralize'
import InputsContainer from './InputsContainer'

export default class TaskIngredient extends Component {
	constructor(props) {
		super(props)

		this.state = { showEditPrompt: false }

		this.showEditPrompt = this.showEditPrompt.bind(this)
	}

	showEditPrompt() {
		this.setState({ showEditPrompt: true })
	}

	renderEditPrompt() {
		const { taskIngredient } = this.props
		const ingredient = taskIngredient.ingredient
		const formattedAmount = String(Number(taskIngredient.actual_amount))
		const units = `${pluralize(ingredient.process_type.unit)} of ${ingredientName(ingredient)}`
		return (
			<Prompt
				title={`Enter amount used (${units})`}
				placeholder="Amount used"
				defaultValue={formattedAmount}
				visible={this.state.showEditPrompt}
				onCancel={() => this.setState({ showEditPrompt: false })}
				onSubmit={amount => {
					this.setState({ showEditPrompt: false })
					this.props.onEditAmount(taskIngredient.id, amount)
				}}
			/>
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
		const { taskIngredient, onRemoveInput, onOpenTask, hasRecipe } = this.props
		const { ingredient, inputs, scaled_amount, actual_amount } = taskIngredient
		const { process_type } = ingredient
		return (
			<View style={styles.container}>
				<View style={styles.topContainer}>
					<View style={styles.mainContent}>
						<TitleRow ingredient={ingredient} hasRecipe={hasRecipe} />
						<AmountRow
							actual={actual_amount}
							expected={scaled_amount}
							unit={process_type.unit}
							onEdit={this.showEditPrompt}
						/>
					</View>
					<EditButton onEdit={this.showEditPrompt} />
				</View>
				<InputsContainer inputs={inputs} onRemove={onRemoveInput} onOpenTask={onOpenTask} />
				{this.renderEditPrompt()}
			</View>
		)
	}
}

function ingredientName(ingredient) {
	const { process_type, product_type } = ingredient
	return `${process_type.name} ${product_type.name}`
}

function TitleRow({ ingredient, hasRecipe }) {
	const styles = StyleSheet.create({
		titleRow: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingBottom: 8,
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
		},
		notInRecipe: {
			fontSize: 14,
			color: Colors.lightGray,
			marginLeft: 4,
		},
	})
	return (
		<View style={styles.titleRow}>
			<Image source={ImageUtility.requireIcon(ingredient.process_type.icon)} style={styles.processIcon} />
			<Text style={styles.title}>{ingredientName(ingredient)}</Text>
			{(hasRecipe && !ingredient.recipe_id) && (
				<Text style={styles.notInRecipe}>(not in recipe)</Text>
			)}
		</View>
	)
}

function AmountRow({ actual, expected, unit, onEdit }) {
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
			<TouchableOpacity onPress={onEdit}>
				<Text style={styles.actualAmount}>{formatAmount(actual, unit)}</Text>
			</TouchableOpacity>
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


