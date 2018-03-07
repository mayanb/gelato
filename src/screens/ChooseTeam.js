import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import ActionButton from 'react-native-action-button'

import Colors from '../resources/Colors'
import { Dropdown } from '../components/Dropdown'
import * as actions from '../actions/ProcessesAndProductsActions'
import * as errorActions from '../actions/ErrorActions'
import * as taskActions from '../actions/TaskListActions'
import * as inventoryActions from '../actions/InventoryActions'
import * as ImageUtility from '../resources/ImageUtility'
import paramsToProps from '../resources/paramsToProps'
import { DateFormatter } from '../resources/Utility'
import Compute from '../resources/Compute'
import ModalAlert from '../components/ModalAlert'
import pluralize from 'pluralize'

class ChooseTeam extends Component {
	static navigationOptions = ({ navigation }) => {
		const params = navigation.state.params || {}
		const { showActionSheet } = params

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
		this.renderMoveCompleteModal = this.renderMoveCompleteModal.bind(this)
	}

	componentDidMount() {
		let { dispatch } = this.props
		dispatch(actions.fetchTeams()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	componentWillReceiveProps(np) {
		if (np.hasJustCreatedItem) {
			console.log("move is done")
			this.setState({moveCompleted: true})
		}
	}

	render() {
		let { teams, items } = this.props
		let { addedOther } = this.state
		if(teams && teams.length > 0 && !addedOther) {
			teams.sort(function(a, b) {
				if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
				if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
				return 0;
			})
			teams.unshift({id: null, name: "other"})
			this.setState({addedOther: true})
		}
		//filter for Dandelion MVP - only showing the dandelion teams
		if(teams) {
			teams = teams.filter(team => ['alabama', 'valencia', 'fulfillment', 'productmakers', 'unitedcold', 'other'].includes(team.name))
		}
		let { selectedTeam, moveCompleted } = this.state
		return (
			<View style={styles.container}>
				<ScrollView style={styles.scroll}>
					<Text style={styles.title}>I want to move these items to...</Text>
					<Dropdown
						selectedItem={selectedTeam}
						data={teams}
						onSelect={item => this.handleSelect(item)}
						style={styles.dropdown}
					/>
				</ScrollView>
				<View style={styles.modal}>{moveCompleted ? this.renderMoveCompleteModal() : null}</View>
				{this.shouldShowNext() && (
					<ActionButton
						buttonColor={Colors.base}
						activeOpacity={0.5}
						onPress={this.handleMove.bind(this)}
						buttonText=">"
						icon={<Image source={ImageUtility.requireIcon('rightarrow.png')} />}
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
		let { dispatch, items } = this.props
		let { selectedTeam } = this.state
		let formatted_items = []
		items.map(item => formatted_items.push({item: item.id}))
		let data = {team_destination: selectedTeam.id, status: "RC", notes: "DELIVERED VIA APP", items: formatted_items}
		dispatch(inventoryActions.requestCreateMove(data)).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
		// let data = { processType: selectedProcess, productType: selectedProduct }
		// dispatch(taskActions.requestCreateTask(data)).catch(e => {
		// 	dispatch(errorActions.handleError(Compute.errorText(e)))
		// })
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

	renderMoveCompleteModal() {
		let { selectedTeam } = this.state
		let { items, teams } = this.props
		return (
			<ModalAlert 
				style={styles.modal}
				onPress={this.navigateToHome.bind(this)} 
				message={`You finished moving ${items.length} ${pluralize("items", items.length)} to ${selectedTeam.name}`}
				buttonText="OK!">
			</ModalAlert>
		)
	}

	navigateToHome() {
		this.props.navigation.goBack()
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
	}
})

const mapStateToProps = (state /*, props */) => {
	return {
		teams: state.teams.data,
		hasJustCreatedItem: state.move.ui.hasJustCreatedItem,
	}
}

export default paramsToProps(connect(mapStateToProps)(ChooseTeam))
