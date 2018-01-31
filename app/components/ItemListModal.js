import React, { Component } from 'react'
import {
	AlertIOS,
	Button,
	Text,
	TouchableOpacity,
	View,
	Image,
	StyleSheet,
	FlatList
} from 'react-native'
import * as ImageUtility from '../resources/ImageUtility'
import Colors from '../resources/Colors'
import Modal from '../components/Modal'
import pluralize from 'pluralize'

class ItemListModal extends Component {

	render() {
		let { mode, task } = this.props
		let item_array = task[mode] || []
		return (
			<Modal onToggle={this.onToggleItemList}>
				<FlatList
					renderItem={this.props.mode === 'inputs' ?
						this.renderInputItemListRow.bind(this) :
						this.renderOutputItemListRow.bind(this)}
					data={item_array}
					keyExtractor={this.keyExtractor}
				/>
			</Modal>
		)
	}

	renderInputItemListRow({item, index}) {
		return <QRItemListRow
			qr={item['input_qr']}
			task_display={item.input_task_display}
			onRemove={() => this.props.onRemoveInput(index)}
			onOpenTask={() => this.props.onOpenTask(item.input_task_n)}
		/>
	}

	renderOutputItemListRow({item, index}) {
		let itemAmount = parseInt(item.amount) + " " + pluralize(this.props.processUnit, item.amount)
		return <QRItemListRow
			qr={item['item_qr']}
			task_display={item.input_task_display}
			onRemove={() => this.props.onRemoveOutput(index)}
			itemAmount={itemAmount}
		/>
	}

	keyExtractor = (item, index) => item.id;
}

export class QRItemListRow extends Component {
	render() {
		let {task_display, qr, itemAmount} = this.props
		let {index} = this.props
		let styles = StyleSheet.create({
			container: {
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				padding: 8,
				flexDirection: 'row',
				display: 'flex',
				justifyContent: 'space-between'
			}, textContainer: {
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
			}, img : {
				height: 16,
				width: 16,
				marginRight: 8,
			}, subTitleText: {
				color: Colors.lightGray,
			}
		})
		return (
			<View style={styles.container}>
				<TouchableOpacity
					onPress={() => this.props.onOpenTask()}
					disabled={!this.props.onOpenTask}
				>
					<Image source={ImageUtility.requireIcon('qr_icon')} style={styles.img} />
					<View style={styles.textContainer}>
						<Text>{qr.substring(qr.length - 6)}</Text>
						<Text style={styles.subTitleText}>{task_display}</Text>
						<Text style={styles.subTitleText}>{itemAmount}</Text>
					</View>
				</TouchableOpacity>
				<Button title="Remove" onPress={this.confirmRemove.bind(this)} />
			</View>
		)
	}

	confirmRemove() {
		AlertIOS.alert(
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

export default ItemListModal