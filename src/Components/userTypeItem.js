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


const UserTypeItem = props => {
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
      userTypesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: SCREEN_WIDTH,
        alignItems: 'center',
        marginTop:30
      },
      userTypeItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
        marginLeft:15,
        marginRight:15
      },
      userTypeItemContainerSelected: {
        opacity: 1,
      },
      userTypeMugshot: {
        margin: 4,
        height: 70,
        width: 70,
      },
      userTypeMugshotSelected: {
        height: 90,
        width: 90,
      },
      userTypeLabel: {
        color: 'yellow',
        fontFamily: 'bold',
        fontSize: 11,
      },
 
})

export default UserTypeItem;