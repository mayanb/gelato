import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'
import React, { Component } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import pluralize from 'pluralize'
import { FlagPill } from './Flag'

export class TaskRow extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const width = Dimensions.get('window').width
    const styles = StyleSheet.create({
      container: {
        backgroundColor: Colors.white,
        flex: 1,
        flexDirection: 'row',
        width: width,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ultraLightGray,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
      },

      text_container: {
        flex: 1,
        minHeight: 30,
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      title: {
        marginBottom: 5,
      },
      display: {
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 4,
      },
      date: {
        fontSize: 13,
        color: Colors.lightGray,
      },
      process_icon: {
        width: 38,
        height: 38,
        marginRight: 8,
      },
      header: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5,
      }
    })
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={this.openTask.bind(this)}>
        <View style={styles.container}>
          <View>
            <Image
              source={ImageUtility.requireIcon(this.props.imgpath)}
              style={styles.process_icon}
            />
          </View>
          <View style={styles.text_container}>
            <View style={styles.header}>
              {this.props.is_flagged && <FlagPill />}
              <Text style={styles.display}>{this.props.name}</Text>
            </View>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.date}>{this.props.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  openTask() {
    this.props.onPress(
      this.props.id,
      this.props.title,
      this.props.open,
      this.props.imgpath,
      this.props.name,
      this.props.date,
      this.props.outputAmount,
      this.props.outputUnit
    )
  }
}

export class TaskRowHeader extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const width = Dimensions.get('window').width
    const styles = StyleSheet.create({
      container: {
        width: width,
        height: this.props.isLoading ? 140 : 75,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ultraLightGray,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: Colors.bluishGray,
      },
      title: {
        fontSize: 15,
        color: Colors.lightGray,
      },
      indicator: {
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
      },
    })
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        {this.props.isLoading && (
          <ActivityIndicator
            size="large"
            color={Colors.base}
            style={styles.indicator}
          />
        )}
      </View>
    )
  }
}

export class AttributeHeaderCell extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const width = Dimensions.get('window').width
    const styles = StyleSheet.create({
      container: {
        flex: 0,
        flexDirection: 'row',
        width: width,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ultraLightGray,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: Colors.bluishGray,
        alignItems: 'center',
        height: 80,
      },

      text_container: {
        flex: 1,
        minHeight: 30,
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      title: {
        marginBottom: 5,
      },
      display: {
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 5,
      },
      date: {
        fontSize: 13,
        color: Colors.lightGray,
      },
      output: {
        fontSize: 13,
        color: Colors.lightGray,
        fontWeight: 'bold',
      },
      process_icon: {
        width: 38,
        height: 38,
        marginRight: 6,
      },
    })
	  return (
		  <View style={styles.container}>
			  <View>
				  <Image source={ImageUtility.requireIcon(this.props.imgpath)} style={styles.process_icon} />
			  </View>
			  <View style={styles.text_container}>
				  <Text style={styles.display}>{this.props.name}</Text>
				  <View style={{ flexDirection: 'row' }}>
					  <Text style={styles.output}>
              {`${this.props.outputAmount} ${pluralize(this.props.outputUnit, this.props.outputAmount)} `}</Text>
            <Text style={styles.date}>started at {this.props.date}</Text>
				  </View>
			  </View>
		  </View>
	  )
  }
}

export class BottomTablePadding extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const width = Dimensions.get('window').width
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: 'row',
        width: width,
        paddingTop: 20,
        paddingBottom: 100,
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
      title: {
        marginBottom: 5,
        fontSize: 18,
        color: Colors.lightGray,
      },
    })
    return (
      <View style={styles.container}>
        <Text style={styles.title}>That's all for this task!</Text>
      </View>
    )
  }
}
