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
			searchText: props.initialVaue,
			filtered_results: [],
		}

		this.handleChangeText = this.handleChangeText.bind(this)
	}

	componentDidMount() {
		this.props.dispatch(actions.fetchUsers())
	}

	handleChangeText(text) {
		this.setState({
			searchText: text,
			filtered_results: Compute.searchItems(text, this.props.users),
		})
	}

	render() {
		const { onCancel, onSelectUser } = this.props
		const { searchText } = this.state
		return (
			<View style={styles.container}>
				<EditableCell
					placeholder="search a user"
					onCancel={onCancel}
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

function EditableCell({ placeholder, onChangeText, value, onCancel }) {
	return (
		<View style={styles.cell_container}>
			<TextInput
				style={styles.input}
				autoCapitalize="none"
				autoCorrect={false}
				underlineColorAndroid="transparent"
				returnKeyType="done"
				autoFocus="true"
				onSubmitEditing={onCancel}
				placeholder={placeholder}
				onChangeText={onChangeText}
				value={value}
			/>
		</View>
	)
}

function NonEditableCell({ onPress, username_display }) {
	return (
		<TouchableWithoutFeedback activeOpacity={0.5} onPress={onPress}>
			<View style={styles.cell_container}>
				<Text style={styles.display}>{username_display}</Text>
			</View>
		</TouchableWithoutFeedback>
	)
}

const width = Dimensions.get('window').width
const inputMarginRight = 24
const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		shadowColor: 'rgba(0, 0, 0, 0.07)',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowRadius: 4,
		shadowOpacity: 1,
		borderStyle: 'solid',
		borderRadius: 4,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.08)',
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
		paddingRight: inputMarginRight,
    width: (width - inputMarginRight) / 2,
    borderBottomWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.08)',
	},
	input: {
		height: 40,
		fontSize: 17,
		textAlign: 'right',
		color: Colors.textBlack,
	},
	display: {
		fontSize: 17,
		color: Colors.textBlack,
		textAlign: 'right',
	},
})

const mapStateToProps = state => {
	return {
		users: state.users.data,
	}
}

export default connect(mapStateToProps)(SelectUserWithInput)
