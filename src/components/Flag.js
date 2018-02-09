import React from 'react'
import { Dimensions, View, Text, StyleSheet } from 'react-native'
import Colors from '../resources/Colors'

export default function Flag(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This task is flagged.</Text>
    </View>
  )
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: width,
    alignItems: 'center',
    padding: 8,
    justifyContent: 'center',
    backgroundColor: Colors.red,
  },
  text: {
    color: Colors.white,
  },
})
