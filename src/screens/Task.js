// Copyright 2018 Addison Leong for Polymerize, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Keyboard,
  SectionList,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  AlertIOS,
  Image,
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ActionButton from 'react-native-action-button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NavHeader from 'react-navigation-header-buttons'

import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import * as actions from '../actions/TaskListActions'
import { AttributeHeaderCell } from '../components/Cells'
import AttributeCell from '../components/AttributeCell'
import Flag from '../components/Flag'
import * as ImageUtility from '../resources/ImageUtility'
import { DateFormatter } from '../resources/Utility'
import paramsToProps from '../resources/paramsToProps'

const ACTION_TITLE = 'More'
const ACTION_OPTIONS = ['Cancel', 'Rename', 'Flag', 'Delete']
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 3

class Task extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const { showActionSheet } = params

    return {
      title: params.name,
      headerRight: (
        <NavHeader IconComponent={Ionicons} size={25} color={Colors.white}>
          <NavHeader.Item
            iconName="md-more"
            label=""
            onPress={showActionSheet}
          />
        </NavHeader>
      ),
    }
  }

  constructor(props) {
    super(props)
    this.handlePress = this.handlePress.bind(this)
    this.showCamera = this.showCamera.bind(this)
    this.printTask = this.printTask.bind(this)
    console.log(this.props)
  }

  showCustomNameAlert() {
    AlertIOS.prompt(
      'Enter a value',
      null,
      text =>
        this.props.dispatch(
          actions.requestRenameTask(
            this.props.task,
            text,
            this.props.taskSearch
          )
        ),
      'plain-text',
      this.props.task.display
    )
  }

  showConfirmDeleteAlert() {
    let { task } = this.props
    // Works on both iOS and Android
    Alert.alert(
      `Delete ${task.display}`,
      `Are you sure you want to delete ${task.display}?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Yes, delete',
          onPress: this.handleDeleteTask.bind(this),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    )
  }

  handlePress(i) {
    if (ACTION_OPTIONS[i] === 'Rename') {
      this.showCustomNameAlert()
    }
    if (ACTION_OPTIONS[i] === 'Flag') {
      this.props.dispatch(
        actions.requestFlagTask(this.props.task, this.props.taskSearch)
      )
    }
    if (ACTION_OPTIONS[i] === 'Delete') {
      this.showConfirmDeleteAlert()
    }
  }

  handleDeleteTask() {
    let success = () => {
      this.props.navigation.goBack()
    }
    this.props.dispatch(
      actions.requestDeleteTask(this.props.task, this.props.taskSearch, success)
    )
  }

  showCamera(mode) {
    this.props.navigation.navigate('QRScanner', {
      task_id: this.props.task.id,
      open: this.props.open,
      taskSearch: this.props.taskSearch,
      mode: mode,
      processUnit: this.props.task.process_type.unit,
    })
  }

  printTask(mode) {
    this.props.navigation.navigate('Print', {
      selectedTask: this.props.task,
    })
  }

  componentWillMount() {
    this.props.navigation.setParams({
      showActionSheet: () => this.ActionSheet.show(),
    })
  }

  componentDidMount() {
    this.props.dispatch(actions.resetJustCreated())
    if (this.props.taskSearch) {
      this.props.dispatch(actions.fetchTask(this.props.id))
    }
  }

  render() {
    let { task } = this.props
    console.log(task)
    if (!task) {
      return null
    }
    let outputAmount = task.items.reduce(function(total, current) {
      return total + parseInt(current.amount)
    }, 0)

    let imgpath = this.props.imgpath
      ? this.props.imgpath
      : task.process_type.icon

    let date = this.props.taskSearch
      ? DateFormatter.shorten(this.props.date)
      : this.props.date

    let sections = [
      {
        key: 'attributes',
        title: this.props.title,
        imgpath: imgpath,
        date: date,
        data: task.organized_attributes,
        type: 'Top',
        outputAmount: outputAmount,
        outputUnit: task.process_type.unit,
      },
      {
        key: 'bottom',
        type: 'Bottom',
        title: "That's all for this task!",
        data: [],
      },
    ]
    console.log(this.props.date)

    return (
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}>
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={ACTION_TITLE}
            options={ACTION_OPTIONS}
            cancelButtonIndex={CANCEL_INDEX}
            onPress={this.handlePress}
          />
          {task.is_flagged && <Flag />}
          <SectionList
            style={styles.table}
            renderItem={this.renderRow}
            renderSectionHeader={this.renderSectionHeader}
            sections={sections}
            keyExtractor={this.keyExtractor}
          />
          <ActionButton buttonColor={Colors.base} activeOpacity={0.5}>
            <ActionButton.Item
              buttonColor={'purple'}
              title="Print Task Label"
              onPress={() => this.printTask()}>
              <Image source={ImageUtility.requireIcon('print.png')} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor={'green'}
              title="Add Inputs"
              onPress={() => this.showCamera('inputs')}>
              <Image source={ImageUtility.requireIcon('inputs.png')} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor={'blue'}
              title="Add Outputs"
              onPress={() => this.showCamera('items')}>
              <Image source={ImageUtility.requireIcon('outputs.png')} />
            </ActionButton.Item>
          </ActionButton>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    )
  }

  renderRow = ({ item }) => (
    <AttributeCell
      title={item.display}
      key={item.id}
      id={item.id}
      name={item.name}
      value={item.value.value || ''}
      onSubmitEditing={this.handleSubmitEditing.bind(this)}
    />
  )

  handleSubmitEditing(id, newValue) {
    let task = this.props.task
    let attributeIndex = task.organized_attributes.findIndex(e =>
      Compute.equate(e.id, id)
    )
    let currValue = task.organized_attributes[attributeIndex].value
    if (newValue === currValue) {
      return
    }
    return this.props.dispatch(
      actions.updateAttribute(task, id, newValue, this.props.taskSearch)
    )
  }

  renderSectionHeader = ({ section }) => (
    <AttributeHeaderCell
      name={section.title}
      imgpath={section.imgpath}
      date={section.date}
      type={section.type}
      outputAmount={section.outputAmount}
      outputUnit={section.outputUnit}
    />
  )

  keyExtractor = (item, index) => item.id
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: Colors.bluishGray,
  },
})

const mapStateToProps = (state, props) => {
  let { taskSearch, open } = props
  let arr = state.searchedTasks.data
  if (!taskSearch && open) {
    arr = state.openTasks.data
  } else if (!taskSearch) {
    arr = state.completedTasks.data
  }

  return {
    task: arr.find(e => Compute.equate(e.id, props.id)),
  }
}

export default paramsToProps(connect(mapStateToProps)(Task))
