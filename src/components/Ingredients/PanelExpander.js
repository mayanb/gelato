import React, { Component } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures';
import * as ImageUtility from '../../resources/ImageUtility'

import Colors from '../../resources/Colors'

const CLOSED_PERCENTAGE = 0.2
const OPEN_PERCENTAGE = 0.8
const WINDOW_HEIGHT = Dimensions.get('window').height
const WINDOW_WIDTH = Dimensions.get('window').width

export default class PanelExpander extends Component {

	constructor(props) {
		super(props)
		this.state = {
			panelHeight: new Animated.Value(0),
		}

		this.handleOpen = this.handleOpen.bind(this)
		this.handleClose = this.handleClose.bind(this)
	}

	componentWillReceiveProps(np) {
		if (np.expanded && !this.props.expanded)
			this.handleOpen()

		if (!np.expanded && this.props.expanded)
			this.handleClose()
	}

	handleOpen() {
		if (this.props.typeSearch || this.expanded)
			return

		this.props.setExpanded(true)
		Animated.timing(this.state.panelHeight, {
			toValue: 1,
			duration: 400,
		}).start()
	}

	handleClose() {
		this.props.setExpanded(false)
		Animated.timing(this.state.panelHeight, {
			toValue: 0,
			duration: 400,
		}).start()
	}

	render() {
		const { camera, ingredientsContent } = this.props
		const styles = StyleSheet.create({
			container: {
				flex: 1,
				justifyContent: 'flex-end',
			},
		})
		const flex = this.state.panelHeight.interpolate({
			inputRange: [0, 1],
			outputRange: [CLOSED_PERCENTAGE, OPEN_PERCENTAGE]
		})

		return (
			<GestureRecognizer style={styles.container} onSwipeUp={this.handleOpen}>
				{camera}
				<Animated.View style={{
					flex: flex,
					maxHeight: OPEN_PERCENTAGE * WINDOW_HEIGHT,
				}}>
					<ArrowOverlay expanded={this.props.expanded} onOpen={this.handleOpen} onClose={this.handleClose}
					              animateOpen={this.state.panelHeight} />
					<IngredientsContainer onOpen={this.handleOpen} content={ingredientsContent} />
					{!this.props.expanded && <IngredientsOverlay onOpen={this.handleOpen} />}
				</Animated.View>
				{this.props.expanded && <CloseOverlay onClose={this.handleClose} />}
			</GestureRecognizer>
		)
	}
}

function CloseOverlay({ onClose }) {
	return (
		<GestureRecognizer
			onSwipeDown={onClose}
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: WINDOW_WIDTH,
				height: CLOSED_PERCENTAGE * WINDOW_HEIGHT,
				zIndex: 10,
			}}
		>
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={{ flex: 1 }} />
			</TouchableWithoutFeedback>
		</GestureRecognizer>
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

function IngredientsContainer({ onOpen, content }) {
	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1, backgroundColor: Colors.white }}>{content}</View>
		</View>
	)
}

function IngredientsOverlay({ onOpen }) {
	return (
		<View style={{
			position: 'absolute',
			bottom: 0,
			left: 0,
			width: WINDOW_WIDTH,
			height: CLOSED_PERCENTAGE * WINDOW_HEIGHT,
		}}>
			<TouchableWithoutFeedback onPress={onOpen}>
				<View style={{ flex: 1 }} />
			</TouchableWithoutFeedback>
		</View>
	)
}


