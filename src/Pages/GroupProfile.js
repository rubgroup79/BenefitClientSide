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
import { Slider, Divider, Button, ListItem } from 'react-native-elements';
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



export default class GroupProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      userCode: 0,
      trainingTime: "",
      longitude: "",
      latitude: "",
      withTrainer: 0,
      creatorCode: 0,
      minParticipants: 0,
      maxParticipants: 0,
      currentParticipants: 0,
      sportCategory: "",
      price: 0,
      groupParticipants: [],
      address: "",
      status: 0,
      creatorPicture: "",
      creatorRate: 0,
      creatorName: "",
      creatorAge: 0


    };

    this.getGroupDetails = this.getGroupDetails.bind(this);
    this.getGroupParticipants = this.getGroupParticipants.bind(this);
    this.getAddress = this.getAddress.bind(this);
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

    this.getGroupDetails();


  }

  setTime(trainingTime) {
    hour = (trainingTime.split(" ")[1]).split(":")[0];
    minutes = (trainingTime.split(" ")[1]).split(":")[1];
    ampm = trainingTime.split(" ")[2];
    
    if (ampm == "PM")
    {
        if(hour=="12")
            return (hour) + ":" + minutes;
        temp= JSON.parse(hour);
        temp+=12;
        return (temp) + ":" + minutes;
    }
       
    else return hour + ":" + minutes;
}

  getGroupDetails() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetGroupDetails?GroupCode=' + this.props.navigation.getParam('GroupCode', null), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ trainingTime: response.TrainingTime, latitude: response.Latitude, longitude: response.Longitude, withTrainer: response.WithTrainer, creatorCode: response.CreatorCode, minParticipants: response.MinParticipants, maxParticipants: response.MaxParticipants, currentParticipants: response.CurrentParticipants, sportCategory: response.SportCategory, price: response.Price }, this.getGroupParticipants)

      })
      .catch(error => console.warn('Error:', error.message));
  }

  getGroupParticipants() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetGroupParticipants?GroupCode=' + this.props.navigation.getParam('GroupCode', null), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ groupParticipants: response }, this.getAddress)
        response.map((participant) => {
          if (participant.UserCode == this.state.creatorCode){
            this.setState({ creatorPicture: participant.Picture, creatorAge: participant.Age, creatorName: participant.FirstName + ' ' + participant.LastName, creatorRate: participant.Rate })

          }
        })

      })
      .catch(error => console.warn('Error:', error.message));

  }

  getAddress() {
    var address = '';

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.latitude + ',' + this.state.longitude + '&key=' + 'AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q')
      .then((response) => response.json())
      .then((responseJson) => {
        address = JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'route').length > 0)[0].short_name) + ' ' +
          JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'street_number').length > 0)[0].short_name) + ', ' +
          JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'locality').length > 0)[0].short_name);
        address = address.replace(/"/g, '');
        this.setState({ address: address, status: 1 })


      });
  }


  render() {
    const { goBack } = this.props.navigation;
    index = 1;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        {this.state.fontLoaded && this.state.status == 1 ? (
          <View style={{ flex: 1, }}>
            <Icon1 name='left' style={styles.closeIcon} size={20} color='gray' onPress={() => { goBack() }}></Icon1>
            <View style={styles.statusBar} />

            <View style={styles.navBar}>

              <Text style={styles.nameHeader}>{this.state.sportCategory + ' Group'}</Text>
              <Text style={{ flex: 1, fontFamily: 'regular', textAlign: 'center', color: '#7384B4', fontSize: 18, }}>{this.state.address}</Text>
              <Text style={{ flex: 1, fontFamily: 'regular', textAlign: 'center', color: '#7384B4', fontSize: 18, }}>{this.setTime(this.state.trainingTime) +' '+ this.state.trainingTime.split(' ')[0].split('/')[1]+"."+this.state.trainingTime.split(' ')[0].split('/')[0]+"."+this.state.trainingTime.split(' ')[0].split('/')[2] }</Text>
              <Text style={{ flex: 1, fontFamily: 'light', textAlign: 'center', color: '#7384B4', fontSize: 14, }}>Open For {this.state.minParticipants} - {this.state.maxParticipants} Trainees </Text>

            </View>

            <ScrollView
              scrollEnabled={false}
              style={{ flex: 1, flexDirection: 'column' }}>

              {this.state.withTrainer ?

                <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 20 }}>
                  
                  <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 5 }}>
                    <Image style={{ width: 80, height: 80, borderRadius: 40 }} source={{ uri: this.state.creatorPicture }}></Image>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginLeft: 5 }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>

                      <Text style={{ fontFamily: 'light', color: '#7384B4', }}>{this.state.creatorName}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>

                      <Text style={{ fontFamily: 'light', color: '#7384B4', }}>$ {this.state.price}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
                      <Image style={{ width: 20, height: 20 }} source={require('../../Images/SelectedStar.png')}></Image>
                      <Text style={{ fontFamily: 'light', marginLeft: 10, marginTop: 2, color: '#7384B4', }}>{this.state.creatorRate}</Text>
                    </View>
                  </View>
                </View> :   <View style={{ flex: 1, alignItems: 'center', marginRight: 5 }}>
                    <Image style={{ width: 80, height: 80, borderRadius: 40 }} source={require('../../Images/GroupWithPartners.png') }></Image>
                  </View>}

              <ScrollView
                style={{ flex: 1, flexDirection: 'column', height:400, marginTop:10 }}>

                <View style={styles.list}>
                  {this.state.groupParticipants.map((participant, index) => (
                    ((participant.UserCode != this.state.creatorCode )||(participant.UserCode == this.state.creatorCode && this.state.withTrainer==0)) &&
                    <ListItem
                      key={index}
                      leftIcon={() =>
                        <Image source={{ uri: participant.Picture }} style={{ width: 40, height: 40, borderRadius: 20 }}></Image>}
                      title={participant.FirstName + " " + participant.LastName}
                      titleStyle={{ color: 'black', fontFamily: 'regular' }}
                      subtitle={participant.Age.toString()}
                      subtitleStyle={{ fontFamily: 'regular' }}
                      rightTitle={participant.Rate.toString()}
                      rightTitleStyle={{ color: 'green', fontSize: 15, fontFamily: 'regular' }}
                      bottomDivider
                      rightIcon={() => <Icon1 color='#f7d84c' name='star' size={30} />}
                      onPress={() => this.props.navigation.navigate('UserProfile', { UserCode: participant.UserCode })}
                    />)
                  )}

                </View>
              </ScrollView>
              <View style={{flex:1, alignItems:'flex-end'}}>
                <Text style={{ fontFamily: 'light',color: '#7384B4', marginRight:8}}>{this.state.withTrainer ? this.state.currentParticipants-1:this.state.currentParticipants} Participants</Text>
              </View>












              {/* <View style={{ flex: 1, marginTop: 10, flexDirection: 'column', margin: 20, justifyContent: 'center' }}>
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
              </View> */}

              {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -40 }}>
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

              </View> */}




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
    height: 110,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
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
