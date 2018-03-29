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


class EnterBatchSize extends Component {
  static navigationOptions = {
    title: 'New Task',
  }

  constructor(props) {
    super(props)
    this.state = {
      batchSize: null,
      isCreatingTask: false,
    }
    this.onChangedNumber = this.onChangedNumber.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
  }

  componentWillReceiveProps(np) {
    if (np.hasJustCreatedItem) {
      this.openTaskName(np.hasJustCreatedItem)
    }
  }

  render() {
    let { batchSize } = this.state
    let { unit, defaultBatchSize } = this.props
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <Text style={styles.title}>Enter your batch size...</Text>
          <Text>{unit}</Text>
            <BatchNumberInput
              keyboardType="numeric"
              placeholder="1"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={text => this.onChangedNumber(text)}
              returnKeyType="done"
            />
        </ScrollView>
        {batchSize && (
          <ActionButton
            buttonColor={Colors.base}
            activeOpacity={0.5}
            onPress={this.handleCreate}
            buttonText=">"
            icon={<Image source={ImageUtility.requireIcon('rightarrow.png')} />}
          />
        )}
      </View>
    )
  }

  onChangedNumber(num) {
    let batchSize = num !== '' ? parseFloat(num) : 0
    this.setState({ batchSize: batchSize })
  }

  handleCreate() {
    let { dispatch, selectedProduct, selectedProcess } = this.props
    let { batchSize } = this.state
    let data = { processType: selectedProcess, productType: selectedProduct, batchSize: batchSize }
    this.setState({ isCreatingTask: true })
    dispatch(taskActions.requestCreateTask(data)).catch(e => {
      dispatch(errorActions.handleError(Compute.errorText(e)))
      this.setState({ isCreatingTask: false })
    })
  }

  openTaskName(task) {
    this.props.navigation.goBack()
    this.props.navigation.navigate('TaskName', {
     id: task.id,
     name: task.display,
     open: true,
     task: task,
     date: DateFormatter.shorten(task.created_at),
     taskSearch: false,
     title: task.display,
    })
  }

}

const mapStateToProps = (state /*, props */) => {
  return {
    hasJustCreatedItem: state.openTasks.ui.hasJustCreatedItem,
  }
}

export default paramsToProps(connect(mapStateToProps)(EnterBatchSize))

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
