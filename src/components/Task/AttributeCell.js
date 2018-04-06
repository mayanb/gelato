import React from 'react'
import {
	Image,
	View,
	Text,
	TextInput,
	Dimensions,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	Switch,
} from 'react-native'
import Colors from '../../resources/Colors'
import * as ImageUtility from '../../resources/ImageUtility'

export default class AttributeCell extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
		}
	}

	render() {
		let { name } = this.props
		name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
		return (
			<View style={styles.container}>
				<View style={styles.nameContainer}>
					<Text style={styles.name}>{name}</Text>
					{this.state.loading && <ActivityIndicator size="small" color={Colors.base} />}
				</View>
				{this.renderValue()}
			</View>
		)
	}

	renderValue() {
		if (this.props.type === 'BOOL') {
			return (
				<BooleanCell
					value={this.props.value}
					onSubmit={this.handleSubmit.bind(this)}
				/>
			)
		} else {
			return (
				<TextNumberCell
					value={this.props.value}
					onSubmit={this.handleSubmit.bind(this)}
					type={this.props.type}
				/>
			)
		}
	}

	handleSubmit(value) {
		console.log('handleSubmit', value)
		if (value !== this.props.value) {
			this.setState({ loading: true })
			this.props
				.onSubmitEditing(this.props.id, value)
				.finally(() => this.setState({ loading: false }))
		}
	}
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
	container: {
		width: width,
		minHeight: 60,
		borderBottomWidth: 1,
		borderBottomColor: Colors.ultraLightGray,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 16,
		paddingRight: 16,
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: Colors.white,
	},
	nameContainer: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	name: {
		color: Colors.lightGray,
		fontSize: 17,
		marginRight: 20,
	},
})

class TextNumberCell extends React.Component {
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
			if (this.input)
				this.input.focus()
		})
	}

	render() {
		if (!this.state.editing && (this.props.value === undefined || this.props.value === null)) {
			return <EditButton onEdit={this.handleEdit} />
		} else {
			const keyboardType = this.props.type === 'NUMB' ? 'numeric' : 'default'
			const style = {
				fontSize: 17,
				color: Colors.textBlack,
				flex: 1,
				textAlign: 'right',
			}
			console.log('should show')
			return (
				<TextInput
					style={style}
					onChangeText={this.handleChangeText}
					onSubmitEditing={this.handleSubmitText}
					onBlur={this.handleSubmitText}
					returnKeyType="done"
					value={this.state.draftValue}
					keyboardType={keyboardType}
					autoCorrent={false}
					ref={input => (this.input = input)}
				/>
			)
		}
	}
}


class BooleanCell extends React.Component {
	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(value) {
		const storedValue = value ? 'true' : ''
		this.props.onSubmit(storedValue)
	}

	render() {
		if (this.props.value === undefined)
			return null

		const booleanValue = this.props.value === 'true'
		const label = booleanValue ? 'Yes' : 'No'

		return (
			<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<Text style={{ marginRight: 20 }}>{label}</Text>
				<Switch
					value={booleanValue}
					onValueChange={this.handleChange}
				/>
			</View>
		)
	}
}

function EditButton({ onEdit }) {
	return (
		<TouchableOpacity
			activeOpacity={0.5}
			onPress={onEdit}
			style={{
				width: width / 2,
				height: 59,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'flex-end',
				alignItems: 'center',
			}}>
			<View>
				<Image source={ImageUtility.uxIcon('edit')} />
			</View>
		</TouchableOpacity>
	)
}


