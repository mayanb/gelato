import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, View, Text } from 'react-native'
import Storage from '../resources/Storage'
import Compute from '../resources/Compute'
import Networking from '../resources/Networking-superagent'
import { INVALID_QR } from '../resources/QRSemantics'
import QRCamera from '../components/QRCamera'
import paramsToProps from '../resources/paramsToProps'
import ModalAlert from '../components/ModalAlert'

class Search extends Component {
	constructor(props) {
		super(props)
		this.state = {
			expanded: false,
			barcode: false,
			foundQR: null,
			semantic: '', // semantic is a string that indicates what to display out of the various options
			searchText: '',
			typeSearch: false,
			showNotFoundModal: false,
			isLoading: false,
			searchData: [],
			request: null,
		}
		this.closeModal = this.closeModal.bind(this)
	}

	render() {
		let { typeSearch, searchText, searchData, showNotFoundModal } = this.state

		return (
			<View style={styles.container}>
				<QRCamera
					searchable={true}
					onBarCodeRead={this.handleBarCodeRead.bind(this)}
					onClose={this.handleClose.bind(this)}
					searchData={this.state.searchData}
					onChangeText={this.handleChangeText.bind(this)}
					onSelectFromDropdown={this.handleSelectTaskFromDropdown.bind(this)}
				/>
				{showNotFoundModal && this.renderNotFoundModal()}
			</View>
		)
	}

	handleClose() {
		console.log('close')
		this.props.navigation.goBack()
	}

	async handleChangeText(text) {
		const { request } = this.state
		if (request) {
			request.abort()
		}

		const teamID = await Storage.get('teamID')
		const r = Compute.getSearchResults(text, teamID)
		r
			.then(res =>
				this.setState({ searchData: res.body.results, isLoading: false })
			)
			.catch(() => this.setState({ searchData: [], isLoading: false }))

		this.setState({ request: r, isLoading: true })
	}

	toggleTypeSearch() {
		this.setState({ typeSearch: !this.state.typeSearch })
	}

	handleSelectTaskFromDropdown(task) {
		this.navigateToFoundTask(task)
	}

	handleBarCodeRead(e) {
		let data = e.data.trim() // for some reason the qr code printed has some spaces sometimes
		let { expanded, barcode } = this.state
		if (expanded || barcode) {
			return
		}

		let valid = Compute.validateQR(data)
		if (!valid) {
			this.setState({ showNotFoundModal: true, semantic: INVALID_QR })
		} else {
			this.setState({ barcode: data, isFetching: true })
			this.fetchBarcodeData(data) // get detailed info about this bar code from the server
		}
	}

	fetchBarcodeData(code) {
		let { mode } = this.props

		let success = () => {
			// this.setState({foundQR: searchData, semantic: semantic, isFetching: false})
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
					if (found) {
						this.navigateToFoundTask(found.creating_task)
					} else {
						this.setState({ showNotFoundModal: true })
					}
				}
			})
	}

	renderNotFoundModal() {
		return (
			<ModalAlert
				onPress={this.closeModal}
				message={<Text>{"This QR Code isn't in our system!"}</Text>}
				buttonText="Close"
			/>
		)
	}

	closeModal() {
		this.setState({
			showNotFoundModal: false,
			expanded: false,
			barcode: false,
			foundQR: null,
			semantic: '',
			searchText: '',
			isFetching: false,
		})
	}

	navigateToFoundTask(foundTask) {
		this.props.navigation.goBack()
		this.props.navigation.navigate('Task', { id: foundTask.id })
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
