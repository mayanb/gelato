import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, Animated, Image, Dimensions } from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'

import Colors from '../../resources/Colors'

const CLOSED_PERCENTAGE = 0.2
const OPEN_PERCENTAGE = 0.8
const WINDOW_HEIGHT = Dimensions.get('window').height

export default class PanelExpander extends Component {

	constructor(props) {
		super(props)
		this.state = {
			open: false,
			panelHeight: new Animated.Value(0),
		}

		this.handleOpen = this.handleOpen.bind(this)
		this.handleClose = this.handleClose.bind(this)
	}

	handleOpen() {
		this.setState({ open: true })
		Animated.timing(this.state.panelHeight, {
			toValue: 1,
			duration: 400,
		}).start()
	}

	handleClose() {
		this.setState({ open: false })
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
			<View style={styles.container}>
				{this.state.open && <Overlay onClose={this.handleClose} />}
				{camera}
				<Animated.View style={{
					flex: flex,
					maxHeight: OPEN_PERCENTAGE * WINDOW_HEIGHT,
				}}>
					<ArrowOverlay open={this.state.open} onOpen={this.handleOpen} onClose={this.handleClose}
					              animateOpen={this.state.panelHeight} />
					<IngredientsContainer onOpen={this.handleOpen} content={ingredientsContent} />
				</Animated.View>
			</View>
		)
	}
}

function Overlay({ onClose }) {
	return (
		<TouchableWithoutFeedback onPress={onClose}>
			<View
				style={{
					flex: CLOSED_PERCENTAGE,
					zIndex: 10,
				}}
			/>
		</TouchableWithoutFeedback>
	)
}

function ArrowOverlay({ open, onOpen, onClose, animateOpen }) {
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
		<TouchableWithoutFeedback onPress={open ? onClose : onOpen}>
			<Animated.View
				style={styles.container}>
				<Animated.Image source={ImageUtility.requireIcon('uparrowwhite.png')} style={styles.image} />
			</Animated.View>
		</TouchableWithoutFeedback>
	)
}

function IngredientsContainer({ onOpen, content }) {
	return (
		<TouchableWithoutFeedback onPress={onOpen}>
			<View style={{ flex: 1, backgroundColor: Colors.white }}>
				{content}
			</View>
		</TouchableWithoutFeedback>
	)
}
