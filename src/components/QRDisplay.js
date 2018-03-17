import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native'
import { AddButton, CancelButton } from './Buttons'
import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import * as ImageUtility from '../resources/ImageUtility'

export default class QRDisplay extends Component {
  render() {
    let {
      barcode,
      creating_task,
      semantic,
      shouldShowAmount,
      default_amount,
      onChange,
      onPress,
      onCancel,
      amount
    } = this.props
    let styles = StyleSheet.create({
      container: {
        flexDirection: 'column',
        flex: 1,
      },
      qr_top: {
        flexDirection: 'row',
        flex: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ultraLightGray,
        padding: 16,
      },
      main: {
        flex: 1,
        padding: 16,
      },
      qr_text: {
        flex: 1,
      },
      icon: {
        height: 24,
        width: 24,
        marginRight: 8,
      },
      semantic: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
      },
    })
    return (
      <View style={styles.container}>
        <TouchableOpacity
          disabled={!this.props.onOpenTask}
          onPress={() => this.props.onOpenTask()}
          style={styles.qr_top}>
          <Image
            source={ImageUtility.requireIcon('qr_icon')}
            style={styles.icon}
          />
          <Text style={styles.qr_text}>
            {barcode.substring(barcode.length - 6)}
          </Text>
          <Text>{creating_task}</Text>
        </TouchableOpacity>
        <View style={styles.main}>
          <Text style={styles.semantic}>
            {Compute.getTextFromSemantic(semantic)}
          </Text>
          {shouldShowAmount ? (
            <QRInput
              placeholder={default_amount}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={onChange}
              value={amount}
            />
          ) : null}
        </View>
        {renderButtons(semantic, onPress, onCancel)}
      </View>
    )
  }
}

function renderButtons(semantic, onPress, onCancel) {
  if (Compute.isOkay(semantic)) {
    return <AddButton onAdd={onPress} />
  } else {
    return <CancelButton onCancel={onCancel} />
  }
}

function QRInput(props) {
  let styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    help: {
      textAlign: 'center',
    },
    input: {
      borderRadius: 4,
      backgroundColor: Colors.white,
      borderColor: Colors.lightGray,
      borderWidth: 1,
      borderRadius: 3,
      fontSize: 15,
      color: Colors.gray,
      marginBottom: 20,
      padding: 10,
      textAlign: 'center',
      marginTop: 4,
    },
  })
  return (
    <View style={styles.container}>
      <Text style={styles.help}>Enter amount</Text>
      <TextInput keyboardType="numeric" returnKeyType='done' style={styles.input} {...props} />
    </View>
  )
}
