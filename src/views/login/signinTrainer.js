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

} from 'react-native';
import { Button, Input, Slider } from 'react-native-elements';
import { Font } from 'expo';
import GenderButton from '../../Components/genderButton';
import NumericInput from 'react-native-numeric-input';
import Icon from "react-native-vector-icons/Entypo";
import Icon1 from "react-native-vector-icons/Ionicons";
import ActionButton from 'react-native-action-button';
import ImageUpload from '../../Components/ImagePicker';

const MALE_AVATAR = require('../../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../../Images/FemaleAvatar.png');
const BOTH_AVATAR = require('../../../Images/BothAvatar.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_SIZE = SCREEN_WIDTH - 150;


export default class SigninTrainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      // email: '',
      // password: '',
      // firstName: '',
      // lastName: '',
      // dateOfBirth: '',
      // sportCategories: [],
      // gender: null,
      // isTrainer: null,
      searchRadius: 5,
      picture: '',
      personalTrainingPrice: 0
    };

    this.setPicturePath = this.setPicturePath.bind(this);
  
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require('../../../assets/fonts/Georgia.ttf'),
      regular: require('../../../assets/fonts/Montserrat-Regular.ttf'),
      light: require('../../../assets/fonts/Montserrat-Light.ttf'),
      bold: require('../../../assets/fonts/Montserrat-Bold.ttf'),
    });

    this.setState({
      fontLoaded: true,
    });
  }

 
  submit() {
    const pictureValid = this.validatePicture();

    if (
      pictureValid 
    ) {
      let Trainer = {
        Email: this.props.navigation.getParam('email'),
        Password: this.props.navigation.getParam('password'),
        FirstName: this.props.navigation.getParam('firstName'),
        LastName: this.props.navigation.getParam('lastName'),
        Gender: this.props.navigation.getParam('gender'),
        DateOfBirth: this.props.navigation.getParam('dateOfBirth'),
        SportCategories: this.props.navigation.getParam('sportCategories'),
        IsTrainer: 1,
        SearchRadius: this.state.searchRadius,
        PersonalTrainingPrice:0,
        Picture: this.state.picture,
      }

      console.warn(Trainer);
      fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/InsertTrainer', {
        method: 'POST',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(Trainer),

      })
        .then(res => res.json())
        .then(response => {
          if (response == 0) {
            alert('Error');
          }
          else {
            alert('User Code: ' + response);
            this.props.navigation.navigate('Login');
          }
        })

        .catch(error => console.warn('Error:', error.message));
    }



  }

  validatePicture() {
    if (this.state.picture == null) {
      alert('Please insert picture');
      return false;
    }
    else return true;

  }


setPicturePath(path){
  this.setState({picture:path});
}


  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>

        <StatusBar barStyle="light-content" />

        {this.state.fontLoaded ? (
          <View style={{ flex: 1, backgroundColor: 'rgba(47,44,60,1)' }}>

            <View style={styles.statusBar} />

            <View style={styles.navBar}>

              <Text style={styles.nameHeader}>{this.props.navigation.getParam('firstName') + ' ' + this.props.navigation.getParam('lastName')}</Text>

            </View>

            <ScrollView style={{ flex: 1 }}>

              <View>

                <ImageUpload setPicturePath={this.setPicturePath} gender={this.props.navigation.getParam('gender')}></ImageUpload>

              </View>

                  <View style={{ flex: 1, flexDirection: 'column' }}>

                    <Text
                      style={style = styles.textHeadlines}
                    >

                      Search Radius
                </Text>

                    <View style={styles.sliderContainerStyle} >

                      <Text style={styles.sliderRangeText}>0</Text >

                      <Slider
                        minimumTrackTintColor='white'
                        maximumTrackTintColor='gray'
                        thumbTintColor='rgba(213, 100, 140, 1)'
                        style={styles.sliderStyle}
                        minimumValue={0}
                        step={1}
                        maximumValue={30}
                        value={this.state.searchRadius}
                        onValueChange={value => this.setState({ searchRadius: value })}
                      />

                      <Text style={style = styles.sliderRangeText}>30</Text>

                    </View>

                    <Text style={{ color: 'rgba(216, 121, 112, 1)', textAlign: 'center', fontSize: 13 }}>Radius: {this.state.searchRadius} km</Text>

                  </View>

                  <View style={{ flex: 1, flexDirection: 'column' }}>

                    {/* <Text style={styles.preferencesHeadlines} > Partner Preferences</Text> */}


                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: "center", marginTop: 20 }}>

                      <Text style={style = styles.partnersAgeHeadline}>
                        Price for personal training
                      </Text>

                      <View style={{ flex: 5, justifyContent: 'center', flexDirection: 'row', marginRight: 25 }}>

                  

                        <Text style={{ flex: 1, color: 'white', textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>$</Text>

                        <NumericInput
                          style={styles.numericInput}
                          value={this.state.personalTrainingPrice}
                          onChange={value => this.setState({ personalTrainingPrice: value })}
                          type='up-down'
                          initValue={this.state.personalTrainingPrice}
                          totalWidth={100}
                          textColor='white'
                          minValue={0}
                          maxValue={500}
                          rounded
                        />
                      </View>

                    </View>

                  </View>

                  <View style={{ flex: 1 }}>
                      <ActionButton
                        buttonColor='#46db93'
                        size={50}
                        renderIcon={active => active ? null :
                          (<Icon
                            name='check'
                            color='white'
                            size={35}
                          />)
                        }
                        onPress={() => this.submit()}
                      ></ActionButton>
<Button
title="submit"
onPress={() => this.submit()}
>

</Button>

                </View>

               

            </ScrollView>

          </View>
        ) : (

            <Text>Loading...</Text>

          )}

      </SafeAreaView>
    );
  }
}



const styles = StyleSheet.create({
  statusBar: {
    height: 10,
  },
  navBar: {
    height: 60,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignContent: 'center',
  },
  nameHeader: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
  },
  infoTypeLabel: {
    fontSize: 15,
    textAlign: 'right',
    color: 'rgba(126,123,138,1)',
    fontFamily: 'regular',
    paddingBottom: 10,
  },
  infoAnswerLabel: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'regular',
    paddingBottom: 10,
  },
  inputStyle: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    fontFamily: 'light',
    fontSize: 16,
    height: 100,

  },
  inputContainer: {
    marginTop: 25
  },
  sliderStyle: {
    width: SLIDER_SIZE,
    marginTop: 25,
  },


  sliderContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: -18
  },

  partnerPreferencesContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 10,
    //alignItems: 'center',
    flexDirection: 'row',
    marginRight: 40

  },
  sliderRangeText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 37,
    textAlign: 'center'
  },
  textHeadlines: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(216, 121, 112, 1)',
    fontFamily: 'regular',
    marginLeft: 40,
    marginTop: 30
  },
  partnersGenderHeadline: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(216, 121, 112, 1)',
    fontFamily: 'regular',
    marginLeft: 40,
    marginTop: 30
  },

  partnersAgeHeadline: {
    flex: 2,
    fontSize: 15,
    color: 'rgba(216, 121, 112, 1)',
    fontFamily: 'regular',
    marginLeft: 40,
    marginTop: 10
  },

  userTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    marginTop: -18,
  },
  partnerPreferencesStyle: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 30
  },
  uploadImageIcon: {
    fontSize: 20,
    height: 22,
    color: 'black'
  },
  editImageButton: {
    marginRight: 95,
    marginTop: -30
  },
  numericInput: {
    flex: 1,
  },
  preferencesHeadlines: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
  }


});
