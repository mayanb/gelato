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
					ListHeaderComponent={() => inputHeader(this.props.items, 'inputs', this.props.processUnit)}
					keyExtractor={this.keyExtractor}
				/>
			</Modal>
		)
	}

	renderRow({item, index}) {
		const process = this.props.processHash[item.input_task_n.process_type]
		const processIconPath = process ? process.icon : ''
		let itemAmount = parseFloat(item.amount) + " " + pluralize(this.props.processUnit, item.amount)

		return <QRItemListRow
			qr={item['input_qr']}
			task_display={item.input_task_display}
			imgpath={processIconPath}
			onRemove={() => this.props.onRemove(index)}
			onOpenTask={() => this.props.onOpenTask(item.input_task_n)}
			itemAmount={itemAmount}
		/>
	}

	keyExtractor = (item, index) => String(item.id)
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

function inputHeader(items, typeName, unit) {
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
	return (
		<View style={styles.container}>
			<Text style={styles.text}>
				{`${count} ${pluralize(typeName, count)}`}
			</Text>
		</View>
	)
}

class QRItemListRow extends Component {
	render() {
		let {task_display, qr, itemAmount, imgpath} = this.props
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
				display: 'flex',
				justifyContent: 'space-between',
			},
			topRow: {
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				flex: 1,
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
					<View style={styles.topRow}>
						<View style={styles.infoContainer}>
							<Image source={ImageUtility.requireIcon('qricon.png')} style={styles.img} />
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

function TaskInfo({imgpath, taskName}) {
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

function InputAmount({amount}) {
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
		<TouchableOpacity onPress={onPress} style={{alignSelf: 'flex-start'}}>
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