import React from 'react'
import {
	TextInput,
	View,
	TouchableOpacity,
	StyleSheet,
} from 'react-native'
import Colors from '../../resources/Colors'
import { fieldIsBlank } from '../../resources/Utility'
import EditButton from './EditButton'
import { AttributeName } from './AttributeCell'

export default class TextNumberCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			draftValue: this.props.value,
			editing: false,
		}

		this.handleChangeText = this.handleChangeText.bind(this)
		this.handleSubmitText = this.handleSubmitText.bind(this)
		this.handleEdit = this.handleEdit.bind(this)
	}

	componentWillReceiveProps(np) {
		this.setState({ draftValue: np.value })
	}

	handleChangeText(text) {
		this.setState({ draftValue: text })
	}

	handleSubmitText() {
		this.setState({ editing: false })
		this.props.onSubmit(this.state.draftValue)
	}

	handleEdit() {
		this.setState({ editing: true }, () => {
			if (this.input) this.input.focus()
		})
	}

	render() {
		if (this.props.isLoadingTask) return null

		const { name, loading } = this.props
		return (
			<TouchableOpacity onPress={this.handleEdit} style={styles.container}>
				<AttributeName name={name} loading={loading} />
				{this.renderRightSide()}
			</TouchableOpacity>
		)
	}

	renderRightSide() {
		const { value } = this.props
		const showEdit = !this.state.editing && fieldIsBlank(value)
		const keyboardType = this.props.type === 'NUMB' ? 'numeric' : 'default'
		return (
			<View>
				<View style={showEdit ? {} : styles.hidden}>
					<EditButton />
				</View>
				<View style={showEdit ? styles.hidden : {}}>
					<TextInput
						ref={input => this.input = input}
						style={styles.input}
						onChangeText={this.handleChangeText}
						onSubmitEditing={this.handleSubmitText}
						onBlur={this.handleSubmitText}
						returnKeyType="done"
						value={this.state.draftValue}
						keyboardType={keyboardType}
						autoCorrect={false}
					/>
				</View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	input: {
		fontSize: 17,
		color: Colors.textBlack,
		flex: 1,
		textAlign: 'right',
	},
	hidden: {
		height: 0,
		width: 0,
		opacity: 0,
	},
})

