import React, { Component } from 'react'
import {
	Dimensions,
	Animated,
	StyleSheet,
} from 'react-native'
import Heading from './Heading'
import NumericInputWithUnits from '../NumericInputWithUnits'

import Colors from '../../resources/Colors'

const TOP_SECTION_HEIGHT = 250
const MARGIN_TOP = 60
const HEIGHT = 120

export default class SelectBatchSize extends Component {
	constructor(props) {
		super(props)
		const offScreenTransform =
			Dimensions.get('window').height - TOP_SECTION_HEIGHT
		this.state = {
			yTransformAnim: new Animated.Value(offScreenTransform),
		}
	}

	componentDidMount() {
		Animated.timing(this.state.yTransformAnim, {
			toValue: 0,
			duration: 400,
		}).start()
	}

	render() {
		let { unit, onBatchSizeInput } = this.props
		return (
			<Animated.View
				style={[
					styles.container,
					{
						transform: [{ translateY: this.state.yTransformAnim }],
					},
				]}>
				<Heading>What's your batch size?</Heading>
				<NumericInputWithUnits
					unit={unit}
					value={this.state.batchSize}
					onChangeText={num => onBatchSizeInput(num)}
				/>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: MARGIN_TOP,
		marginBottom: 60,
		height: HEIGHT,
	},
	textInput: {
		marginTop: 20,
		padding: 16,
		height: 60,
		backgroundColor: Colors.white,
		borderRadius: 4,
		shadowColor: 'rgba(0, 0, 0, 0.07)',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowRadius: 4,
		shadowOpacity: 1,
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.08)',
	},
	unit: {
		position: 'absolute',
		right: 24,
		bottom: 20,
		fontSize: 17,
		color: Colors.lightGray,
	},
})
