import React from 'react'
import {
    ActivityIndicator,
    View,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Alert,
    Image,
    ScrollView,
} from 'react-native'
import * as ImageUtility from '../../resources/ImageUtility'
import ImageView from './ImageView'
import expo from 'expo'
import Colors from '../../resources/Colors'
import Networking from '../../resources/Networking-superagent'
import { IMG_EXTENSIONS } from '../../resources/ImagePickerConstants'

export default class ImagePicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            takingPicture: false, 
            isUploadingImage: false,
            files: [],
            imageUrls: [], 
            selectedIndex: null
        }
        this.takePicture = this.takePicture.bind(this)
        this.handleSelectImage = this.handleSelectImage.bind(this)
        this.handleCloseImageView = this.handleCloseImageView.bind(this)
    }

    componentWillReceiveProps(nextProps){
        const files = nextProps.task.files
        if (files) {
            this.setState({ 
                files: files ? files : [],
                imageUrls: getImageUrls(files)
            })
        }
    }

    render() {
        const { isUploadingImage, files } = this.state
        const { isLoadingTask } = this.props
        if (isLoadingTask) {
            return null
        }
        return (
            <View>
                <ImageView 
                    imageUrls={this.state.imageUrls}
                    index={this.state.selectedIndex}
                    onCancel={this.handleCloseImageView}
                />
                <ScrollView 
                    style={styles.container}
                    keyboardDismissMode='on-drag'
                    horizontal={true}
                >
                    <TouchableOpacity
                        style={[styles.icon, styles.addPhotoButton]}
                        onPress={this.takePicture}
                    >
                        <Image source={ImageUtility.uxIcon('camera')} />
                    </TouchableOpacity>
                    { isUploadingImage && 
                        <View style={[styles.icon, styles.uploadingContainer]}>
                            <ActivityIndicator size="small" color={Colors.base} />
                        </View>
                    }
                    {files && files.map((file, index) => {
                        const { url, extension } = file
                        if (!IMG_EXTENSIONS.includes(extension)) {
                            return null
                        }
                        return (
                            <TouchableOpacity
                                key={url}
                                style={styles.imageContainer}
                                onPress={() => this.handleSelectImage(index)}
                            >
                                <Image source={{uri: 'https://' + url}} resizeMethod={'resize'} style={styles.icon} />
                            </TouchableOpacity>
                        )
                    }) }
                </ScrollView>
            </View>
        )
    }

    handleSelectImage(index) {
        this.setState({ selectedIndex: index })
    }

    handleCloseImageView() {
        this.setState({ imageUrls: [], selectedIndex: null })
    }

    async takePicture() {
        // Request permissions
        const { status: camera_status } = await expo.Permissions.askAsync(expo.Permissions.CAMERA)
        const { status: camera_roll_status } = await expo.Permissions.askAsync(expo.Permissions.CAMERA_ROLL)
        if (camera_status === 'granted' && camera_roll_status === 'granted') {
            if (!this.state.takingPicture) {
                // Launch the camera to take a picture
                this.setState({ takingPicture: true })
                const result = await expo.ImagePicker.launchCameraAsync()
                this.setState({ takingPicture: false })

                if (!result.cancelled) {
                    const { task, user } = this.props
                    const { uri } = result
                    
                    // Try to upload the picture
                    this.setState({ isUploadingImage: true })
                    Networking.uploadURI('/ics/files/', uri, user.teamID, task.id)
                        .then(res => {
                            res.json().then(image => {
                                // image contains { id, name, extension, task, url }
                                const newFiles = [image, ...this.state.files]
                                this.setState({ 
                                    isUploadingImage: false,
                                    files: newFiles,
                                    imageUrls: getImageUrls(newFiles)
                                })
                            })
                        }).catch(e => {
                            this.setState({ isUploadingImage: false })
                            console.error('There was an error uploading the file!', e)
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

function getImageUrls(files) {
    const urls = []
    if (files) {
        files.forEach(file => {
            const { url, extension } = file
            if (IMG_EXTENSIONS.includes(extension)) {
                const fullUrl = 'https://' + url
                urls.push({ url: fullUrl })
            }
        })
    }
    return urls
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
    },
    icon: {
        height: 56,
        width: 56,
        backgroundColor: Colors.veryLightGray,
        borderRadius: 4,
    },
    addPhotoButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 8,
        marginVertical: 16,
    },
    uploadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginHorizontal: 8,
        marginVertical: 16,
    },
    imageContainer: {
        marginHorizontal: 8,
        marginVertical: 16,
    },
})