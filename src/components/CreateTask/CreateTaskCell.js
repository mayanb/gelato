import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
	Text,
	TextInput,
} from 'react-native'
import Colors from '../../resources/Colors'
import * as ImageUtility from '../../resources/ImageUtility'

export function SelectTypeInput({ style, selected, registerInput, ...rest }) {
	let img = selected ? ImageUtility.requireIcon(selected.icon) : ImageUtility.systemIcon('unknown')
	return (
		<View style={styles.container}>
			<Image
				source={img}
				style={styles.process_icon}
			/>
			<TextInput
				style={[style, styles.input]}
				autoCapitalize="none"
				autoCorrect={false}
				underlineColorAndroid="transparent"
				ref={input => registerInput(input)}
				{...rest}
			/>
		</View>
	)
}

export class CreateTaskCell extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let { onPress, imgpath, name } = this.props
		return (
			<TouchableWithoutFeedback activeOpacity={0.5} onPress={onPress}>
				<View style={styles.container}>
					<Image
						source={ImageUtility.requireIcon(imgpath)}
						style={styles.process_icon}
					/>
					<Text style={styles.display}>{name}</Text>
					{this.props.header ? (
						<Image
							style={styles.arrow}
							source={ImageUtility.requireIcon('downarrow.png')}
						/>
					) : null}
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

const imgSize = 24
const styles = StyleSheet.create({
	container: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 20,
		paddingRight: 20,
		borderBottomStyle: 'solid',
		borderBottomRadius: 4,
		borderBottomWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.08)',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	}, 
	process_icon: {
		width: imgSize,
		height: imgSize,
		marginRight: 8,
		flexGrow: 0,
	},
	input: {
		flex: 1,
		height: 40,
		fontSize: 17,
		color: Colors.gray,

	},
	display: {
		fontSize: 17,
		color: Colors.textblack,
		flex: 1,
	},
})
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		flexDirection: 'row',
// 		alignSelf: 'stretch',
// 		height: 60,
// 		shadowColor: 'rgba(0, 0, 0, 0.07)',
// 		shadowOffset: {
// 			width: 0,
// 			height: 2,
// 		},
// 		shadowRadius: 4,
// 		shadowOpacity: 1,
// 		borderStyle: 'solid',
// 		borderRadius: 4,
// 		borderWidth: 1,
// 		borderColor: 'green', //'rgba(1, 0, 0, 0.08)',
// 		paddingTop: 8,
// 		paddingBottom: 8,
// 		paddingLeft: 20,
// 		paddingRight: 20,
// 		backgroundColor: 'white',
// 	},
// 	display: {
// 		fontSize: 17,
// 		color: Colors.textblack,
// 		flex: 1,
// 	},
// 	process_icon: {
// 		width: imgSize,
// 		height: imgSize,
// 		marginRight: 8,
// 		flexGrow: 0,
// 	},
// 	input: {
// 			flex: 1,
// 			height: 40,
// 			backgroundColor: Colors.white,
// 			fontSize: 15,
// 			color: Colors.gray,
// 			padding:0,
// 	}
// })
