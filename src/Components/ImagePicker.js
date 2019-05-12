import React, { Component } from 'react';
import {
    Clipboard,
    Image,
    Share,
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import {ImagePicker, Permissions } from 'expo';
import Icon from "react-native-vector-icons/AntDesign";
import Icon1 from "react-native-vector-icons/Ionicons";
import ActionButton from 'react-native-action-button';

const SCREEN_WIDTH = Dimensions.get('window').width;

const IMAGE_SIZE = SCREEN_WIDTH - 250;
const Male = require('../../Images/MaleAvatar.png');
const Female = require('../../Images/FemaleAvatar.png');


export default class ImageUpload extends Component {

    state = {
        image: "null",
        uploading: false,
    };

    render() {
        let {
            image
        } = this.state;

        return (
            <View style={styles.container}>
                <Image
                    source={this.state.image=="null"? (this.props.gender=='Male' ? Male : Female) :{uri:this.state.image}}
                    style={{
                        width: IMAGE_SIZE,
                        height: IMAGE_SIZE,
                        borderRadius: 10,
                    }}
                />
                <ActionButton style={styles.editImageButton}
                    renderIcon={active => active ? (<Icon1
                        name="md-create"
                        size={15}
                        style={styles.uploadImageIcon}
                    />) :
                        (<Icon1
                            name="md-create"
                            size={15}
                            style={styles.uploadImageIcon}
                        />)

                    }
                    verticalOrientation='down'
                    buttonColor='#d0d6e0'
                    size={33}
                >

                    <ActionButton.Item
                        buttonColor='white'
                        onPress={this._pickImage}
                        >
                        <Icon
                            name="upload"
                            size={15}
                            style={styles.uploadImageIcon}
                        />
                    </ActionButton.Item>
                    <ActionButton.Item
                        buttonColor='white'
                        onPress={this._takePhoto}
                    >
                        <Icon
                            name="camera"
                            size={15}
                            style={styles.uploadImageIcon}
                        />
                    </ActionButton.Item>
                </ActionButton>

{/* 
                {this._maybeRenderImage()}
                {this._maybeRenderUploadingOverlay()} */}
            </View>
        );
    }

    // _maybeRenderUploadingOverlay = () => {
    //     if (this.state.uploading) {
    //         return (
    //             <View
    //                 style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
    //                 <ActivityIndicator color="#fff" size="large" />
    //             </View>
    //         );
    //     }
    // };

    // _maybeRenderImage = () => {
    //     let {
    //         image
    //     } = this.state;

    //     if (!this.state.image) {
    //         return;
    //     }

    //     return (
    //         <View
    //             style={styles.maybeRenderContainer}>
    //             <View
    //                 style={styles.maybeRenderImageContainer}>
    //                 <Image source={{ uri: image }} style={styles.maybeRenderImage} />
    //             </View>

    //             <Text
    //                 onPress={this._copyToClipboard}
    //                 onLongPress={this._share}
    //                 style={styles.maybeRenderImageText}>
    //                 {image}
    //             </Text>
    //         </View>
    //     )};

    _share = () => {
        Share.share({
            message: this.state.image,
            title: 'Check out this photo',
            url: this.state.image,
        });
    };

    _copyToClipboard = () => {
        Clipboard.setString(this.state.image);
        alert('Copied image URL to clipboard');
    };

    _takePhoto = async () => {
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });

            this._handleImagePicked(pickerResult);
        }
    };

    _pickImage = async () => {
        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera roll
        if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });

            this._handleImagePicked(pickerResult);
            
        }
    };

    _handleImagePicked = async pickerResult => {
        let uploadResponse, uploadResult;

        try {
            this.setState({
                uploading: true
            });

            if (!pickerResult.cancelled) {
                uploadResponse = await uploadImageAsync(pickerResult.uri);
                uploadResult = await uploadResponse.json();
              
                this.setState({
                    image: uploadResult
                });
           
            }
        } catch (e) {
            console.log({ uploadResponse });
            console.log({ uploadResult });
            console.log({ e });
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({
                uploading: false
            });
            this.props.setPicturePath(this.state.image);
        }
    };
}

async function uploadImageAsync(uri) {
    let apiUrl = 'http://proj.ruppin.ac.il/bgroup79/test1/tar6/uploadpicture';
   
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    let formData = new FormData();
    formData.append('photo', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
    });

    let options = {
        method: 'POST',
        body: formData,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    };
 
    return fetch(apiUrl, options);
}




const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    exampleText: {
        fontSize: 20,
        marginBottom: 20,
        marginHorizontal: 15,
        textAlign: 'center',
    },
    maybeRenderUploading: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
    },
    maybeRenderContainer: {
        borderRadius: 3,
        elevation: 2,
        marginTop: 30,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 4,
            width: 4,
        },
        shadowRadius: 5,
        width: 250,
    },
    maybeRenderImageContainer: {
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        overflow: 'hidden',
    },
    maybeRenderImage: {
        height: 250,
        width: 250,
    },
    maybeRenderImageText: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    uploadImageIcon:{
        fontSize:20,
        height:22,
        color: 'black'
      },
      editImageButton:{
        marginRight:95,
        marginTop:-30
      }
});