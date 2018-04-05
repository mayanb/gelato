import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native'
import * as ImageUtility from '../resources/ImageUtility'
import { AddButton, CancelButton } from './Buttons'
import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import NumericInputWithUnits from './NumericInputWithUnits'


export default class QRDisplay extends Component {
  render() {
    let {
      unit,
      barcode,
      creating_task,
      semantic,
      shouldShowAmount,
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
            <View>
              <NumericInputWithUnits
                unit={unit}
                value={amount}
                onChangeText={num => onChange(num)}
              />
            </View>
          ) : null}
        </View>
        {renderButtons(semantic, onPress, onCancel, amount)}
      </View>
    )
  }
}

function renderButtons(semantic, onPress, onCancel, amount) {
	if (Compute.isOkay(semantic)) {
		return <AddButton onAdd={onPress} disabled={!amount} />
	} else {
		return <CancelButton onCancel={onCancel} />
	}
}
