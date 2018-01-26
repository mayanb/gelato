import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { BasicReducer } from './app/reducers/BasicReducer' 
import { _taskAttribute } from './app/reducers/TaskAttributeReducerExtension'

const OPEN_TASKS = 'OPEN_TASKS'
const COMPLETED_TASKS = 'COMPLETED_TASKS'
const PROCESSES = 'PROCESSES'
const PRODUCTS = 'PRODUCTS'
const TASK = 'TASK'

let defaultState = {
	data: [],
	ui: {}
}

let defaultTaskState = { data: null, ui: {} } 

function createFilteredReducer(reducerFunction, reducerPredicate, defaultState) {
    return (state, action) => {
        const isInitializationCall = state === undefined;
        const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall;
        if (isInitializationCall) { 
        	return reducerFunction(defaultState, action);
        }
        return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
    }
}


var reducer = combineReducers({
  	openTasks: createFilteredReducer(_taskAttribute, action => action.name === OPEN_TASKS, defaultState),
    completedTasks: createFilteredReducer(_taskAttribute, action => action.name === COMPLETED_TASKS, defaultState),
    processes: createFilteredReducer(BasicReducer, action => action.name === PROCESSES, defaultState),
    products: createFilteredReducer(BasicReducer, action => action.name === PRODUCTS, defaultState),
    task: createFilteredReducer(BasicReducer, action => action.name === TASK, defaultTaskState)
  })

export default createStore(reducer, applyMiddleware(thunkMiddleware))

