import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	Animated,
	Dimensions,
	PanResponder,
	Image,
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
			expanded: false,
			pan: new Animated.Value(0),
			move: null,
		}

		this.handleOpen = this.handleOpen.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this.handleToggle = this.handleToggle.bind(this)

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

	handleToggle() {
		this.state.expanded ? this.handleClose() : this.handleOpen()
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
					<DraggableBar
						panHandlers={this._panResponder.panHandlers}
						expanded={expanded}
						onToggle={this.handleToggle}
					/>
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

function DraggableBar({ panHandlers, expanded, onToggle }) {
	const spin = expanded ? '180deg' : '0deg'
	const styles = StyleSheet.create({
		container: {
			height: DRAGGABLE_HEIGHT,
			width: WINDOW_WIDTH,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'white',
			borderBottomColor: Colors.ultraLightGray,
			borderBottomWidth: 1,
			borderTopLeftRadius: 4,
			borderTopRightRadius: 4,
		},
		image: {
			height: 36,
			width: 36,
			transform: [{ rotate: spin }],
		},
	})
	return (
		<View {...panHandlers}>
			<TouchableWithoutFeedback onPress={onToggle}>
				<View style={{ flex: 1 }} style={styles.container}>
					<Image source={ImageUtility.requireIcon('uparrow.png')} style={styles.image} />
				</View>
			</TouchableWithoutFeedback>
		</View>
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


