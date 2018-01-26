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

export class Dropdown extends Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: true,
		}
	}

	render() {
		let { selectedItem, data} = this.props
		let {collapsed} = this.state
		return (
			<View style={styles.container}>
				{ this.renderHeader(selectedItem) }
				<ScrollView style={styles.list}>
					<Collapsible collapsed={collapsed}>
						<FlatList
							style={styles.flatList}
							data={data}
							renderItem={this.renderItem.bind(this)}
							extraData={this.state}
							keyExtractor={this.keyExtractor}
						/>
					</Collapsible>
				</ScrollView>
			</View>
		)
	}

	renderItem({item}) {
		return (
			<CreateTaskSelect 
				name={item.name}
				imgpath={item.icon}
				key={item.id}
				onPress={(e) => this.handleSelect(item)}
			/>
		)
	}

	renderHeader(selectedItem) {
		return (
			<CreateTaskSelect 
				name={selectedItem.name} 
				imgpath={selectedItem.icon}
				key={selectedItem.id}
				header={true}
				onPress={this.handleToggle.bind(this)} 
			/>
		)
	}

	handleSelect(item) {
		this.props.onSelect(item)
		this.handleToggle()
	}

	handleToggle() {
		this.setState({collapsed: !this.state.collapsed})
	}

	keyExtractor = (item, index) =>  { item.id }
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
	container: {
		marginBottom: 50,
	},
	list: {
		marginTop: 43,
	}
})