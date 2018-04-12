import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'
import Colors from '../../resources/Colors'
import { formatNumber, formatAmount } from '../../resources/Utility'
import pluralize from 'pluralize'

export default class TaskIngredient extends Component {
	constructor(props) {
		super(props)
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
		const { taskIngredient } = this.props
		const { ingredient, inputs, scaled_amount, actual_amount } = taskIngredient
		const { process_type, product_type } = ingredient
		return (
			<View style={styles.container}>
				<View style={styles.topContainer}>
					<View style={styles.mainContent}>
						<TitleRow process_type={process_type} product_type={product_type} />
						<AmountRow
							actual={actual_amount}
							expected={scaled_amount}
							unit={process_type.unit}
						/>
					</View>
					<EditButton />
				</View>
				<TaskContainer inputs={inputs} />
			</View>
		)
	}
}

function TitleRow({ process_type, product_type }) {
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
	const title = `${process_type.name} ${product_type.name}`
	return (
		<View style={styles.titleRow}>
			<Image source={ImageUtility.requireIcon(process_type.icon)} style={styles.processIcon} />
			<Text style={styles.title}>{title}</Text>
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

function TaskContainer({ inputs }) {
	const styles = StyleSheet.create({
		container: {
			height: 36,
			paddingLeft: 32,
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: Colors.extremelyLightGray,
		},
		taskCountContainer: {
			width: 72,
			flex: 0,
		},
		taskCount: {
			color: Colors.lightGray,
		},
		expandButton: {
			height: 36,
			width: 36,
			justifyContent: 'center',
		},
		arrowIcon: {
			height: 16,
			width: 16,
		},
	})
	const taskCount = `${inputs.length} ${pluralize('task', inputs.length)}`
	return (
		<View style={styles.container}>
			<View style={styles.taskCountContainer}>
				<Text style={styles.taskCount}>{taskCount}</Text>
			</View>
			<TouchableOpacity style={styles.expandButton}>
				<Image source={ImageUtility.requireIcon('downarrow.png')} style={styles.arrowIcon} />
			</TouchableOpacity>
		</View>
	)
}
