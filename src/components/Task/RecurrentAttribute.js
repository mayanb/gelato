import React from 'react'
import {
	Text,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
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
	}

	render() {
		if (this.props.isLoadingTask) {
			return null
		}

		const { name, values } = this.props
		const { displayAll } = this.state
		const logs = displayAll ? values : values.slice(0, COLLAPSED_LOG_COUNT)
		return (
			<TouchableWithoutFeedback>
				<View style={styles.container}>
					<View style={styles.headerContainer}>
						<Text style={styles.name}>{name}</Text>
						{this.addNewEntryButton()}
					</View>
					{logs.map((log, i) => {
						// Hide bottom log border if showMoreLogs button not present
						const hideBottomBorder = (i === logs.length - 1) && (values.length <= COLLAPSED_LOG_COUNT)
						return <Log key={log.id} log={log} hideBottomBorder={hideBottomBorder} />
					})}
					{this.showMoreLogs()}
				</View>
			</TouchableWithoutFeedback>
		)
	}

	addNewEntryButton() {
		return (
			<TouchableOpacity style={styles.addNewEntryButtonContainer} onPress={() => console.log('Pressed add entry button!')}>
				<Image
					source={ImageUtility.uxIcon('addentrybutton')}
					style={styles.addNewEntryButton}
				/>
			</TouchableOpacity>
		)
	}

	showMoreLogs() {
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
				<View style={styles.showMoreLogsContainer}>
					<Text style={styles.showMoreLogsText}>{msg}</Text>
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

function Log({ log, hideBottomBorder }) {
	const displayDate = moment(log.updated_at).fromNow()
	return (
		<View style={[styles.log, hideBottomBorder ? {} : styles.logBottomBorder]}>
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
		paddingBottom: 4,
		borderColor: Colors.ultraLightGray,
		borderBottomWidth: 1,
		backgroundColor: Colors.white,
		marginBottom: 8,
	},
	headerContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	name: {
		flex: 1,
		fontWeight: 'bold',
		fontSize: 17,
		color: Colors.textBlack,
		marginBottom: 12,
	},
	addNewEntryButtonContainer: {
		flex: 0,
		marginRight: 20,
		shadowOffset: { width: 1, height: 2 },
		shadowColor: 'black',
		shadowOpacity: 0.3,
	},
	addNewEntryButton: {
		flex: 1,
		borderRadius: 13,
		height: 26,
		width: 26,
		maxHeight: 26,
		maxWidth: 26,
	},
	log: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 48,
		marginRight: 20,
	},
	logBottomBorder: {
		borderBottomWidth: 1,
		borderColor: Colors.ultraLightGray,
	},
	value: {
		fontSize: 17,
		paddingRight: 6,
	},
	date: {
		fontSize: 14,
		color: Colors.lightGray,
		textAlign: 'right',
	},
	showMoreLogsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 38,
	},
	showMoreLogsText: {
		flex: 0,
		fontSize: 14,
		color: Colors.lightGray,
	},
	upOrDownArrowContainer: {
		flex: 0,
		marginTop: -4,
	},
	arrow: {
		height: 26,
		width: 26,
	},
	upArrow: {
		transform: [{ rotate: '180deg' }],
	},
})
