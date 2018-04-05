import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import { Dropdown } from '../Dropdown'
import * as actions from '../../actions/ProcessesAndProductsActions'
import * as errorActions from '../../actions/ErrorActions'
import Compute from '../../resources/Compute'
import Heading from './Heading'

class SelectTypes extends Component {

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
		let { processes, products, onSelect, selectedProduct, selectedProcess, isFetchingTypes } = this.props
		if (isFetchingTypes) return null
		return (
			<View>
				<Heading>What are you working on?</Heading>
				<View style={styles.dropdownContainer}>
					<Dropdown
						selectedItem={selectedProcess}
						data={processes}
						onSelect={item => onSelect('processes', item)}
					/>
				</View>
				<View style={styles.dropdownContainer}>
					<Dropdown
						selectedItem={selectedProduct}
						data={products}
						onSelect={item => onSelect('products', item)}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F8F8F8',
		flex: 1,
		paddingLeft: 16,
		paddingRight: 16,
	},
	scroll: {
		paddingTop: 20,
		paddingBottom: 40,
		position: 'relative',
		flex: 1,
	},
	dropdownContainer: {
		marginTop: 20,
	},
})

const mapStateToProps = (state /*, props */) => {
	const isFetchingTypes = state.processes.ui.isFetchingData || state.products.ui.isFetchingData
	return {
		processes: state.processes.data,
		products: state.products.data,
		isFetchingTypes: isFetchingTypes,
	}
}

export default connect(mapStateToProps)(SelectTypes)
