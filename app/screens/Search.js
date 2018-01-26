import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, Text, View, Button, FlatList, Image, TouchableOpacity } from 'react-native'
import Camera from 'react-native-camera'
import ActionButton from 'react-native-action-button'
import Compute from '../resources/Compute'
import Colors from '../resources/Colors'
import Networking from '../resources/Networking-superagent'
import {ALREADY_ADDED, INVALID_QR} from '../resources/QRSemantics'
import * as ImageUtility from '../resources/ImageUtility'
import Modal from '../components/Modal'
import {QRItemListRow, QRDisplay} from '../components/QRComponents'
import * as actions from '../actions/TaskListActions'
import SearchDropdown from '../components/SearchDropdown'

class Search extends Component {
	constructor(props) {
		super(props)
		this.state = {
			expanded: false,
			barcode: false,
			foundQR: null,
			semantic: "", // semantic is a string that indicates what to display out of the various options
		}
	}


	render() {
		let {expanded, barcode } = this.state
		let { mode, task } = this.props
		return (
			<View style={styles.container}>
				<SearchDropdown onSelect={this.onSelectTaskFromDropdown.bind(this)}/>
				<Button onPress={() => {setTimeout(() => this.onBarCodeRead({data: 'dande.li/ics/e1290d6d-93ac-4523-9268-46225f5d8e48'}), 1000)}} title="hello" />
			</View>
		)
	}

	/*
		<Camera
					ref={(cam) => { this.camera = cam }}
					onBarCodeRead={this.onBarCodeRead.bind(this)}
					style={styles.preview}
					aspect={Camera.constants.Aspect.fill}>
				</Camera>
				*/

	onSelectTaskFromDropdown(task) {
		this.navigateToFoundTask(task)
	}

	onBarCodeRead(e) {
		let {type, data} = e
		let {expanded, barcode} = this.state
		if (expanded || barcode) {
			return
		}

		let valid = Compute.validateQR(data)
		if (!valid) {
			this.setState({barcode: data, isFetching: false, foundQR: null, semantic: INVALID_QR})
		} else {
			this.setState({barcode: data, isFetching: true})
			this.fetchBarcodeData(data) // get detailed info about this bar code from the server
		}
	}

	fetchBarcodeData(code) {
		let {mode} = this.props

		let nav = this.props.navigator
		let disp = this.props.dispatch
		let s = this.state
		let success = (data, semantic) => {
			// this.setState({foundQR: data, semantic: semantic, isFetching: false})
			//navigate to task page
		}
		let failure = (data) => this.setState({foundQR: null, semantic: "", isFetching: false})
		Networking.get('/ics/items/')
			.query({item_qr: code})
			.end((err, res) => {
				if (err || !res.ok) {
					failure(err)
				} else {
					let found = res.body.length ? res.body[0] : null
					let semantic = Compute.getQRSemantic(mode, found)
					success(found, semantic)
					this.navigateToFoundTask(found.creating_task)
				}
			})
	}

	navigateToFoundTask(foundTask) {
		let nav = this.props.navigator
		nav.pop({
			animated: false,
		})
		nav.push({
			screen: 'gelato.Task',
			title: foundTask.display,
			animated: true,
			passProps: {
				id: foundTask.id, 
				name: foundTask.display,
				open: foundTask.open,
				task: foundTask,
				taskSearch: true,
			}
		})
	}

	keyExtractor = (item, index) => item.id;
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


const styles = StyleSheet.create({
	container: {
		flex: 1,
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
	scrim: {
		position: 'absolute',
		justifyContent: 'flex-end',
		alignItems: 'center',
		top: 0,
		left: 0,
		height: height,
		width: width,
		backgroundColor: 'rgba(255,0,0,0.5)',
	}, button: {
		position: 'absolute', 
		top: 24,
		left: 24,
	}
})

const mapStateToProps = (state, props) => {
	return {
		openTasks: state.openTasks,
		completedTasks: state.completedTasks,
		task: state.task,
	}
}

export default connect(mapStateToProps)(Search)