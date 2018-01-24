export function getBackend() {
	let k = 'local'
	switch(k) {
		case 'staging':
			return 'https://eszlr18ifi.execute-api.us-west-1.amazonaws.com/staging'
		default:
			return 'http://localhost:8000'
	}
}

export function latest(host, path) {
	let url = host + path
	if (path.startsWith('/ics')) {
		url = host + '/ics/v7' + path.substring(4) 
	}
	return url
}
