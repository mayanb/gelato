import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'
import Colors from '../../resources/Colors'

export default class RecipeInstructions extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expanded: false,
		}

		this.handleToggle = this.handleToggle.bind(this)
	}

	handleToggle() {
		this.setState({ expanded: !this.state.expanded })
	}

	render() {
		const styles = StyleSheet.create({
			container: {
				marginBottom: 24,
				backgroundColor: Colors.white,
				margin: 20,
				padding: 12,
				borderRadius: 4,
				shadowColor: "rgba(0, 0, 0, 0.02)",
				shadowOffset: {
					width: 0,
					height: 2
				},
				shadowRadius: 4,
				shadowOpacity: 1,
			},
			headerRow: {
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				height: 14,
			},
			title: {
				color: Colors.lightGray,
			},
			hideContainer: {
				flexDirection: 'row',
				justifyContent: 'center',
				padding: 8,
			},
		})
		const { instructions } = this.props
		const { expanded } = this.state
		return (
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<Text style={styles.title}>Instructions</Text>
					{!expanded && <Toggle expanded={this.state.expanded} onPress={this.handleToggle} />}
				</View>
				{expanded && (
					<View>
						<Content content={instructions} />
						<View style={styles.hideContainer}>
							<Toggle expanded={this.state.expanded} onPress={this.handleToggle} />
						</View>
					</View>
				)}
			</View>
		)
	}
}

function Toggle({ expanded, onPress }) {
	const text = expanded ? 'Hide' : 'Expand'
	const rotation = expanded ? '0deg' : '180deg'
	const styles = StyleSheet.create({
		toggleContainer: {
			flexDirection: 'row',
		},
		toggleText: {
			color: Colors.base,
		},
		icon: {
			width: 20,
			height: 20,
			transform: [{ rotate: rotation }],
		},
	})
	return (
		<TouchableOpacity style={styles.toggleContainer} onPress={onPress}>
			<Text style={styles.toggleText}>{text}</Text>
			<Image source={ImageUtility.requireIcon('uparrowwhite.png')} style={styles.icon} />
		</TouchableOpacity>
	)
}

function Content({ content }) {
	const styles = StyleSheet.create({
		content: {
			marginTop: 16,
			height: 100,
		},
	})
	return (
		<View style={styles.content}>
			<Text>{content}</Text>
		</View>
	)
}

