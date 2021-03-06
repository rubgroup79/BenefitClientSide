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
import { Slider, Divider } from 'react-native-elements';
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
      partnerGender: null,
      trainerGender: null,
      minPartnerAge: 18,
      maxPartnerAge: 30,
      minBudget: 0,
      maxBudget: 100,
      step: 1,
    };

    this.setSelectedGenderPartner = this.setSelectedGenderPartner.bind(this);
    this.setSelectedGenderTrainer = this.setSelectedGenderTrainer.bind(this);
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
    const pictureValid = this.validatePicture();
    const trainerGenderValid = this.validateTrainerGender();

    if (
      pictureValid &&
      trainerGenderValid
    ) {
      let Trainee = {
        Email: this.props.navigation.getParam('email'),
        Password: this.props.navigation.getParam('password'),
        FirstName: this.props.navigation.getParam('firstName'),
        LastName: this.props.navigation.getParam('lastName'),
        Gender: this.props.navigation.getParam('gender'),
        DateOfBirth: this.props.navigation.getParam('dateOfBirth'),
        SportCategories: this.props.navigation.getParam('userSportCategories'),
        IsTrainer: 0,
        SearchRadius: this.state.searchRadius,
        MinBudget: 0,
        MaxBudget: this.state.maxBudget,
        MinPartnerAge: this.state.minPartnerAge,
        MaxPartnerAge: this.state.maxPartnerAge,
        PartnerGender: this.state.partnerGender,
        TrainerGender: this.state.trainerGender,
        Picture: this.state.picture,
      }

      console.warn(Trainee);
      fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/InsertTrainee', {
        method: 'POST',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(Trainee),

      })
        .then(res => res.json())
        .then(response => {
          if (response == 0) {
            alert('Error');
          }
          else {
            //alert('User Code: ' + response);
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

  validatePartnerGender() {
    if (this.state.partnerGender == null) {
      alert('Please select prefered partner gender');
      return false;
    }
    else return true;

  }

  validateTrainerGender() {
    if (this.state.trainerGender == null) {
      alert('Please select prefered trainer gender');
      return false;
    }
    else return true;

  }

  setSelectedGenderPartner = selectedType =>
    LayoutAnimation.easeInEaseOut() || this.setState({ partnerGender: selectedType });


  setSelectedGenderTrainer = selectedType =>
    LayoutAnimation.easeInEaseOut() || this.setState({ trainerGender: selectedType });


  setPicturePath(path) {
    this.setState({ picture: path });
  }


  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>

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

                <ImageUpload setPicturePath={this.setPicturePath}  gender={this.props.navigation.getParam('gender')}></ImageUpload>

              </View>

              <View style={styles.budgetView}>

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

                <Text style={styles.radiusText}>Radius: {this.state.searchRadius} km</Text>

              </View>
              <Divider style={styles.divider}></Divider>

              {this.state.step == 1 ?
                <View>

                  <View style={styles.budgetView}>

                    <Text style={styles.preferencesHeadlines} > PARTNER PREFERENCES</Text>

                    <View style={styles.partnerPreferencesStyle}>

                      <Text style={style = styles.partnersGenderHeadline}>
                        Gender
                    </Text>

                      <View style={styles.partnerPreferencesContainerStyle} >

                        <View style={styles.userTypesContainer}>

                          <AvatarImage
                            label={"Male"}
                            lableFontSize={11}
                            labelColor={'#75cac3'}
                            image={FEMALE_AVATAR}
                            height={40}
                            width={40}
                            selectedHeight={50}
                            selectedWidth={50}
                            image={MALE_AVATAR}
                            onPress={
                              () => {
                                this.setSelectedGenderPartner('Male')
                                this.setState({ partnerGender: 'Male' })
                              }
                            }
                            selected={this.state.partnerGender === 'Male'}
                          />

                          <AvatarImage
                            label={"Female"}
                            lableFontSize={11}
                            labelColor={'#f34573'}
                            image={FEMALE_AVATAR}
                            height={40}
                            width={40}
                            selectedHeight={50}
                            selectedWidth={50}
                            image={FEMALE_AVATAR}
                            onPress={
                              () => {
                                this.setSelectedGenderPartner('Female')
                                this.setState({ partnerGender: 'Female' })
                              }
                            }
                            selected={this.state.partnerGender === 'Female'}
                          />

                          <AvatarImage
                            label={"Both"}
                            lableFontSize={11}
                            labelColor={'#7384B4'}
                            image={FEMALE_AVATAR}
                            height={40}
                            width={40}
                            selectedHeight={50}
                            selectedWidth={50}
                            image={BOTH_AVATAR}
                            onPress={
                              () => {
                                this.setSelectedGenderPartner('Both')
                                this.setState({ partnerGender: 'Both' })
                              }
                            }
                            selected={this.state.partnerGender === 'Both'}
                          />

                        </View>

                      </View>

                    </View>

                    <View style={styles.ageContainer}>

                      <Text style={style = styles.partnersAgeHeadline}>
                        Age
                      </Text>

                      <View style={styles.ageView}>

                        <NumericInput
                          style={styles.numericInput}
                          value={this.state.minPartnerAge}
                          onChange={value => this.setState({ minPartnerAge: value })}
                          type='up-down'
                          initValue={this.state.minPartnerAge}
                          totalWidth={100}
                          textColor='#7384B4'
                          minValue={18}
                          maxValue={this.state.maxPartnerAge}
                          rounded
                        />

                        <Text style={styles.toText}>to</Text>

                        <NumericInput
                          style={styles.numericInput}
                          value={this.state.maxPartnerAge}
                          onChange={value => this.setState({ maxPartnerAge: value })}
                          type='up-down'
                          initValue={this.state.maxPartnerAge}
                          totalWidth={100}
                          textColor='#7384B4'
                          minValue={this.state.minPartnerAge}
                          maxValue={100}
                          rounded
                        />
                      </View>

                    </View>

                  </View>

                  <View style={styles.actionButtonView}>

                    <ActionButton
                      buttonColor='#75cac3'
                      size={50}
                      renderIcon={active => active ? null :
                        (<Icon
                          name='chevron-right'
                          color='white'
                          size={35}
                        />)
                      }
                      onPress={() => this.nextStep()}
                    ></ActionButton>

                  </View>

                </View>

                :
                <View style={styles.budgetView}>

                  <Text style={styles.preferencesHeadlines}>TRAINER PREFERENCES</Text>

                  <View style={styles.partnerPreferencesStyle}>

                    <Text style={style = styles.partnersGenderHeadline}>
                      Gender
                    </Text>

                    <View style={styles.partnerPreferencesContainerStyle} >

                      <View style={styles.userTypesContainer}>

                        <AvatarImage
                          label={"Male"}
                          lableFontSize={11}
                          labelColor={'#75cac3'}
                          image={FEMALE_AVATAR}
                          height={40}
                          width={40}
                          selectedHeight={50}
                          selectedWidth={50}
                          image={MALE_AVATAR}
                          onPress={
                            () => {
                              this.setSelectedGenderTrainer('Male')
                              this.setState({ trainerGender: 'Male' })
                            }
                          }
                          selected={this.state.trainerGender === 'Male'}
                        />

                        <AvatarImage
                          label={"Female"}
                          lableFontSize={11}
                          labelColor={'#f34573'}
                          image={FEMALE_AVATAR}
                          height={40}
                          width={40}
                          selectedHeight={50}
                          selectedWidth={50}
                          image={FEMALE_AVATAR}
                          onPress={
                            () => {
                              this.setSelectedGenderTrainer('Female')
                              this.setState({ trainerGender: 'Female' })
                            }
                          }
                          selected={this.state.trainerGender === 'Female'}
                        />

                        <AvatarImage
                          label={"Both"}
                          lableFontSize={11}
                          labelColor={'#7384B4'}
                          image={FEMALE_AVATAR}
                          height={40}
                          width={40}
                          selectedHeight={50}
                          selectedWidth={50}
                          image={BOTH_AVATAR}
                          onPress={
                            () => {
                              this.setSelectedGenderTrainer('Both')
                              this.setState({ trainerGender: 'Both' })
                            }
                          }
                          selected={this.state.trainerGender === 'Both'}
                        />

                      </View>

                    </View>

                  </View>

                  <View style={styles.budgetView}>

                    <Text
                      style={ [styles.textHeadlines] }
                    >
                      Your Budget
                    </Text>

                    <View style={styles.sliderContainerStyle} >

                      <Text style={styles.sliderRangeText}>0</Text >

                      <Slider
                        minimumTrackTintColor='gray'
                        maximumTrackTintColor='#c7c9cc'
                        thumbTintColor='#f34573'
                        style={styles.sliderStyle}
                        minimumValue={0}
                        step={10}
                        maximumValue={500}
                        value={this.state.maxBudget}
                        onValueChange={value => this.setState({ maxBudget: value })}
                      />

                      <Text style={style = styles.sliderRangeText}>500</Text>


                    </View>

                    <Text style={styles.budgetText}>Budget: {this.state.maxBudget} $</Text>

                  </View>

                  <View style={styles.actionButtonsContainer}>

                    <View style={styles.actionButtonsView}>

                      <ActionButton
                        buttonColor='#75cac3'
                        size={50}
                        renderIcon={active => active ? null :
                          (<Icon
                            name='chevron-left'
                            color='white'
                            size={35}
                          />)
                        }
                        onPress={() => this.setState({ step: 1 })}
                      >
                      </ActionButton>

                    </View>

                    <View style={{ flex: 1 }}>
                      <ActionButton
                        buttonColor='#75cac3'
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

                    </View>

                  </View>

                </View>}

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
  },
radiusText:
{ color: '#f34573', textAlign: 'center', fontSize: 13, fontFamily: 'light' },
divider:
{flex:1, marginTop:10},

ageView:
{ flex: 5, justifyContent: 'center', flexDirection: 'row', marginRight: 25 },
toText:
{ flex: 1, color: 'white', textAlign: 'center', marginTop: 10, fontWeight: 'bold' },
ageContainer:
{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: "center", marginTop: 20 },
actionButtonView:
{ flex: 1, marginTop:30 },

budgetText:
{ color: '#f34573', textAlign: 'center', fontSize: 13 },
actionButtonsView:
{ flex: 1, marginRight: 170 },
actionButtonsContainer:
{ flex: 1, flexDirection: 'row', justifyContent: 'center',  },

budgetView:
{ flex: 1, flexDirection: 'column' },



});
