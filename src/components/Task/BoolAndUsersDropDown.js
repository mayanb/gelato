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
		const { userData, label } = this.props
		const boolData = [{ value: 'Yes' }, { value: 'No' }]
		const data = this.props.type === USER && userData ? userData : boolData

		return (
			<Dropdown
				ref={ref => this.openPopup(ref)}
				label={label}
				data={data}
				onChangeText={this.handleChangeText}
			/>
		)
	}

	openPopup(ref) {
		// HACK: without a timeout, the Dropdown won't focused, preventing the list from popping up
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
	const userData = state.users.data.map(user => {
		return { value: Compute.getUsernameDisplay(user) }
	})
	return {
		userData: userData,
	}
}

export default connect(mapStateToProps)(BoolAndUsersDropDown)
