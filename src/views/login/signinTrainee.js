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

// class CustomButton extends Component {
//   constructor() {
//     super();

//     this.state = {
//       selected: false,

//     };
//   }

//   componentDidMount() {
//     const { selected } = this.props;

//     this.setState({
//       selected,
//     });
//   }

//   render() {
//     const { title } = this.props;
//     const { selected } = this.state;

//     return (
//       <Button
//         title={title}
//         titleStyle={{ fontSize: 15, color: 'white', fontFamily: 'regular' }}
//         buttonStyle={
//           selected
//             ? {
//               backgroundColor: 'rgba(213, 100, 140, 1)',
//               borderRadius: 100,
//               width: 127,
//             }
//             : {
//               borderWidth: 1,
//               borderColor: 'white',
//               borderRadius: 30,
//               width: 127,
//               backgroundColor: 'transparent',
//             }
//         }
//         containerStyle={{ marginRight: 10 }}
//         onPress={() => this.setState({ selected: !selected })}
//       />
//     );
//   }
// }

export default class SigninTrainee extends Component {
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
      georgia: require('../../../assets/fonts/Georgia.ttf'),
      regular: require('../../../assets/fonts/Montserrat-Regular.ttf'),
      light: require('../../../assets/fonts/Montserrat-Light.ttf'),
      bold: require('../../../assets/fonts/Montserrat-Bold.ttf'),
    });

    this.setState({
      fontLoaded: true,
    });
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
        SportCategories: this.props.navigation.getParam('sportCategories'),
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

  // //choose image from camera roll
  //     _pickImage = async () => {
  //       const {
  //         status: cameraRollPerm
  //       } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  //       // only if user allows permission to camera roll
  //       if (cameraRollPerm === 'granted') {
  //         let pickerResult = await ImagePicker.launchImageLibraryAsync({
  //           allowsEditing: true,
  //           aspect: [4, 3],
  //         });

  //         this._handleImagePicked(pickerResult);
  //       }
  //     };

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

              {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={this.props.navigation.getParam('gender') == 'Male' ? MalePicture : FemalePicture}
                  style={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    borderRadius: 10,
                  }}
                />
                <ActionButton style={styles.editImageButton} 
                renderIcon={ active => active ? (  <Icon1
                      name="md-create"
                      size={15}
                      style={styles.uploadImageIcon}
                    />) : 
                    (  <Icon1
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
                buttonColor= 'white'
            
                >
                    <Icon
                      name="upload"
                      size={15}
                      style={styles.uploadImageIcon}
                    />
                </ActionButton.Item>
                <ActionButton.Item
                buttonColor= 'white'
                >
                    <Icon
                      name="camera"
                      size={15}
                      style={styles.uploadImageIcon}
                    />
                </ActionButton.Item>
                </ActionButton> 
            </View>  */}

              {this.state.step == 1 ?
                <View>

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

                    <Text style={styles.preferencesHeadlines} > Partner Preferences</Text>

                    <View style={styles.partnerPreferencesStyle}>

                      <Text style={style = styles.partnersGenderHeadline}>
                        Gender
                    </Text>

                      <View style={styles.partnerPreferencesContainerStyle} >

                        <View style={styles.userTypesContainer}>

                          <GenderButton
                            image={MALE_AVATAR}
                            onPress={
                              () => {
                                this.setSelectedGenderPartner('Male')
                                this.setState({ partnerGender: 'Male' })
                              }
                            }
                            selected={this.state.partnerGender === 'Male'}
                          />

                          <GenderButton
                            image={FEMALE_AVATAR}
                            onPress={
                              () => {
                                this.setSelectedGenderPartner('Female')
                                this.setState({ partnerGender: 'Female' })
                              }
                            }
                            selected={this.state.partnerGender === 'Female'}
                          />

                          <GenderButton
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
                          textColor='white'
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
                          textColor='white'
                          minValue={this.state.minPartnerAge}
                          maxValue={100}
                          rounded
                        />
                      </View>

                    </View>

                  </View>

                  <View style={{ flex: 1 }}>

                    <ActionButton
                      buttonColor='rgba(216, 121, 112, 1)'
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

                  <Text style={styles.preferencesHeadlines}>Trainer Preferences</Text>

                  <View style={styles.partnerPreferencesStyle}>

                    <Text style={style = styles.partnersGenderHeadline}>
                      Gender
                    </Text>

                    <View style={styles.partnerPreferencesContainerStyle} >

                      <View style={styles.userTypesContainer}>

                        <GenderButton
                          image={MALE_AVATAR}
                          onPress={
                            () => {
                              this.setSelectedGenderTrainer('Male')
                              this.setState({ trainerGender: 'Male' })
                            }
                          }
                          selected={this.state.trainerGender === 'Male'}
                        />

                        <GenderButton
                          image={FEMALE_AVATAR}
                          onPress={
                            () => {
                              this.setSelectedGenderTrainer('Female')
                              this.setState({ trainerGender: 'Female' })
                            }
                          }
                          selected={this.state.trainerGender === 'Female'}
                        />

                        <GenderButton
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
                      style={style = styles.textHeadlines}
                    >
                      Your Budget
                    </Text>

                    <View style={styles.sliderContainerStyle} >

                      <Text style={styles.sliderRangeText}>0</Text >

                      <Slider
                        minimumTrackTintColor='white'
                        maximumTrackTintColor='gray'
                        thumbTintColor='rgba(213, 100, 140, 1)'
                        style={styles.sliderStyle}
                        minimumValue={0}
                        step={10}
                        maximumValue={500}
                        value={this.state.maxBudget}
                        onValueChange={value => this.setState({ maxBudget: value })}
                      />

                      <Text style={style = styles.sliderRangeText}>500</Text>


                    </View>

                    <Text style={{ color: 'rgba(216, 121, 112, 1)', textAlign: 'center', fontSize: 13 }}>Budget: {this.state.maxBudget} $</Text>

                  </View>

                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 60 }}>

                    <View style={{ flex: 1, marginRight: 170 }}>

                      <ActionButton
                        buttonColor='rgba(216, 121, 112, 1)'
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
