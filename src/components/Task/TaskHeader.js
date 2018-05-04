import Colors from '../../resources/Colors'
import * as ImageUtility from '../../resources/ImageUtility'
import React, { Component } from 'react'
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import pluralize from 'pluralize'
import { DateFormatter } from '../../resources/Utility'

export default class TaskHeader extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		const width = Dimensions.get('window').width
		const styles = StyleSheet.create({
			container: {
				flex: 0,
				flexDirection: 'row',
				width: width,
				borderBottomWidth: 1,
				borderBottomColor: Colors.ultraLightGray,
				paddingLeft: 16,
				paddingRight: 16,
				backgroundColor: Colors.bluishGray,
				alignItems: 'center',
				height: 80,
			},

			text_container: {
				flex: 1,
				minHeight: 30,
				alignItems: 'flex-start',
				justifyContent: 'center',
			},
			title: {
				marginBottom: 5,
			},
			display: {
				fontWeight: 'bold',
				fontSize: 17,
				marginBottom: 5,
			},
			date: {
				fontSize: 13,
				color: Colors.lightGray,
			},
			output: {
				fontSize: 13,
				color: Colors.lightGray,
				fontWeight: 'bold',
			},
			process_icon: {
				width: 38,
				height: 38,
				marginRight: 6,
			},
		})
		return (
			<View style={styles.container}>
				<View>
					<Image
						source={ImageUtility.requireIcon(this.props.imgpath)}
						style={styles.process_icon}
					/>
				</View>
				<TouchableOpacity
					style={styles.text_container}
					onPress={this.props.onPress}
					hitSlop={{ top: 10, left: 20, bottom: 20 }}>
					<Text style={styles.display}>{this.props.name}</Text>
					<View style={{ flexDirection: 'row' }}>
						<EditButton onEdit={() => null} />
						<Text style={styles.output}>
							{`${this.props.outputAmount} ${pluralize(
								this.props.outputUnit,
								this.props.outputAmount
							)} `}
						</Text>
						<Text style={styles.date}>
							started {DateFormatter.shorten(this.props.date)}
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}

function EditButton({ onEdit }) {
	return (
		<View
			activeOpacity={0.5}
			onPress={onEdit}
			style={{
				width: 18,
				height: 18,
				marginRight: 4,
			}}>
			<Image source={ImageUtility.uxIcon('edit')} />
		</View>
	)
}
