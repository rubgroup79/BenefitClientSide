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
  Image

} from 'react-native';
import { Slider, Divider } from 'react-native-elements';
import { Font } from 'expo';
import AvatarImage from '../Components/AvatarImage'
import NumericInput from 'react-native-numeric-input';
import Icon from "react-native-vector-icons/Entypo";
import ActionButton from 'react-native-action-button';
import ImageUpload from '../Components/ImagePicker';

const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');
const BOTH_AVATAR = require('../../Images/BothAvatar.png');
const STAR= require('../../Images/SelectedStar.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_SIZE = SCREEN_WIDTH - 150;


export default class TraineeProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      userCode: 0,
      firstName: '',
      lastName: '',
      gender: '',
      picture: '',
      rate:0,
      sportCategories:[],
      Age:0

    };


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

  componentWillMount() {

     fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/ShowProfile?UserCode=1', {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
          this.setState({ userCode: response.UserCode, firstName: response.FirstName, lastName: response.LastName, gender: response.Gender, picture: response.Picture, age:response.Age, sportCategories:response.SportCategories, rate: response.Rate })
          console.warn(this.state);
      })
      .catch(error => console.warn('Error:', error.message));

  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>

        <StatusBar barStyle="light-content" />

        {this.state.fontLoaded ? (
          <View style={{ flex: 1, }}>

            <View style={styles.statusBar} />

            <View style={styles.navBar}>

              <Text style={styles.nameHeader}>{this.state.firstName + ' ' + this.state.lastName + "'s Profile"}</Text>

            </View>

            <ScrollView
              scrollEnabled={false}
              style={{ flex: 1, flexDirection: 'column' }}>

              <View style={{ flex: 1, alignItems: 'center', marginTop: 10, flexDirection: 'column', }}>
                <Image style={{ width: 100, height: 100, borderRadius: 50, }} source={{ uri: this.state.picture }}></Image>
                <Text style={{ flex: 1, fontFamily: 'regular', color: '#7384B4', fontSize: 18, margin: 5 }}>{this.state.gender}</Text>
                <Text style={{ flex: 1, fontFamily: 'regular', color: '#7384B4', fontSize: 15, }}>{this.state.age}</Text>
              </View>

              <View style={{ flex: 1, marginTop: 10, flexDirection: 'row', margin:20, justifyContent:'center' }}>
                <Image source={STAR}></Image>
                <Text style={{ flex: 1, fontFamily: 'regular', color: '#f34573', fontSize: 18, margin: 5, alignContent:'center', justifyContent:'center', marginTop:15, marginLeft:10 }}>{this.state.rate}</Text>
              </View>
              {/* 
              <View style={{ flex: 1, flexDirection: 'column' }}>

                <Text
                  style={style = styles.textHeadlines}
                >

                  Search Radius
                </Text>

                <View style={styles.sliderContainerStyle} >

                  <Text style={styles.sliderRangeText}>0</Text >

                  <Slider
                    minimumTrackTintColor='#c7c9cc'
                    maximumTrackTintColor='gray'
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
              <Divider style={{ flex: 1, marginTop: 10 }}></Divider>

              {this.state.step == 1 ?
                <View>

                  <View style={{ flex: 1, flexDirection: 'column' }}>

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
                            labelColor={'#ffffff'}
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
                            labelColor={'#ffffff'}
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
                            labelColor={'#ffffff'}
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

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: "center", marginTop: 20 }}>

                      <Text style={style = styles.partnersAgeHeadline}>
                        Age
                      </Text>

                      <View style={{ flex: 5, justifyContent: 'center', flexDirection: 'row', marginRight: 25 }}>

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

                        <Text style={{ flex: 1, color: 'white', textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>to</Text>

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

                  <View style={{ flex: 1, marginTop: 30 }}>

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
                <View style={{ flex: 1, flexDirection: 'column' }}>

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
                          labelColor={'#ffffff'}
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
                          labelColor={'#ffffff'}
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
                          labelColor={'#ffffff'}
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

                  <View style={{ flex: 1, flexDirection: 'column' }}>

                    <Text
                      style={[styles.textHeadlines]}
                    >
                      Your Budget
                    </Text>

                    <View style={styles.sliderContainerStyle} >

                      <Text style={styles.sliderRangeText}>0</Text >

                      <Slider
                        minimumTrackTintColor='#c7c9cc'
                        maximumTrackTintColor='gray'
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

                    <Text style={{ color: '#f34573', textAlign: 'center', fontSize: 13 }}>Budget: {this.state.maxBudget} $</Text>

                  </View>

                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>

                    <View style={{ flex: 1, marginRight: 170 }}>

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

                </View>} */}

            </ScrollView>

          </View>
        ) : null}

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
    marginTop: 10
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
