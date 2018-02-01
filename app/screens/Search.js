import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, Text, View, Button, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import Camera from 'react-native-camera'
import ActionButton from 'react-native-action-button'
import Compute from '../resources/Compute'
import Colors from '../resources/Colors'
import Networking from '../resources/Networking-superagent'
import {ALREADY_ADDED, INVALID_QR} from '../resources/QRSemantics'
import * as ImageUtility from '../resources/ImageUtility'
import Modal from '../components/Modal'
import * as actions from '../actions/TaskListActions'
import {SearchDropdown, SearchBox} from '../components/SearchDropdown'
import QRCamera from '../components/QRCamera'

class Search extends Component {
	constructor(props) {
		super(props)
		this.state = {
			expanded: false,
			barcode: false,
			foundQR: null,
			semantic: "", // semantic is a string that indicates what to display out of the various options

			searchText: "", 
			typeSearch: false,
			data: [],
		}
	}

	render() {
		let {expanded, barcode, typeSearch, searchText, data } = this.state
		let { mode, task } = this.props
		return (
			<View style={styles.container}>
				<QRCamera onBarCodeRead={this.onBarCodeRead.bind(this)} onClose={this.handleClose.bind(this)}/>
				<View style={styles.searchContainer}>
					<SearchBox 
						onChangeText={this.handleChangeText.bind(this)} 
						searchText={searchText} 
						typeSearch={typeSearch}
						onFocus={this.handleFocus.bind(this)}
						clearText={this.handleBlur.bind(this)}
					/>
				</View>
				{ typeSearch &&
					<SearchDropdown onSelect={this.onSelectTaskFromDropdown.bind(this)} data={data} isLoading={this.state.isLoading} />
				}
				</View>
		)
	}

	// <Button onPress={() => {setTimeout(() => this.onBarCodeRead({data: 'dande.li/ics/84a8c86e-2d23-47c8-996f-92f6834e27ed'}), 1000)}} title="hello" />
	//<SearchDropdown onSelect={this.onSelectTaskFromDropdown.bind(this)}/>

	// 

	handleFocus() {
		this.setState({data: [], searchText: "", typeSearch: true})
	}

	handleBlur() {
		this.setState({data: [], searchText: "", typeSearch: false})
	}

	handleClose() {
		let nav = this.props.navigator
		nav.pop({
			animated: false,
		})
	}

	handleChangeText(text) {
		let {request} = this.state
		this.setState({searchText: text})

		if (request) {
			request.abort()
		}

		if (text.length < 2) 
			return 

		let r = Networking.get('/ics/tasks/search/')
			.query({label: text})

		r.then(res => this.setState({data: res.body.results, isLoading: false}) )
			.catch(e => this.setState({data: [], isLoading: false}))

		this.setState({request: r, isLoading: true})
	}


	toggleTypeSearch() {
		this.setState({typeSearch: !this.state.typeSearch})
	}

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

					// it should only do this if found != null
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
				date: foundTask.created_at,
				taskSearch: true,
				title: foundTask.display,
				imgpath: foundTask.process_type.icon
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
	}, button: {
		position: 'absolute', 
		top: 24,
		left: 24,
	}, searchContainer: {
		position: 'absolute',
		top: 20,
		left: 0,
		width: width,
		alignItems: 'center',
		marginLeft: 32,
		paddingRight: 32,
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