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
import moment from 'moment'
import { FlagPill, AncestorFlagPill } from './Flag'
import { DateFormatter } from '../resources/Utility'
import EditButton from './Task/EditButton'

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

export class CreateTaskSelect extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let { onPress, imgpath, name } = this.props
		const imgSize = 24
		const styles = StyleSheet.create({
			container: {
				flex: 1,
				flexDirection: 'row',
				alignSelf: 'stretch',
				height: 60,
				shadowColor: 'rgba(0, 0, 0, 0.07)',
				shadowOffset: {
					width: 0,
					height: 2
				},
				shadowRadius: 4,
				shadowOpacity: 1,
				borderStyle: 'solid',
				borderRadius: 4,
				borderWidth: 1,
				borderColor: 'rgba(0, 0, 0, 0.08)',
				paddingTop: 8,
				paddingBottom: 8,
				paddingLeft: 20,
				paddingRight: 20,
				alignItems: 'center',
				backgroundColor: 'white',
			},
			display: {
				fontSize: 17,
				color: Colors.textblack,
				opacity: this.props.id === -1 ? 0.65 : 1,
				flex: 1,
			},
			process_icon: {
				width: imgSize,
				height: imgSize,
				marginRight: 8,
				flexGrow: 0,
			},
			arrow: {
				flexGrow: 0,
			},
		})
		return (
			<TouchableOpacity activeOpacity={0.5} onPress={onPress}>
				<View style={styles.container}>
					{Boolean(imgpath) && (
						<Image
							source={ImageUtility.requireIcon(imgpath)}
							style={styles.process_icon}
						/>
					)}
					<Text style={styles.display}>{name}</Text>
					{this.props.header ? (
						<Image
							style={styles.arrow}
							source={ImageUtility.requireIcon('downarrow.png')}
						/>
					) : null}
				</View>
			</TouchableOpacity>
		)
	}
}
