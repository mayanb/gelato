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
			const usernameDisplay = Compute.getUsernameDisplay(filtered_results[0])
			this.props.onSelectUser(usernameDisplay)
		}
		this.props.onCancel()
	}

	render() {
		const { onCancel, onSelectUser } = this.props
		const { searchText } = this.state
		return (
			<View style={styles.container}>
				<EditableCell
					placeholder="Search for a user"
					onBlur={onCancel}
					onKeyboardSubmit={this.handleKeyboardSubmit}
					onChangeText={this.handleChangeText}
					value={searchText}
				/>
				<View style={styles.dropdown_wrapper}>
					<KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
						{this.state.filtered_results.map(user => {
							return (
								<NonEditableCell
									key={'user-' + user.id}
									user={user}
									onPress={() => onSelectUser(Compute.getUsernameDisplay(user))}
								/>
							)
						})}
					</KeyboardAwareScrollView>
				</View>
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
				autoFocus={true}
				placeholder={placeholder}
				onBlur={onBlur}
				onSubmitEditing={onKeyboardSubmit}
				onChangeText={onChangeText}
				value={value}
			/>
		</View>
	)
}

function NonEditableCell({ onPress, user }) {
	return (
		<TouchableWithoutFeedback activeOpacity={0.5} onPress={onPress}>
			<View style={styles.non_editable_cell_container}>
				<Text style={styles.user_display_text}>
					{Compute.getUsernameDisplay(user)}
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
	cell_container: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 8,
		width: width / 2,
	},
	dropdown_wrapper: {
		borderWidth: 1,
		borderBottomWidth: 0,
		borderColor: 'rgba(0, 0, 0, 0.08)',
	},
	non_editable_cell_container: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 8,
		width: width / 2,
		borderBottomWidth: 1,
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
