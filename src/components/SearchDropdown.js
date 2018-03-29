import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'
import React, { Component } from 'react'
import {
	ActivityIndicator,
	Dimensions,
	Image,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	ScrollView,
	View,
} from 'react-native'
import { CreateTaskSelect } from './Cells'
import Collapsible from 'react-native-collapsible'
import Networking from '../resources/Networking-superagent'

export class SearchDropdown extends Component {
	render() {
		let containerStyle = StyleSheet.create({
			container: {
				position: 'absolute',
				top: 100,
				left: 16,
				width: width - 32,
				height: height - 100,
				backgroundColor: 'rgba(0,0,0,0.5)',
				borderTopRightRadius: 4,
				borderTopLeftRadius: 4,
			},
		})

		return (
			<View style={containerStyle.container}>
				<View style={styles.results}>
					<FlatList
						data={this.props.data}
						renderItem={this.renderItem.bind(this)}
						extraData={this.state}
						keyExtractor={this.keyExtractor}
						style={styles.choices}
						ListHeaderComponent={this.renderLoader()}
					/>
				</View>
			</View>
		)
	}

	renderLoader() {
		return (
			this.props.isLoading && (
				<ActivityIndicator
					size="large"
					color={Colors.base}
					style={styles.indicator}
				/>
			)
		)
	}

	renderItem({ item }) {
		return (
			<SearchResultCell
				name={item.display}
				key={item.id}
				id={item.id}
				onPress={e => this.handleSelect(item)}
			/>
		)
	}

	handleSelect(item) {
		this.props.onSelect(item)
	}

	keyExtractor = (item, index) => {
		item.id
	}
}

function SearchResultCell(props) {
	return (
		<TouchableOpacity onPress={props.onPress}>
			<View style={styles.result}>
				<Text style={styles.resultText}>{props.name}</Text>
			</View>
		</TouchableOpacity>
	)
}

export function SearchBox(props) {
	return (
		<View style={styles.searchTextContainer}>
			<TextInput
				style={styles.searchText}
				placeholderTextColor="white"
				placeholder="Search"
				value={props.searchText}
				onChangeText={props.onChangeText}
				onFocus={props.onFocus}
				autoCorrect={false}
				//onBlur={props.onBlur}
				ref={input => (this.input = input)}
			/>
			<View style={styles.button}>
				<TouchableOpacity
					onPress={() => {
						props.clearText()
						this.input.blur()
					}}>
					<Image
						source={ImageUtility.systemIcon('close_camera')}
						title=""
						color="white"
					/>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const styles = StyleSheet.create({
	searchTextContainer: {
		borderColor: 'white',
		borderWidth: 1,
		flex: 0,
		maxWidth: 200,
		minWidth: 200,
		display: 'flex',
		flexDirection: 'row',
		borderRadius: 24,
		padding: 8,
	},
	searchText: {
		color: 'white',
		flex: 1,
		fontSize: 20,
	},

	result: {
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,0.5)',
		padding: 16,
	},
	resultText: {
		color: 'white',
		fontSize: 17,
		lineHeight: 24,
	},
	button: {
		flex: 0,
	},
})
