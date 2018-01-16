// Copyright 2018 Addison Leong

import { Storage } from '../Storage';

// Wrapper class for handling network requests
export default class Networking {
	constructor() {

	}
	static host = "http://localhost:8000/"; // Development
	// static host = "https://aws"; // Production

	static async request(url, method, data) {
		url = this.host + url;
		try {
			let response = await fetch(url, {
			  method: method,
			  headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(data),
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