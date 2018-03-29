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
			searchText: '',
			typeSearch: false,
		}
	}

	render() {
	  let { searchText, typeSearch } = this.state
		return (
			<View style={styles.container}>
				<Camera
					ref={cam => {
						this.camera = cam
					}}
					onBarCodeRead={this.props.onBarCodeRead}
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
						clearText={this.handleBlur.bind(this)}
					/>
				</SafeAreaView>
				{typeSearch && (
					<SearchDropdown
						onSelect={this.props.onSelectFromDropdown.bind(this)}
						data={this.props.searchData}
						isLoading={this.props.isLoading}
					/>
				)}
			</View>
		)
	}

	handleFocus() {
		this.setState({ searchText: '', typeSearch: true })
		//  TO DO: clear prop searchData
	}

	handleBlur() {
		this.setState({ searchText: '', typeSearch: false })
		//  TO DO: clear prop searchData
	}

	handleChangeText(text) {
    this.setState({ searchText: text })
    if (text.length < 2) return

    this.props.onChangeText(text)
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
