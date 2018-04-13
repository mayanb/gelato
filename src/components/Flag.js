import React from 'react'
import { Dimensions, View, Text, StyleSheet, Image } from 'react-native'
import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'


// wide flag
export function Flag(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This task is flagged.</Text>
    </View>
  )
}

export function AncestorFlag(props) {
  return (
    <View style={styles.ancestorContainer}>
      <Text style={styles.text}>This task has a flagged ancestor.</Text>
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
  ancestorContainer: {
    flex: 0,
    width: width,
    alignItems: 'center',
    padding: 8,
    justifyContent: 'center',
    backgroundColor: Colors.orange,
  },
  text: {
    color: Colors.white,
  },
})

// export function FlagPill(props) {
//   const styles = StyleSheet.create({
//     container: {
//       backgroundColor: Colors.red,
//       borderRadius: 4,
//       alignItems: 'center',
//       justifyContent: 'center',
//       paddingLeft: 4,
//       paddingRight: 4,
//     }, 
//     text: {
//       color: 'white',
//       fontSize: 10,
//     }
//   })
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>FLAGGED</Text>
//     </View>
//   )
// }

export function FlagPill(props) {
  const styles = StyleSheet.create({
    container: {
      height: 10,
    }, 
    text: {
      color: 'white',
      fontSize: 10,
    }
  })
  return (
    <View style={styles.container}>        
      <Image source={ImageUtility.systemIcon('red_warning')} />
    </View>
  )
}

export function AncestorFlagPill(props) {
  const styles = StyleSheet.create({
    container: {
      height: 10,
    }, 
    text: {
      color: 'white',
      fontSize: 10,
    }
  })
  return (
    <View style={styles.container}>        
      <Image source={ImageUtility.systemIcon('orange_warning')} />
    </View>
  )
}

