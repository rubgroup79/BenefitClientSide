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
import MyDatePicker from '../Components/DatePicker';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import AvatarImage from '../Components/AvatarImage';
import CustomButton from '../Components/CategoriesButton';
// Enable LayoutAnimation on Android

const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');

const TRAINER_AVATAR = require('../../Images/TrainerAvatar.png');
const TRAINEE_AVATAR = require('../../Images/TraineeAvatar.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var MaxDate = "01-01-" + (new Date().getFullYear() - 18);


UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

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
      selectedSportCategories:[],
      userSportCategories:[],
      gender: null,
      isTrainer: null,
      lastNameValid: true,
      firstNameValid: true,
      confirmationPasswordValid: true,
      status:0
    };

    this.setSelectedType = this.setSelectedType.bind(this);
    this.setDate = this.setDate.bind(this);
    this.signup = this.signup.bind(this);
    this.getSportCategories=this.getSportCategories.bind(this);
    this.setCategories=this.setCategories.bind(this);
  }

  UNSAFE_componentWillMount(){
    this.getSportCategories();
  }

  getSportCategories() { 
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetSportCategories', {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
       
        temp=response.map((category)=>{
        return({CategoryCode:category.CategoryCode, Description:category.Description, Selected:false})
        })
        this.setState({ sportCategories: response, selectedSportCategories:temp, status:1 });
      })

      .catch(error => console.warn('Error:', error.message));

  }

  async componentDidMount() {
    await Font.loadAsync({
      light: require('../../assets/fonts/Ubuntu-Light.ttf'),
      bold: require('../../assets/fonts/Ubuntu-Bold.ttf'),
      lightitalic: require('../../assets/fonts/Ubuntu-Light-Italic.ttf'),
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
          this.props.navigation.navigate('SigninTrainee', { email: this.props.navigation.getParam('email', null), password: this.props.navigation.getParam('password', null), firstName: this.state.firstName, lastName: this.state.lastName, gender: this.state.gender, dateOfBirth: this.state.dateOfBirth, userSportCategories: this.state.userSportCategories });
        // USER IS TRAINER
        else {
          this.props.navigation.navigate('SigninTrainer', { email: this.props.navigation.getParam('email', null), password: this.props.navigation.getParam('password', null), firstName: this.state.firstName, lastName: this.state.lastName, gender: this.state.gender, dateOfBirth: this.state.dateOfBirth, userSportCategories: this.state.userSportCategories });

         
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
    this.state.selectedSportCategories.map(function (x) {
      if (x.Description == category) {
        x.Selected = !x.Selected;
      }
     

    });
    this.setState({});
  }

  validateCategories() {
    temp=[];
    this.state.selectedSportCategories.map(function (x) {
      if (x.Selected) {
        temp.push(x.CategoryCode);
      }

    })
    this.setState({userSportCategories:temp});
    console.warn(temp);
    
    if (temp.length != 0) {
      
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
      status
    } = this.state;

    return !fontLoaded && status!=1 ? (
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
              //backgroundColor: '#cccccc',
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

                <AvatarImage
                  label="Trainee"
                  lableFontSize={11}
                  labelColor={'#75cac3'}
                  image={FEMALE_AVATAR}
                  height={70}
                  width={70}
                  selectedHeight={90}
                  selectedWidth={90}
                  image={TRAINEE_AVATAR}
                  onPress={() => {
                    this.setSelectedType('Trainee');
                    this.setState({ isTrainer: 0 });
                  }}
                  selected={selectedType === 'Trainee'}
                />

                <AvatarImage
                  label="Trainer"
                  labelColor="#f34573"
                  lableFontSize={11}
                  height={70}
                  width={70}
                  selectedHeight={90}
                  selectedWidth={90}
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
                    this.firstNameInput.focus();
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
                    this.lastNameInput.focus();
                  }}
                />

                <View style={styles.partnerPreferencesStyle}>

                  <Text style={style = styles.genderHeadline}>
                    Gender
                    </Text>

                  <View style={styles.partnerPreferencesContainerStyle} >

                    <View style={styles.genderContainer}>

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
                            this.setSelectedGender('Male')
                            this.setState({ gender: 'Male' })
                          }}
                        selected={selectedGender === 'Male'}
                      />

                      <AvatarImage
                        label={'Female'}
                        lableFontSize={11}
                        labelColor={'#f34573'}
                        image={FEMALE_AVATAR}
                        height={40}
                        width={40}
                        selectedHeight={50}
                        selectedWidth={50}
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

                          <CustomButton selected={this.state.selectedSportCategories[0].Selected} editMode={true} title={this.state.sportCategories[0].Description} setCategories={this.setCategories} />
                          <CustomButton selected={this.state.selectedSportCategories[1].Selected} editMode={true} title={this.state.sportCategories[1].Description}  setCategories={this.setCategories} />
                          <CustomButton selected={this.state.selectedSportCategories[2].Selected} editMode={true} title={this.state.sportCategories[2].Description} setCategories={this.setCategories} />

                        </View>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                          <CustomButton selected={this.state.selectedSportCategories[3].Selected} editMode={true} title={this.state.sportCategories[3].Description}  setCategories={this.setCategories} />
                          <CustomButton selected={this.state.selectedSportCategories[4].Selected} editMode={true} title={this.state.sportCategories[4].Description}  setCategories={this.setCategories} />
                          <CustomButton selected={this.state.selectedSportCategories[5].Selected} editMode={true} title={this.state.sportCategories[5].Description}  setCategories={this.setCategories} />

                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>

                          <CustomButton selected={this.state.selectedSportCategories[6].Selected} editMode={true} title={this.state.sportCategories[6].Description}  setCategories={this.setCategories} />
                          <CustomButton selected={this.state.selectedSportCategories[7].Selected} editMode={true} title={this.state.sportCategories[7].Description}  setCategories={this.setCategories} />
                          <CustomButton selected={this.state.selectedSportCategories[8].Selected} editMode={true} title={this.state.sportCategories[8].Description}  setCategories={this.setCategories} />

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
                  colors: ['#75cac3', '#75cac3'],
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
    
    //backgroundColor: '#293046',
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
    color: '#f34573',
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
    color: '#7384B4',
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
    color: '#75cac3',
    fontSize: 16,
    marginLeft: -33,
    fontFamily: 'regular',
    flex: 1,
    textAlign: 'center'
  },

  textHeadlines: {
    flex: 1,
    fontSize: 16,
    color: '#75cac3',
    fontFamily: 'regular',
    marginLeft: 40,
    marginTop: 30
  },

  partnersGenderHeadline: {
    flex: 1,
    fontSize: 16,
    color: '#75cac3',
    fontFamily: 'regular',
    marginLeft: 40,
    marginTop: 30
  },

  genderHeadline: {
    flex: 1,
    fontSize: 15,
    color: '#75cac3',
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
