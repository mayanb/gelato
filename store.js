import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { BasicReducer } from './src/reducers/BasicReducer'
import { _task } from './src/reducers/TaskReducerExtension'
import { ErrorReducer } from './src/reducers/ErrorReducer'

const TASKS = 'TASKS'
const PROCESSES = 'PROCESSES'
const PRODUCTS = 'PRODUCTS'
const TEAMS = 'TEAMS'
const ERROR = 'ERROR'
const MOVE = 'MOVE'

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
})

export default createStore(reducer, applyMiddleware(thunkMiddleware))
