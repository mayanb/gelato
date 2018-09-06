import React from 'react'
import { connect } from 'react-redux'
import {
    FlatList,
    View,
    StyleSheet,
    Text,
    Image,
} from 'react-native'
import NavHeader from 'react-navigation-header-buttons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { TagRow } from '../components/Cells'
import Colors from '../resources/Colors'
import * as ImageUtility from '../resources/ImageUtility'
import * as tagActions from '../actions/TagActions'

class Settings extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {}
        const { handleClose } = params
        const NavItem = NavHeader.Item
        return {
            headerLeft: (
                <NavHeader IconComponent={Ionicons} size={25} color={Colors.white}>
                    <NavItem 
                        iconName='md-close'
                        label='Close'
                        onPress={handleClose}
                    />
                </NavHeader>
            ),
            headerTitle: (
                <View>
                    <Text style={styles.title}>Settings</Text>
                </View>
            ),
        }
    }
    
    render() {
        const { tags } = this.props
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.iconContainer}>
                        <Image style={styles.icon} source={ImageUtility.uxIcon('tune')} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.headerText}>Filter content</Text>
                        <Text style={styles.descriptionText}>Choose what data shows up on this device</Text>
                    </View>
                </View>
                {!!tags.length && 
                <FlatList
                    data={tags}
                    style={styles.table}
                    renderItem={this.renderRow}
                    ListFooterComponent={this.renderFooter}
                    //ListHeaderComponent={this.renderHeader}
                />
                }
            </View>
        )
    }

    renderRow({ item }) {
        return (
            <TagRow 
                name={item.name}
                key={item.id}
                id={item.id}

            />
        )
    }

    renderFooter() {
        return (
            <View style={styles.footer}></View>
        )
    }

    componentDidMount() {
        this.props.dispatch(tagActions.fetchTags())
    }
    componentWillMount() {
        this.props.navigation.setParams({
            handleClose: this.handleClose.bind(this)
        })
    }

    handleClose() {
        this.props.navigation.goBack()
    }
}

const mapStateToProps = (state/*, props*/) => {
    return { tags: state.tags.data }
}

export default connect(mapStateToProps)(Settings)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bluishGray,
        display: 'flex',
        height: '100%',
    },
    title: {
        color: Colors.white,
        fontSize: 17,
        fontWeight: 'bold',
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    iconContainer: {
        paddingLeft: 16,
        paddingRight: 8,
        paddingTop: 16,
        paddingBottom: 16,
        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1,
    },
    icon: {
        height: 44,
        width: 44,
        marginLeft: 'auto',
    },
    textContainer: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
        // borderColor: 'black',
        // borderStyle: 'solid',
        // borderWidth: 1,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    descriptionText: {
        fontSize: 16,
    },
    footer: {
        height: 60, 
    },
})