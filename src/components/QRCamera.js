import React, { Component } from 'react'
import {
	Dimensions,
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
} from 'react-native'
import { Camera } from 'expo'
import { SafeAreaView } from 'react-navigation'
import * as ImageUtility from '../resources/ImageUtility'
import { SearchDropdown, SearchBox } from '../components/SearchDropdown'

export default class QRCamera extends Component {
	constructor(props) {
		super(props)
		this.state = {
			typeSearch: false,
		}
	}

	render() {
		let { typeSearch } = this.state
		let { onBarCodeRead, onSelectFromDropdown, onChangeText, searchable, searchData, searchText, isLoading } = this.props
		return (
			<View style={styles.container}>
				<Camera
					ref={cam => {
						this.camera = cam
					}}
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

				{searchable && (
					<SafeAreaView
						style={styles.searchContainer}
						forceInset={{ top: 'always' }}>
						<SearchBox
							onChangeText={onChangeText}
							searchText={searchText}
							typeSearch={typeSearch}
							onFocus={this.handleFocus.bind(this)}
							clearText={this.handleBlur.bind(this)}
						/>
					</SafeAreaView>
				)}
				{typeSearch && (
					<SearchDropdown
						onSelect={onSelectFromDropdown}
						data={searchData}
						isLoading={isLoading}
					/>
				)}
			</View>
		)
	}

	handleFocus() {
		this.setState({ typeSearch: true })
		//  TO DO: clear prop searchData
		this.props.onChangeText('')
	}

	handleBlur() {
		this.setState({ typeSearch: false })
		//  TO DO: clear prop searchData
		this.props.onChangeText('')
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
