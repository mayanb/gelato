import React from 'react'
import {
  Image,
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'
import AttributeCell from './AttributeCell'

export default class AttributeList extends React.Component {
  render() {
    console.log(this.props)
    let data = this.props.data || []
    return (
      <KeyboardAwareScrollView>
      {
        data.map((item, index) => {
          return (
            <AttributeCell
              key={item.id}
              id={item.id}
              name={item.name}
              value={item.value}
              type={item.datatype}
              onSubmitEditing={this.props.onSubmitEditing}
            />
          )
        })
      }
      </KeyboardAwareScrollView>
    )
  }
}
