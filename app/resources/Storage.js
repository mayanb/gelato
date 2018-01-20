// Copyright 2018 Addison Leong

import React from 'react';
import {
	AsyncStorage
} from 'react-native';

// Wrapper class for making local storage easier to handle
export default class Storage {
	constructor() {}
	static async save(key, value) {
		try {
			await AsyncStorage.setItem(key, value);
			return true;
		} catch (error) {
			return null;
		}
	}
	
	static async get(key) {
		try {
			const result = await AsyncStorage.getItem(key);
			return result;
		} catch (error) {
			return null;
		}
	}

	static async remove(key) {
		try {
			await AsyncStorage.removeItem(key);
			return true;
		} catch (error) {
			return null;
		}
	}
}