import Storage from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import Compute from '../resources/Compute'
import {
	REQUEST,
	REQUEST_SUCCESS,
	REQUEST_FAILURE,
	REQUEST_CREATE,
	REQUEST_CREATE_SUCCESS,
	REQUEST_CREATE_FAILURE,
	REQUEST_DELETE_SUCCESS,
	REQUEST_DELETE_FAILURE,
	REQUEST_EDIT_ITEM_SUCCESS,
	REQUEST_EDIT_ITEM_FAILURE,
} from '../reducers/BasicReducer'
const MOVE = 'MOVE'



export function requestCreateMove(data) {
	return dispatch => {
		dispatch(startCreateMove())
		let openPayload = data
		return Storage.multiGet(['teamID', 'userAccountID']).then(values => {
			let localStorage = {}
			values.forEach((element, i) => {
				let key = element[0]
				let val = element[1]
				localStorage[key] = val
			})
			openPayload['team_origin'] = localStorage['teamID']
			openPayload['origin'] = localStorage['userAccountID']
			return Networking.post('/ics/movements/create/')
				.send(openPayload)
				.then(res => {
					console.log("SUCCESS!!")
					dispatch(createMoveSuccess(res.body))
				})
				.catch(e => {
					console.log("FAILURE!!")
					dispatch(createMoveFailure(e))
					throw e
				})
		})
	}
}

function startCreateMove() {
	return {
		name: MOVE,
		type: REQUEST_CREATE,
	}
}

function createMoveSuccess(data) {
	return {
		name: MOVE,
		type: REQUEST_CREATE_SUCCESS,
		item: data,
	}
}

function createMoveFailure(err) {
	return {
		name: MOVE,
		type: REQUEST_CREATE_FAILURE,
		error: err,
	}
}