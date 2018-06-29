import React from 'react'
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	ActivityIndicator,
	TouchableWithoutFeedback,
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
			focus: false,
		}
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	render() {
		return (
			<View style={styles.container}>
				{this.renderCell()}
			</View>
		)
	}

	renderCell() {
		const { value, isLoadingTask, type, name, time_format } = this.props
		const { loading } = this.state
		switch (type) {
			case 'BOOL':
				return <BooleanCell
					name={name}
					loading={loading}
					value={value}
					onSubmit={this.handleSubmit}
					isLoadingTask={isLoadingTask}
				/>
			case 'USER':
				return <UserCell
					name={name}
					loading={loading}
					value={value}
					onSubmit={this.handleSubmit}
					isLoadingTask={isLoadingTask}
				/>
      case 'TIME':
          return <DateTimeCell
            name={name}
            loading={loading}
            value={value}
            onSubmit={this.handleSubmit}
            isLoadingTask={isLoadingTask}
            time_format={time_format}
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
		if (value !== this.props.value) {
			this.setState({ loading: true })
			this.props
				.onSubmitEditing(this.props.id, value)
				.finally(() => this.setState({ loading: false }))
		}
	}
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
			color: Colors.lightGray,
			fontSize: 17,
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
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingLeft: 16,
		paddingRight: 16,
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: Colors.white,
	},
})
