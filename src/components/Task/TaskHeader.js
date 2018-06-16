import React from 'react'
import Colors from '../../resources/Colors'
import * as ImageUtility from '../../resources/ImageUtility'
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import pluralize from 'pluralize'
import moment from 'moment'

export default function TaskHeader({
	imgpath,
	onPress,
	name,
	outputAmount,
	outputUnit,
	date,
}) {
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
					source={ImageUtility.requireIcon(imgpath)}
					style={styles.process_icon}
				/>
			</View>
			<TouchableOpacity
				style={styles.text_container}
				onPress={onPress}
			>
				<Text style={styles.display}>{name}</Text>
				<View style={{ flexDirection: 'row' }}>
					<EditButton />
					<Text style={styles.output}>
						{`${outputAmount} ${pluralize(outputUnit, outputAmount)} `}
					</Text>
					<Text style={styles.date}>
						started {moment(date).format('ddd MMM D, hh:mma')}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	)
}

function EditButton() {
	return (
		<View
			activeOpacity={0.5}
			style={{
				width: 18,
				height: 18,
				marginRight: 4,
			}}>
			<Image source={ImageUtility.uxIcon('edit')} />
		</View>
	)
}
