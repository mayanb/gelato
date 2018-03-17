import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	Dimensions,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Button,
} from 'react-native'
import { Camera } from 'expo'
import ActionButton from 'react-native-action-button'
import Compute from '../resources/Compute'
import Colors from '../resources/Colors'
import Networking from '../resources/Networking-superagent'
import { INVALID_QR, ALREADY_ADDED_MOVE_ITEM } from '../resources/QRSemantics'
import * as ImageUtility from '../resources/ImageUtility'
import Modal from '../components/Modal'
import QRDisplay from '../components/QRDisplay'
import { MoveItemListModal } from '../components/MoveItemListModals'
import paramsToProps from '../resources/paramsToProps'

class Move extends Component {
	static navigationOptions = () => {
		return {
			header: null,
		}
	}

	constructor(props) {
		super(props)

		this.state = {
			expanded: false,
			barcode: false,
			foundQR: null,
			semantic: '',
			scanned_items: [],
		}

		this.navigateToNext = this.navigateToNext.bind(this)
		this.testBarCodeRead = this.testBarCodeRead.bind(this)
	}

	// MARK: - RENDERERS
	render() {
		let { expanded, barcode, scanned_items } = this.state
		return (
			<View style={styles.container}>
				<Camera
					ref={cam => {
						this.camera = cam
					}}
					onBarCodeRead={this.handleBarCodeRead.bind(this)}
					style={styles.preview}
				/>
				<View style={styles.button}>
					<View style={styles.title}>
						<Image source={ImageUtility.requireIcon('move_items_text.png')} />
						<Button title="hello" onPress={this.testBarCodeRead} />
					</View>
					<TouchableOpacity
						onPress={this.handleClose.bind(this)}
						style={styles.closeTouchableOpacity}>
						<Image
							style={styles.close}
							source={ImageUtility.systemIcon('close_camera')}
							title=""
							color="white"
						/>
					</TouchableOpacity>
				</View>
				{(expanded || barcode) && this.renderModal()}
				{this.renderActionButtons()}
			</View>
		)
	}

	renderActionButtons() {
		let { expanded, barcode, scanned_items } = this.state
		if (!expanded && !barcode && scanned_items.length > 0) {
			return [this.renderItemListButton(true), this.renderNextButton(true)]
		} else {
			return [this.renderItemListButton(), this.renderNextButton()]
		}
	}

	renderItemListButton(active) {
		let items = this.state.scanned_items
		return (
			<ActionButton
				buttonColor={active ? Colors.base : Colors.gray}
				activeOpacity={active ? 0.5 : 1}
				buttonText={String(items.length)}
				position="left"
				onPress={active && this.handleToggleItemList.bind(this)}
			/>
		)
	}

	renderNextButton(active) {
		if (this.state.scanned_items.length <= 0) {
			return null
		}
		return (
			<ActionButton
				buttonColor={active ? Colors.lightPurple : Colors.gray}
				activeOpacity={1}
				icon={<Image source={ImageUtility.requireIcon('rightarrow.png')} />}
				onPress={active && this.navigateToNext}
				position="right"
			/>
		)
	}

	renderModal() {
		if (this.state.expanded) {
			return this.renderItemListModal()
		} else if (this.state.barcode) {
			return this.renderQRModal()
		}
	}

	renderItemListModal() {
		return (
			<MoveItemListModal
				task={this.props.task}
				processUnit={this.props.processUnit}
				onCloseModal={this.handleCloseModal.bind(this)}
				onRemove={this.handleRemoveInput.bind(this)}
				onOpenTask={() => {}}
				items={this.state.scanned_items}
			/>
		)
	}

	renderQRModal() {
		let { foundQR, isFetching } = this.state

		if (isFetching) {
			return this.renderQRLoading()
		}

		let creatingTask = foundQR && foundQR.creating_task 

		return (
			<Modal onPress={this.handleCloseModal.bind(this)}>
				{this.renderInputQR(creatingTask)}
			</Modal>
		)
	}

	renderInputQR(creatingTask) {
		let { barcode, semantic } = this.state

		return (
			<QRDisplay
				barcode={barcode}
				creating_task={creatingTask?creatingTask.display:""}
				semantic={semantic}
				shouldShowAmount={false}
				onPress={this.handleAddInput.bind(this)}
				onCancel={this.handleCloseModal.bind(this)}
			/>
		)
	}

	renderQRLoading() {
		return <Text>Loading...</Text>
	}

	// MARK: - EVENT HANDLERS
	handleCloseModal() {
		this.setState({
			barcode: false,
			foundQR: false,
			semantic: '',
			amount: this.state.default_amount,
			expanded: false,
			isFetching: false,
		})
	}

	handleAddInput() {
		let scanned_items = this.state.scanned_items.concat([this.state.foundQR])
		this.setState({ scanned_items: scanned_items })
		this.handleCloseModal()
	}

	handleRemoveInput(i) {
		let { scanned_items } = this.state
		// let item = task['inputs'][i]
		const success = () => {
			// if (this.props.task.inputs.length === 0) {
			if (scanned_items.length === 0) {
				this.handleCloseModal()
			}
		}
		scanned_items.splice(i, 1)
		this.setState({ scanned_items: scanned_items })
		success()
	}

	handleToggleItemList() {
		this.setState({ expanded: !this.state.expanded })
	}

	handleClose() {
		this.props.navigation.popToTop()
		this.props.navigation.goBack(null)
	}

	handleBarCodeRead(e) {
		let data = e.data.trim() // for some reason the qr code printed has some spaces sometimes
		let { expanded, barcode, scanned_items } = this.state
		if (expanded || barcode) {
			return
		}

		let valid = Compute.validateQR(data)
		if (!valid) {
			// not a valid qr code
			this.setState({
				barcode: data,
				isFetching: false,
				foundQR: null,
				semantic: INVALID_QR,
			})
		} else if (scanned_items.map(a => a.item_qr).includes(data)) {
			// its already an input to this task
			this.setState({
				barcode: data,
				isFetching: false,
				foundQR: null,
				semantic: ALREADY_ADDED_MOVE_ITEM,
			})
		} else {
			// fetch all the data about this qr code
			this.setState({ barcode: data, isFetching: true })
			this.fetchBarcodeData(data)
		}
	}

	fetchBarcodeData(code) {
		let { mode } = this.props
		let success = (data, semantic) => {
			this.setState({ foundQR: data, semantic: semantic, isFetching: false })
		}
		let failure = () =>
			this.setState({ foundQR: null, semantic: INVALID_QR, isFetching: false })

		Networking.get('/ics/items')

		Networking.get('/ics/items/')
			.query({ item_qr: code })
			.end((err, res) => {
				if (err || !res.ok) {
					failure()
				} else {
					let found = res.body.length ? res.body[0] : null
					if (found) {
						let semantic = Compute.getQRSemantic(mode, found)
						success(found, semantic)
					} else {
						failure()
					}
				}
			})
	}

	navigateToNext() {
		this.props.navigation.navigate('ChooseTeam', {
			name: 'Move',
			items: this.state.scanned_items,
		})
	}

	// MARK: - DEBUG

	/* CALL THIS FUNCTION IF YOU WANT TO TEST onBarCodeRead() on the simulator!
	 * ----
	 * Eg. you can put a button that calls this function, so you can test the 
	 * flow fo what happens when you read a barcode.
	 */
	testBarCodeRead() {
		let barcode = 'dande.li/ics/84a8c86e-2d23-47c8-996f-92f6834e27ed'
		setTimeout(() => this.handleBarCodeRead({ data: barcode }), 1000)
	}
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
	},
	close: {
		position: 'absolute',
		top: 20 + 16,
		left: 16,
	},
	closeTouchableOpacity: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 50,
		height: 80,
	},
	title: {
		alignItems: 'center',
		marginTop: 20 + 16,
	},
})

const mapStateToProps = (/* state, props */) => {
	return {}
}

export default paramsToProps(connect(mapStateToProps)(Move))
