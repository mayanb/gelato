import Colors from '../resources/Colors';
import * as ImageUtility from '../resources/ImageUtility'
import React, { Component } from 'react';
import {
	Dimensions,
	Image,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	ScrollView,
	View
} from 'react-native'
import {CreateTaskSelect} from './Cells'
import Collapsible from 'react-native-collapsible'
import Networking from '../resources/Networking-superagent'

export default class SearchDropdown extends Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: true,
			searchText: "",
			data: [],
			request: null,
		}
	}

	render() {
		let { collapsed, searchText, data } = this.state
		let shouldCollapse = searchText.length < 2

		return (
			<View style={styles.container}>
				<SearchBox onChangeText={this.handleChangeText.bind(this)}/>
				<Collapsible collapsed={shouldCollapse}>
					<FlatList
						data={data}
						renderItem={this.renderItem.bind(this)}
						extraData={this.state}
						keyExtractor={this.keyExtractor}
						style={styles.choices}
					/>
				</Collapsible>
			</View>
		)
	}

	renderItem({item}) {
		return (
			<SearchResultCell 
				name={item.display}
				key={item.id}
				id={item.id}
				onPress={(e) => this.handleSelect(item)}
			/>
		)
	}

	handleSelect(item) {
		console.log(item)
		this.props.onSelect(item)
		this.handleClearText()
	}

	handleClearText() {
		this.handleChangeText('')
	}

	handleChangeText(text) {
		let {request} = this.state
		this.setState({searchText: text, data: []})
		if (request) {
			request.abort()
		}

		if (text.length < 2) 
			return 

		let r = Networking.get('/ics/tasks/search/')
			.query({label: text})

		r.then(res => this.setState({data: res.body.results}) )
			.catch(e => console.log(e))

		this.setState({request: r})
	}

	keyExtractor = (item, index) =>  { item.id }
}

function SearchResultCell(props) {
	return (
		<TouchableOpacity onPress={props.onPress}>
			<View>
				<Text>{props.name}</Text>
			</View>
		</TouchableOpacity>
	)
}

function SearchBox(props) {
	return (
		<TouchableOpacity>
			<View>
				<TextInput placeholder="Search" value={props.searchText} onChangeText={props.onChangeText}/>
			</View>
		</TouchableOpacity>
	)
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
})