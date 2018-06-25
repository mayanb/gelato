import React from 'react'
import {
	Text,
	TextInput,
	View,
	TouchableOpacity,
	StyleSheet,
	Image,
} from 'react-native'
import moment from 'moment'
import Colors from '../../resources/Colors'
import { fieldIsBlank } from '../../resources/Utility'
import EditButton from './EditButton'
import * as ImageUtility from '../../resources/ImageUtility'

const MIN_LOG_COUNT = 2

export default class RecurrentAttribute extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			draftValue: this.props.value,
			editing: false,
			displayAll: false,
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

		const { name, loading, values } = this.props
		const { displayAll } = this.state
		const valuesToDisplay = displayAll ? values : values.slice(0, MIN_LOG_COUNT)
		return (
			<TouchableOpacity onPress={this.handleEdit} style={styles.container}>
				<Text style={styles.name}>{name}</Text>
				{valuesToDisplay.map(log => <Log key={log.id} log={log} />)}
				{this.moreButton()}
			</TouchableOpacity>
		)
	}

	moreButton() {
		const { values } = this.props
		const { displayAll } = this.state
		const numHidden = values.length - MIN_LOG_COUNT
		if (numHidden < 1) {
			return
		}
		const msg = `${displayAll ? 'Hide' : 'Show'} ${numHidden} older values`
		return (
			<TouchableOpacity
				onPress={() => this.setState({ displayAll: !displayAll })}>
				<View style={styles.moreButton}>
					<Text style={styles.moreButtonText}>{msg}</Text>
					<UpOrDownArrow upArrow={displayAll} />
				</View>
			</TouchableOpacity>
		)
	}
}

function UpOrDownArrow({ upArrow }) {
	return (
		<View style={styles.upOrDownArrowContainer}>
			<Image
				source={ImageUtility.requireIcon('downarrow.png')}
				style={[styles.arrow, upArrow ? styles.upArrow : {}]}
			/>
		</View>
	)
}

function Log({ log }) {
	const displayDate = `${moment(log.updated_at).fromNow()}`
	return (
		<View style={styles.log}>
			<Text style={styles.value}>{log.value}</Text>
			<Text style={styles.date}>{displayDate}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		paddingLeft: 16,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: Colors.white,
	},
	name: {
		fontWeight: 'bold',
		fontSize: 17,
		color: Colors.textBlack,
		marginBottom: 12,
	},
	log: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'baseline',
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderColor: Colors.ultraLightGray,
		marginBottom: 10,
	},
	value: {
		fontSize: 17,
		paddingRight: 6,
	},
	date: {
		fontSize: 14,
		color: Colors.lightGray,
	},
	moreButton: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	moreButtonText: {
		flex: 0,
		fontSize: 14,
		color: Colors.lightGray,
		marginBottom: 8,
	},
	upOrDownArrowContainer: {
		flex: 0,
	},
	arrow: {
		height: 26,
		width: 26,
	},
	upArrow: {
		transform: [{ rotate: '180deg' }],
	},
})
