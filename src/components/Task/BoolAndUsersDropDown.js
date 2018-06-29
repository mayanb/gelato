import React from 'react'
import { Dropdown } from 'react-native-material-dropdown'
import { connect } from 'react-redux'
import { getBoolDbStorageValue } from './BooleanCell'
import * as actions from '../../actions/UserListActions'
import { USER, BOOL } from '../../resources/AttributeTypeConstants'
import Compute from '../../resources/Compute'

class BoolAndUsersDropDown extends React.Component {
	constructor(props) {
		super(props)
		this.state = { ref: null }

		this.handleChangeText = this.handleChangeText.bind(this)
	}

	componentDidMount() {
		if (this.props.type === USER) {
			this.props.dispatch(actions.fetchUsers())
		}
	}

	render() {
		const { userList, label, toggleEditingState } = this.props
		const boolData = [{ value: 'Yes' }, { value: 'No' }]
		const data = this.props.type === USER && userList ? userList : boolData

		return (
			<Dropdown
				ref={ref => this.openPopup(ref)}
				label={label}
				data={data}
				onChangeText={this.handleChangeText}
				onBlur={() => toggleEditingState(false)}
			/>
		)
	}

	openPopup(ref) {
		// We're given ref one "tick" before the component mounts, so setTimeout delays
		// focus()ing until the component has safely mounted. ref.focus() opens the list modal.
		setTimeout(() => {
			if (ref) {
				ref.focus()
			}
		}, 0)
	}

	handleChangeText(value) {
		let _value = value
		if (this.props.type === BOOL) {
			const booleanValue = value === 'Yes'
			_value = getBoolDbStorageValue(booleanValue)
		}
		this.props.onSubmit(_value)
	}
}

const mapStateToProps = state => {
	// searchUsers filters out UUIDs from usernames which are actually just auto-generated invitation strings
	const userList = Compute.searchUsers('', state.users.data)
	const userListFormatted = userList.map(user => {
		return { value: Compute.getUsernameDisplay(user) }
	})
	return {
		userList: userListFormatted,
	}
}

export default connect(mapStateToProps)(BoolAndUsersDropDown)
