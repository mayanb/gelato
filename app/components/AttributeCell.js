import React from 'react'
import {
	Image,
	View, 
	Text,
	TextInput,
	Dimensions,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native'
import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'

export default class AttributeCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			typedValue: this.props.value,
			editing: false,
			loading: false
		}
		this.edit = this.edit.bind(this)
		this.chooseDateTime = this.chooseDateTime.bind(this)
	}

	render() {
		let {name} = this.props
		name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
		return (
			<View style={styles.container}>
				<Text style={styles.name}>{name}</Text>
				{this.renderValue()}
			</View>
		)
	}

	renderValue() {
		if (this.state.loading) {
			return <ActivityIndicator size="small" color={Colors.base} />
		} else if (this.state.editing || Boolean(this.props.value)) {
			const keyboardType = this.props.type === 'NUMB' ? 'numeric' : 'default'
			if (this.props.type === 'NUMB' && this.props.type === 'TEXT') {
				return (
					<TextInput
						style={styles.value}
						onChangeText={this.handleChangeText.bind(this)}
						onSubmitEditing={this.handleSubmitEditing.bind(this)}
						onBlur={this.handleSubmitEditing.bind(this)}
						returnKeyType='done'
						value={this.state.typedValue}
						keyboardType={keyboardType}
						ref={(input) => this.input = input}
					/>
				)
			} else if (this.props.type !== "DATE") {
				return (
					<TouchableOpacity activeOpacity={0.5} onPress={this.chooseDateTime}>
						<Text style={styles.date}>{this.parseDate(this.state.typedValue) || "Tues. Jan 8"}</Text>
					</TouchableOpacity>
				)
			}
		} else {
			return (
				<TouchableOpacity activeOpacity={0.5} onPress={this.edit} style={styles.editButton}>
					<View>
						<Image source={ImageUtility.uxIcon("edit")} />
					</View>
				</TouchableOpacity>
			)
		}
	}

	parseDate(date) {
		let monthNames = [
			"Jan", "Feb", "Mar",
			"Apr", "May", "Jun", "Jul",
			"Aug", "Sept", "Oct",
			"Nov", "Dec"
		]
		if (date) {
			date = new Date(date)
			var day = date.getDate()
			var monthIndex = date.getMonth()
			var year = date.getFullYear()
			var time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
			return String(monthIndex + 1) + '/' + day + ' ' + time
		}
	}

	chooseDateTime() {
		this.props.chooseDateTime(this.props.id)
	}

	handleChangeText(text) {
		this.setState({ typedValue: text })
	}

	handleSubmitEditing() {
		this.setState({editing: false})
		if(this.state.typedValue !== this.props.value) {
			this.setState({ loading: true })
			this.props.onSubmitEditing(this.props.id, this.state.typedValue)
				.finally(() => this.setState({ loading: false }))
		}
	}

	edit() {
		this.setState({ editing: true }, () => {
			if (this.input) {
				this.input.focus()
			} else {
				this.chooseDateTime()
			}
		})
	}
}


const width= Dimensions.get('window').width;
const styles = StyleSheet.create({
	container: {
		width: width,
		minHeight: 60,
		borderBottomWidth: 1,
		borderBottomColor: Colors.ultraLightGray,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 16,
		paddingRight: 16,
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: Colors.white,
	},
	name: {
		color: Colors.lightGray,
		flex: 1,
		fontSize: 17,
	},
	value: {
		fontSize: 17,
		color: Colors.textBlack,
		flex: 1,
		textAlign: 'right',
	},
	editButton: {
		width: width / 2,
		height: 59,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	}
})