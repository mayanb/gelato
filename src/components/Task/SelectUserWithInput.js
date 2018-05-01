import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Text,
	TextInput,
	Dimensions,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Colors from '../../resources/Colors'
import Compute from '../../resources/Compute'
import * as actions from '../../actions/UserListActions'

class SelectUserWithInput extends Component {
	constructor(props) {
		super(props)
		this.state = {
			searchText: props.usernameDisplay,
			filtered_results: [],
		}

		this.handleChangeText = this.handleChangeText.bind(this)
		this.handleKeyboardSubmit = this.handleKeyboardSubmit.bind(this)
	}

	componentDidMount() {
		this.props.dispatch(actions.fetchUsers())
	}

	handleChangeText(text) {
		this.setState({
			searchText: text,
			filtered_results: Compute.searchItems(text, this.props.users).slice(0, 3),
		})
	}

	handleKeyboardSubmit() {
		const { filtered_results } = this.state
		if (filtered_results.length > 0) {
			const username = filtered_results[0].username
			this.props.onSelectUser(username)
		}
		this.props.onCancel()
	}

	render() {
		const { onCancel, onSelectUser } = this.props
		const { searchText } = this.state
		return (
			<View style={styles.container}>
				<EditableCell
					placeholder="search a user"
					onBlur={onCancel}
					onKeyboardSubmit={this.handleKeyboardSubmit}
					onChangeText={this.handleChangeText}
					value={searchText}
				/>
				<KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
					{this.state.filtered_results.map(user => {
						return (
							<NonEditableCell
								key={'user-' + user.id}
								{...user}
								onPress={() => onSelectUser(user.username)}
							/>
						)
					})}
				</KeyboardAwareScrollView>
			</View>
		)
	}
}

function EditableCell({
	placeholder,
	onBlur,
	onKeyboardSubmit,
	onChangeText,
	value,
}) {
	return (
		<View style={styles.cell_container}>
			<TextInput
				style={styles.input}
				autoCapitalize="none"
				autoCorrect={false}
				underlineColorAndroid="transparent"
				returnKeyType="done"
				autoFocus="true"
				placeholder={placeholder}
				onBlur={onBlur}
				onSubmitEditing={onKeyboardSubmit}
				onChangeText={onChangeText}
				value={value}
			/>
		</View>
	)
}

function NonEditableCell({ onPress, first_name, last_name, username_display }) {
	const last_initial = !!last_name ? `${last_name.charAt(0)}.` : ''
	return (
		<TouchableWithoutFeedback activeOpacity={0.5} onPress={onPress}>
			<View style={styles.non_editable_cell_container}>
				<Text style={styles.user_display_text}>
					{first_name} {last_initial} ({username_display})
				</Text>
			</View>
		</TouchableWithoutFeedback>
	)
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
	container: {
		paddingTop: 4,
		backgroundColor: 'white',
		overflow: 'hidden',
	},
	scroll: {
		paddingTop: 20,
		paddingBottom: 40,
		backgroundColor: 'blue',
	},
	cell_container: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 8,
		width: width / 2,
	},
	non_editable_cell_container: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 8,
		width: width / 2,
		borderWidth: 1,
		borderBottomWidth: 0,
		borderColor: 'rgba(0, 0, 0, 0.08)',
	},
	input: {
		height: 40,
		fontSize: 17,
		textAlign: 'right',
		color: Colors.textBlack,
	},
	user_display_text: {
		fontSize: 17,
		color: Colors.textBlack,
		textAlign: 'right',
		paddingLeft: 4,
		paddingRight: 4,
	},
})

const mapStateToProps = state => {
	return {
		users: state.users.data,
	}
}

export default connect(mapStateToProps)(SelectUserWithInput)
