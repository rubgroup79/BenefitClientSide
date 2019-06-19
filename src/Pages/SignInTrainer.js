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
import { Slider, Divider, Button } from 'react-native-elements';
import { Font } from 'expo';
import AvatarImage from '../Components/AvatarImage';
import NumericInput from 'react-native-numeric-input';
import Icon from "react-native-vector-icons/Entypo";
import ActionButton from 'react-native-action-button';
import ImageUpload from '../Components/ImagePicker';

const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');
const BOTH_AVATAR = require('../../Images/BothAvatar.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_SIZE = SCREEN_WIDTH - 150;


export default class SigninTrainee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      searchRadius: 5,
      picture: '',
      personalTrainingPrice: 150
    };

    // this.setSelectedGenderPartner = this.setSelectedGenderPartner.bind(this);
    // this.setSelectedGenderTrainer = this.setSelectedGenderTrainer.bind(this);
    this.setPicturePath = this.setPicturePath.bind(this);

  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require('../../assets/fonts/Georgia.ttf'),
      regular: require('../../assets/fonts/Montserrat-Regular.ttf'),
      light: require('../../assets/fonts/Montserrat-Light.ttf'),
      bold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    });

    this.setState({
      fontLoaded: true,
    });
  }

  UNSAFE_componentWillMount() {
    this.setState({ picture: this.props.navigation.getParam('gender') == 'Male' ? "http://proj.ruppin.ac.il/bgroup79/test1/tar6/uploadFiles/Male.jpg" : "http://proj.ruppin.ac.il/bgroup79/test1/tar6/uploadFiles/Female.jpg" })
  }

  nextStep() {
    const partnerGenderValid = this.validatePartnerGender();
    if (partnerGenderValid)
      this.setState({ step: 2 });
  }


  submit() {

    let Trainer = {
      Email: this.props.navigation.getParam('email'),
      Password: this.props.navigation.getParam('password'),
      FirstName: this.props.navigation.getParam('firstName'),
      LastName: this.props.navigation.getParam('lastName'),
      Gender: this.props.navigation.getParam('gender'),
      DateOfBirth: this.props.navigation.getParam('dateOfBirth'),
      SportCategories: this.props.navigation.getParam('userSportCategories'),
      IsTrainer: 1,
      SearchRadius: this.state.searchRadius,
      Picture: this.state.picture,
      PersonalTrainingPrice: this.state.personalTrainingPrice
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

  validatePicture() {
    if (this.state.picture == '') return false;
    else return true;
  }


  // validatePartnerGender() {
  //   if (this.state.partnerGender == null) {
  //     alert('Please select prefered partner gender');
  //     return false;
  //   }
  //   else return true;

  // }

  // validateTrainerGender() {
  //   if (this.state.trainerGender == null) {
  //     alert('Please select prefered trainer gender');
  //     return false;
  //   }
  //   else return true;

  // }

  // setSelectedGenderPartner = selectedType =>
  //   LayoutAnimation.easeInEaseOut() || this.setState({ partnerGender: selectedType });


  // setSelectedGenderTrainer = selectedType =>
  //   LayoutAnimation.easeInEaseOut() || this.setState({ trainerGender: selectedType });


  setPicturePath(path) {
    this.setState({ picture: path });
  }


  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
{console.warn(this.state.picture)}
        <StatusBar barStyle="light-content" />

        {this.state.fontLoaded ? (
          <View style={{ flex: 1, }}>

            <View style={styles.statusBar} />

            <View style={styles.navBar}>

              <Text style={styles.nameHeader}>{this.props.navigation.getParam('firstName') + ' ' + this.props.navigation.getParam('lastName')}</Text>

            </View>

            <ScrollView
              scrollEnabled={false}
              style={{ flex: 1 }}>

              <View>

                <ImageUpload setPicturePath={this.setPicturePath} gender={this.props.navigation.getParam('gender')}></ImageUpload>

              </View>

              <View style={{ flex: 1, flexDirection: 'column', marginTop: 20 }}>

                <Text
                  style={style = styles.textHeadlines}
                >

                  Search Radius
                </Text>

                <View style={styles.sliderContainerStyle} >

                  <Text style={styles.sliderRangeText}>0</Text >

                  <Slider
                    minimumTrackTintColor='gray'
                    maximumTrackTintColor='#c7c9cc'
                    thumbTintColor='#f34573'
                    style={styles.sliderStyle}
                    minimumValue={0}
                    step={1}
                    maximumValue={30}
                    value={this.state.searchRadius}
                    onValueChange={value => this.setState({ searchRadius: value })}
                  />

                  <Text style={style = styles.sliderRangeText}>30</Text>

                </View>

                <Text style={{ color: '#f34573', textAlign: 'center', fontSize: 13, fontFamily: 'light' }}>Radius: {this.state.searchRadius} km</Text>

              </View>

              <View style={{ flex: 1, flexDirection: 'column', marginTop: 20 }}>

                <Text
                  style={style = styles.textHeadlines}
                >

                  Pesonal Training Price
</Text>

                <View style={styles.sliderContainerStyle} >

                  <Text style={styles.sliderRangeText}>0</Text >

                  <Slider
                    minimumTrackTintColor='gray'
                    maximumTrackTintColor='#c7c9cc'
                    thumbTintColor='#f34573'
                    style={styles.sliderStyle}
                    minimumValue={0}
                    step={1}
                    maximumValue={500}
                    value={this.state.personalTrainingPrice}
                    onValueChange={value => this.setState({ personalTrainingPrice: value })}
                  />

                  <Text style={style = styles.sliderRangeText}>30</Text>

                </View>

                <Text style={{ color: '#f34573', textAlign: 'center', fontSize: 13, fontFamily: 'light' }}>Price: {this.state.personalTrainingPrice} $</Text>

              </View>
              <Button
                containerStyle={{ marginVertical: 20 }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10
                }}
                buttonStyle={{
                  height: 55,
                  width: SCREEN_WIDTH - 250,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                linearGradientProps={{
                  colors: ['#75cac3', '#75cac3'],
                  start: [1, 0],
                  end: [0.2, 0],
                }}
                title="SUBMIT"
                titleStyle={{
                  fontFamily: 'regular',
                  fontSize: 20,
                  color: 'white',
                  textAlign: 'center',
                }}
                onPress={() => this.submit()}
                activeOpacity={0.5}
              />




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
    color: '#f34573',
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'light'
  },

  sliderStyle: {
    width: SLIDER_SIZE,
    marginTop: 35,
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
    flexDirection: 'row',
    marginRight: 40

  },

  sliderRangeText: {
    flex: 1,
    color: '#f34573',
    marginTop: 37,
    textAlign: 'center',
    fontFamily: 'bold'
  },

  textHeadlines: {
    flex: 1,
    fontSize: 15,
    color: '#75cac3',
    fontFamily: 'regular',
    marginLeft: 40,
    marginTop: 10
  },

  partnersGenderHeadline: {
    flex: 1,
    fontSize: 15,
    color: '#75cac3',
    fontFamily: 'regular',
    marginLeft: 40,
    marginTop: 30
  },

  partnersAgeHeadline: {
    flex: 2,
    fontSize: 15,
    color: '#75cac3',
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
    marginTop: 15
  },

  numericInput: {
    flex: 1,
  },

  preferencesHeadlines: {
    color: '#7384B4',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: "bold",
    marginTop: 20,
  }


});
