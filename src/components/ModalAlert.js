import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'
import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
  View,
  Button,
} from 'react-native'
import { CreateTaskSelect } from './Cells'
import Collapsible from 'react-native-collapsible'

export default class ModalAlert extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.modalAlert}>
        <TouchableView style={styles.topRowAlert} onPress={this.props.onPress}/>
          <View style={styles.middleRowAlert}>
            <TouchableView style={styles.sideAlert} onPress={this.props.onPress}/>
            <View style={styles.modalContentAlert}>
              {this.props.children}
              <View style={styles.message}>
                <Text>{this.props.message}</Text>
              </View>
              <View style={styles.button}>
                  <Button onPress={this.props.onPress} title={this.props.buttonText} color="white"></Button>
              </View>
            </View>
            <TouchableView style={styles.sideAlert} onPress={this.props.onPress}/>
          </View>
          <TouchableView style={styles.bottomRowAlert} onPress={this.props.onPress} />
      </View>
    )
  }
}

function TouchableView(props) {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={props.style}/>
    </TouchableWithoutFeedback>
  )
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const modalHeight = (52 * 5)
const paddingHeight = (height - modalHeight )/2 - 85

const modalAlertHeight = (52*3)
const paddingAlertHeight = (height - modalAlertHeight)/2 - 85
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

  modalContentAlert: {
    backgroundColor: 'white',
    borderRadius: 4,
    maxHeight: modalAlertHeight,
    minHeight: modalAlertHeight,
    flex: 1,
    minWidth: width - 32,
    maxWidth: width - 32,
  },

  message: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  modalAlert: {
    flexDirection: 'column',
    flex: 1,
    height: height,
    width: width,
  },

  topRowAlert: {
    minHeight: paddingAlertHeight,
  },

  middleRowAlert: {
    flexDirection: 'row',
    minHeight: modalAlertHeight,
    maxHeight: modalAlertHeight,
  },

  sideAlert: {
    flex: 1,
  },

  bottomRowAlert: {
    minHeight: paddingAlertHeight,
    flex: 1,
  },

  button: {
    flex: 0,
    backgroundColor: Colors.base,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 16,
  },
  secondary: {
    flex: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.ultraLightGray,
  },

})

