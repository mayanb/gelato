import React, { Component } from 'react'
import {
	AlertIOS,
	Text,
	TouchableOpacity,
	View,
	Image,
	StyleSheet,
	FlatList
} from 'react-native'
import { connect } from 'react-redux'
import * as ImageUtility from '../resources/ImageUtility'
import Colors from '../resources/Colors'
import Modal from '../components/Modal'
import pluralize from 'pluralize'
import * as actions from "../actions/ProcessesAndProductsActions"

class InputItemListModalUnconnected extends Component {
	componentDidMount() {
		this.props.dispatch(actions.fetchProcesses())
	}

	render() {
		return (
			<Modal onPress={this.props.onCloseModal}>
				<FlatList
					renderItem={this.renderRow.bind(this)}
					data={this.props.items}
					ListHeaderComponent={() => header(this.props.items, 'inputs', this.props.processUnit)}
					keyExtractor={this.keyExtractor}
				/>
			</Modal>
		)
	}

	renderRow({item, index}) {
		const process = this.props.processHash[item.input_task_n.process_type]
		const processIconPath = process ? process.icon : ''
		return <QRItemListRow
			qr={item['input_qr']}
			task_display={item.input_task_display}
			imgpath={processIconPath}
			onRemove={() => this.props.onRemove(index)}
			onOpenTask={() => this.props.onOpenTask(item.input_task_n)}
		/>
	}

	keyExtractor = (item, index) => item.id;
}

const mapStateToProps = (state, props) => {
	return {
		processHash: state.processes.data.reduce((map, obj) => {
			map[obj.id] = obj
			return map
		}, {})
	}
}

export const InputItemListModal = connect(mapStateToProps)(InputItemListModalUnconnected)

export class OutputItemListModal extends Component {
	render() {
		return (
			<Modal onPress={this.props.onCloseModal}>
				<FlatList
					renderItem={this.renderRow.bind(this)}
					data={this.props.items}
					ListHeaderComponent={() => header(this.props.items, 'outputs', this.props.processUnit)}
					keyExtractor={this.keyExtractor}
				/>
			</Modal>
		)
	}

	renderRow({item, index}) {
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
	const totalAmount = items.reduce(function(total, current) {
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
		let {task_display, qr, itemAmount} = this.props
		let {index} = this.props
		let styles = StyleSheet.create({
			container: {
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				minHeight: 55,
				paddingLeft: 20,
				paddingRight: 15,
				paddingTop: 8,
				paddingBottom: 8,
				flexDirection: 'row',
				display: 'flex',
				justifyContent: 'space-between'
			},
			itemContainer: {
				display: 'flex',
				flexDirection: 'row',
				flex: 1
			},
			infoContainer: {
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
			},
			shortQr: {
				fontSize: 14,
				color: Colors.lightGrayText,
				paddingBottom: 4
			},
			img : {
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
					<Image source={ImageUtility.requireIcon('qricon.png')} style={styles.img} />
					<View style={styles.infoContainer}>
						<Text style={styles.shortQr}>{qr.substring(qr.length - 6)}</Text>
						<View>
							{
								!!this.props.task_display && InputInfo(this.props.imgpath, this.props.task_display)
							}
							{
								!!this.props.itemAmount && OutputInfo(this.props.itemAmount)
							}
						</View>
					</View>
				</TouchableOpacity>
				{RemoveButton(this.confirmRemove.bind(this))}
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

function InputInfo(imgpath, taskName) {
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
			<Image
				source={imgpath ? ImageUtility.requireIcon(imgpath) : ''}
				style={styles.img}
			/>
			<Text style={styles.text}>{taskName}</Text>
		</View>
	)
}

function OutputInfo(outputAmount) {
	return (
		<Text
			style={{
				fontSize: 12,
				color: Colors.lightGrayText
			}}
		>
		{`${outputAmount}`}
		</Text>
	)
}

function RemoveButton(onPress) {
	return (
		<TouchableOpacity onPress={onPress}>
			<Text
				style={{
					fontSize: 12,
					color: Colors.darkRed
				}}
			>
				Remove
			</Text>
		</TouchableOpacity>
	)
}