import React from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native'
import Colors from '../resources/Colors'

export default function ActivityIndicatorOverlay() {
	return (
		<View style={styles.container}>
			<View style={styles.blackBox}>
				<ActivityIndicator
					size="large"
					color={Colors.white}
					style={styles.indicator}
				/>
			</View>
		</View>
	)
}

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		width: width,
		height: height,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
	},
	blackBox: {
		width: 140,
		height: 140,
		backgroundColor: Colors.black,
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
	},
})
