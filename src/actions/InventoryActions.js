import Storage from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import Compute from '../resources/Compute'
import {
	REQUEST,
	REQUEST_SUCCESS,
	REQUEST_FAILURE,
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
		let openPayload = data
		return Storage.multiGet(['teamID', 'userID']).then(values => {
			let localStorage = {}
			values.forEach((element, i) => {
				let key = element[0]
				let val = element[1]
				localStorage[key] = val
			})
			openPayload['team_origin'] = localStorage['teamID']
			openPayload['origin'] = localStorage['teamID']
			console.log(openPayload)
			return Networking.post('/ics/movements/create/')
				.send(openPayload)
				.then(res => {
					console.log("SUCCESS!!")
					console.log(res.body)
					dispatch(createMoveSuccess(res.body))
				})
				.catch(e => {
					console.log("FAILURE!!")
					console.log(e)
					dispatch(createMoveFailure(e))
					throw e
				})
		})
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