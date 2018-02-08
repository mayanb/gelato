import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { BasicReducer } from './src/reducers/BasicReducer'
import { _taskAttribute } from './src/reducers/TaskAttributeReducerExtension'

const OPEN_TASKS = 'OPEN_TASKS'
const COMPLETED_TASKS = 'COMPLETED_TASKS'
const SEARCHED_TASKS = 'SEARCHED_TASKS'
const PROCESSES = 'PROCESSES'
const PRODUCTS = 'PRODUCTS'
const TASK = 'TASK'

let defaultState = {
	data: [],
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
})

export default createStore(reducer, applyMiddleware(thunkMiddleware))
