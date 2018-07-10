import request from 'superagent'
import * as urls from './urls'

let host = urls.getBackend()

function get(path) {
  let url = urls.latest(host, path)
  console.log(url)
  return request.get(url)
  //.withCredentials()
}

function post(path) {
  let url = urls.latest(host, path)

  return request.post(url).set('Content-Type', 'application/json')
  //.set('X-CSRFToken', getCookie('csrftoken'))
  //.withCredentials()
}

function put(path) {
  let url = urls.latest(host, path)
  return request('PUT', url).set('Content-Type', 'application/json')
  //.set('X-CSRFToken', getCookie('csrftoken'))
  //.withCredentials()
  //.send({team: team, created_by: team})
}

function del(path) {
  let url = urls.latest(host, path)
  return request('DELETE', url)
  //.withCredentials()
}

function patch(path, id) {
  let url = urls.latest(host, path)
  return request('PATCH', url).set('Content-Type', 'application/json')
}

function uploadURI(path, uri, extraData) {
  const host = urls.getBackend()
  const url = urls.latest(host, path)
  const uriParts = uri.split('.')
  const fileType = uriParts[uriParts.length - 1];
  const d = new Date()
  const datestring = ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + "-" +
  d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) +
  ":" + ("0" + d.getSeconds()).slice(-2)

  const formData = new FormData()
  formData.append('file_binary', {
      uri,
      name: `${datestring}`,
      type: `image/${fileType}`,
  })
  formData.append('team', extraData.team)
  formData.append('task', extraData.task)

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  }
  return fetch(url, options)
}

export default { get, post, del, host, put, patch, uploadURI }
