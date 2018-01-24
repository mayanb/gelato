import Colors from '../resources/Colors';
import * as ImageUtility from '../resources/ImageUtility'
import React, { Component } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	Image,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

export class TaskRow extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const width = Dimensions.get('window').width;
		const styles = StyleSheet.create({
			container: {
				flex: 1,
				flexDirection: 'row',
				width: width,
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				paddingTop: 8,
				paddingBottom: 8,
				paddingLeft: 16,
				paddingRight: 16
			},

			text_container: {
				flex: 1,
				minHeight: 30,
				alignItems: 'flex-start',
				justifyContent: 'center',
			},
			title: {
				marginBottom: 5
			},
			display: {
				fontWeight: 'bold',
				fontSize: 17,
				marginBottom: 5
			},
			date: {
				fontSize: 13,
				color: Colors.lightGray
			},
			process_icon: {
				width: 38,
				height: 38,
				marginRight: 8,
			}
		})
		return (
			<TouchableOpacity activeOpacity={0.5} onPress={this.openTask.bind(this)}>
				<View style={styles.container}>
					<View>
						<Image source={ImageUtility.requireIcon(this.props.imgpath)} style={styles.process_icon} />
					</View>
					<View style={styles.text_container}>
						<Text style={styles.display}>{this.props.name}</Text>
						<Text style={styles.title}>{this.props.title}</Text>
						<Text style={styles.date}>{this.props.date}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	openTask() {
		this.props.onPress(this.props.id, this.props.title, this.props.open);
	}

	

}

export class TaskRowHeader extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const width = Dimensions.get('window').width;
		const styles = StyleSheet.create({
			container: {
				width: width,
				height: this.props.isLoading ? 140 : 75,
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				alignItems: 'flex-start',
				justifyContent: 'flex-end',
				paddingTop: 10,
				paddingBottom: 10,
				paddingLeft: 20,
				paddingRight: 20,
				backgroundColor: Colors.bluishGray
			},
			title: {
				fontSize: 15,
				color: Colors.lightGray
			},
			indicator: {
				alignSelf: 'center',
				marginTop: 20,
				marginBottom: 20
			}
		});
		return (
			<View style={styles.container}>
				<Text style={styles.title}>{this.props.title}</Text>
				{
					this.props.isLoading && <ActivityIndicator size="large" color={Colors.base} style={styles.indicator} />
				}
			</View>
		);
	}
}

export class AttributeRow extends Component {
	constructor(props) {
		super(props)
		this.state = {
			typedValue: this.props.value,
		}
	}

	render() {
		let {name, id, onSubmitEditing} = this.props
		const width= Dimensions.get('window').width;
		const styles = StyleSheet.create({
			container: {
				width: width,
				minHeight: 30,
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				alignItems: 'flex-start',
				justifyContent: 'center',
				paddingTop: 10,
				paddingBottom: 10,
				paddingLeft: 20,
				paddingRight: 20,
				display: 'flex',
				flexDirection: 'row'
			},
			title: {
				fontSize: 15,
				color: Colors.lightGray,
				flex: 1,
			},
			value: {
				fontSize: 15,
				color: Colors.lightGray,
				flex: 1,
				textAlign: 'right',
			}
		})
		return (
			<View style={styles.container}>
				<Text style={styles.name}>{name}</Text>
				<TextInput 
					style={styles.value} 
					onChangeText={this.handleChangeText.bind(this)}
					onSubmitEditing={() => onSubmitEditing(id, this.state.typedValue)} 
					onBlur={() => onSubmitEditing(id, this.state.typedValue)}
					returnKeyType='done'
					value={this.state.typedValue}
				/>
			</View>
		)
	}

	handleChangeText(text) {
		this.setState({ typedValue: text })
	}
}


export class CreateTaskSelect extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {onPress, imgpath, name} = this.props
		const width = Dimensions.get('window').width
		const imgSize = 24
		const styles = StyleSheet.create({
			container: {
				flex: 1,
				flexDirection: 'row',
				width: width,
				minHeight: 30,
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				alignItems: 'flex-start',
				paddingTop: 8,
				paddingBottom: 8,
				paddingLeft: 20,
				paddingRight: 20,
				alignItems: 'center',
				backgroundColor: 'white',
			},
			display: {
				fontSize: 17,
			},
			process_icon: {
				width: imgSize,
				height: imgSize,
				marginRight: 8,
			}
		})
		return (
			<TouchableOpacity activeOpacity={0.5} onPress={onPress}>
				<View style={styles.container}>
					{ 
						imgpath ?
						<Image source={ImageUtility.requireIcon(imgpath)} style={styles.process_icon} /> :
						null
					}
					<Text style={styles.display}>{name}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}