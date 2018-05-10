import React from 'react'
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	ActivityIndicator,
} from 'react-native'
import Colors from '../../resources/Colors'
import TextNumberCell from './TextNumberCell'
import BooleanCell from './BooleanCell'
import UserCell from './UserCell'
import DateTimeCell from './DateTimeCell'

export default class AttributeCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
		}
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	render() {
		const { value, isLoadingTask, type } = this.props
		const { loading } = this.state
		let name = this.props.name
		const formattedName =
			name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
		return (
			<View style={styles.container}>
				<AttributeName name={formattedName} loading={loading} />
				<AttributeValue
					value={value}
					handleSubmit={this.handleSubmit}
					isLoadingTask={isLoadingTask}
					type={type}
				/>
			</View>
		)
	}

	handleSubmit(value) {
		if (value !== this.props.value) {
			this.setState({ loading: true })
			this.props
				.onSubmitEditing(this.props.id, value)
				.finally(() => this.setState({ loading: false }))
		}
	}
}

function AttributeName({ name, loading }) {
	return (
		<View style={styles.nameContainer}>
			<Text style={styles.name}>{name}</Text>
			{loading && <ActivityIndicator size="small" color={Colors.base} />}
		</View>
	)
}

function AttributeValue({ value, handleSubmit, isLoadingTask, type }) {
	switch (type) {
		case 'BOOL':
			return (
				<BooleanCell
					value={value}
					onSubmit={handleSubmit}
					isLoadingTask={isLoadingTask}
				/>
			)
		case 'USER':
			return (
				<UserCell
					value={value}
					onSubmit={handleSubmit}
					isLoadingTask={isLoadingTask}
				/>
			)
		case 'TIME':
			return (
				<DateTimeCell
					value={value}
					onSubmit={handleSubmit}
					isLoadingTask={isLoadingTask}
				/>
			)
		default:
			return (
				<TextNumberCell
					value={value}
					onSubmit={handleSubmit}
					type={type}
					isLoadingTask={isLoadingTask}
				/>
			)
	}
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
	container: {
		width: width,
		minHeight: 60,
		borderBottomWidth: 1,
		borderBottomColor: Colors.ultraLightGray,
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingLeft: 16,
		paddingRight: 16,
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: Colors.white,
	},
	nameContainer: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		minHeight: 60,
	},
	name: {
		color: Colors.lightGray,
		fontSize: 17,
		marginRight: 20,
		textAlignVertical: 'top',
	},
})
