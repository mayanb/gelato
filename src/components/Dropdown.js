import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'
import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  View,
} from 'react-native'
import { CreateTaskSelect } from './Cells'
import Collapsible from 'react-native-collapsible'

export class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
    }
  }

  render() {
    let { selectedItem, data, testID } = this.props
    let { collapsed } = this.state
    return (
      <View style={styles.container} testID={testID}>
        {this.renderHeader(selectedItem)}
        <Collapsible collapsed={collapsed}>
          <FlatList
            data={data}
            renderItem={this.renderItem.bind(this)}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            style={styles.choices}
          />
        </Collapsible>
      </View>
    )
  }

  renderItem({ item }) {
    return (
      <CreateTaskSelect
        name={item.name}
        imgpath={item.icon}
        key={item.id}
        id={item.id}
        onPress={e => this.handleSelect(item)}
        testID="dropdown-item"
      />
    )
  }

  // Unsure why this is in a function
  // it was just a lot of lines of code
  renderHeader(selectedItem) {
    return (
      <CreateTaskSelect
        name={selectedItem.name}
        imgpath={selectedItem.icon}
        key={selectedItem.id}
        id={selectedItem.id}
        header={true}
        onPress={this.handleToggle.bind(this)}
      />
    )
  }

  handleSelect(item) {
    this.props.onSelect(item)
    this.handleToggle()
  }

  handleToggle() {
    this.setState({ collapsed: !this.state.collapsed })
  }

  keyExtractor = (item, index) => {
    item.id
  }
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {},
  list: {
    // marginTop: 13,
  },
  choices: {
    // maxHeight: 300
  },
})
