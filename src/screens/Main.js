// Copyright 2018 Addison Leong for Polymerize, Inc.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, SectionList, StyleSheet, View } from 'react-native'
import ActionButton from 'react-native-action-button'
import ActionSheet from 'react-native-actionsheet'
import NavHeader from 'react-navigation-header-buttons'
import { clearUser } from 'react-native-authentication-helpers'

import { TaskRow, TaskRowHeader } from '../components/Cells'
import Colors from '../resources/Colors'
import Storage from '../resources/Storage'
import { DateFormatter } from '../resources/Utility'
import * as actions from '../actions/TaskListActions'

const ACTION_TITLE = 'Settings'
const ACTION_OPTIONS = ['Close', 'Logout', 'Search']
const CANCEL_INDEX = 0

class Main extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const params = navigation.state.params || {}
    const { showActionSheet } = params

    return {
      title: screenProps.team,
      headerLeft: (
        <NavHeader color={Colors.white}>
          <NavHeader.Item
            label="Settings"
            onPress={showActionSheet}
            buttonStyle={{ fontSize: 15 }}
          />
        </NavHeader>
      ),
    }
  }

  constructor(props) {
    super(props)
    console.disableYellowBox = true
    this.handlePress = this.handlePress.bind(this)
    // Storage.clear()
  }

  componentWillMount() {
    this.props.navigation.setParams({
      showActionSheet: () => this.ActionSheet.show(),
    })
  }

  componentDidMount() {
    this.props.dispatch(actions.fetchOpenTasks())
    this.props.dispatch(actions.fetchCompletedTasks())
  }

  handlePress(i) {
    if (ACTION_OPTIONS[i] === 'Logout') {
      Storage.clear()
      clearUser()
    }
    if (ACTION_OPTIONS[i] === 'Search') {
      this.props.navigation.navigate('Search')
    }
  }

  render() {
    let sections = this.loadData()
    return (
      <View style={styles.container}>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={ACTION_TITLE}
          options={ACTION_OPTIONS}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={this.handlePress}
        />
        <SectionList
          style={styles.table}
          renderItem={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          sections={sections}
          keyExtractor={this.keyExtractor}
        />
        <ActionButton
          buttonColor={Colors.base}
          activeOpacity={0.5}
          onPress={this.handleCreateTask.bind(this)}
        />
      </View>
    )
  }

  handleCreateTask() {
    this.props.navigation.navigate('CreateTask')
  }

  loadData() {
    // // Make the request
    // const teamData = await Compute.classifyTasks(this.props.teamID); // Gets all of the task data
    // // Send the data into our state
    // await this.setState({tasks: teamData});
    let open = this.props.openTasks.data
    let completed = this.props.completedTasks.data

    return [
      {
        data: open,
        key: 'open',
        title: 'OPEN TASKS',
        isLoading: this.props.openTasks.ui.isFetchingData,
      },
      {
        data: completed,
        key: 'completed',
        title: 'RECENTLY COMPLETED',
        isLoading: this.props.completedTasks.ui.isFetchingData,
      },
      {
        data: [],
        key: 'space',
      },
    ]
  }

  // Helper function to render individual task cells
  renderRow = ({ item }) => {
    return (
      <TaskRow
        title={item.display}
        key={item.id}
        id={item.id}
        imgpath={item.process_type.icon}
        open={item.is_open}
        name={item.process_type.name}
        date={DateFormatter.shorten(item.updated_at)}
        onPress={this.openTask.bind(this)}
      />
    )
  }

  // Helper function to render headers
  renderSectionHeader = ({ section }) => (
    <TaskRowHeader title={section.title} isLoading={section.isLoading} />
  )

  // Extracts keys - required for indexing
  keyExtractor = (item, index) => item.id

  // Event for navigating to task detail page
  openTask(id, name, open, imgpath, title, date) {
    this.props.navigation.navigate('Task', {
      id: id,
      name: name,
      open: open,
      imgpath: imgpath,
      title: title,
      date: date,
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
})

const mapStateToProps = (state, props) => {
  return {
    openTasks: state.openTasks,
    completedTasks: state.completedTasks,
  }
}

export default connect(mapStateToProps)(Main)
