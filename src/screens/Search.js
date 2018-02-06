import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import Compute from '../resources/Compute'
import Networking from '../resources/Networking-superagent'
import { INVALID_QR } from '../resources/QRSemantics'
import { SearchDropdown, SearchBox } from '../components/SearchDropdown'
import QRCamera from '../components/QRCamera'
import paramsToProps from '../resources/paramsToProps'

class Search extends Component {
  static navigationOptions = {
    // Not actually displayed, unsure what this is for
    title: 'Search for a task',
  }

  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      barcode: false,
      foundQR: null,
      semantic: '', // semantic is a string that indicates what to display out of the various options

      searchText: '',
      typeSearch: false,
      data: [],
    }
  }

  render() {
    let { typeSearch, searchText, data } = this.state

    return (
      <View style={styles.container}>
        <QRCamera
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          onClose={this.handleClose.bind(this)}
        />
        <SafeAreaView
          style={styles.searchContainer}
          forceInset={{ top: 'always' }}>
          <SearchBox
            onChangeText={this.handleChangeText.bind(this)}
            searchText={searchText}
            typeSearch={typeSearch}
            onFocus={this.handleFocus.bind(this)}
            clearText={this.handleBlur.bind(this)}
          />
        </SafeAreaView>
        {typeSearch && (
          <SearchDropdown
            onSelect={this.onSelectTaskFromDropdown.bind(this)}
            data={data}
            isLoading={this.state.isLoading}
          />
        )}
      </View>
    )
  }

  // <Button onPress={() => {setTimeout(() => this.onBarCodeRead({data: 'dande.li/ics/84a8c86e-2d23-47c8-996f-92f6834e27ed'}), 1000)}} title="hello" />
  // <SearchDropdown onSelect={this.onSelectTaskFromDropdown.bind(this)}/>
  //

  handleFocus() {
    this.setState({ data: [], searchText: '', typeSearch: true })
  }

  handleBlur() {
    this.setState({ data: [], searchText: '', typeSearch: false })
  }

  handleClose() {
    console.log('close')
    this.props.navigation.goBack()
  }

  handleChangeText(text) {
    let { request } = this.state
    this.setState({ searchText: text })
    if (request) {
      request.abort()
    }

    if (text.length < 2) return

    let r = Networking.get('/ics/tasks/search/').query({
      label: text,
      team: this.props.teamID,
    })

    r
      .then(res => this.setState({ data: res.body.results, isLoading: false }))
      .catch(() => this.setState({ data: [], isLoading: false }))

    this.setState({ request: r, isLoading: true })
  }

  toggleTypeSearch() {
    this.setState({ typeSearch: !this.state.typeSearch })
  }

  onSelectTaskFromDropdown(task) {
    this.navigateToFoundTask(task)
  }

  onBarCodeRead(e) {
    let { data } = e
    let { expanded, barcode } = this.state
    if (expanded || barcode) {
      return
    }

    let valid = Compute.validateQR(data)
    if (!valid) {
      this.setState({
        barcode: data,
        isFetching: false,
        foundQR: null,
        semantic: INVALID_QR,
      })
    } else {
      this.setState({ barcode: data, isFetching: true })
      this.fetchBarcodeData(data) // get detailed info about this bar code from the server
    }
  }

  fetchBarcodeData(code) {
    let { mode } = this.props

    let success = () => {
      // this.setState({foundQR: data, semantic: semantic, isFetching: false})
    }

    let failure = () =>
      this.setState({ foundQR: null, semantic: '', isFetching: false })

    Networking.get('/ics/items/')
      .query({ item_qr: code })
      .end((err, res) => {
        if (err || !res.ok) {
          failure(err)
        } else {
          let found = res.body.length ? res.body[0] : null
          let semantic = Compute.getQRSemantic(mode, found)
          success(found, semantic)

          // it should only do this if found != null
          this.navigateToFoundTask(found.creating_task)
        }
      })
  }

  navigateToFoundTask(foundTask) {
    this.props.navigation.goBack()
    this.props.navigation.navigate('Task', {
      id: foundTask.id,
      name: foundTask.display,
      open: foundTask.open,
      task: foundTask,
      date: foundTask.created_at,
      taskSearch: true,
      title: foundTask.display,
      imgpath: foundTask.process_type.icon,
    })
  }

  keyExtractor = item => item.id
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
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
    top: 24,
    left: 24,
  },
  searchContainer: {
    position: 'absolute',
    top: 5,
    left: 0,
    width: width,
    alignItems: 'center',
    marginLeft: 32,
    paddingRight: 32,
  },
})

const mapStateToProps = (state /*, props */) => {
  return {
    openTasks: state.openTasks,
    completedTasks: state.completedTasks,
    task: state.task,
  }
}

export default paramsToProps(connect(mapStateToProps)(Search))