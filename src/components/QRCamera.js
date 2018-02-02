import React, { Component } from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Camera } from 'expo'
import { SafeAreaView } from 'react-navigation'
import * as ImageUtility from '../resources/ImageUtility'

export default class QRCamera extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={cam => {
            this.camera = cam
          }}
          onBarCodeRead={this.props.onBarCodeRead}
          style={styles.preview}
        />

        <SafeAreaView
          style={StyleSheet.absoluteFill}
          forceInset={{ top: 'always' }}>
          <View style={{ flex: 1 }}>
            <View style={styles.button}>
              <TouchableOpacity
                onPress={this.props.onClose}
                hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}>
                <Image
                  source={ImageUtility.systemIcon('close_camera')}
                  title=""
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    height: height,
    width: width,
  },
  preview: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'center',
    top: 0,
    left: 0,
    height: height,
    width: width,
  },
  button: {
    position: 'absolute',
    top: 12,
    left: 16,
  },
  text: {
    color: 'white',
    marginTop: 20,
  },
})
