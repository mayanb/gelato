import React from 'react'
import { Image, View, TouchableOpacity, Dimensions } from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'

const width = Dimensions.get('window').width

export default function EditButton({ onEdit }) {
	return (
		<TouchableOpacity
			activeOpacity={0.5}
			onPress={onEdit}
			style={{
				width: width / 2,
				height: 59,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'flex-end',
				alignItems: 'center',
			}}>
			<View>
				<Image source={ImageUtility.uxIcon('edit')} />
			</View>
		</TouchableOpacity>
	)
}
