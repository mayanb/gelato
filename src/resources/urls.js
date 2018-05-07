const PRODUCTION_URL =
	'https://41aty886e1.execute-api.us-west-1.amazonaws.com/production'
const STAGING_URL =
	'https://eszlr18ifi.execute-api.us-west-1.amazonaws.com/staging'
const LOCAL_URL = 'http://192.168.0.111:8000'

export function getBackend() {
	let { releaseChannel } = Expo.Constants.manifest
	switch (releaseChannel) {
		case 'production':
			return PRODUCTION_URL
		case 'staging':
			return STAGING_URL
		default:
			// change this if you want to change what your dev app is using
			return LOCAL_URL
	}
}

export function latest(host, path) {
	let url = host + path
	if (path.startsWith('/ics')) {
		url = host + '/ics/v9' + path.substring(4)
	}
	return url
}
