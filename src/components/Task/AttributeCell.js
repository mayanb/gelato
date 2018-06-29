import React from 'react'
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	ActivityIndicator,
} from 'react-native'
import {
	TEXT,
	NUMB,
	TIME,
	BOOL,
	USER,
} from '../../resources/AttributeTypeConstants'
import Colors from '../../resources/Colors'
import { fieldIsBlank } from '../../resources/Utility'
import TextNumberCell from './TextNumberCell'
import BooleanCell from './BooleanCell'
import UserCell from './UserCell'
import DateTimeCell from './DateTimeCell'
import RecurrentAttribute from './RecurrentAttribute'
import { _task } from "../../reducers/TaskReducerExtension";

export default class AttributeCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			focus: false,
		}
		this.handleSubmit = this.handleSubmit.bind(this)
	}


	render() {
		const { isLoadingTask, attribute } = this.props
		const { is_recurrent, values, name, datatype } = attribute
		const { loading } = this.state
		if (is_recurrent) {
			return <RecurrentAttribute
				name={name}
				loading={loading}
				onSubmit={this.handleSubmit}
				isLoadingTask={isLoadingTask}

				values={values}
				onSubmit={this.handleSubmit}
				type={datatype}
			/>
		}
		return (
			<View style={styles.container}>
				{this.renderCell()}
			</View>
		)
	}

	renderCell() {
		const { isLoadingTask, attribute } = this.props
		const { values, datatype, name } = attribute
		const { loading } = this.state
		const value = values.length === 0 ? '' : values[0].value
		switch (datatype) {
			case BOOL:
				return <BooleanCell
					name={name}
					loading={loading}
					value={value}
					onSubmit={this.handleSubmit}
					isLoadingTask={isLoadingTask}
				/>
			case USER:
				return <UserCell
					name={name}
					loading={loading}
					value={value}
					onSubmit={this.handleSubmit}
					isLoadingTask={isLoadingTask}
				/>
      case TIME:
          return <DateTimeCell
            name={name}
            loading={loading}
            value={value}
            onSubmit={this.handleSubmit}
            isLoadingTask={isLoadingTask}
          />
			default:
				return <TextNumberCell
					name={name}
					loading={loading}
					value={value}
					onSubmit={this.handleSubmit}
					type={datatype}
					isLoadingTask={isLoadingTask}
				/>
		}
	}

	handleSubmit(value, taskAttributeToPatch /* undefined for PUTs */) {
		const { attribute } = this.props
		const { is_recurrent, id, datatype } = attribute
		let _taskAttributeToPatch = taskAttributeToPatch
		// Non-recurring attributes should update the most recent (displayed) value
		if (!is_recurrent && !taskAttributeToPatch) {
			_taskAttributeToPatch = attribute.values[0]
		}
		if (this.state.loading || valueUnchanged(_taskAttributeToPatch, value, datatype === BOOL)) {
			return
		}
		this.setState({ loading: true })
		this.props
			.onSubmitEditing(id, value, _taskAttributeToPatch)
			.finally(() => this.setState({ loading: false }))
	}
}

function valueUnchanged(taskAttribute, value, isBool) {
	// Booleans use 'Yes'/'' for True/False. So for Boolean value === '', we just assume it's changed.
	if (isBool && value !== 'Yes') {
		return false
	}
	const stillBlank = taskAttribute && fieldIsBlank(taskAttribute.value) && fieldIsBlank(value)
	const yetToBeCreated = !taskAttribute && fieldIsBlank(value)
	return stillBlank || yetToBeCreated
}

export function AttributeName({ name, loading }) {
	const styles = StyleSheet.create({
		nameContainer: {
			flex: 1,
			display: 'flex',
			alignItems: 'center',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			minHeight: 60,
		},
		name: {
			fontWeight: 'bold',
			fontSize: 17,
			color: Colors.textBlack,
			marginRight: 20,
			textAlignVertical: 'top',
		},
	})
	const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
	return (
		<View style={styles.nameContainer}>
			<Text style={styles.name}>{formattedName}</Text>
			{loading && <ActivityIndicator size="small" color={Colors.base} />}
		</View>
	)
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
	container: {
		width: width,
		minHeight: 60,
		borderBottomWidth: 1,
		borderBottomColor: Colors.ultraLightGray,
		marginBottom: 8,
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingLeft: 16,
		paddingRight: 16,
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: Colors.white,
	},
})
