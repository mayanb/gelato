import Colors from '../resources/Colors'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Text, View, ScrollView, Image} from 'react-native'
import { PrintButton, BatchNumberInput } from '../components/Forms'
import ActionButton from 'react-native-action-button'
import * as actions from '../actions/ProcessesAndProductsActions'
import * as errorActions from '../actions/ErrorActions'
import * as taskActions from '../actions/TaskListActions'
import * as ImageUtility from '../resources/ImageUtility'
import paramsToProps from '../resources/paramsToProps'
import { DateFormatter } from '../resources/Utility'
import Compute from '../resources/Compute'


class TaskName extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const { showActionSheet } = params
    return {
      title: params.name,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
    }
    this.openCreatedTask = this.openCreatedTask.bind(this)
  }


  render() {
    let { name } = this.props
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <Text style={styles.title}>{name}</Text>
        </ScrollView>
          <ActionButton
            buttonColor={Colors.base}
            activeOpacity={0.5}
            onPress={this.openCreatedTask}
            buttonText=">"
            icon={<Image source={ImageUtility.requireIcon('rightarrow.png')} />}
          />
      </View>
    )
  }


  openCreatedTask() {
    let { id, name, task, date, title } = this.props
    this.props.navigation.goBack()
    this.props.navigation.navigate('Task', {
     id: id,
     name: name,
     open: true,
     task: task,
     date: date,
     taskSearch: false,
     title: title,
    })
  }
}

const mapStateToProps = (state /*, props */) => {
  return {
  }
}

export default paramsToProps(connect(mapStateToProps)(TaskName))

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    flex: 1,
    paddingTop: 25,
  },
  inputTitle: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 10,
    alignSelf: 'center',
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 12,
    alignSelf: 'center',
  },
  title: {
    fontSize: 17,
    marginLeft: 16,
    color: Colors.textblack,
    opacity: 0.9,
    marginBottom: 10,
    marginTop: 50,
  },
  numberInput: {
    paddingLeft: 20,
    paddingRight: 20,
  }
})
