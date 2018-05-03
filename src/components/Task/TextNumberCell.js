import React from 'react'
import { TextInput, View } from 'react-native'
import Colors from '../../resources/Colors'
import { fieldIsBlank } from '../../resources/Utility'
import EditButton from './EditButton'

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

		const { value } = this.props
		if (!this.state.editing && fieldIsBlank(value)) {
			return <EditButton onEdit={this.handleEdit} />
		} else {
			const keyboardType = this.props.type === 'NUMB' ? 'numeric' : 'default'
			const style = {
				fontSize: 17,
				color: Colors.textBlack,
				flex: 1,
				textAlign: 'right',
			}
			return (
				<View style={{flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: 60 }}>
					<TextInput
						style={style}
						onChangeText={this.handleChangeText}
						onSubmitEditing={this.handleSubmitText}
						onBlur={this.handleSubmitText}
						returnKeyType="done"
						value={this.state.draftValue}
						keyboardType={keyboardType}
						autoCorrect={false}
						ref={input => (this.input = input)}
					/>
				</View>
			)
		}
	}
}
