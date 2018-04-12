import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, Animated, Image } from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'

import Colors from '../../resources/Colors'

export default class PanelExpander extends Component {

	constructor(props) {
		super(props)
		this.state = {
			open: false,
			panelHeight: new Animated.Value(0.2),
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
		Animated.timing(this.state.panelHeight, {
			toValue: 0.2,
			duration: 400,
		}).start(() => this.setState({ open: false }))
	}

	render() {
		const { camera, ingredientsContent } = this.props
		const styles = StyleSheet.create({
			container: {
				flex: 1,
				justifyContent: 'flex-end',
			},
		})
		return (
			<View style={styles.container}>
				{this.state.open && <Overlay onClose={this.handleClose} />}
				{camera}
				<Animated.View style={{ flex: this.state.panelHeight }}>
					<ArrowOverlay open={this.state.open} onOpen={this.handleOpen} onClose={this.handleClose} />
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
					flex: 0.2,
					zIndex: 10,
					backgroundColor: Colors.black,
					opacity: 0.8,
				}}
			/>
		</TouchableWithoutFeedback>
	)
}

function ArrowOverlay({ open, onOpen, onClose }) {
	const styles = StyleSheet.create({
		container: {
			height: 36,
			display: 'flex',
			alignItems: 'center',
		},
		image: {
			height: 36,
			width: 36,
			transform: [{ rotate: open ? '180deg' : '0deg' }],
		},
	})
	return (
		<TouchableWithoutFeedback onPress={open ? onClose : onOpen}>
			<View
				style={styles.container}>
				<Image source={ImageUtility.requireIcon('uparrowwhite.png')} style={styles.image} />
			</View>
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
