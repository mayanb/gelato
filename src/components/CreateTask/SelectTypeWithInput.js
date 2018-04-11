import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Dropdown } from '../Dropdown'
import { SelectTypeInput, CreateTaskCell } from './CreateTaskCell'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class SelectTypes extends Component {
	constructor(props) {
		super(props)
		this.state = {
			text: '',
			filtered_results: [],
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<SelectTypeInput
					placeholder={this.props.placeholder}
					onChangeText={t => this.props.onChangeText(t)}
					returnKeyType="next"
					blurOnSubmit={false}
					value={this.props.text}
					selected={this.props.selected}
					registerInput={this.props.registerInput}
					onFocus={this.props.onFocus}
				/>
				{ this.props.dropdown_open && (
				<KeyboardAwareScrollView keyboardShouldPersistTaps='handled' >
					{this.props.data.map(e => {
						return <CreateTaskCell key={'stwi-' + e.id} {...e} imgpath={e.icon} onPress={() => this.props.onSelect(e)}/>
					})}
				</KeyboardAwareScrollView>
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		margin: 20,
		backgroundColor: 'white',
		shadowColor: 'rgba(0, 0, 0, 0.07)',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowRadius: 4,
		shadowOpacity: 1,
		borderStyle: 'solid',
		borderRadius: 4,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.08)',
		overflow: 'hidden',
	},
	scroll: {
		paddingTop: 20,
		paddingBottom: 40,
		flex: 1,
		backgroundColor: 'blue',
	},
})
