import React, { Component } from 'react'
import {
	Alert,
	Text,
	TouchableOpacity,
	View,
	Image,
	StyleSheet,
	FlatList,
} from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'
import Colors from '../../resources/Colors'
import { FlagPill, AncestorFlagPill } from '../Flag'
import pluralize from 'pluralize'

export default class OutputItemListModal extends Component {
	render() {
		return (
			<FlatList
				renderItem={this.renderRow.bind(this)}
				data={this.props.items}
				ListHeaderComponent={() => header(this.props.items, 'outputs', this.props.processUnit)}
				keyExtractor={this.keyExtractor}
			/>
		)
	}

	renderRow({ item, index }) {
		let itemAmount = parseFloat(item.amount) + " " + pluralize(this.props.processUnit, item.amount)
		return <QRItemListRow
			qr={item['item_qr']}
			onRemove={() => this.props.onRemove(index)}
			itemAmount={itemAmount}
		/>
	}

	keyExtractor = (item, index) => item.id;
}

function header(items, typeName, unit) {
	let styles = StyleSheet.create({
		container: {
			height: 50,
			borderBottomWidth: 1,
			borderBottomColor: Colors.ultraLightGray,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			paddingLeft: 20,
			paddingRight: 16,
		},
		text: {
			fontSize: 14,
			color: Colors.lightGrayText
		}
	})
	const count = items.length
	const totalAmount = items.reduce(function (total, current) {
		return total + parseFloat(current.amount)
	}, 0)

	return (
		<View style={styles.container}>
			<Text style={styles.text}>
				{`${count} ${pluralize(typeName, count)} (${totalAmount} ${pluralize(unit, totalAmount)})`}
			</Text>
		</View>
	)
}

class QRItemListRow extends Component {
	render() {
		let { task_display, qr, itemAmount, imgpath, isFlagged, isAncestorFlagged } = this.props
		let { index } = this.props
		let styles = StyleSheet.create({
			container: {
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				minHeight: 55,
				paddingLeft: 20,
				paddingRight: 15,
				paddingTop: 8,
				paddingBottom: 8,
				display: 'flex',
				justifyContent: 'space-between',
			},
			topRow: {
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				flex: 1,
				marginBottom: 4,
				alignItems: 'center',
			},
			infoContainer: {
				display: 'flex',
				flexDirection: 'row',
			},
			bottomRow: {
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				flex: 1,
				marginLeft: 20,
			},
			shortQr: {
				marginLeft: 4,
				fontSize: 14,
				color: Colors.lightGrayText,
				paddingBottom: 4,
				lineHeight: 18,
			},
			img: {
				height: 16,
				width: 16,
				marginRight: 8,
			},
		})
		return (
			<View style={styles.container}>
				<TouchableOpacity
					onPress={() => this.props.onOpenTask()}
					disabled={!this.props.onOpenTask}
					style={styles.itemContainer}
				>
					<View style={styles.topRow}>
						<View style={styles.infoContainer}>
							<Image source={ImageUtility.requireIcon('qricon.png')} style={styles.img} />
							{isFlagged && <FlagPill />}
							{!isFlagged && isAncestorFlagged && <AncestorFlagPill />}
							<Text style={styles.shortQr}>{qr.substring(qr.length - 6)}</Text>
						</View>
						<RemoveButton onPress={this.confirmRemove.bind(this)} />
					</View>
					<View style={styles.bottomRow}>
						<TaskInfo imgpath={imgpath} taskName={task_display} />
						<InputAmount amount={itemAmount} />
					</View>
				</TouchableOpacity>
			</View>
		)
	}

	confirmRemove() {
		Alert.alert(
			'Are you sure you want to remove this item?',
			'',
			[
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{
					text: 'Remove',
					onPress: this.props.onRemove
				}
			]
		)
	}
}

function TaskInfo({ imgpath, taskName }) {
	const styles = StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'row'
		},
		img: {
			height: 16,
			width: 16,
			marginRight: 4
		},
		text: {
			fontSize: 12,
			color: Colors.lightGrayText
		}
	})
	return (
		<View style={styles.container}>
			{imgpath && <Image
				source={ImageUtility.requireIcon(imgpath)}
				style={styles.img}
			/>}
			<Text style={styles.text}>{taskName}</Text>
		</View>
	)
}

function InputAmount({ amount }) {
	return (
		<Text
			style={{
				fontSize: 12,
				color: Colors.lightGrayText,
			}}
		>
			{`${amount}`}
		</Text>
	)
}

function RemoveButton({ onPress }) {
	return (
		<TouchableOpacity onPress={onPress} style={{ alignSelf: 'flex-start' }}>
			<Text
				style={{
					fontSize: 12,
					color: Colors.red,
				}}
			>
				Remove
			</Text>
		</TouchableOpacity>
	)
}