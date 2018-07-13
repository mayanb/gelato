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

function uploadURI(path, uri, team, task) {
  const host = urls.getBackend()
  const url = urls.latest(host, path)
  const uriParts = uri.split('.')
  const fileType = uriParts[uriParts.length - 1]

  const formData = new FormData()
  // six random digits
  const randomImgNumber = Math.random().toString().slice(2, 8)
  formData.append('file_binary', {
      uri,
      name: `img_${randomImgNumber}.${fileType}`,
      type: `image/${fileType}`,
  })
  formData.append('team', team)
  formData.append('task', task)

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
