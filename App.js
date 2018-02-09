// Copyright 2018 Addison Leong

import React from 'react'
import { Provider } from 'react-redux'

import App from './src'
import store from './store.js'

export default class AppContainer extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}
