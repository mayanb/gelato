import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NavHeader from 'react-navigation-header-buttons'
import Colors from '../resources/Colors'

export default function BackButton({ onPress }) {
	return (
		<NavHeader IconComponent={Ionicons} size={25} color={Colors.white}>
			<NavHeader.Item
				iconName="ios-arrow-back"
				label="Back"
				onPress={onPress}
				buttonStyle={{
					marginHorizontal: 0,
					marginLeft: 13,
					marginRight: 4,
				}}
			/>
		</NavHeader>
	)
}
