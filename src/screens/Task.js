import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	Keyboard,
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
} from 'react-native'
import ActionButton from 'react-native-action-button'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import * as actions from '../actions/TaskListActions'
import { AttributeHeaderCell, BottomTablePadding } from '../components/Cells'
import AttributeCell from '../components/AttributeCell'
import Flag from '../components/Flag'
import * as ImageUtility from '../resources/ImageUtility'
import { DateFormatter } from '../resources/Utility'
import paramsToProps from '../resources/paramsToProps'
import * as errorActions from '../actions/ErrorActions'
import TaskMenu from '../components/TaskMenu'
import FAIcon from 'react-native-vector-icons/FontAwesome'


class Task extends Component {

	constructor(props) {
		super(props)
		this.showCamera = this.showCamera.bind(this)
		this.printTask = this.printTask.bind(this)
	}

	dispatchWithError(f) {
		let { dispatch } = this.props
		return dispatch(f).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}


	showCamera(mode) {
		this.props.navigation.navigate('QRScanner', {
			task_id: this.props.task.id,
			open: this.props.open,
			taskSearch: this.props.taskSearch,
			mode: mode,
			processUnit: this.props.task.process_type.unit,
			onOpenTask: this.handleOpenTask.bind(this),
		})
	}


	printTask() {
		this.props.navigation.navigate('Print', {
			selectedTask: this.props.task,
		})
	}

	handleOpenTask(task) {
		//let x = 'hi'
		this.props.navigation.navigate({
			screen: 'gelato.Task',
			title: task.display,
			animated: true,
			passProps: {
				task: task,
				taskSearch: true,
				id: task.id,
				open: task.is_open,
				title: task.display,
				date: task.created_at,
				imgpath: null,
			},
		})
	}

	componentDidMount() {
		this.props.dispatch(actions.resetJustCreated())
		if (this.props.taskSearch) {
			this.dispatchWithError(actions.fetchTask(this.props.id))
		}
	}

	render() {
		let { task } = this.props
		if (!task) {
			return null
		}
		const isLabel = task.process_type.name.toLowerCase() === 'label'
		let outputButtonName = 'Outputs'
		if (isLabel) {
			outputButtonName = 'Label Items'
		}
		return (
			<TouchableWithoutFeedback
				onPress={() => Keyboard.dismiss()}
				accessible={false}>
				<View style={styles.container}>
					<TaskMenu task={task} />
					{task.is_flagged && <Flag />}
					<KeyboardAwareFlatList
						style={styles.table}
						data={task.organized_attributes}
						renderItem={this.renderRow}
						ListHeaderComponent={() => this.renderHeader(task)}
						ListFooterComponent={<BottomTablePadding />}
					/>
					<ActionButton
						buttonColor={Colors.base}
						activeOpacity={0.5}
						icon={
							<FAIcon name="qrcode" size={24} color="white" />
						}>
						{!isLabel && (
							<ActionButton.Item
								buttonColor={'green'}
								title="Inputs"
								onPress={() => this.showCamera('inputs')}>
								<Image source={ImageUtility.requireIcon('inputs.png')} />
							</ActionButton.Item>
						)}
						<ActionButton.Item
							buttonColor={'blue'}
							title={outputButtonName}
							onPress={() => this.showCamera('items')}>
							<Image source={ImageUtility.requireIcon('outputs.png')} />
						</ActionButton.Item>
					</ActionButton>
				</View>
			</TouchableWithoutFeedback>
		)
	}

	renderRow = ({ item }) => (
		<AttributeCell
			key={item.id}
			id={item.id}
			name={item.name}
			value={item.value.value || ''}
			type={item.datatype}
			onSubmitEditing={this.handleSubmitEditing.bind(this)}
		/>
	)

	handleSubmitEditing(id, newValue) {
		let task = this.props.task
		let attributeIndex = task.organized_attributes.findIndex(e =>
			Compute.equate(e.id, id)
		)
		let currValue = task.organized_attributes[attributeIndex].value
		if (newValue === currValue) {
			return
		}
		return this.dispatchWithError(
			actions.updateAttribute(task, id, newValue, this.props.taskSearch)
		)
	}

	renderHeader = task => {
		let imgpath = this.props.imgpath
			? this.props.imgpath
			: task.process_type.icon
		let date = this.props.taskSearch
			? DateFormatter.shorten(this.props.date)
			: this.props.date
		let outputAmount = task.items.reduce((total, current) => {
			return total + parseFloat(current.amount)
		}, 0)
		return (
			<AttributeHeaderCell
				name={Compute.getReadableTaskDescriptor(task)}
				imgpath={imgpath}
				date={date}
				type="Top"
				outputAmount={outputAmount}
				outputUnit={task.process_type.unit}
			/>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.bluishGray,
		display: 'flex',
		height: '100%',
	},
})

const mapStateToProps = (state, props) => {
	let { taskSearch, open } = props
	let arr = state.searchedTasks.data
	if (!taskSearch && open) {
		arr = state.openTasks.data
	} else if (!taskSearch) {
		arr = state.completedTasks.data
	}

	return {
		task: arr.find(e => Compute.equate(e.id, props.id)),
	}
}

export default paramsToProps(connect(mapStateToProps)(Task))
