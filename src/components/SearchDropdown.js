import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'
import React, { Component } from 'react'
import {
	ActivityIndicator,
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	FlatList,
	View,
	Keyboard,
} from 'react-native'

export class SearchDropdown extends Component {
	constructor(props) {
		super(props)
		this.handleSelect = this.handleSelect.bind(this)
	}

	render() {
		let containerStyle = StyleSheet.create({
			container: {
				position: 'absolute',
				top: 100,
				left: 16,
				width: width - 32,
				maxHeight: 228,
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
						keyboardShouldPersistTaps="handled"
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
				containsAlreadyAddedInput={item.containsAlreadyAddedInput}
			/>
		)
	}

	handleSelect(item) {
		Keyboard.dismiss()
		this.props.onSelect(item)
	}

	keyExtractor = (item, index) => {
		return String(item.id)
	}
}

function SearchResultCell({ onPress, containsAlreadyAddedInput, name }) {
	return containsAlreadyAddedInput ? <DisabledCell name={name}/> : <ClickableCell name={name} onPress={onPress}/>
}

function ClickableCell({ name, onPress }) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.result}>
				<Text style={styles.resultText}>{name}</Text>
			</View>
		</TouchableOpacity>
	)
}

function DisabledCell({ name }) {
	return (
		<TouchableOpacity disabled={true}>
			<View style={styles.result}>
				<Text style={styles.disabledText}>{name} is added</Text>
			</View>
		</TouchableOpacity>
	)
}

export function SearchBox(props) {
	return (
		<TouchableWithoutFeedback onPress={() => this.input.focus() } >
			<View style={styles.searchTextTouchable} >
				<View style={styles.searchTextContainer}>
					<TextInput
						underlineColorAndroid="transparent"
						style={styles.searchText}
						placeholderTextColor="white"
						placeholder="Search"
						value={props.searchText}
						onChangeText={props.onChangeText}
						onFocus={props.onFocus}
						autoCorrect={false}
						onSubmitEditing={props.onBlur}
						blurOnSubmit={true}
						returnKeyType="done"
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
			</View>
		</TouchableWithoutFeedback>
	)
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const styles = StyleSheet.create({
	searchTextTouchable: {
		paddingLeft: 32,
		paddingBottom: 16,
		paddingTop: 0,
		marginRight: 32,
	},
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
	disabledText: {
		color: Colors.gray,
		fontSize: 17,
		lineHeight: 24,
	},
	button: {
		flex: 0,
	},
})
