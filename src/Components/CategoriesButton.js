import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  LayoutAnimation,
  Dimensions,
  StatusBar,
  AsyncStorage,
  Image

} from 'react-native';
import { Slider, Divider, Button } from 'react-native-elements';
import { Font } from 'expo';
import AvatarImage from '../Components/AvatarImage';
import NumericInput from 'react-native-numeric-input';
import Icon from "react-native-vector-icons/Entypo";
import Icon1 from "react-native-vector-icons/FontAwesome";
import ActionButton from 'react-native-action-button';
import ImageUpload from '../Components/ImagePicker';

const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');
const BOTH_AVATAR = require('../../Images/BothAvatar.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_SIZE = SCREEN_WIDTH - 150;

export default class CustomButton extends Component {
  constructor() {
    super();

    this.state = {
      selected: false,
    };
  }

  componentDidMount() {
    const { selected } = this.props;

    this.setState({
      selected,
    });
  }

  render() {
    const { title } = this.props;
    const { selected } = this.state;


    return (
      <Button
        title={title}
        titleStyle={
          selected
            ? {
              color: 'white',
              fontSize: 12,
              fontFamily: 'regular'
            }
            : {
              fontSize: 12,
              color: 'gray',
              fontFamily: 'regular'
            }
        }
        buttonStyle={
          selected
            ? {
              backgroundColor: '#f34573',
              borderRadius: 100,
              width: 105
            }
            : {
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 30,
              width: 105,
              backgroundColor: 'transparent',
            }
        }
        containerStyle={{ marginRight: 10 }}
        onPress={() => { 
          if(this.props.editMode) {
          this.setState({ selected: !selected })
          this.props.setCategories(title)
        }
          
        }}
      />
    );
  }
}
