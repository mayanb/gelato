import React from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Linking,
    Alert,
    Image
} from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'
import expo from 'expo'
import Colors from '../../resources/Colors'
import Networking from '../../resources/Networking-superagent'

export default class ImagePicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = { takingPicture: false }
        this.takePicture = this.takePicture.bind(this)
    }

    render() {
        const { isLoadingTask } = this.props
        if (isLoadingTask) {
            return null
        }

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.addPhotoButton}
                    onPress={this.takePicture}
                >
                    <Image source={ImageUtility.uxIcon('camera')} />
                    <Text style={styles.addPhotoText}>Add photo</Text>
                </TouchableOpacity>
            </View>
        )
    }

    async takePicture() {
        const { status: camera_status } = await expo.Permissions.askAsync(expo.Permissions.CAMERA)
        const { status: camera_roll_status } = await expo.Permissions.askAsync(expo.Permissions.CAMERA_ROLL)
        if (camera_status === 'granted' && camera_roll_status === 'granted') {
            if (!this.state.takingPicture) {
                this.setState({ takingPicture: true })
                const result = await expo.ImagePicker.launchCameraAsync()
                this.setState({ takingPicture: false })
                if (!result.cancelled) {
                    const { task, user } = this.props
                    const { uri } = result

                    Networking.uploadURI('/ics/files/', uri, user.teamID, task.id)
                        .then(res => {
                            res.json().then(image => {
                                // image contains { id, name, task, url }
                                // this will be useful information for displaying photos in the future.
                            })
                        })
                }
            }
        } else {
            Alert.alert(
                'Camera Access Disabled',
                'In order to use this feature, please enable "Camera" and "Photos > Read and Write" in your settings.',
                [
                    { text: 'Cancel', onDismiss: () => console.log('Permissions Denied'), style: 'cancel' },
                    { text: 'Settings', onPress: () => Linking.openURL('app-settings:') },
                ],
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    addPhotoButton: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginHorizontal: 16,
        marginVertical: 16,
        height: 60,
        borderStyle: 'solid',
		borderRadius: 4,
		borderWidth: 1,
		borderColor: Colors.base,
    },
    addPhotoText: {
        marginLeft: 8,
        fontSize: 16,
        color: Colors.base
    }
})