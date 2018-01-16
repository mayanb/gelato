# Gelato

This is the codebase for Gelato, the mobile side of Polymer. This version is written in React Native and compiles to both Android and iOS.

## TODO

* Store TODOs here

## Getting Started

These instructions will help you get up and running with the codebase as soon as possible. They will guide you through the process of setting it up for testing on your local machine.

### Prerequisites

* Node.JS
* React Native (follow [these instructions](https://facebook.github.io/react-native/docs/getting-started.html) to install, stopping at "Creating a new application")
* Xcode (if developing for iOS)
* Android Studio (if developing for Android)

### Installing

With the prerequisites in place, go to the root directory and install the packages:

```
$ npm install
```

## Running

To start the app, run:

```
$ react-native run-ios
```

or

```
$ react-native run-android
```

## Built With

* React Native
* Node.JS
* Objective-C
* Java

## Organization

Gelato is divided into several logical segments. At the root is:

* `index.js`
	* Main entrypoint for the app
	* Starts the app as a single-screen navigation app
	* Redirects to the appropriate view on startup

The `app` folder contains the main app logic. It is divided into the following folders:

* `components`
	* Custom components go here
	* Each folder represents a component library, with the code located at the enclosed `index.js`
* `resources`
	* Custom libraries go here
	* Each file represents a library
* `screens`
	* Views go here
	* Organized into folders based on app hierarchy
* `start`
	* Contains only `index.js`
		* This file registers the views in `screens` for use in the app

## Code Style

An important part of maintaining a project is consistent style.
* We follow the Async/Await Promise paradigm, which makes the code much more readable, and much more logical. When dealing with asynchronous code, especially local storage and networking, always use Async/Await.
* All lines (except for closures) must end with a semicolon.