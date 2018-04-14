import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
	Text,
	TextInput,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Colors from '../../resources/Colors'
import * as ImageUtility from '../../resources/ImageUtility'

export default class SelectTypeWithInput extends Component {
	constructor(props) {
		super(props)
		this.state = {
			text: '',
			filtered_results: [],
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<EditableCell
					placeholder={this.props.placeholder}
					onChangeText={t => this.props.onChangeText(t)}
					returnKeyType={this.props.done ? 'done' : 'next'}
					blurOnSubmit={false}
					value={this.props.text}
					selected={this.props.selected}
					registerInput={this.props.registerInput}
					onFocus={this.props.onFocus}
				/>
				{this.props.dropdown_open && (
					<KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
						{this.props.data.map(e => {
							return (
								<NonEditableCell
									key={'stwi-' + e.id}
									{...e}
									imgpath={e.icon}
									onPress={() => this.props.onSelect(e)}
								/>
							)
						})}
					</KeyboardAwareScrollView>
				)}
			</View>
		)
	}
}

export function EditableCell({ style, selected, registerInput, ...rest }) {
	let img = selected ? ImageUtility.requireIcon(selected.icon) : ImageUtility.systemIcon('unknown')
	return (
		<View style={styles.cell_container}>
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

export class NonEditableCell extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let { onPress, imgpath, name } = this.props
		return (
			<TouchableWithoutFeedback activeOpacity={0.5} onPress={onPress}>
				<View style={styles.cell_container}>
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
		marginTop: 20,
		backgroundColor: 'white',
		shadowColor: 'rgba(0, 0, 0, 0.07)',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowRadius: 4,
		shadowOpacity: 1,
		borderStyle: 'solid',
		borderRadius: 4,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.08)',
		overflow: 'hidden',
	},
	scroll: {
		paddingTop: 20,
		paddingBottom: 40,
		flex: 1,
		backgroundColor: 'blue',
	},
	cell_container: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 20,
		paddingRight: 20,
		// borderBottomStyle: 'solid',
		// borderBottomRadius: 4,
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
