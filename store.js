import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { BasicReducer } from './src/reducers/BasicReducer'
import { _taskAttribute } from './src/reducers/TaskAttributeReducerExtension'
import { ErrorReducer } from './src/reducers/ErrorReducer'

const OPEN_TASKS = 'OPEN_TASKS'
const COMPLETED_TASKS = 'COMPLETED_TASKS'
const SEARCHED_TASKS = 'SEARCHED_TASKS'
const PROCESSES = 'PROCESSES'
const PRODUCTS = 'PRODUCTS'
const TEAMS = 'TEAMS'
const TASK_DETAILS = 'TASK_DETAILS'
const ERROR = 'ERROR'
const MOVE = 'MOVE'

let defaultState = {
	data: [],
	ui: {},
}

let defaultStateByID = {
	data: {},
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
  openTasks: createFilteredReducer(
    _taskAttribute,
    action => action.name === OPEN_TASKS,
    defaultState
  ),
  completedTasks: createFilteredReducer(
    _taskAttribute,
    action => action.name === COMPLETED_TASKS,
    defaultState
  ),
  searchedTasks: createFilteredReducer(
    _taskAttribute,
    action => action.name === SEARCHED_TASKS,
    defaultState
  ),
	taskDetailsByID: createFilteredReducer(
		_taskAttribute,
		action => action.name === TASK_DETAILS,
		defaultStateByID
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
})

export default createStore(reducer, applyMiddleware(thunkMiddleware))
