const PRODUCTION_URL =
	'https://41aty886e1.execute-api.us-west-1.amazonaws.com/production'
const STAGING_URL =
	'https://eszlr18ifi.execute-api.us-west-1.amazonaws.com/staging'
const LOCAL_URL = 'http://localhost:8000'

export function getBackend() {
	let { releaseChannel } = Expo.Constants.manifest
	switch (releaseChannel) {
		case 'production':
			return PRODUCTION_URL
		case 'staging':
			return STAGING_URL
		default:
			// change this if you want to change what your dev app is using
			return STAGING_URL
			//return LOCAL_URL
	}
}

export function latest(host, path) {
	let url = host + path
	if (path.startsWith('/ics')) {
		url = host + '/ics/v8' + path.substring(4)
	}
	return url
}
