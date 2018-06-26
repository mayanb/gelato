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
		const { values, isLoadingTask, type, name, is_recurrent } = this.props
		const { loading } = this.state
		console.log('In swithc: is_recurrent', is_recurrent)
		if (is_recurrent) {
			return <RecurrentAttribute
				name={name}
				loading={loading}
				onSubmit={this.handleSubmit}
				isLoadingTask={isLoadingTask}

				values={values}
				onSave={this.handleSubmit}
				type={type}
			/>
		}
		return (
			<View style={styles.container}>
				{this.renderCell()}
			</View>
		)
	}

	renderCell() {
		const { values, isLoadingTask, type, name } = this.props
		const { loading } = this.state
		const value = values.length === 0 ? '' : values[0].value
		switch (type) {
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
					type={type}
					isLoadingTask={isLoadingTask}
				/>
		}
	}

	handleSubmit(value) {
		const { attribute } = this.props
		const { is_recurrent } = attribute
		// For future: if we're editing EXISTING recurring values, assume we're creating a new one (which null currently signals)
		const newestTaskAttribute = is_recurrent ? null : attribute.values[0]
		if (this.state.loading || valueUnchanged(newestTaskAttribute, value)) {
			return
		}
		this.setState({ loading: true })
		this.props
			.onSubmitEditing(this.props.id, value, newestTaskAttribute)
			.finally(() => this.setState({ loading: false }))
	}
}

function valueUnchanged(taskAttribute, value) {
	const stillBlank = taskAttribute && fieldIsBlank(taskAttribute.value) && fieldIsBlank(value)
	return stillBlank || (taskAttribute && taskAttribute.value === value)
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
