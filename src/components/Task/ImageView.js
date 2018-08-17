import React from 'react'
import { Modal, TouchableOpacity, Image, StyleSheet } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import * as ImageUtility from '../../resources/ImageUtility'

export default class ImageView extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { imageUrls, index, onCancel } = this.props
        if (imageUrls.length <= 0 || index === null) { 
            return null 
        }
        return (
            <Modal visible={true}>
                <ImageViewer 
                    imageUrls={imageUrls}
                    index={index}
                    enableSwipeDown={true}
                    onCancel={onCancel}
                />
                <TouchableOpacity
                    style={styles.closeBtnContainer}
                    onPress={() => onCancel()}
                >
                    <Image source={ImageUtility.uxIcon('close')} />
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    closeBtnContainer: {
        position: 'absolute',
        right: 20,
        top: 35,
    },
})