import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'
import Colors from '../resources/Colors'
import { Dropdown } from '../components/Dropdown'
import ActivityIndicatorOverlay from '../components/ActivityIndicatorOverlay'
import * as actions from '../actions/ProcessesAndProductsActions'
import * as errorActions from '../actions/ErrorActions'
import * as inventoryActions from '../actions/InventoryActions'
import * as ImageUtility from '../resources/ImageUtility'
import paramsToProps from '../resources/paramsToProps'
import { DateFormatter } from '../resources/Utility'
import Compute from '../resources/Compute'
import pluralize from 'pluralize'

class ChooseTeam extends Component {
	static navigationOptions = ({ navigation }) => {
		const params = navigation.state.params || {}
		return {
			title: params.name,
		}
	}

	constructor(props) {
		super(props)
		this.state = {
			selectedTeam: { name: 'Choose a team', id: -1 },
			moveCompleted: false,
			addedOther: false,
		}
	}

	componentDidMount() {
		let { dispatch, teams } = this.props
		let { addedOther } = this.state
		dispatch(actions.fetchTeams()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
		
	}

	componentWillReceiveProps(np) {
		if (np.hasJustCreatedItem) {
			//console.log('move is done')
			this.setState({ moveCompleted: true })
		}
	}

	render() {
		let { teams, isCreatingItem } = this.props
		let { selectedTeam } = this.state
		return (
			<View style={styles.container}>
				{isCreatingItem && <ActivityIndicatorOverlay />}
				<ScrollView style={styles.scroll}>
					<Text style={styles.title}>I want to move these items to...</Text>
					<Dropdown
						selectedItem={selectedTeam}
						data={teams}
						onSelect={item => this.handleSelect(item)}
						style={styles.dropdown}
					/>
				</ScrollView>
				{this.shouldShowNext() && (
					<ActionButton
						buttonColor={Colors.lightPurple}
						activeOpacity={0.5}
						onPress={this.handleMove.bind(this)}
						buttonText=">"
						icon={<Image source={ImageUtility.requireIcon('send.png')} />}
					/>
				)}
			</View>
		)
	}

	shouldShowNext() {
		let { selectedTeam } = this.state
		return selectedTeam.id !== -1
	}

	showConfirmMoveDialog() {
		//show dialog are you sure you want to move x items to y? ok! cancel
		//ok on press => handleMove
	}

	handleMove() {
		if (isCreatingItem) {
			return
		}
		let { dispatch, items } = this.props
		let { selectedTeam } = this.state
		let formatted_items = []
		items.map(item => formatted_items.push({ item: item.id }))
		let data = {
			team_destination: selectedTeam.id,
			status: 'RC',
			notes: 'DELIVERED VIA APP',
			items: formatted_items,
		}
		dispatch(inventoryActions.requestCreateMove(data))
			.then(() => {
				dispatch(errorActions.handleError(this.generateMoveMessage(), 7500))
				this.navigateToHome()
			})
			.catch(e => {
				dispatch(errorActions.handleError(Compute.errorText(e)))
			})
	}

	generateMoveMessage() {
		let { items } = this.props
		let tname = this.state.selectedTeam.name
		let items_pl = pluralize('items', items.length)
		let items_c = items.length
		return `Hooray! You finished moving ${items_c} ${items_pl} to ${tname}`
	}

	openCreatedTask(task) {
		this.props.navigation.goBack()

		this.props.navigation.navigate('Task', {
			id: task.id,
			name: task.display,
			open: true,
			task: task,
			date: DateFormatter.shorten(task.created_at),
			taskSearch: false,
			title: task.display,
		})
	}

	handleSelect(item) {
		this.setState({ selectedTeam: item })
	}

	navigateToHome() {
		//this.props.navigation.goBack()
		//this.props.navigation.popToTop()
		//this.props.navigation.goBack(null)
		this.props.navigation.navigate('Main')
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F8F8F8',
		flex: 1,
		paddingTop: 25,
	},
	scroll: {
		// height: height
	},
	autocompleteContainer: {
		marginLeft: 10,
		marginRight: 10,
	},
	title: {
		fontSize: 17,
		marginLeft: 16,
		color: Colors.textblack,
		opacity: 0.9,
		marginBottom: 10,
		marginTop: 50,
	},
	dropdown: {
		padding: 30,
	},
	modal: {
		position: 'absolute',
		top: 50,
	},
})

const mapStateToProps = (state /*, props */) => {
	return {
		teams: state.teams.data,
		hasJustCreatedItem: state.move.ui.hasJustCreatedItem,
		isCreatingItem: state.move.ui.isCreatingItem,
	}
}

export default paramsToProps(connect(mapStateToProps)(ChooseTeam))
