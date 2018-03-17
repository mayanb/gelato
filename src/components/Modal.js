import React, { Component } from 'react'
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

export default class Modal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.modal}>
        <TouchableView style={styles.topRow} onPress={this.props.onPress} />
        <View style={styles.middleRow}>
          <TouchableView style={styles.side} onPress={this.props.onPress} />
          <View style={styles.modalContent}>{this.props.children}</View>
          <TouchableView style={styles.side} onPress={this.props.onPress} />
        </View>
        <TouchableView style={styles.bottomRow} onPress={this.props.onPress} />
      </View>
    )
  }
}

function TouchableView(props) {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={props.style} />
    </TouchableWithoutFeedback>
  )
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const modalHeight = 52 * 5
const paddingHeight = (height - modalHeight) / 2 - 120

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 4,
    maxHeight: modalHeight,
    minHeight: modalHeight,
    flex: 1,
    minWidth: width - 32,
    maxWidth: width - 32,
  },

  modal: {
    flexDirection: 'column',
    flex: 1,
    height: height,
    width: width,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topRow: {
    minHeight: paddingHeight,
  },

  middleRow: {
    flexDirection: 'row',
    minHeight: modalHeight,
    maxHeight: modalHeight,
  },

  side: {
    flex: 1,
  },

  bottomRow: {
    minHeight: paddingHeight,
    flex: 1,
  },
})
