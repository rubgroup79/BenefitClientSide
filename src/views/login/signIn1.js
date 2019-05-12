import React, { Component } from 'react';
import {
  LayoutAnimation,
  Dimensions,
  UIManager,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Font } from 'expo';
import { Input, Button, withTheme } from 'react-native-elements';
import MyDatePicker from '../../Components/datePicker';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import UserTypeItem from '../../Components/userTypeItem';
import GenderButton from '../../Components/genderButton';

// Enable LayoutAnimation on Android

const MALE_AVATAR = require('../../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../../Images/FemaleAvatar.png');

const TRAINER_AVATAR = require('../../../Images/TrainerAvatar.png');
const TRAINEE_AVATAR = require('../../../Images/TraineeAvatar.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var MaxDate = "01-01-" + (new Date().getFullYear() - 18);

var Categories = [
  {
    CategoryCode: 1,
    Description: 'Short Run',
    Selected: false
  },
  {
    CategoryCode: 2,
    Description: 'Yoga',
    Selected: false
  },
  {
    CategoryCode: 3,
    Description: 'Jogging',
    Selected: false
  },
  {
    CategoryCode: 4,
    Description: 'Long Run',
    Selected: false
  },
  {
    CategoryCode: 5,
    Description: 'Walking',
    Selected: false
  },
  {
    CategoryCode: 6,
    Description: 'Functional',
    Selected: false
  },
  {
    CategoryCode: 7,
    Description: 'Pilatis',
    Selected: false
  },
  {
    CategoryCode: 8,
    Description: 'Strength',
    Selected: false
  },
  {
    CategoryCode: 9,
    Description: 'TRX',
    Selected: false
  },
]

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class CustomButton extends Component {
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
        titleStyle={{ fontSize: 15, color: 'white', fontFamily: 'regular' }}
        buttonStyle={
          selected
            ? {
              backgroundColor: 'rgba(213, 100, 140, 1)',
              borderRadius: 100,
              width: 127,
            }
            : {
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 30,
              width: 127,
              backgroundColor: 'transparent',
            }
        }
        containerStyle={{ marginRight: 10 }}
        onPress={() => {
          this.setState({ selected: !selected });
          this.props.setCategories(title);
        }}
      />
    );
  }
}

export default class SignIn1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      selectedType: null,
      selectedGender: null,
      fontLoaded: false,
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: MaxDate,
      sportCategories: [],
      gender: null,
      isTrainer: null,
      lastNameValid: true,
      firstNameValid: true,
      confirmationPasswordValid: true,
    };

    this.setSelectedType = this.setSelectedType.bind(this);
    this.setDate = this.setDate.bind(this);
    this.signup = this.signup.bind(this);
  }

  async componentDidMount() {
    await Font.loadAsync({
      light: require('../../../assets/fonts/Ubuntu-Light.ttf'),
      bold: require('../../../assets/fonts/Ubuntu-Bold.ttf'),
      lightitalic: require('../../../assets/fonts/Ubuntu-Light-Italic.ttf'),
    });

    this.setState({
      fontLoaded: true,
    })
  }

  signup() {
    LayoutAnimation.easeInEaseOut();
    const isTrainerValid = this.validateIsTrainer();
    const firstNameValid = this.validateFirstName();
    const lastNameValid = this.validateLastName();
    const isGenderValid = this.validateGender();
    const isCategoriesValid = this.validateCategories();


    if (

      firstNameValid &&
      lastNameValid &&
      isTrainerValid &&
      isCategoriesValid &&
      isGenderValid

    ) {

      this.setState({ isLoading: true });
      setTimeout(() => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ isLoading: false });
        // IF THE USER IS TRAINEE
        if (this.state.isTrainer == 0)
          this.props.navigation.navigate('SigninTrainee', { email: this.props.navigation.getParam('email', null), password: this.props.navigation.getParam('password', null), firstName: this.state.firstName, lastName: this.state.lastName, gender: this.state.gender, dateOfBirth: this.state.dateOfBirth, sportCategories: this.state.sportCategories });
        // USER IS TRAINER
          else {
            this.props.navigation.navigate('SigninTrainer', { email: this.props.navigation.getParam('email', null), password: this.props.navigation.getParam('password', null), firstName: this.state.firstName, lastName: this.state.lastName, gender: this.state.gender, dateOfBirth: this.state.dateOfBirth, sportCategories: this.state.sportCategories });

          console.warn(this.state);
        }
      }, 1500);
    }
  }

  print() {
    console.warn(this.state.firstName + ' ' + this.state.lastName + ' ' + this.state.email + ' ' + this.state.password);
  }

  setDate(date) {
    this.setState({ dateOfBirth: date });

  }

  validateFirstName() {
    const { firstName } = this.state;
    const firstNameValid = firstName.length > 0;
    LayoutAnimation.easeInEaseOut();
    this.setState({ firstNameValid });
    firstNameValid || this.firstNameInput.shake();
    return firstNameValid;
  }

  validateLastName() {
    const { lastName } = this.state;
    const lastNameValid = lastName.length > 0;
    LayoutAnimation.easeInEaseOut();
    this.setState({ lastNameValid });
    lastNameValid || this.lastNameInput.shake();
    return lastNameValid;
  }

  validateIsTrainer() {
    if (this.state.isTrainer == null) {
      alert('Please choose type (trainer/trainee)');
      return false;
    }
    else return true;

  }
  validateGender() {
    if (this.state.gender == null) {
      alert('Please choose your gender');
      return false;
    }
    else return true;
  }

  setCategories(category) {
    Categories.map(function (x) {
      if (x.Description == category) {
        x.selected = !x.selected;
      }

    });
  }

  validateCategories() {
    temp = [];
    var i = 0;
    Categories.map(function (x) {
      if (x.selected) {
        temp[i] = x.CategoryCode;
        i++;
      }

    })
    if (temp.length != 0) {
      this.setState({ sportCategories: temp });
      return true;
    }
    else {
      alert('Please choose at least one sport category!');
      return false;
    }

  }

  setSelectedType = selectedType =>
    LayoutAnimation.easeInEaseOut() || this.setState({ selectedType });

  setSelectedGender = selectedGender =>
    LayoutAnimation.easeInEaseOut() || this.setState({ selectedGender });

  render() {
    const {
      isLoading,
      selectedType,
      selectedGender,
      fontLoaded,
      firstName,
      lastName,
      firstNameValid,
      lastNameValid,
    } = this.state;

    return !fontLoaded ? (
      <Text> Loading... </Text>

    ) : (
        <ScrollView
          //scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >

          <KeyboardAvoidingView
            behavior="position"
            contentContainerStyle={styles.formContainer}
          >

            <ScrollView style={{
              flex: 1,
              paddingBottom: 20,
              paddingTop: 30,
              backgroundColor: '#293046',
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              textAlign: 'center',
              alignContent: "center"
            }}>

              <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', textAlign: 'center' }}>

                <Text style={styles.signUpText}>Sign up</Text>

                <Text style={styles.whoAreYouText}>WHO ARE YOU?</Text>

              </View>

              <View style={styles.userTypesContainer}>

                <UserTypeItem
                  label="Trainee"
                  labelColor="#ECC841"
                  image={TRAINEE_AVATAR}
                  onPress={() => {  
                    this.setSelectedType('Trainee');
                    this.setState({ isTrainer: 0 });
                  }}
                  selected={selectedType === 'Trainee'}
                />

                <UserTypeItem
                  label="Trainer"
                  labelColor="#2CA75E"
                  image={TRAINER_AVATAR}
                  onPress={() => {
                    this.setSelectedType('Trainer');
                    this.setState({ isTrainer: 1 });
                  }}
                  selected={selectedType === 'Trainer'}
                />

              </View>

              <View style={styles.viewContainer}>

                <FormInput style={{ flex: 1 }}
                  refInput={input => (this.firstNameInput = input)}
                  icon="user"
                  value={firstName}
                  onChangeText={firstName => this.setState({ firstName })}
                  placeholder="First Name"
                  returnKeyType="next"
                  errorMessage={
                    firstNameValid ? null : "Your First Name can't be blank"
                  }
                  onSubmitEditing={() => {
                    this.validateFirstName();
                    this.lastNameInput.focus();
                  }}
                />

                <FormInput style={{ flex: 1 }}
                  refInput={input => (this.lastNameInput = input)}
                  icon="user"
                  value={lastName}
                  onChangeText={lastName => this.setState({ lastName })}
                  placeholder="Last Name"
                  returnKeyType="next"
                  errorMessage={
                    lastNameValid ? null : "Your Last Name can't be blank"
                  }
                  onSubmitEditing={() => {
                    this.validateLastName();
                    this.emailInput.focus();
                  }}
                />

                <View style={styles.partnerPreferencesStyle}>

                  <Text style={style = styles.genderHeadline}>
                    Gender
                    </Text>

                  <View style={styles.partnerPreferencesContainerStyle} >

                    <View style={styles.genderContainer}>

                      <GenderButton
                        image={MALE_AVATAR}
                        onPress={
                          () => {
                            this.setSelectedGender('Male')
                            this.setState({ gender: 'Male' })
                          }}
                        selected={selectedGender === 'Male'}
                      />

                      <GenderButton
                        image={FEMALE_AVATAR}
                        onPress={
                          () => {
                            this.setSelectedGender('Female')
                            this.setState({ gender: 'Female' })
                          }}
                        selected={selectedGender === 'Female'}
                      />

                    </View>

                  </View>

                </View>



                <View style={{ flex: 1, flexDirection: 'row', }}>

                  <Text style={styles.dateOfBirthLabel}>
                    Date of Birth
                  </Text>

                  <MyDatePicker
                    style={{ flex: 1 }}
                    setDate={this.setDate}
                  ></MyDatePicker>

                </View>


                <View style={{ flex: 1 }}>

                  <Text
                    style={styles.textHeadlines}
                  >
                    Favorite Sport Types
                </Text>

                  <View style={{ flex: 1, width: SCREEN_WIDTH, marginTop: 20, }}>

                    <ScrollView
                      style={{ flex: 1 }}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >

                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'column',
                          height: 170,
                          marginLeft: 40,
                          marginRight: 10,
                        }}
                      >

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                          <CustomButton title="Short Run" setCategories={this.setCategories} />
                          <CustomButton title="Yoga" setCategories={this.setCategories} />
                          <CustomButton title="Jogging" setCategories={this.setCategories} />

                        </View>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                          <CustomButton title="Long Run" setCategories={this.setCategories} />
                          <CustomButton title="Walking" setCategories={this.setCategories} />
                          <CustomButton title="Functional" setCategories={this.setCategories} />

                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>

                          <CustomButton title="Pilatis" setCategories={this.setCategories} />
                          <CustomButton title="Strength" setCategories={this.setCategories} />
                          <CustomButton title="TRX" setCategories={this.setCategories} />

                        </View>

                      </View>

                    </ScrollView>

                  </View>

                </View>

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
                  colors: ['rgba(216, 121, 112, 1)', 'rgba(216, 121, 112, 1)'],
                  start: [1, 0],
                  end: [0.2, 0],
                }}
                title="NEXT"
                titleStyle={{
                  fontFamily: 'regular',
                  fontSize: 20,
                  color: 'white',
                  textAlign: 'center',
                }}
                onPress={() => this.signup()}
                activeOpacity={0.5}
              />

            </ScrollView>

          </KeyboardAvoidingView>

        </ScrollView>

      );
  }
}

export const FormInput = props => {
  const { icon, refInput, ...otherProps } = props;
  return (
    <Input
      {...otherProps}
      ref={refInput}
      inputContainerStyle={styles.inputContainer}
      leftIcon={<Icon name={icon} color="#7384B4" size={18} />}
      inputStyle={styles.inputStyle}
      autoFocus={false}
      autoCapitalize="none"
      keyboardAppearance="dark"
      errorStyle={styles.errorInputStyle}
      autoCorrect={false}
      blurOnSubmit={false}
      placeholderTextColor="#7384B4"
    />
  );
};



const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 30,
    backgroundColor: '#293046',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  formContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  signUpText: {
    flex: 1,
    color: 'white',
    fontSize: 28,
    fontFamily: 'light',
    marginTop: 15,
    textAlign: 'center',
  },

  whoAreYouText: {
    flex: 1,
    color: '#7384B4',
    fontFamily: 'bold',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
  },

  userTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    marginTop: 30,
  },

  inputContainer: {
    paddingLeft: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(110, 120, 170, 1)',
    height: 45,
    marginVertical: 10,
  },

  inputStyle: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    fontFamily: 'light',
    fontSize: 16,
  },

  errorInputStyle: {
    marginTop: 0,
    textAlign: 'center',
    color: '#F44336',
  },
  
  signUpButtonText: {
    fontFamily: 'bold',
    fontSize: 13,
  },

  signUpButton: {
    width: 250,
    borderRadius: 50,
    height: 45,
  },

  loginHereContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  alreadyAccountText: {
    fontFamily: 'lightitalic',
    fontSize: 12,
    color: 'white',
  },

  loginHereText: {
    color: '#FF9800',
    fontFamily: 'lightitalic',
    fontSize: 12,
  },

  viewContainer:
  {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    margin: 35,
  },

  dateOfBirthLabel: {
    marginTop: 9,
    color: 'rgba(216, 121, 112, 1)',
    fontSize: 16,
    marginLeft: -33,
    fontFamily: 'light',
    flex: 1,
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
  
  genderHeadline: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(216, 121, 112, 1)',
    fontFamily: 'regular',
    marginTop: 30
  },

  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    marginTop: -18,
  },

  partnerPreferencesStyle: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10
  },
  
  partnerPreferencesContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 10,
    flexDirection: 'row',
    marginRight: 40
  },

});
