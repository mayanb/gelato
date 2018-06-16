import React, { Component } from 'react'
import {
	Dimensions,
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
	Platform,
} from 'react-native'
import { Camera } from 'expo'
import { SafeAreaView } from 'react-navigation'
import * as ImageUtility from '../resources/ImageUtility'
import { SearchDropdown, SearchBox } from '../components/SearchDropdown'

const DESIRED_CAMERA_RATIO = '16:9'

export default class QRCamera extends Component {
	constructor(props) {
		super(props)
		this.state = {
			searchText: '',
			camera: null,
			cameraRatio: undefined,
		}

		this.handleClearText = this.handleClearText.bind(this)
		this.getCameraRatio = this.getCameraRatio.bind(this)
	}

	render() {
		let { searchText, cameraRatio } = this.state
		let { onBarCodeRead, searchData, isLoading, typeSearch } = this.props
		return (
			<View style={styles.container}>
				<Camera
					ref={cam => {
						this.camera = cam
					}}
					ratio={cameraRatio}
					onCameraReady={this.getCameraRatio}
					onBarCodeRead={onBarCodeRead}
					style={styles.preview}
				/>

				<SafeAreaView
					style={StyleSheet.absoluteFill}
					forceInset={{ top: 'always' }}>
					<View style={{ flex: 1 }}>
						<View style={styles.button}>
							<TouchableOpacity
								onPress={this.props.onClose}
								hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
								style={styles.closeTouchableOpacity}>
								<Image
									source={ImageUtility.systemIcon('close_camera')}
									title=""
									color="white"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</SafeAreaView>

				<SafeAreaView
					style={styles.searchContainer}
					forceInset={{ top: 'always' }}>
					<SearchBox
						onChangeText={this.handleChangeText.bind(this)}
						searchText={searchText}
						typeSearch={typeSearch}
						onFocus={this.handleFocus.bind(this)}
						clearText={this.handleClearText}
						onBlur={this.handleClearText}
					/>
				</SafeAreaView>
				{typeSearch && (
					<SearchDropdown
						onSelect={this.handleSelectFromDropdown.bind(this)}
						data={searchData}
						isLoading={isLoading}
					/>
				)}
			</View>
		)
	}

	getCameraRatio = async () => {
		if (Platform.OS === 'android' && this.camera) {
			const ratios = await this.camera.getSupportedRatiosAsync()
			// See if the current device has your desired ratio, otherwise get the maximum supported one
			// Usually the last element of "ratios" is the maximum supported ratio
			const cameraRatio = ratios.find((ratio) => ratio === DESIRED_CAMERA_RATIO) || ratios[ratios.length - 1]
			this.setState({ cameraRatio })
		}
	}

	handleFocus() {
		this.setState({ searchText: '' })
		this.props.onTypeSearchChange(true)
	}

	handleClearText() {
		this.setState({ searchText: '' })
		this.props.onTypeSearchChange(false)
	}

	handleChangeText(text) {
		this.setState({ searchText: text })
		if (text.length < 2) return

		this.props.onChangeText(text)
	}

	handleSelectFromDropdown(item) {
		this.setState({ searchText: '' })
		this.props.onTypeSearchChange(false)
		this.props.onSelectFromDropdown(item)
	}
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'absolute',
		top: 0,
		left: 0,
		height: height,
		width: width,
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
		top: 12,
		left: 16,
	},
	text: {
		color: 'white',
		marginTop: 20,
	},
	closeTouchableOpacity: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 50,
		height: 50,
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
