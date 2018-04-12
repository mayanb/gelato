import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import * as actions from '../../actions/ProcessesAndProductsActions'
import * as errorActions from '../../actions/ErrorActions'
import Compute from '../../resources/Compute'
import Heading from './Heading'
import SelectTypeWithInput from './SelectTypeWithInput'

class SelectTypes extends Component {
	constructor(props) {
		super(props)

		this.state = {
			processes_text: '',
			processes_filtered: [],
			processes_dropdown_open: false,
			products_text: '',
			products_filtered: [],
			products_dropdown_open: false,
		}

		this.inputs = {}
	}

	componentWillReceiveProps(np) {
		this.setState({
			processes_filtered: np.processes.slice(0, 4),
			products_filtered: np.products.slice(0, 4),
		})
	}

	componentDidMount() {
		let { dispatch } = this.props
		dispatch(actions.fetchProcesses()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
		dispatch(actions.fetchProducts()).catch(e => {
			dispatch(errorActions.handleError(Compute.errorText(e)))
		})
	}

	render() {
		const { selectedProduct, selectedProcess, isFetchingTypes } = this.props
		if (isFetchingTypes) return null
		return (
			<View style={styles.container}>
				<Heading>What are you working on?</Heading>
				<SelectTypeWithInput
					heading=""
					placeholder="Select process"
					data={this.state.processes_filtered}
					text={this.state.processes_text}
					dropdown_open={this.state.processes_dropdown_open}
					selected={selectedProcess}
					onChangeText={t => this.handleChangeText('processes', t)}
					onSelect={item => this.onSelect('processes', item)}
					onFocus={() => this.onFocus('processes')}
					registerInput={this.registerInputFunction('processes')}
			/>
				<SelectTypeWithInput
					heading=""
					placeholder="Select product"
					data={this.state.products_filtered}
					text={this.state.products_text}
					dropdown_open={this.state.products_dropdown_open}
					selected={selectedProduct}
					onChangeText={t => this.handleChangeText('products', t)}
					onSelect={item => this.onSelect('products', item)}
					onFocus={() => this.onFocus('products')}
					registerInput={this.registerInputFunction('products')}
					done={true}
				/>
			</View>
		)
	}

	handleChangeText(type, text) {
		let textKey = type + '_text'
		let filteredKey = type + '_filtered'
		let filtered = this.props[type].slice(0, 4)
		if (text !== '') {
			filtered = this.searchItems(text.toLowerCase(), this.props[type])
		}
		this.setState({
			[textKey]: text,
			[filteredKey]: filtered,
		})
		this.props.onSelect(type, null)
	}

	searchItems(text, arr) {
		let r = new RegExp(`\\b${text}`)
		return arr.filter(e => e.search.search(r) !== -1)
	}

	onSelect(type, item) {
		let textKey = type + '_text'
		let filteredKey = type + '_filtered'
		let dropdownKey = type + '_dropdown_open'
		this.setState({
			[textKey]: item.name,
			[filteredKey]: [item],
			[dropdownKey]: false,
		})
		this.props.onSelect(type, item)

		if (type === 'processes') {
			this.inputs['products'].focus()
		} else {
			this.inputs['products'].blur()
		}
	}

	onFocus(type) {
		let dropdownKey = type + '_dropdown_open'
		let otherDropdownKey = type === 'processes' ? 'products_dropdown_open' : 'processes_dropdown_open'
		this.setState({ [dropdownKey]: true, [otherDropdownKey]: false })
	}

	registerInputFunction(name) {
		return input => (this.inputs[name] = input)
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
	},
})

const mapStateToProps = (state /*, props */) => {
	const isFetchingTypes =
		state.processes.ui.isFetchingData || state.products.ui.isFetchingData
	return {
		processes: state.processes.data,
		products: state.products.data,
		isFetchingTypes: isFetchingTypes,
	}
}

export default connect(mapStateToProps)(SelectTypes)
