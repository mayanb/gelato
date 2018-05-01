import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { BasicReducer } from './src/reducers/BasicReducer'
import { _task } from './src/reducers/TaskReducerExtension'
import { ErrorReducer } from './src/reducers/ErrorReducer'

export const OPEN_TASKS = 'OPEN_TASKS'
export const COMPLETED_TASKS = 'COMPLETED_TASKS'
export const SEARCHED_TASKS = 'SEARCHED_TASKS'
export const PROCESSES = 'PROCESSES'
export const PRODUCTS = 'PRODUCTS'
export const TEAMS = 'TEAMS'
export const TASK = 'TASK'
export const TASKS = 'TASKS'
export const ERROR = 'ERROR'
export const MOVE = 'MOVE'
export const USERS = 'USERS'

let defaultState = {
	data: [],
	ui: {},
}

let tasksDefaultState = {
	dataByID: {},
	recentIDs: [],
	searchedIDs: [],
	ui: {},
}

function createFilteredReducer(
	reducerFunction,
	reducerPredicate,
	defaultState
) {
	return (state, action) => {
		const isInitializationCall = state === undefined
		const shouldRunWrappedReducer =
			reducerPredicate(action) || isInitializationCall
		if (isInitializationCall) {
			return reducerFunction(defaultState, action)
		}
		return shouldRunWrappedReducer ? reducerFunction(state, action) : state
	}
}

var reducer = combineReducers({
	tasks: createFilteredReducer(
		_task,
		action => action.name === TASKS,
		tasksDefaultState,
	),
  processes: createFilteredReducer(
    BasicReducer,
    action => action.name === PROCESSES,
    defaultState
  ),
  products: createFilteredReducer(
    BasicReducer,
    action => action.name === PRODUCTS,
    defaultState
  ),
  teams: createFilteredReducer(
    BasicReducer,
    action => action.name === TEAMS,
    defaultState
  ),
  move: createFilteredReducer(
    BasicReducer,
    action => action.name === MOVE,
    defaultState
  ),
  errors: createFilteredReducer(
    ErrorReducer,
    action => action.name === ERROR,
    defaultState
  ),
  users: createFilteredReducer(
    BasicReducer,
    action => action.name === USERS,
    defaultState
  ),
})

export default createStore(reducer, applyMiddleware(thunkMiddleware))
