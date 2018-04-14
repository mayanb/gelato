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
      creating_task_display,
      semantic,
      shouldShowAmount,
      onChange,
      onPress,
      onCancel,
      amount
    } = this.props
	  let text = ''
    if(semantic && semantic.length) {
	    text = Compute.getTextFromSemantic(semantic)
    } else if(shouldShowAmount) {
      text = 'Enter amount:'
    }
    return (
      <View style={styles.container}>
        <View
          style={styles.qr_top}>
          <Image
            source={ImageUtility.requireIcon('qr_icon')}
            style={styles.icon}
          />
          <Text style={styles.qr_text}>
            {barcode.substring(barcode.length - 6)}
          </Text>
          <Text>{creating_task_display}</Text>
        </View>
        {Compute.isFlagged(semantic) && <Flag />}
        <View style={styles.main}>
          <Text style={styles.semantic}>
            {text}
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
        {renderButtons(semantic, onPress, onCancel, amount, shouldShowAmount)}
      </View>
    )
  }
}

function Flag() {
  return (
    <View style={styles.flag}>
      <Text style={styles.flagText}>This task is flagged!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  qr_top: {
    flexDirection: 'row',
    flex: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ultraLightGray,
    padding: 8,
    alignItems: 'center',
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
  flag: {
    backgroundColor: Colors.red,
    padding: 8,
  },
  flagText: {
    color: 'white',
    textAlign: 'center',
  }
})

function renderButtons(semantic, onPress, onCancel, amount, shouldShowAmount) {
	if (Compute.isOkay(semantic)) {
		return <AddButton onAdd={onPress} disabled={shouldShowAmount && !amount} />
	} else {
		return <CancelButton onCancel={onCancel} />
	}
}
