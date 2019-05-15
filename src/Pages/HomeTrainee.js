import React, { Component } from 'react';
import { Text, View, Switch, StyleSheet, Dimensions, LayoutAnimation, ActivityIndicator, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Avatar, Badge, Divider, Button } from 'react-native-elements';
import Map from '../Components/Map';
import GenderButton from '../Components/genderButton';
import { Font } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import IconNew from 'react-native-vector-icons/Entypo';
import TimePickerNew from '../Components/TimePicker';
import moment from 'moment';
import PendingRequests from '../Components/PendingRequests';
import ApprovedRequests from '../Components/ApprovedRequests';
import FutureTrainings from '../Components/FutureTrainings';
import SearchModal from '../Components/SearchModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');
const TRAINER_AVATAR = require('../../Images/TrainerAvatar.png');
const TRAINEE_AVATAR = require('../../Images/TraineeAvatar.png');
const APPROVED_REQUESTS = require('../../Images/ApprovedRequests.png');
const PENDING_REQUESTS = require('../../Images/PendingRequests.png');
const FUTURE_TRAININGS = require('../../Images/FutureTrainings.png');
var hours_now = new Date().getHours();
var minutes_now = new Date().getMinutes();
var timeNow = hours_now + ":" + minutes_now;

export default class HomeTrainee extends Component {
  constructor(props) {

    super(props);

    this.state = {
      status: 0,
      fontLoaded: false,
      searchModalVisible: false,
      searchMode: false,
      //isSwitchOn: false,
      latitude: 0,
      longitude: 0,
      // withTrainer: false,
      // withPartner: false,
      // groupWithTrainer: false,
      // groupWithPartners: false,
      // startTime: (moment(new Date()).format('YYYY-MM-DD HH:mm:ss')),
      // endTime: (moment(new Date()).format('YYYY-MM-DD HH:mm:ss')),
      coupleResults: [],
      groupResults: [],
      pendingRequestsOn: false,
      pendingRequests: [],
      futureTrainingsOn: false,
      futureCoupleTrainings: [],
      futureGroupTrainings: [],
      approvedRequestsOn: false,
      approvedRequests: []

    };
    //this.setSearchMode=this.setSearchMode.bind(this);
    this.setSearchLocation = this.setSearchLocation.bind(this);
    this.searchModalVisible = this.searchModalVisible.bind(this);
    this.getCoupleResults = this.getCoupleResults.bind(this);
    this.getGroupResults = this.getGroupResults.bind(this);
  }

  searchModalVisible() {
    this.setState({ searchModalVisible: !this.state.searchModalVisible })
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
    this.getCurrentLocation();
    this.getFutureTrainings();
    this.getRequests(true);
    this.getRequests(false);

  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const output =
          'latitude=' + position.coords.latitude +
          '\nlongitude=' + position.coords.longitude +
          '\naltitude=' + position.coords.altitude +
          '\nheading=' + position.coords.heading +
          '\nspeed=' + position.coords.speed;

        this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude, status: 1 });// +  Math.random()/1000,
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  getCoupleResults(coupleResults) {
    this.setState({
      coupleResults: coupleResults,
    })

  }

  getGroupResults(groupResults) {
    this.setState({
      groupResults: groupResults,
    })
  }

  setSearchLocation(Latitude, Longitude) {
    this.setState({
      latitude: Latitude,
      longitude: Longitude
    });
  }

  setSearchMode=(mode)=>{
      this.setState({searchMode: mode});
  }

  getRequests(IsApproved) {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetSuggestions?UserCode=' + this.props.navigation.getParam('userCode', '0') + '&IsApproved=' + IsApproved, {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        if (IsApproved)
          this.setState({ approvedRequests: response })
        else
          this.setState({ pendingRequests: response })
      })
      .catch(error => console.warn('Error:', error.message));
  }

  getFutureTrainings() {
    // + this.props.navigation.getParam('userCode', '0')
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetFutureCoupleTrainings?UserCode=' + this.props.navigation.getParam('userCode', '0'), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ futureCoupleTrainings: response })
      })
      .catch(error => console.warn('Error:', error.message));
    //+ this.props.navigation.getParam('userCode', '0')
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetFutureGroupTrainings?UserCode=' + this.props.navigation.getParam('userCode', '0'), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ futureGroupTrainings: response })
      })
      .catch(error => console.warn('Error:', error.message));
  }


  //userCode={this.props.navigation.getParam('userCode', '0')}
  render() {
    return (

      <KeyboardAvoidingView behavior='position' style={styles.formContainer} keyboardVerticalOffset={-70}>
        {this.state.status == 1 ?

          <View style={{ flex: 1, width: SCREEN_WIDTH, backgroundColor: 'white', height: SCREEN_HEIGHT, alignItems: 'center' }}>
            {this.state.searchModalVisible ?
              <SearchModal setSearchMode={this.setSearchMode} setSearchLocation={this.setSearchLocation} userCode={1} searchModalVisible={this.searchModalVisible} getCoupleResults={this.getCoupleResults} getGroupResults={this.getGroupResults} style={{ zIndex: 1000 }}></SearchModal>
              : null}

            <View style={{ flex: 6, zIndex: 0, width: SCREEN_WIDTH, height: SCREEN_HEIGHT }} >

              <Map style={{ zIndex: 0 }} SenderCode={this.props.navigation.getParam('userCode', '0')} coupleResults={this.state.coupleResults} groupResults={this.state.groupResults} longitude={this.state.longitude} latitude={this.state.latitude}></Map>

            </View>



            {this.state.fontLoaded ?
              <View style={{ flex: 1, zIndex: 1000, position: 'absolute', left: 0, top: 20, width: SCREEN_WIDTH, }}>
                <View style={styles.container}>
                  <IconNew
                    name="menu"
                    size={30}
                    //type="entypo"
                    containerStyle={{ marginLeft: 10 }}
                    onPress={() => this.props.navigation.navigate('DrawerOpen')}
                  />
                  <View style={{ flex: 1, marginLeft: 55 }}>

                    <Avatar
                      rounded
                      source={
                        PENDING_REQUESTS
                      }
                      size="medium"
                      onPress={() => {
                        this.setState({ pendingRequestsOn: !this.state.pendingRequestsOn, approvedRequestsOn: false, futureTrainingsOn: false, isSwitchOn: false });
                        this.getRequests(false);
                      }}
                    />

                    <Badge
                      status="warning"
                      color='red'
                      containerStyle={{ position: 'absolute', top: -3, }}
                      value={this.state.pendingRequests.length}
                    />

                  </View>

                  <View style={{ flex: 1 }}>

                    <Avatar
                      rounded
                      source={
                        APPROVED_REQUESTS
                      }
                      size="medium"
                      onPress={() => {
                        this.setState({ approvedRequestsOn: !this.state.approvedRequestsOn, pendingRequestsOn: false, futureTrainingsOn: false, isSwitchOn: false })
                        this.getRequests(true);
                      }}

                    />

                    <Badge
                      status="primary"
                      containerStyle={{ position: 'absolute', top: -3, }}
                      value={this.state.approvedRequests.length}
                    />

                  </View>

                  <View style={{ flex: 1 }}>

                    <Avatar
                      rounded
                      source={
                        FUTURE_TRAININGS
                      }
                      size="medium"
                      onPress={() => {
                        this.setState({ futureTrainingsOn: !this.state.futureTrainingsOn, approvedRequestsOn: false, pendingRequestsOn: false, isSwitchOn: false });
                        this.getFutureTrainings();
                      }
                      }
                    />

                    <Badge
                      status="success"
                      containerStyle={{ position: 'absolute', top: -3, }}
                      value={this.state.futureCoupleTrainings.length + this.state.futureGroupTrainings.length}
                    />

                  </View>
                </View>
                {this.state.pendingRequestsOn ?

                  <PendingRequests PendingRequests={this.state.pendingRequests} UserCode={this.props.navigation.getParam('userCode', '0')}></PendingRequests>
                  : null}

                {this.state.approvedRequestsOn ?
                  <ApprovedRequests ApprovedRequests={this.state.approvedRequests} UserCode={this.props.navigation.getParam('userCode', '0')} ></ApprovedRequests>
                  : null
                }


                {this.state.futureTrainingsOn ?
                  //{this.props.navigation.getParam('userCode', '0')}
                  <FutureTrainings FutureCoupleTrainings={this.state.futureCoupleTrainings} FutureGroupTrainings={this.state.futureGroupTrainings} UserCode={this.props.navigation.getParam('userCode', '0')}></FutureTrainings>
                  : null}

                <View style={{ flex: 1, flexDirection: "column", justifyContent: 'center', top: 500, height: 200 }}>
                  <View style={styles.searchButtonsContainer}>

                      {this.state.searchMode ? 
                      <ActionButton

                      renderIcon={active => active ? (<Icon1
                        name="search"
                        size={30}
                        style={styles.uploadImageIcon}
                      />) :
                        (<Icon1
                          name="search"
                          size={30}
                          style={styles.uploadImageIcon}
                        />)

                      }
                      verticalOrientation='up'
                      buttonColor='rgba(71, 224, 135,0.7)'
                      size={60}
                    >
                      <ActionButton.Item
                        buttonColor='rgba(237,29,26,0.7)'
                        onPress={()=>this.setSearchMode(false)}
                      >
                        <Icon2
                          name="poweroff"
                          size={30}
                          style={styles.uploadImageIcon}
                        />
                      </ActionButton.Item>
                        <ActionButton.Item
                        buttonColor='rgba(255,255,255,0.7)'
                        onPress={() => {
                          this.props.navigation.navigate('CreateGroup', { creatorCode: this.props.navigation.getParam('userCode', '0'), isTrainer: 0 })
                        }}
                      >
                        <Icon2
                          name="addusergroup"
                          size={30}
                          style={styles.uploadImageIcon}
                        />
                      </ActionButton.Item>
                      <ActionButton.Item
                        buttonColor='rgba(255,255,255,0.7)'
                        onPress={() => this.searchModalVisible()}
                      >
                        <Icon3
                          name="account-search-outline"
                          size={30}
                          style={styles.uploadImageIcon}
                        />
                      </ActionButton.Item>
                      </ActionButton>
                       : 
                       <ActionButton

                       renderIcon={active => active ? (<Icon1
                         name="search"
                         size={30}
                         style={styles.uploadImageIcon}
                       />) :
                         (<Icon1
                           name="search"
                           size={30}
                           style={styles.uploadImageIcon}
                         />)
 
                       }
                       verticalOrientation='up'
                       buttonColor='rgba(255,255,255,0.7)'
                       size={60}
                     >
                      
                         <ActionButton.Item
                         buttonColor='rgba(255,255,255,0.7)'
                         onPress={() => {
                           this.props.navigation.navigate('CreateGroup', { creatorCode: this.props.navigation.getParam('userCode', '0'), isTrainer: 0 })
                         }}
                       >
                         <Icon2
                           name="addusergroup"
                           size={30}
                           style={styles.uploadImageIcon}
                         />
                       </ActionButton.Item>
                       <ActionButton.Item
                         buttonColor='rgba(255,255,255,0.7)'
                         onPress={() => this.searchModalVisible()}
                       >
                         <Icon3
                           name="account-search-outline"
                           size={30}
                           style={styles.uploadImageIcon}
                         />
                       </ActionButton.Item>
                       </ActionButton>

                       }

                    
                   
                  </View>
                </View>



              </View>
              :
              null
            }

          </View > :
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator style={{ flex: 1 }}
              size='large'
            ></ActivityIndicator>
          </View>}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    zIndex: 1000,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255,0.9)',
    width: SCREEN_WIDTH,
    paddingLeft: 30

  },

  searchButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 60,
    paddingLeft: 60

  },

  switch: {
    marginTop: 8,
  },

  trainingsPreferencesStyle: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0
  },

  trainingsHeadline: {
    flex: 1,
    fontSize: 23,
    color: 'rgba(216, 121, 112, 1)',
    fontFamily: 'regular',
  },

  trainingsPreferencesContainerStyle: {
    flex: 3,
    flexDirection: 'row',
  },

  dividerStyle: {
    backgroundColor: 'gray'
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

})
