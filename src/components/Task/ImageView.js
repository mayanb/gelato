import React from 'react'
import { Modal } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

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
            </Modal>
        )
    }
}