import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import moment from 'moment'
import Colors from '../resources/Colors'
import { FlagPill, AncestorFlagPill } from './Flag'
import * as ImageUtility from '../resources/ImageUtility'


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
              {!this.props.is_flagged && this.props.is_ancestor_flagged && <AncestorFlagPill />}
              <Text style={styles.display}>{this.props.name}</Text>
            </View>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.date}>{moment(this.props.date).fromNow()}</Text>
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
    })
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
      </View>
    )
  }
}

export class TagHeader extends Component {
  render() {
    return (
      <CheckBox title='Select/Deselect All' />
    )
  }
}
export class TagRow extends Component {
  render() {
    const { name, checked } = this.props
    const styles = StyleSheet.create({
      container: {
        borderWidth: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: Colors.veryLightGray,
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 20,
        paddingRight: 20,
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
      },
      text: {
        fontSize: 18,
        marginLeft: 40,
        fontWeight: 'normal',
        color: !!checked ? Colors.textBlack : Colors.lightGray,
      },
    })

    return (
      <CheckBox title={name} checked={!!checked} containerStyle={styles.container} textStyle={styles.text} />
    )
  }
}

