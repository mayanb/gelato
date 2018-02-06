import Storage from '../resources/Storage'
import Networking from '../resources/Networking-superagent'
import Compute from '../resources/Compute'
import { DateFormatter } from '../resources/Utility'

import {
  REQUEST,
  REQUEST_SUCCESS,
  REQUEST_FAILURE,
  REQUEST_CREATE_SUCCESS,
  REQUEST_CREATE_FAILURE,
  FAILURE,
  REQUEST_DELETE_SUCCESS,
  REQUEST_DELETE_FAILURE,
  REQUEST_EDIT_ITEM_SUCCESS,
  REQUEST_EDIT_ITEM_FAILURE,
  UPDATE_ATTRIBUTE_SEARCH_SUCCESS,
  UPDATE_ATTRIBUTE_SEARCH_FAILURE,
} from '../reducers/BasicReducer'
import {
  UPDATE_ATTRIBUTE_SUCCESS,
  UPDATE_ATTRIBUTE_FAILURE,
  RESET_JUST_CREATED,
  ADD_INPUT_SUCCESS,
  ADD_OUTPUT_SUCCESS,
  START_ADDING,
  ADD_FAILURE,
  REMOVE_OUTPUT_SUCCESS,
  REMOVE_INPUT_SUCCESS,
} from '../reducers/TaskAttributeReducerExtension'

const OPEN_TASKS = 'OPEN_TASKS'
const COMPLETED_TASKS = 'COMPLETED_TASKS'
const SEARCHED_TASKS = 'SEARCHED_TASKS'

export function fetchOpenTasks() {
  return dispatch => {
    dispatch(requestTasks(OPEN_TASKS))

    let open = []
    var yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    // Get all open tasks
    let openPayload = {
      team: 1,
      ordering: '-updated_at',
      is_open: true,
      start: DateFormatter.format(yesterday),
      end: DateFormatter.format(new Date()),
    }

    return Storage.multiGet(['teamID', 'userID']).then(values => {
      let localStorage = {}
      values.forEach((element, i) => {
        let key = element[0]
        let val = element[1]
        localStorage[key] = val
      })
      openPayload['team'] = localStorage['teamID']
      Networking.get('/ics/tasks/')
        .query(openPayload)
        .end(function(err, res) {
          if (err || !res.ok) {
            dispatch(requestTasksFailure(OPEN_TASKS, err))
          } else {
            let organized = Compute.organizeAttributesForTasks(res.body)
            dispatch(requestTasksSuccess(OPEN_TASKS, organized))
          }
        })
    })
  }
}

export function fetchCompletedTasks() {
  return dispatch => {
    dispatch(requestTasks(COMPLETED_TASKS))

    let completed = []
    const completedPayload = {
      team: 1,
      ordering: '-updated_at',
      is_open: false,
    }

    return Storage.multiGet(['teamID', 'userID']).then(values => {
      let localStorage = {}
      values.forEach((element, i) => {
        let key = element[0]
        let val = element[1]
        localStorage[key] = val
      })
      completedPayload['team'] = localStorage['teamID']
      Networking.get('/ics/tasks/search')
        .query(completedPayload)
        .end(function(err, res) {
          if (err || !res.ok) {
            dispatch(requestTasksFailure(COMPLETED_TASKS, err))
          } else {
            let organized = Compute.organizeAttributesForTasks(res.body.results)
            dispatch(requestTasksSuccess(COMPLETED_TASKS, organized))
          }
        })
    })
  }
}

export function fetchTask(task_id) {
  return dispatch => {
    dispatch(requestTasks(SEARCHED_TASKS))
    return Storage.multiGet(['teamID', 'userID']).then(values => {
      let localStorage = {}
      values.forEach((element, i) => {
        let key = element[0]
        let val = element[1]
        localStorage[key] = val
      })
      Networking.get(`/ics/tasks/${task_id}`).end(function(err, res) {
        if (err || !res.ok) {
          dispatch(requestTasksFailure(SEARCHED_TASKS, err))
        } else {
          let organized = Compute.organizeAttributes(res.body)
          res.body.organized_attributes = organized
          dispatch(requestTasksSuccess(SEARCHED_TASKS, [res.body]))
        }
      })
    })
  }
}

function requestTasks(name) {
  return {
    type: REQUEST,
    name: name,
  }
}

function requestTasksSuccess(name, data) {
  return {
    type: REQUEST_SUCCESS,
    name: name,
    data: data,
  }
}

function requestTasksFailure(name, err) {
  return {
    type: REQUEST_FAILURE,
    name: name,
    error: err,
  }
}

export function updateAttribute(task, attribute_id, new_value, isSearched) {
  // let name = TASK
  // let successtype = UPDATE_ATTRIBUTE_SUCCESS
  // let errtype = UPDATE_ATTRIBUTE_FAILURE

  // if(isSearched) {
  // 	name = TASK
  // 	successtype = UPDATE_ATTRIBUTE_SEARCH_SUCCESS
  // 	errtype = UPDATE_ATTRIBUTE_SEARCH_FAILURE
  // } else {
  // 	name = task.is_open ? OPEN_TASKS : COMPLETED_TASKS
  // 	successtype = UPDATE_ATTRIBUTE_SUCCESS
  // 	errtype = UPDATE_ATTRIBUTE_FAILURE
  // }
  let name = findReducer(task, isSearched)
  return dispatch => {
    let payload = {
      task: task.id,
      attribute: attribute_id,
      value: new_value,
    }

    return Networking.post('/ics/taskAttributes/create/')
      .send(payload)
      .then(res => dispatch(updateAttributeSuccess(name, res.body)))
      .catch(err => dispatch(updateAttributeFailure(name, err)))
  }
}

function updateAttributeSuccess(name, data, type) {
  return {
    name: name,
    type: UPDATE_ATTRIBUTE_SUCCESS,
    data: data,
  }
}

function updateAttributeFailure(name, err, type) {
  return {
    name: name,
    type: UPDATE_ATTRIBUTE_FAILURE,
    error: err,
  }
}

export function requestCreateTask(data) {
  return dispatch => {
    let payload = Compute.generateNewTask(data)

    return Networking.post('/ics/tasks/create/')
      .send(payload)
      .end(function(err, res) {
        if (err || !res.ok) {
          dispatch(createTaskFailure(OPEN_TASKS, err))
        } else {
          res.body.process_type = data.processType
          res.body.product_type = data.productType
          res.body.attribute_values = []
          res.body.organized_attributes = Compute.organizeAttributes(res.body)
          dispatch(createTaskSuccess(res.body))
        }
      })
  }
}

function createTaskSuccess(data) {
  return {
    name: OPEN_TASKS,
    type: REQUEST_CREATE_SUCCESS,
    item: data,
  }
}

function createTaskFailure(err) {
  return {
    name: OPEN_TASKS,
    type: REQUEST_CREATE_FAILURE,
    error: err,
  }
}

export function resetJustCreated() {
  return {
    name: OPEN_TASKS,
    type: RESET_JUST_CREATED,
  }
}

export function addInput(task, item, isSearched, success, failure) {
  let payload = { task: task.id, input_item: item.id }
  return dispatch => {
    return Networking.post('/ics/inputs/create/')
      .send(payload)
      .end((err, res) => {
        if (err || !res.ok) {
          dispatch(addFailure(err))
          failure(err)
        } else {
          res.body.input_item = item
          dispatch(addSuccess(ADD_INPUT_SUCCESS, task, res.body))
          success(res.body)
        }
      })
  }
}

export function addOutput(task, qr, amount, isSearched, success, failure) {
  let payload = { creating_task: task.id, item_qr: qr, amount: amount }
  return dispatch => {
    dispatch(startAdding(task))
    return Networking.post('/ics/items/create/')
      .send(payload)
      .end((err, res) => {
        if (err || !res.ok) {
          dispatch(addFailure(err))
          failure(err)
        } else {
          dispatch(addSuccess(ADD_OUTPUT_SUCCESS, task, res.body))
          success(res.body)
        }
      })
  }
}

export function startAdding(task, isSearched) {
  let name = findReducer(task, isSearched)
  return {
    name: name,
    type: START_ADDING,
  }
}

function addSuccess(type, task, item, isSearched) {
  let name = findReducer(task, isSearched)
  return {
    type: type,
    name: name,
    item: item,
    task_id: task.id,
  }
}

function addFailure(err) {
  return {
    type: ADD_FAILURE,
    name: OPEN_TASKS,
    error: err,
  }
}

export function removeOutput(task, item, index, isSearched, success, failure) {
  console.log(isSearched)
  return removeSuccess(REMOVE_OUTPUT_SUCCESS, task, index, isSearched)
  return dispatch => {
    return Networking.del('/ics/items/', item.id).end((err, res) => {
      if (err || !res.ok) {
        dispatch(removeFailure(err))
        failure(err)
      } else {
        dispatch(removeSuccess(REMOVE_OUTPUT_SUCCESS, task, index, isSearched))
        success(res.body)
      }
    })
  }
}

export function removeInput(task, input, index, isSearched, success) {
  return dispatch => {
    return Networking.del('/ics/inputs/', input.id).end((err, res) => {
      if (err || !res.ok) {
        //dispatch(removeFailure(err))
        failure(err)
      } else {
        dispatch(removeSuccess(REMOVE_INPUT_SUCCESS, task, index, isSearched))
        success(res.body)
      }
    })
  }
}

function removeSuccess(type, task, index, isSearched) {
  console.log(isSearched)
  let name = findReducer(task, isSearched)
  return {
    type: type,
    name: name,
    task_id: task.id,
    index: index,
  }
}

export function requestDeleteTask(task, isSearched, success) {
  let name = findReducer(task, isSearched)
  let payload = { is_trashed: true }
  return dispatch => {
    return Networking.put(`/ics/tasks/edit/${task.id}/`)
      .send(payload)
      .end(function(err, res) {
        if (err || !res.ok) {
          dispatch(deleteTaskFailure(name, err))
        } else {
          dispatch(deleteTaskSuccess(name, task))
          success()
        }
      })
  }
}

function deleteTaskSuccess(name, data) {
  return {
    name: name,
    type: REQUEST_DELETE_SUCCESS,
    item: data,
  }
}

function deleteTaskFailure(name, err) {
  return {
    name: name,
    type: REQUEST_DELETE_FAILURE,
    error: err,
  }
}

export function requestFlagTask(task, isSearched) {
  let name = findReducer(task, isSearched)
  let payload = { is_flagged: true }
  return dispatch => {
    return Networking.put(`/ics/tasks/edit/${task.id}/`)
      .send(payload)
      .end(function(err, res) {
        if (err || !res.ok) {
          dispatch(requestEditItemFailure(name, err))
        } else {
          dispatch(requestEditItemSuccess(name, task, 'is_flagged', true))
        }
      })
  }
}

function requestEditItemFailure(name, err) {
  return {
    name: name,
    type: REQUEST_EDIT_ITEM_FAILURE,
    error: err,
  }
}

function requestEditItemSuccess(name, item, key, value) {
  return {
    name: name,
    type: REQUEST_EDIT_ITEM_SUCCESS,
    item: item,
    field: key,
    value: value,
  }
}

export function requestRenameTask(task, custom_display, isSearched) {
  let name = findReducer(task, isSearched)
  let payload = { custom_display: custom_display }
  return dispatch => {
    return Networking.put(`/ics/tasks/edit/${task.id}/`)
      .send(payload)
      .end(function(err, res) {
        if (err || !res.ok) {
          dispatch(requestEditItemFailure(name, err))
        } else {
          dispatch(
            requestEditItemSuccess(name, task, 'custom_display', custom_display)
          )
          if (custom_display.length) {
            dispatch(
              requestEditItemSuccess(name, task, 'display', custom_display)
            )
          }
        }
      })
  }
}

function findReducer(task, isSearched) {
  let name = SEARCHED_TASKS
  if (!isSearched && task.is_open) {
    name = OPEN_TASKS
  } else if (!isSearched) {
    name = COMPLETED_TASKS
  }
  return name
}