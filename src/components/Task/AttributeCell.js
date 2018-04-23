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

export default class AttributeCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
		}
	}

	render() {
		let { name } = this.props
		name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
		return (
			<View style={styles.container}>
				<View style={styles.nameContainer}>
					<Text style={styles.name}>{name}</Text>
					{this.state.loading && <ActivityIndicator size="small" color={Colors.base} />}
				</View>
				{this.renderValue()}
			</View>
		)
	}

	renderValue() {
		if (this.props.type === 'BOOL') {
			return (
				<BooleanCell
					value={this.props.value}
					onSubmit={this.handleSubmit.bind(this)}
					isLoadingTask={this.props.isLoadingTask}
				/>
			)
		} else {
			return (
				<TextNumberCell
					value={this.props.value}
					onSubmit={this.handleSubmit.bind(this)}
					type={this.props.type}
					isLoadingTask={this.props.isLoadingTask}
				/>
			)
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

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
	container: {
		width: width,
		minHeight: 60,
		borderBottomWidth: 1,
		borderBottomColor: Colors.ultraLightGray,
		alignItems: 'center',
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
	},
	name: {
		color: Colors.lightGray,
		fontSize: 17,
		marginRight: 20,
	},
})
