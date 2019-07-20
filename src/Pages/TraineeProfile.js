import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  LayoutAnimation,
  Dimensions,
  AsyncStorage,
  Image,
  ActivityIndicator
} from 'react-native';
import { Slider, Divider, Button } from 'react-native-elements';
import { Font } from 'expo';
import AvatarImage from '../Components/AvatarImage';
import NumericInput from 'react-native-numeric-input';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon1 from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/Feather";
import ActionButton from 'react-native-action-button';
import ImageUpload from '../Components/ImagePicker';
import CustomButton from '../Components/CategoriesButton';

const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');
const BOTH_AVATAR = require('../../Images/BothAvatar.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_SIZE = SCREEN_WIDTH - 150;


export default class TraineeProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      userCode: 0,
      IsTrainer: 0,
      firstName: '',
      lastName: '',
      email: '',
      age: 0,
      picture: '',
      rate: 0,
      searchRadius: 0,
      maxBudget: 0,
      partnerGender: '',
      trainerGender: '',
      minPartnerAge: 0,
      maxPartnerAge: 0,
      selectedSportCategories: [],
      sportCategories: [],
      userSportCategories: [],
      editMode: false

    };

    this.setSelectedGenderPartner = this.setSelectedGenderPartner.bind(this);
    this.setSelectedGenderTrainer = this.setSelectedGenderTrainer.bind(this);
    this.setPicturePath = this.setPicturePath.bind(this);
    this.getLocalStorage = this.getLocalStorage.bind(this);
    this.getTraineeDetails = this.getTraineeDetails.bind(this);
    this.setSelectedSportCategories = this.setSelectedSportCategories.bind(this);
    this.getSportCategories = this.getSportCategories.bind(this);
    this.setCategories = this.setCategories.bind(this);
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
    setTimeout(() => {
      this.getLocalStorage();
    }, 1000);


  }


  getLocalStorage = async () => {
    await AsyncStorage.getItem('UserCode', (err, result) => {
      if (result != null) {
        this.setState({ userCode: result }, this.getSportCategories);
      }
      else alert('error local storage user code');
    }
    )

    await AsyncStorage.getItem('IsTrainer', (err, result) => {
      if (result != null) {
        this.setState({ isTrainer: result });
      }
      else alert('error local storage is trainer');
    }
    )
  }

  getTraineeDetails() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetTraineeProfileDetails?UserCode=' + this.state.userCode, {
      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({
          firstName: response.FirstName,
          lastName: response.LastName,
          email: response.Email,
          age: response.Age,
          picture: response.Picture,
          rate: response.Rate,
          searchRadius: response.SearchRadius,
          maxBudget: response.MaxBudget,
          partnerGender: response.PartnerGender,
          trainerGender: response.TrainerGender,
          minPartnerAge: response.MinPartnerAge,
          maxPartnerAge: response.MaxPartnerAge,
          userSportCategories: response.SportCategories
        }, this.setSelectedSportCategories)
      })
      .catch(error => console.warn('Error:', error.message));

  }


  getSportCategories() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetSportCategories', {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ sportCategories: response }, this.getTraineeDetails);
      })
      .catch(error => console.warn('Error:', error.message));

  }

  setSelectedSportCategories() {
    temp = this.state.sportCategories.map((category) => {
      counter = 0;
      this.state.userSportCategories.map((userCategory) => {
        if (category.Description == userCategory.Description)
          counter++;
      })
      if (counter == 1) return { CategoryCode: category.CategoryCode, Description: category.Description, Selected: true };
      else return { CategoryCode: category.CategoryCode, Description: category.Description, Selected: false };
    });

    this.setState({ selectedSportCategories: temp });

  }

  setCategories(category) {
    this.state.selectedSportCategories.map(function (x) {
      if (x.Description == category) {
        x.Selected = !x.Selected;
      }

    });
    this.setState({});

  }

  updateDetails() {

    temp = this.state.selectedSportCategories.map((category) => {
      if (category.Selected)
        return category;
    });

    var filtered = temp.filter(function (el) {
      return el != null;
    });




    Trainee = {
      TraineeCode: this.state.userCode,
      Picture: this.state.picture,
      SearchRadius: this.state.searchRadius,
      MaxBudget: this.state.maxBudget,
      PartnerGender: this.state.partnerGender,
      TrainerGender: this.state.trainerGender,
      MinPartnerAge: this.state.minPartnerAge,
      MaxPartnerAge: this.state.maxPartnerAge,
      SportCategories: filtered
    }
    console.warn(JSON.stringify(Trainee))

    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/UpdateTraineeDetails', {
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(Trainee),

    })
      .then(() => { this.setState({ editMode: !this.state.editMode }) })
      .catch(error => console.warn('Error:', error.message));
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




  async logout() {

    try {
      await AsyncStorage.removeItem('UserCode');
      await AsyncStorage.removeItem('IsTrainer');
      await AsyncStorage.removeItem('Details');

      this.props.navigation.navigate('Login');

      return true;
    }
    catch (exception) {
      return false;
    }


  }

  render() {
    return (
      <View style={styles.flex}>
        {this.state.fontLoaded && this.state.selectedSportCategories.length != 0 ? (
          <View style={styles.formContainer}>
            <View style={styles.headerContainer} >
              <Image style={styles.logoImage} source={require('../../Images/LogoOnly.png')} />
              <Text style={styles.heading}>{this.state.firstName + ' ' + this.state.lastName}</Text>
            </View>

            <ScrollView
              style={styles.scrollViewStyle}>

              <View style={styles.actionButtonsContainer}>
                <ActionButton

                  renderIcon={active => active ? (<Icon2
                    name="settings"
                    size={25}
                  />) :
                    (<Icon2
                      name="settings"
                      size={25}
                    />)
                  }
                  verticalOrientation="down"
                  buttonColor='#d7dbe2'
                  size={40}
                >
                  <ActionButton.Item
                    buttonColor='#d7dbe2'
                    onPress={() => {
                      this.logout();
                    }}
                  >
                    <Icon
                      name="logout"
                      color='white'
                      size={20}
                    />
                  </ActionButton.Item>
                  <ActionButton.Item
                    buttonColor={this.state.editMode ? 'rgba(71, 224, 135,0.7)' : '#d7dbe2'}
                    size={35}
                    buttonStyle={styles.editButton}
                    onPress={() => {
                      if (this.state.editMode)
                        this.getTraineeDetails();
                      this.setState({ editMode: !this.state.editMode, })
                    }}>
                    <Icon1
                      name='pencil'
                      color='white'
                      size={20}
                    />

                  </ActionButton.Item>

                </ActionButton>
              </View>

              <View style={styles.userTopDetailsContainer}>
                <View style={styles.uploadImageContainer}>
                  {this.state.editMode ? <View>
                    <ImageUpload setPicturePath={this.setPicturePath} editMode={this.state.editMode} ></ImageUpload>
                  </View> :
                    <Image style={styles.traineeImage} source={{ uri: this.state.picture }}></Image>}
                </View>
                <View style={styles.detailsContainer}>
                  <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>{this.state.email}</Text>
                  </View>
                  <View style={styles.textContainerStyle}>
                    <Text style={styles.textStyle}>Age: {this.state.age}</Text>
                  </View>
                  <View style={styles.textContainerStyle}>
                    <Image style={styles.rateStarImage} source={require('../../Images/SelectedStar.png')}></Image>
                    <Text style={styles.rateText}>{this.state.rate}</Text>
                  </View>

                </View>
              </View>


              <View style={styles.radiusContainer}>

                <Text
                  style={style = styles.textHeadlines}
                >

                  Search Radius
                </Text>

                <View style={styles.sliderContainerStyle} >

                  <Text style={styles.sliderRangeText}>0</Text >

                  <Slider
                    disabled={!this.state.editMode}
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
              <Text style={style = styles.textHeadlines}>

                Favorite Sport Types
                </Text>
              <ScrollView
                style={styles.flex}
                horizontal
                showsHorizontalScrollIndicator={false}
              >

                <View
                  style={styles.categoriesContainer}
                >

                  <View style={styles.buttonsRowContainer}>
                    <CustomButton selected={this.state.selectedSportCategories[0].Selected} editMode={this.state.editMode} title={this.state.sportCategories[0].Description} selected={this.state.selectedSportCategories[0].Selected} setCategories={this.setCategories} />
                    <CustomButton selected={this.state.selectedSportCategories[1].Selected} editMode={this.state.editMode} title={this.state.sportCategories[1].Description} selected={this.state.selectedSportCategories[1].Selected} setCategories={this.setCategories} />
                    <CustomButton selected={this.state.selectedSportCategories[2].Selected} editMode={this.state.editMode} title={this.state.sportCategories[2].Description} selected={this.state.selectedSportCategories[2].Selected} setCategories={this.setCategories} />

                  </View>

                  <View style={styles.buttonsRowContainer}>

                    <CustomButton selected={this.state.selectedSportCategories[3].Selected} editMode={this.state.editMode} title={this.state.sportCategories[3].Description} selected={this.state.selectedSportCategories[3].Selected} setCategories={this.setCategories} />
                    <CustomButton selected={this.state.selectedSportCategories[4].Selected} editMode={this.state.editMode} title={this.state.sportCategories[4].Description} selected={this.state.selectedSportCategories[4].Selected} setCategories={this.setCategories} />
                    <CustomButton selected={this.state.selectedSportCategories[5].Selected} editMode={this.state.editMode} title={this.state.sportCategories[5].Description} selected={this.state.selectedSportCategories[5].Selected} setCategories={this.setCategories} />

                  </View>
                  <View style={styles.buttonsRowContainer}>

                    <CustomButton selected={this.state.selectedSportCategories[6].Selected} editMode={this.state.editMode} title={this.state.sportCategories[6].Description} selected={this.state.selectedSportCategories[6].Selected} setCategories={this.setCategories} />
                    <CustomButton selected={this.state.selectedSportCategories[7].Selected} editMode={this.state.editMode} title={this.state.sportCategories[7].Description} selected={this.state.selectedSportCategories[7].Selected} setCategories={this.setCategories} />
                    <CustomButton selected={this.state.selectedSportCategories[8].Selected} editMode={this.state.editMode} title={this.state.sportCategories[8].Description} selected={this.state.selectedSportCategories[8].Selected} setCategories={this.setCategories} />

                  </View>

                </View>

              </ScrollView>
              <Divider style={styles.divider}></Divider>


              <View>

                <View style={styles.preferencesContainer}>

                  <Text style={styles.preferencesHeadlines} > PARTNER PREFERENCES</Text>

                  <View style={styles.partnerPreferencesStyle}>

                    <Text style={style = styles.partnersGenderHeadline}>
                      Gender
                    </Text>

                    <View style={styles.partnerPreferencesContainerStyle} >

                      <View style={styles.userTypesContainer}>

                        <AvatarImage
                          disabled={!this.state.editMode}
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
                          disabled={!this.state.editMode}
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
                          disabled={!this.state.editMode}
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

                  <View style={styles.partnerAgeView}>

                    <Text style={style = styles.partnersAgeHeadline}>
                      Age
                      </Text>

                    {this.state.editMode ?
                      <View style={styles.partnerAgeContainer}>

                        <NumericInput
                          editable={false}
                          style={styles.flex}
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

                        <Text style={styles.partnerAgeEditText}>to</Text>

                        <NumericInput
                          editable={false}
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
                      </View> :
                      <View style={styles.partnerAgeContainer}>
                        <Text style={styles.partnerAgeText}>{this.state.minPartnerAge + " to " + this.state.maxPartnerAge}</Text>
                      </View>
                    }

                  </View>

                </View>



              </View>


              <View style={styles.preferencesContainer}>

                <Text style={styles.preferencesHeadlines}>TRAINER PREFERENCES</Text>

                <View style={styles.partnerPreferencesStyle}>

                  <Text style={style = styles.partnersGenderHeadline}>
                    Gender
                    </Text>

                  <View style={styles.partnerPreferencesContainerStyle} >

                    <View style={styles.userTypesContainer}>

                      <AvatarImage
                        disabled={!this.state.editMode}
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
                        disabled={!this.state.editMode}
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
                        disabled={!this.state.editMode}
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

                <View style={styles.budgetContainer}>

                  <Text style={styles.textHeadlines} >
                    Your Budget
                    </Text>
                  <View style={styles.sliderContainerStyle} >
                    <Text style={styles.sliderRangeText}>0</Text >
                    <Slider
                      disabled={!this.state.editMode}
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



              </View>

              {this.state.editMode ? <Button
                containerStyle={styles.updateButtonContainer}
                style={styles.updateButton}
                buttonStyle={styles.updateButtonStyle}
                linearGradientProps={{
                  colors: ['#75cac3', '#75cac3'],
                  start: [1, 0],
                  end: [0.2, 0],
                }}
                title="UPDATE"
                titleStyle={styles.updateTitle}
                onPress={() => {
                  this.updateDetails();
                }}

                activeOpacity={0.5}
              />
                : null}

            </ScrollView>

          </View>
        ) : (

            <ActivityIndicator style={styles.activityIndicator} size="large" color="gray" />

          )}

      </View>
    );
  }
}



const styles = StyleSheet.create({

  flex:
  {
    flex: 1
  },
  formContainer:
  {
    flex: 1,
    justifyContent: 'center'
  },
  textStyle:
  {
    fontFamily: 'light',
    color: '#7384B4',
  },
  textContainerStyle:
  {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5
  },
  detailsContainer:
  {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    alignItems: 'center'
  },
  rateText:
  {
    fontFamily: 'light',
    marginLeft: 10,
    marginTop: 2,
    color: '#7384B4',
  },
  rateStarImage:
    { width: 20, height: 20 },
  traineeImage:
  {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  logoImage:
  {
    width: 57,
    height: 38,
    marginLeft: 18
  },
  scrollViewStyle:
  {
    flex: 2,
    marginTop: 15,
  },
  userTopDetailsContainer:
  {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadImageContainer:
  {
    flex: 1,
    alignItems: 'center',
  },
  actionButtonsContainer:
  {
    flex: 1,
    zIndex: 2,
    position: 'absolute',
    left: 0,
    top: -10,
    height: 100,
    width: 100,
    justifyContent: 'center'
  },
  radiusText:
  {
    color: '#f34573',
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'light'
  },
  categoriesContainer:
  {
    flex: 1,
    flexDirection: 'column',
    height: 170,
    marginLeft: 40,
    marginRight: 10,
    marginTop: 30
  },
  radiusContainer:
  {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 20,
  },
  budgetText:
  {
    color: '#f34573',
    textAlign: 'center',
    fontSize: 13
  },
  budgetContainer:
  {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 15
  },

  sliderStyle: {
    width: SLIDER_SIZE,
    marginTop: 35,
  },

  preferencesContainer:
  {
    flex: 1,
    flexDirection: 'column'
  },
  buttonsRowContainer:
  {
    flex: 1,
    flexDirection: 'row'
  },
  partnerAgeText:
  {
    flex: 1,
    color: 'white',
    marginTop: 10,
    fontWeight: 'bold',
    fontFamily: 'regular',
    color: '#f34573'
  },
  partnerAgeContainer:
  {
    flex: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 25
  },
  partnerAgeEditText:
  {
    flex: 1,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold'
  },
  partnerAgeView:
  {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: "center",
    marginTop: 20,
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#f5f5f5',
    height: 80,
    marginTop: 20
  },

  heading: {
    color: 'black',
    fontSize: 23,
    flex: 1,
    justifyContent: "center",
    marginLeft: 15,
    fontFamily: 'light',
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


  preferencesHeadlines: {
    color: '#7384B4',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: "bold",
    marginTop: 30,
    marginBottom: 10
  },
  editButton:
    { flex: 1, zIndex: 2 }
  ,
  updateButtonContainer:
    { marginVertical: 20 },
  updateButton:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },

  updateButtonStyle:
  {
    height: 55,
    width: SCREEN_WIDTH - 250,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  updateTitle:
  {
    fontFamily: 'regular',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },

  divider:
    { flex: 1, marginTop: 10 },


  activityIndicator:
    { justifyContent: 'center', top: 350 },



});
