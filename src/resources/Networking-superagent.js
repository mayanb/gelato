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

export default { get, post, del, host, put, patch }
