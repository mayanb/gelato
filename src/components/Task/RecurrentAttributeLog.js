import React from 'react'
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
} from 'react-native'
import {
	TEXT,
	NUMB,
	TIME,
	BOOL,
	USER,
} from '../../resources/AttributeTypeConstants'
import { getDateDisplay } from './DateTimePickerComp'
import { getBoolDisplay } from './BooleanCell'
import moment from 'moment'
import Colors from '../../resources/Colors'
import RecurrentAttributeEditOrCreatePrompt from './RecurrentAttributeEditOrCreatePrompt'

export default class RecurrentAttributeLog extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showEditPrompt: false,
		}

		this.toggleEditingState = this.toggleEditingState.bind(this)
		this.handleSubmitNewLog = this.handleSubmitNewLog.bind(this)
	}
	render() {
		const { showEditPrompt } = this.state
		const { name, log, hideBottomBorder } = this.props
		const displayDate = moment(log.updated_at).fromNow()
		const displayValue = getDisplayValue(log)
		return (
			<TouchableOpacity onPress={this.toggleEditingState}>
				<View
					style={[styles.log, hideBottomBorder ? {} : styles.logBottomBorder]}>
					<Text style={styles.value}>{displayValue}</Text>
					<Text style={styles.date}>{displayDate}</Text>
					{showEditPrompt && (
						<RecurrentAttributeEditOrCreatePrompt
							name={name}
							type={log.datatype}
							toggleEditingState={this.toggleEditingState}
							onSubmit={this.handleSubmitNewLog}
							value={log.value}
						/>
					)}
				</View>
			</TouchableOpacity>
		)
	}

	toggleEditingState() {
		this.setState({ showEditPrompt: !this.state.showEditPrompt })
	}

	handleSubmitNewLog(value) {
		this.toggleEditingState()
		this.props.onSubmit(value, this.props.log) // including log (taskAttribute) signals a PATCH request
	}
}

function getDisplayValue(log) {
	const { value } = log
	if (value === undefined) {
		return ''
	}

	switch (log.datatype) {
		case BOOL:
			return getBoolDisplay(value)
		case TIME:
			return getDateDisplay(value)
		default:
			// TEXT, NUMB, or USER
			return value
	}
}

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
	log: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		minHeight: 48,
		marginRight: 20,
	},
	logBottomBorder: {
		borderBottomWidth: 1,
		borderColor: Colors.ultraLightGray,
	},
	value: {
		maxWidth: 0.4 * width,
		fontSize: 17,
		paddingRight: 6,
	},
	date: {
		fontSize: 14,
		color: Colors.lightGray,
		textAlign: 'right',
	},
})
