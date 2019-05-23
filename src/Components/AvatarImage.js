import React, { Component } from 'react';
import {
    TouchableOpacity,
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';


const SCREEN_WIDTH = Dimensions.get('window').width;

const AvatarImage = props => {
    const { image, label, labelColor, selected,height, width, selectedHeight, selectedWidth,lableFontSize, ...attributes } = props;
    return (
        <TouchableOpacity {...attributes}>
            <View
                style={[
                    styles.userTypeItemContainer,
                    selected && styles.userTypeItemContainerSelected,
                ]}
            >
                <Text style={[styles.lable, { color: labelColor, fontSize: lableFontSize, fontFamily: 'bold', }]}>
                    {label}
                </Text>
                <Image
                    source={image}
                    style={[
                        styles.userTypeMugshot, { height: height, width: width,},
                        selected && (styles.userTypeMugshotSelected, {height: selectedHeight, width: selectedWidth,}),
                    ]}
                />
            </View>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({

    userTypeItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    userTypeItemContainerSelected: {
        opacity: 1,
    },
    userTypeMugshot: {
        margin: 15,
        // height: height,
        // width: width,
    },
    // userTypeMugshotSelected: {
    //     height: selectedHeight,
    //     width: selectedWidth,
    // },

    label: {
        fontFamily: 'bold',
        // fontSize: lableFontSize,
    },

})

export default AvatarImage;