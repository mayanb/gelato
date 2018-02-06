import React from 'react'
import {
  Image,
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'

export default class AttributeCell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      typedValue: this.props.value,
      editing: false,
      loading: false,
    }
    this.edit = this.edit.bind(this)
  }

  render() {
    let { name } = this.props
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    return (
      <View style={styles.container}>
        <Text style={styles.name}>{name}</Text>
        {this.renderValue()}
      </View>
    )
  }

  renderValue() {
    if (this.state.loading) {
      return <ActivityIndicator size="small" color={Colors.base} />
    } else if (this.state.editing || Boolean(this.props.value)) {
      const keyboardType = this.props.type === 'NUMB' ? 'numeric' : 'default'
      return (
        <TextInput
          style={styles.value}
          onChangeText={this.handleChangeText.bind(this)}
          onSubmitEditing={this.handleSubmitEditing.bind(this)}
          onBlur={this.handleSubmitEditing.bind(this)}
          returnKeyType="done"
          value={this.state.typedValue}
          keyboardType={keyboardType}
          autoCorrent={false}
          ref={input => (this.input = input)}
        />
      )
    } else {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.edit}
          style={styles.editButton}>
          <View>
            <Image source={ImageUtility.uxIcon('edit')} />
          </View>
        </TouchableOpacity>
      )
    }
  }

  handleChangeText(text) {
    this.setState({ typedValue: text })
  }

  handleSubmitEditing() {
    this.setState({ editing: false })
    if (this.state.typedValue !== this.props.value) {
      this.setState({ loading: true })
      this.props
        .onSubmitEditing(this.props.id, this.state.typedValue)
        .finally(() => this.setState({ loading: false }))
    }
  }

  edit() {
    this.setState({ editing: true }, () => {
      this.input.focus()
    })
  }
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    width: width,
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ultraLightGray,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },
  name: {
    color: Colors.lightGray,
    flex: 1,
    fontSize: 17,
  },
  value: {
    fontSize: 17,
    color: Colors.textBlack,
    flex: 1,
    textAlign: 'right',
  },
  editButton: {
    width: width / 2,
    height: 59,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
