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

const GenderButton = props => {
    const { image, label, labelColor, selected, ...attributes } = props;
    return (
        <TouchableOpacity {...attributes}>
            <View
                style={[
                    styles.userTypeItemContainer,
                    selected && styles.userTypeItemContainerSelected,
                ]}
            >
                <Text style={[styles.userTypeLabel, { color: labelColor }]}>
                    {label}
                </Text>
                <Image
                    source={image}
                    style={[
                        styles.userTypeMugshot,
                        selected && styles.userTypeMugshotSelected,
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
        height: 40,
        width: 40,
    },
    userTypeMugshotSelected: {
        height: 50,
        width: 50,
    },

    userTypeLabel: {
        color: 'yellow',
        fontFamily: 'bold',
        fontSize: 11,
    },

})

export default GenderButton;