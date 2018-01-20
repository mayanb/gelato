import { Storage } from './Storage'
import Compute from './Compute'
import { 
	REQUEST, 
	REQUEST_SUCCESS, 
	REQUEST_FAILURE 
} from '../reducers/BasicReducer'

const OPEN_TASKS = 'OPEN_TASKS'
const COMPLETED_TASKS = 'COMPLETED_TASKS'

export function fetchOpenTasks() {
  return (dispatch) => {
    dispatch(requestTasks(OPEN_TASKS))
	  let openTasks = await Compute.getOpenTasks()
    dispatch(requestTasksSuccess(OPEN_TASKS, openTasks))
  }
}

export function fetchCompletedTasks() {
	return (dispatch) => {
		dispatch(requestTasks(COMPLETED_TASKS))
		let completedTasks = await Compute.getCompletedTasks()
		dispatch(requestTasksSuccess(COMPLETED_TASKS, completedTasks))
	}
}

function requestTasks(type) {
	return {
		type: REQUEST,
		name: type,
	}
}

function requestTasksSuccess(type, data) {
	return {
		type: REQUEST_SUCCESS,
		name: type,
		data: data
	}
}