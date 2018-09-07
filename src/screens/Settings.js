import React from 'react'
import { connect } from 'react-redux'
import {
    FlatList,
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
} from 'react-native'
import NavHeader from 'react-navigation-header-buttons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { clearUser } from 'react-native-authentication-helpers'

import Colors from '../resources/Colors'
import Storage from '../resources/Storage'
import { TagRow } from '../components/Cells'
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

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            tags: this.props.tags,
        }
        this.props.dispatch(tagActions.fetchTags())
        Storage.get('selectedTags').then(selectedTagsStr => {
            const selectedTags = JSON.parse(selectedTagsStr)
            this.setState({ selectedTags, isLoading: false })
        })

        this.renderHeader = this.renderHeader.bind(this)
        this.renderRow = this.renderRow.bind(this)
        this.handleRowSelect = this.handleRowSelect.bind(this)
        this.handleSelectDeselectAll = this.handleSelectDeselectAll.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ tags: nextProps.tags })
    }

    componentWillMount() {
        this.props.navigation.setParams({
            handleClose: this.handleClose.bind(this)
        })
    }
    
    render() {
        const { isLoading, tags } = this.state
        return (
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.iconContainer}>
                        <Image style={styles.icon} source={ImageUtility.uxIcon('tune')} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.headerText}>Filter content</Text>
                        <Text style={styles.descriptionText}>Choose what data shows up on this device</Text>
                    </View>
                </View>
                { !isLoading && !!tags.length && 
                <FlatList
                    data={tags}
                    style={styles.table}
                    ListHeaderComponent={this.renderHeader}
                    renderItem={this.renderRow}
                    ListFooterComponent={this.renderFooter}
                    extraData={this.state}
                    scrollEnabled={false}
                /> }
                {!tags.length && 
                <Text style={styles.errorText}>No tags created.</Text> }
                <Text style={styles.logout} onPress={this.handleLogout}>LOG OUT</Text>
            </ScrollView>
        )
    }

    renderHeader() {
        const { selectedTags } = this.state
        return (
            <TagRow
                text='Select/Deselect All'
                checked={!selectedTags}
                onPress={this.handleSelectDeselectAll}
            />
        )
    }

    renderRow({ item }) {
        return (
            <TagRow 
                text={item.name}
                checked={this.is_selected_tag(item.name)}
                key={item.id}
                id={item.id}
                onPress={() => this.handleRowSelect(item.name)}
            />
        )
    }

    is_selected_tag(name) {
        const { selectedTags } = this.state
        return !selectedTags ? true : selectedTags.includes(name)
    }

    handleSelectDeselectAll() {
        Storage.get('selectedTags').then(selectedTagsStr => {
            const selectedTags = JSON.parse(selectedTagsStr)
            if (selectedTags) {
                Storage.remove('selectedTags')
                this.setState({ selectedTags: null })
            } else {
                Storage.save('selectedTags', JSON.stringify([]))
                this.setState({ selectedTags: [] })
            }
        })

    }

    handleRowSelect(name) {
        const { selectedTags, tags } = this.state
        if (!selectedTags) {
            const newSelectedTags = []
            tags.forEach(tag => {
                if (name !== tag.name) {
                    newSelectedTags.push(tag.name)
                }
            })
            Storage.save('selectedTags', JSON.stringify(newSelectedTags))
            this.setState({ selectedTags: newSelectedTags })
        } else {
            if (!selectedTags.includes(name)) {
                Storage.save('selectedTags', JSON.stringify([...selectedTags, name]))
                this.setState({ selectedTags: [...selectedTags, name] })
            } else {
                const removeIndex = selectedTags.indexOf(name)
                const newSelectedTags = []
                for (let i = 0; i < selectedTags.length; i++) {
                    if (i !== removeIndex) {
                        newSelectedTags.push(selectedTags[i])
                    }
                }
                Storage.save('selectedTags', JSON.stringify(newSelectedTags))
                this.setState({ selectedTags: newSelectedTags })
            }
        }
    }

    renderFooter() {
        return (
            <View style={styles.footer}></View>
        )
    }

    handleClose() {
        this.props.navigation.state.params.backFn(true)
        this.props.navigation.goBack()
    }

    handleLogout() {
        Storage.clear()
        clearUser()
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
        fontWeight: '600',
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
    },
    headerText: {
        fontSize: 22,
        fontWeight: '500',
    },
    descriptionText: {
        fontSize: 16,
    },
    footer: {
        height: 40, 
    },
    errorText: {
        fontStyle: 'italic',
        color: Colors.gray,
        margin: 20,
    },
    logout: {
        margin: 26,
        color: Colors.base,
        fontSize: 16,
        fontWeight: '500',
    },
})