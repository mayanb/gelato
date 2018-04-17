import React, { Component } from 'react'
import Colors from '../../resources/Colors'
import { StyleSheet, Text, View, Image, TouchableOpacity, AlertIOS } from 'react-native'
import pluralize from 'pluralize'
import * as ImageUtility from '../../resources/ImageUtility'

export default class InputsContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			expanded: false,
		}

		this.handleToggleExpanded = this.handleToggleExpanded.bind(this)
	}

	handleToggleExpanded() {
		this.setState({ expanded: !this.state.expanded })
	}

	render() {
		const { inputs, onRemove } = this.props
		const styles = StyleSheet.create({
			container: {},
			firstRowContainer: {
				height: 36,
				paddingLeft: 32,
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: Colors.extremelyLightGray,
			},
			taskCountContainer: {
				width: 72,
				flex: 0,
			},
			taskCount: {
				color: Colors.lightGray,
			},
			expandButton: {
				height: 36,
				width: 36,
				justifyContent: 'center',
			},
			arrowIcon: {
				height: 16,
				width: 16,
			},
		})
		const taskCount = `${inputs.length} ${pluralize('task', inputs.length)}`
		return (
			<View style={styles.container}>
				<View style={styles.firstRowContainer}>
					<View style={styles.taskCountContainer}>
						<Text style={styles.taskCount}>{taskCount}</Text>
					</View>
					<TouchableOpacity onPress={this.handleToggleExpanded} style={styles.expandButton}>
						<Image source={ImageUtility.requireIcon('downarrow.png')} style={styles.arrowIcon} />
					</TouchableOpacity>
				</View>
				<View>
					{this.state.expanded && inputs.map(input => <InputRow key={input.id} input={input}
					                                                      onRemove={onRemove} />)}
				</View>
			</View>
		)
	}
}

class InputRow extends Component {
	constructor(props) {
		super(props)
		this.handleRemove = this.handleRemove.bind(this)
	}

	handleRemove() {
		AlertIOS.alert(
			'Are you sure you want to remove this item?',
			'',
			[
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{
					text: 'Remove',
					onPress: () => this.props.onRemove(this.props.input.id)
				}
			]
		)
	}

	render() {
		const styles = StyleSheet.create({
			container: {
				paddingLeft: 48,
				paddingRight: 48,
				height: 32,
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
			},
			remove: {
				color: Colors.red,
				fontSize: 12,
			},
		})
		return (
			<View style={styles.container}>
				<Text>{shortQR(this.props.input.input_qr)}</Text>
				<TouchableOpacity onPress={this.handleRemove}>
					<Text style={styles.remove}>Remove</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

function shortQR(qr) {
	return qr.substring(qr.length - 6)
}

