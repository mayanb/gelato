import Storage from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import {
	REQUEST,
	REQUEST_SUCCESS,
	REQUEST_FAILURE,
} from '../reducers/BasicReducer'
import { TAGS } from '../../store'

export function fetchTags() {
    return dispatch => {
        dispatch(requestTags(TAGS))
        return Storage.get('teamID')
            .then(teamID => {
                return Networking.get('/ics/tags/')
                    .query({ team: teamID, team_created_by: teamID })
                    .then(res => dispatch(requestTagsSuccess(TAGS, res.body)))
                    .catch(e => {
                        dispatch(requestTagsFailure(TAGS, e))
                        throw e
                    })
		    })
    }
}

function requestTags(name) {
	return {
		type: REQUEST,
		name: name,
	}
}

function requestTagsSuccess(name, data) {
	return {
		type: REQUEST_SUCCESS,
		name: name,
		data: data,
	}
}

function requestTagsFailure(name, err) {
	return {
		type: REQUEST_FAILURE,
		name: name,
		error: err,
	}
}