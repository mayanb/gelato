import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	Animated,
	Dimensions,
	PanResponder,
	Text,
} from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'

import Colors from '../../resources/Colors'

const CLOSED_PERCENTAGE = 0.2
const OPEN_PERCENTAGE = 0.8
const WINDOW_HEIGHT = Dimensions.get('window').height
const WINDOW_WIDTH = Dimensions.get('window').width
const CLOSED_HEIGHT = WINDOW_HEIGHT * CLOSED_PERCENTAGE
const OPEN_HEIGHT = WINDOW_HEIGHT * OPEN_PERCENTAGE
const OPEN_TOP = (1 - OPEN_PERCENTAGE) * WINDOW_HEIGHT
const CLOSED_TOP = OPEN_PERCENTAGE * WINDOW_HEIGHT
const OPEN_DIFF = OPEN_TOP - CLOSED_TOP
const DRAGGABLE_HEIGHT = 50

export default class PanelExpander extends Component {

	constructor(props) {
		super(props)
		this.state = {
			expanded: true,
			pan: new Animated.Value(0),
			move: null,
		}

		this.handleOpen = this.handleOpen.bind(this)
		this.handleClose = this.handleClose.bind(this)

		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (e, gs) => true,
			onMoveShouldSetPanResponderCapture: (e, gs) => true,
			onPanResponderGrant: (event, gesture) => {
				this.state.pan.setOffset(this.state.pan._value);
				this.state.pan.setValue(0);
			},
			onPanResponderMove: Animated.event([null, {
				dy: this.state.pan
			}]),
			onPanResponderRelease: (e, gesture) => {
				this.state.pan.flattenOffset()
				const { expanded } = this.state
				const diff = gesture.dy
				if (Math.abs(diff) < 50) {
					expanded ? this.handleOpen() : this.handleClose()
				} else {
					diff < 0 ? this.handleOpen() : this.handleClose()
				}
			}
		});
	}

	handleOpen() {
		this.setState({ expanded: true })
		Animated.timing(this.state.pan, {
			toValue: OPEN_DIFF,
			duration: 400,
		}).start()
	}

	handleClose() {
		this.setState({ expanded: false })
		Animated.timing(this.state.pan, {
			toValue: 0,
			duration: 400,
		}).start()
	}

	render() {
		const { camera, ingredientsContent } = this.props
		const { expanded } = this.state

		const translateY = Animated.diffClamp(this.state.pan, OPEN_DIFF, 0)
		return (
			<View>
				{camera}
				{expanded && <CloseOverlay onClose={this.handleClose} />}
				<Animated.View style={{
					height: OPEN_HEIGHT,
					width: WINDOW_WIDTH,
					top: CLOSED_TOP,
					position: 'absolute',
					transform: [{ translateY: translateY }],
				}}
				>
					<View
						style={{
							height: DRAGGABLE_HEIGHT,
							width: WINDOW_WIDTH,
							backgroundColor: Colors.red,
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
						}}
						{...this._panResponder.panHandlers}
					>
						<Text>Drag Me</Text>
					</View>
					<View style={{
						height: OPEN_HEIGHT - DRAGGABLE_HEIGHT,
						width: WINDOW_WIDTH,
						backgroundColor: Colors.ultraLightGray,
					}}>
						{ingredientsContent}
					</View>
				</Animated.View>
				{!expanded && <IngredientsOverlay onOpen={this.handleOpen} />}
			</View>
		)
	}
}

function CloseOverlay({ onClose }) {
	return (
		<View
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: WINDOW_WIDTH,
				height: OPEN_TOP,
			}}
		>
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={{ flex: 1 }} />
			</TouchableWithoutFeedback>
		</View>
	)
}

function ArrowOverlay({ expanded, onOpen, onClose, animateOpen }) {
	const spin = animateOpen.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '180deg']
	})

	const styles = StyleSheet.create({
		container: {
			height: 36,
			display: 'flex',
			alignItems: 'center',
		},
		image: {
			height: 36,
			width: 36,
			transform: [{ rotate: spin }],
		},
	})
	return (
		<TouchableWithoutFeedback onPress={expanded ? onClose : onOpen}>
			<Animated.View style={styles.container}>
				<Animated.Image source={ImageUtility.requireIcon('uparrowwhite.png')} style={styles.image} />
			</Animated.View>
		</TouchableWithoutFeedback>
	)
}

function IngredientsOverlay({ onOpen }) {
	return (
		<View style={{
			position: 'absolute',
			top: CLOSED_TOP + DRAGGABLE_HEIGHT,
			left: 0,
			width: WINDOW_WIDTH,
			height: CLOSED_HEIGHT - DRAGGABLE_HEIGHT,
		}}>
			<TouchableWithoutFeedback onPress={onOpen}>
				<View style={{ flex: 1 }} />
			</TouchableWithoutFeedback>
		</View>
	)
}


