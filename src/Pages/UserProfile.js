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
import CustomButton from '../Components/CategoriesButton';
const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');
const BOTH_AVATAR = require('../../Images/BothAvatar.png');
const STAR = require('../../Images/SelectedStar.png');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_SIZE = SCREEN_WIDTH - 150;


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
      sportCategories: [],
      userSportCategories: [],
      selectedSportCategories: [],
      averageRates: [],
      status: 0

    };

    this.getProfileDetails = this.getProfileDetails.bind(this);
    this.getSportCategories = this.getSportCategories.bind(this);
    this.setSelectedSportCategories = this.setSelectedSportCategories.bind(this);
    this.getAvarageParametersRate = this.getAvarageParametersRate.bind(this);
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
    this.getAvarageParametersRate();


  }

  getProfileDetails() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/ShowProfile?UserCode=' + this.props.navigation.getParam('UserCode', null), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ userCode: response.UserCode, firstName: response.FirstName, lastName: response.LastName, gender: response.Gender, picture: response.Picture, age: response.Age, userSportCategories: response.SportCategories, rate: response.Rate}, this.getSportCategories)
        
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
        this.setState({ sportCategories: response }, this.setSelectedSportCategories);
      })
      .catch(error => console.warn('Error:', error.message));

  }

  getAvarageParametersRate() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetAvarageParametersRate?UserCode=' + this.props.navigation.getParam('UserCode', null), {

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
      if (counter == 1) return { CategoryCode: category.CategoryCode, Description: category.Description, Selected: true };
      else return { CategoryCode: category.CategoryCode, Description: category.Description, Selected: false };
    });
    this.setState({ selectedSportCategories: temp, status:1 });

  }

  render() {
    const { goBack } = this.props.navigation;
    index = 1;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        {this.state.fontLoaded && this.state.status == 1 && this.state.selectedSportCategories.length!=0? (
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
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: 160,
                    marginTop: 10

                  }}
                >

                  <View style={{ flex: 1, flexDirection: 'row' }}>

                    <CustomButton title={this.state.sportCategories[0].Description} selected={this.state.selectedSportCategories[0].Selected} />
                    <CustomButton title={this.state.sportCategories[1].Description} selected={this.state.selectedSportCategories[1].Selected} />
                    <CustomButton title={this.state.sportCategories[2].Description} selected={this.state.selectedSportCategories[2].Selected} />

                  </View>

                  <View style={{ flex: 1, flexDirection: 'row', marginTop: -40 }}>

                    <CustomButton title={this.state.sportCategories[3].Description} selected={this.state.selectedSportCategories[3].Selected} />
                    <CustomButton title={this.state.sportCategories[4].Description} selected={this.state.selectedSportCategories[4].Selected} />
                    <CustomButton title={this.state.sportCategories[5].Description} selected={this.state.selectedSportCategories[5].Selected} />

                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', marginTop: -40 }}>

                    <CustomButton title={this.state.sportCategories[6].Description} selected={this.state.selectedSportCategories[6].Selected} />
                    <CustomButton title={this.state.sportCategories[7].Description} selected={this.state.selectedSportCategories[7].Selected} />
                    <CustomButton title={this.state.sportCategories[8].Description} selected={this.state.selectedSportCategories[8].Selected} />

                  </View>

                </View>
              </View>

              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -40 }}>
                <Image source={STAR}></Image>
                <Text style={{ fontFamily: 'bold', fontSize: 20, color: "#7384B4" }}>{this.state.rate}</Text>
              </View>
              <View style={{ flex: 1, marginTop: 10 }}>
                {this.state.averageRates.map((parameter, index) => {
                  return (<View key={index} style={{ flex: 1, flexDirection: 'row', marginLeft: 20, justifyContent: 'center', marginBottom: 10 }}>
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
