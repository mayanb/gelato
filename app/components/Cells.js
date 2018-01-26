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
				paddingRight: 16,
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
		this.props.onPress(this.props.id, this.props.title, this.props.open, this.props.imgpath, this.props.name, this.props.date);
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
				height: 75,
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
			}
		});
		return (
			<View style={styles.container}>
				<Text style={styles.title}>{this.props.title}</Text>
			</View>
		);
	}
}

export class AttributeHeaderCell extends Component {
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
				paddingTop: 20,
				paddingBottom: 20,
				paddingLeft: 16,
				paddingRight: 16,
				backgroundColor: Colors.bluishGray
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
		if (this.props.type !== "Bottom") {
			return (
				<View style={styles.container}>
					<View>
						<Image source={ImageUtility.requireIcon(this.props.imgpath)} style={styles.process_icon} />
					</View>
					<View style={styles.text_container}>
						<Text style={styles.display}>{this.props.name}</Text>
						<Text style={styles.date}>{this.props.date}</Text>
					</View>
				</View>
			);
		} else {
			return (
				<BottomTablePadding title={this.props.title} />
			)
		}
	}
}

export class BottomTablePadding extends Component {
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
				paddingTop: 20,
				paddingBottom: 100,
				paddingLeft: 16,
				paddingRight: 16,
				alignItems: 'center',
				justifyContent: 'center'
			},
			title: {
				marginBottom: 5,
				fontSize: 18,
				color: Colors.lightGray
			}
		})
		return (
			<View style={styles.container}>
				<Text style={styles.title}>That's all for this task!</Text>
			</View>
		);
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
				// minHeight: 75,
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				alignItems: 'flex-start',
				paddingTop: 25,
				paddingBottom: 25,
				paddingLeft: 20,
				paddingRight: 20,
				alignItems: 'center',
				backgroundColor: 'white',
				justifyContent: 'space-between'
			},
			content: {
				flexDirection: 'row'
			},
			display: {
				fontSize: 17,
				color: Colors.textblack,
				opacity: this.props.id === -1 ? 0.65 : 1
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
					<View style={styles.content}>
						{ imgpath &&
							<Image source={ImageUtility.requireIcon(imgpath)} style={styles.process_icon} />
						}
						<Text style={styles.display}>{name}</Text>
					</View>
					<Image source={ImageUtility.uxIcon('downarrow')} />
				</View>
			</TouchableOpacity>
		);
	}
}