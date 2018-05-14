import React from 'react'
import { Image, View, Dimensions } from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'

const width = Dimensions.get('window').width

export default function EditButton() {
	return (
		<View style={{
			width: width / 2,
			height: 59,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-end',
			alignItems: 'center',
		}}>
			<Image source={ImageUtility.uxIcon('edit')} />
		</View>
	)
}
