import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { BasicReducer } from './app/reducers/BasicReducer' 

const OPEN_TASKS = 'OPEN_TASKS'

let defaultState = {
	data: [],
	ui: {}
}

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
  	openTasks: createFilteredReducer(BasicReducer, action => action.name === OPEN_TASKS, defaultState)
  })

export default createStore(reducer, applyMiddleware(thunkMiddleware))

