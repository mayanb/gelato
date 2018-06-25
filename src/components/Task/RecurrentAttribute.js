import React from 'react'
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Image,
} from 'react-native'
import moment from 'moment'
import Colors from '../../resources/Colors'
import * as ImageUtility from '../../resources/ImageUtility'

const COLLAPSED_LOG_COUNT = 2

export default class RecurrentAttribute extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			displayAll: false,
		}

		this.handleSubmitText = this.handleSubmitText.bind(this)
	}

	render() {
		if (this.props.isLoadingTask) {
			return null
		}

		const { name, values } = this.props
		const { displayAll } = this.state
		const logs = displayAll ? values : values.slice(0, COLLAPSED_LOG_COUNT)
		return (
			<TouchableOpacity onPress={this.handleEdit} style={styles.container}>
				<Text style={styles.name}>{name}</Text>
				{logs.map(log => <Log key={log.id} log={log} />)}
				{this.moreButton()}
			</TouchableOpacity>
		)
	}

	moreButton() {
		const { values } = this.props
		const { displayAll } = this.state
		const numHidden = values.length - COLLAPSED_LOG_COUNT
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
	const displayDate = moment(log.updated_at).fromNow()
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
