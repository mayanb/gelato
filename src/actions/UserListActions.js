import Storage from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import Compute from '../resources/Compute'

import {
	REQUEST,
	REQUEST_SUCCESS,
	REQUEST_FAILURE,
} from '../reducers/BasicReducer'
import { USERS } from '../../store'

export function fetchUsers() {
	console.log('wee, fetchUsers')
	return dispatch => {
		dispatch(requestUsers(USERS))
		return Storage.get('teamID').then(teamID =>
			Networking.get(`/ics/teams/${teamID}`)
				.then(res => {
					console.log('got users: ', res.body.users)
					const orderedUsers = res.body.users.sort(
						Compute.sortAlphabeticallyUsing('username_display')
					)
					dispatch(requestUsersSuccess(USERS, orderedUsers))
				})
				.catch(e => {
					console.log('error', e)
					dispatch(requestUsersFailure(USERS, e))
					throw e
				})
		)
	}
}

function requestUsers(name) {
	return {
		type: REQUEST,
		name: name,
	}
}

function requestUsersSuccess(name, data, append = false) {
	return {
		type: REQUEST_SUCCESS,
		name: name,
		data: data,
		append: append,
	}
}

function requestUsersFailure(name, err) {
	return {
		type: REQUEST_FAILURE,
		name: name,
		error: err,
	}
}
