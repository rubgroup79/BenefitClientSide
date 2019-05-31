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
import { Slider, Divider, Button } from 'react-native-elements';
import { Font } from 'expo';
import AvatarImage from '../Components/AvatarImage'
import NumericInput from 'react-native-numeric-input';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon from "react-native-vector-icons/Entypo";
import ActionButton from 'react-native-action-button';
import ImageUpload from '../Components/ImagePicker';
const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');
const BOTH_AVATAR = require('../../Images/BothAvatar.png');
const STAR = require('../../Images/SelectedStar.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_SIZE = SCREEN_WIDTH - 150;



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
        disabledStyle={{
          backgroundColor: 'transparent',
          color: 'gray'
        }}
        titleStyle={
          this.props.selected
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
          this.props.selected
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

      />
    );
  }
}


export default class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      userCode: 0,
      firstName: '',
      lastName: '',
      gender: '',
      picture: '',
      rate: 0,
      sportCategories:[],
      userSportCategories:[],
      selectedCategories:[],
      averageRates:[]


      // sportCategories: [
      //   {
      //     CategoryCode: 1,
      //     Description: 'Short Run',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 2,
      //     Description: 'Yoga',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 3,
      //     Description: 'Jogging',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 4,
      //     Description: 'Long Run',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 5,
      //     Description: 'Walking',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 6,
      //     Description: 'Functional',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 7,
      //     Description: 'Pilatis',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 8,
      //     Description: 'Strength',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 9,
      //     Description: 'TRX',
      //     Selected: false
      //   },
      // ],
      // userSportCategories: [
      //   {
      //     CategoryCode: 1,
      //     Description: 'Short Run',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 2,
      //     Description: 'Yoga',
      //     Selected: false
      //   },

      //   {
      //     CategoryCode: 6,
      //     Description: 'Functional',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 7,
      //     Description: 'Pilatis',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 8,
      //     Description: 'Strength',
      //     Selected: false
      //   },
      //   {
      //     CategoryCode: 9,
      //     Description: 'TRX',
      //     Selected: false
      //   },
      // ],
      // selectedCategories: [],
      // Age: 0,
      // AverageRates: [
      //   {
      //     Parameter: {
      //       ParameterCode: 1,
      //       Description: 'p1'
      //     },
      //     AverageRate: 2
      //   },
      //   {
      //     Parameter: {
      //       ParameterCode: 2,
      //       Description: 'p2'
      //     },
      //     AverageRate: 4.6
      //   },
      //   {
      //     Parameter: {
      //       ParameterCode: 3,
      //       Description: 'p3'
      //     },
      //     AverageRate: 4
      //   },
      //   {
      //     Parameter: {
      //       ParameterCode: 4,
      //       Description: 'p4'
      //     },
      //     AverageRate: 3.6
      //   },
      //   {
      //     Parameter: {
      //       ParameterCode: 5,
      //       Description: 'p5'
      //     },
      //     AverageRate: 4.6
      //   },

      // ]

    };

    this.getProfileDetails = this.getProfileDetails.bind(this);
    this.setSportCategories = this.setSportCategories.bind(this);
    this.setSelectedSportCategories = this.setSelectedSportCategories.bind(this);
    this.getAvarageParametersRate= this.getAvarageParametersRate.bind(this);
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

    this.getProfileDetails();
    this.setSportCategories();
    this.getAvarageParametersRate();


  }

  getProfileDetails() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/ShowProfile?UserCode='+this.props.navigation.getParam('UserCode',null), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ userCode: response.UserCode, firstName: response.FirstName, lastName: response.LastName, gender: response.Gender, picture: response.Picture, age: response.Age, userSportCategories: response.SportCategories, rate: response.Rate })

      })
      .catch(error => console.warn('Error:', error.message));
  }

  setSportCategories() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetSportCategories', {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ sportCategories: response }, this.setSelectedSportCategories);
      })
      .catch(error => console.warn('Error:', error.message));
    this.setSelectedSportCategories();

  }

  getAvarageParametersRate() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetAvarageParametersRate?UserCode='+this.props.navigation.getParam('UserCode',null), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ averageRates: response });
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
      if (counter == 1) return true;
      else return false;
    });

    console.warn(temp);
    this.setState({ selectedCategories: temp });
  }

  render() {
    const {goBack} = this.props.navigation;
    index = 1;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        {this.state.fontLoaded ? (
          <View style={{ flex: 1, }}>
            <Icon1 name='left' style={styles.closeIcon} size={20} color='gray' onPress={() => { goBack() }}></Icon1>
            <View style={styles.statusBar} />

            <View style={styles.navBar}>

              <Text style={styles.nameHeader}>{this.state.firstName + ' ' + this.state.lastName + "'s Profile"}</Text>

            </View>

            <ScrollView
              scrollEnabled={false}
              style={{ flex: 1, flexDirection: 'column' }}>

              <View style={{ flex: 1, alignItems: 'center', marginTop: 10, flexDirection: 'column', }}>

                <Image style={{ width: 120, height: 120, borderRadius: 60, }} source={{ uri: this.state.picture }} ></Image>
                <Text style={{ flex: 1, fontFamily: 'regular', color: '#7384B4', fontSize: 18, margin: 5 }}>{this.state.gender}</Text>
                <Text style={{ flex: 1, fontFamily: 'regular', color: '#7384B4', fontSize: 15, }}>{this.state.age}</Text>
              </View>

              <View style={{ flex: 1, marginTop: 10, flexDirection: 'column', margin: 20, justifyContent: 'center' }}>
                <Text style={{ flex: 1, fontFamily: 'regular', color: '#f34573', fontSize: 15, }}>{this.state.firstName + "'s Favorite sports"} </Text>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    height: 160,
                    marginTop: 10

                  }}
                >

                  <View style={{ flex: 1, flexDirection: 'row' }}>

                    <CustomButton title='Yoga' selected={this.state.selectedCategories[0]} setCategories={this.setCategories} />
                    <CustomButton title="Yoga" selected={this.state.selectedCategories[1]} />
                    <CustomButton title="Jogging" selected={this.state.selectedCategories[2]} />

                  </View>

                  <View style={{ flex: 1, flexDirection: 'row', marginTop: -40 }}>

                    <CustomButton title="Long Run" selected={this.state.selectedCategories[3]} />
                    <CustomButton title="Walking" selected={this.state.selectedCategories[4]} />
                    <CustomButton title="Functional" selected={this.state.selectedCategories[5]} />

                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', marginTop: -40 }}>

                    <CustomButton title="Pilatis" selected={this.state.selectedCategories[6]} />
                    <CustomButton title="Strength" selected={this.state.selectedCategories[7]} />
                    <CustomButton title="TRX" selected={this.state.selectedCategories[8]} />

                  </View>

                </View>
              </View>

              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -40 }}>
                <Image source={STAR}></Image>
                <Text style={{ fontFamily: 'bold', fontSize: 20, color: "#7384B4" }}>{this.state.rate}</Text>
              </View>
              <View style={{ flex: 1 }}>
                {this.state.averageRates.map((parameter) => {
                  return (<View style={{ flex: 1, flexDirection: 'row', marginLeft: 20, justifyContent: 'center', marginBottom: 5 }}>
                    <Image source={STAR} style={{ width: 20, height: 20 }}></Image>
                    <Text style={{ flex: 1, fontFamily: 'light', color: '#7384B4', fontSize: 18, alignContent: 'center', justifyContent: 'center', marginLeft: 10 }}>{parameter.Parameter.Description + " :" + parameter.AverageRate}</Text>
                  </View>)
                })}

              </View>




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
  },
  closeIcon: {
    top: 20,
    left: 20
},


});
