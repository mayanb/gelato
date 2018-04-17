import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	TextInput,
	Button,
} from 'react-native'
import * as ImageUtility from '../resources/ImageUtility'
import { AddButton, CancelButton } from './Buttons'
import Colors from '../resources/Colors'
import Compute from '../resources/Compute'
import NumericInputWithUnits from './NumericInputWithUnits'


export default class QRDisplay extends Component {
	render() {
		let {
			unit,
			barcode: bc,
			creating_task_display: display,
			semantic,
			onChange,
			onPress,
			onCancel,
			amount
		} = this.props
		const warning = Compute.isWarning(semantic)
		const shouldShowAmount = Compute.isOkay(semantic)
		const text = Compute.getTextFromSemantic(semantic)
		return (
			<View style={styles.container}>
				<Header left={bc.substring(bc.length - 6)} right={display} warning={warning}/>
				{Compute.isFlagged(semantic) && <Flag />}
				{!Compute.isFlagged(semantic) && Compute.isAncestorFlagged(semantic) && <AncestorFlag />}
				<View style={styles.main}>
					{text && <Text style={styles.semantic}>{text}</Text>}
					{shouldShowAmount ? (
						<View>
							<NumericInputWithUnits
								unit={unit}
								value={amount}
								onChangeText={num => onChange(num)}
							/>
						</View>
					) : null}
				</View>
				{renderButtons(semantic, onPress, onCancel, amount)}
			</View>
		)
	}
}

function Header({ left, right, warning }) {
	return (
		<View style={[styles.qr_top, warning && styles.warning]}>
			<Image source={ImageUtility.requireIcon('qr_icon')} style={styles.icon} />
			<Text style={[styles.qr_text, warning && styles.warning]}>{left}</Text>
			<Text style={[styles.qr_text, warning && styles.warning]}>{right}</Text>
		</View>
	)
}

function Flag() {
	return (
		<View style={styles.flag}>
			<Text style={styles.flagText}>This task is flagged!</Text>
		</View>
	)
}

function AncestorFlag() {
	return (
		<View style={styles.ancestorFlag}>
			<Text style={styles.flagText}>This task has a flagged ancestor!</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		flex: 1,
	},
	qr_top: {
		flexDirection: 'row',
		flex: 0,
		borderBottomWidth: 1,
		borderBottomColor: Colors.ultraLightGray,
		padding: 8,
		alignItems: 'center',
		borderTopRightRadius: 4,
		borderTopLeftRadius: 4,
	},
	main: {
		flex: 1,
		padding: 16,
	},
	qr_text: {
		flex: 1,
	},
	icon: {
		height: 24,
		width: 24,
		marginRight: 8,
	},
	semantic: {
		fontSize: 17,
		lineHeight: 24,
		textAlign: 'center',
	},
	flag: {
		backgroundColor: Colors.red,
		padding: 8,
	},
	ancestorFlag: {
		backgroundColor: Colors.orange,
		padding: 8,
	},
	flagText: {
		color: 'white',
		textAlign: 'center',
	}, 
	warning: {
		backgroundColor: 'orange',
		color: 'white',
	},
	warningButtonsContainer: {
		display: 'flex',
		flexDirection: 'row',
	}, 
	warningAddButton: {
		flex: 1,
		borderTopWidth: 1,
		borderTopColor: Colors.ultraLightGray,
		borderRightWidth: 1,
		borderRightColor: Colors.ultraLightGray,
	},
	warningCancelButton: {
		flex: 1,
	}
})

function renderButtons(semantic, onPress, onCancel, amount) {
	if(Compute.isWarning(semantic)) {
		return (
			<View style={styles.warningButtonsContainer}>
				<AddButton 
					title="Add input" 
					backgroundColor="white" 
					color={Colors.red} 
					style={styles.warningAddButton} 
					onAdd={onPress} 
					disabled={!amount} 
				/>
				<CancelButton 
					title="Cancel" 
					style={styles.warningCancelButton}
					onCancel={onCancel} 
					backgroundColor="white"
				/>
			</View>
		)
	} else if (Compute.isOkay(semantic)) {
		return <AddButton onAdd={onPress} disabled={!amount} />
	} else {
		return <CancelButton onCancel={onCancel} />
	}
}
