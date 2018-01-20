// Copyright 2018 Addison Leong

import { Storage } from './Storage';

// Wrapper class for handling network requests
export default class Networking {
	constructor() {

	}
	 static host = "http://localhost:8000/"; // Development
	//static host = "https://eszlr18ifi.execute-api.us-west-1.amazonaws.com/staging/"; // Staging
	// static host = "https://41aty886e1.execute-api.us-west-1.amazonaws.com/production/"; // Production

	static async request(url, method, data) {
		url = this.host + url;
		if (method === "GET") {
			var esc = encodeURIComponent;
			var query = Object.keys(data)
				.map(k => esc(k) + '=' + esc(data[k]))
				.join('&');
			url += "?" + query;
		}
		try {
			let response = await fetch(url, {
			  method: method,
			  headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			  },
			  body: (method === "POST" ? JSON.stringify(data) : null)
			});
			return response;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	static async multipartRequest(url, method, data) {
		url = this.host + url;
		try {
			let response = await fetch(url, {
			  method: method,
			  headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'multipart/form-data'
			  },
			  body: data,
			});
			return response;
		} catch (error) {
			console.log(error);
			return null;
		}
	}
}