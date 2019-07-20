import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import { Image } from 'react-native-elements';
import Map from '../Components/Map';
import { Font } from 'expo';
import ActionButton from 'react-native-action-button';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import IconNew from 'react-native-vector-icons/Entypo';
import PendingRequestsListView from '../Components/PendingRequestsListView';
import ApprovedRequestsListView from '../Components/ApprovedRequestsListView';
import FutureTrainingsListView from '../Components/FutureTrainingsListView';
import TrainerOnlineModal from '../Components/TrainerOnlineModal';
import CreateGroupModal from '../Components/CreateGroupModal';

const LOADING = require('../../Images/LoadingLogo.gif');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const APPROVED_REQUESTS = require('../../Images/ApprovedRequests.png');
const PENDING_REQUESTS = require('../../Images/PendingRequests.png');
const FUTURE_TRAININGS = require('../../Images/FutureTrainings.png');
const SELECTED_APPROVED_REQUESTS = require('../../Images/ApprovedRequestsSelected.png');
const SELECTED_PENDING_REQUESTS = require('../../Images/PendingRequestsSelected.png');
const SELECTED_FUTURE_TRAININGS = require('../../Images/FutureTrainingsSelected.png');
var hours_now = new Date().getHours();
var minutes_now = new Date().getMinutes();

export default class HomeTrainer extends Component {
  constructor(props) {

    super(props);

    this.state = {
      status: 0,
      fontLoaded: false,
      onlineModalVisible: false,
      createGroupModalVisible: false,
      onlineMode: false,
      latitude: 0,
      longitude: 0,
      partnerLatitude: 0,
      partnerLongitude: 0,
      coupleResults: [],
      groupResults: [],
      pendingRequests: [],
      futureCoupleTrainings: [],
      futureGroupTrainings: [],
      approvedRequests: [],
      pendingRequestsMapView: true,
      approvedRequestsMapView: false,
      futureTrainingsMapView: false,
      listView: false,
      userCode: 0,
      isTrainer: true,
      onlineTrainer: [],

    };

    this.getLocalStorage = this.getLocalStorage.bind(this);
    this.closeListView = this.closeListView.bind(this);
    this.onlineModalVisible = this.onlineModalVisible.bind(this);
    this.createGroupModalVisible = this.createGroupModalVisible.bind(this);
    this.checkIfUserOnline = this.checkIfUserOnline.bind(this);
    this.afterLocalStorageFunctions = this.afterLocalStorageFunctions.bind(this);
    this.insertOnlineTrainer = this.insertOnlineTrainer.bind(this);
    this.getFutureTrainings = this.getFutureTrainings.bind(this);
    this.setLatLon = this.setLatLon.bind(this);
    this.refresh = this.refresh.bind(this);

  }

  onlineModalVisible() {
    this.setState({ onlineModalVisible: !this.state.onlineModalVisible })
  }

  createGroupModalVisible() {
    this.setState({ createGroupModalVisible: !this.state.createGroupModalVisible })
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
    console.warn('this is trainer home page');

    setTimeout(() => {
      this.getLocalStorage()
    }, 1500);

  }

  getLocalStorage = async () => {
    await AsyncStorage.getItem('UserCode', (err, result) => {
      if (result != null) {
        this.setState({ userCode: result }, this.afterLocalStorageFunctions);
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

  afterLocalStorageFunctions() {

    this.getFutureTrainings();
    this.getRequests(true);
    this.getRequests(false);
    this.checkIfUserOnline();
  }


  checkIfUserOnline() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckIfTrainerOnline?UserCode=' + this.state.userCode, {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {

        if (response.OnlineCode != 0) {
          this.setState({ onlineMode: true, onlineDetails: response, longitude: response.Longitude, latitude: response.Latitude, partnerLongitude: response.Longitude, partnerLatitude: response.Latitude, status: 1 });
        }
        else {
          this.setState({ onlineDetails: [], pendingRequestsMapView: true })
          this.getCurrentLocation();
        }
      })
      .catch(error => console.warn('Error:', error.message));


  }

  refresh(str) {
    this.getRequests(true);
    this.getRequests(false);
    this.getFutureTrainings();

    if (str == 'search')
      this.setState({ searchResultsMapView: true, pendingRequestsMapView: false, approvedRequestsMapView: false, futureTrainingsMapView: false, })
    if (str == 'pending')
      this.setState({ searchResultsMapView: false, pendingRequestsMapView: true, approvedRequestsMapView: false, futureTrainingsMapView: false, })
    if (str == 'approved')
      this.setState({ searchResultsMapView: false, pendingRequestsMapView: false, approvedRequestsMapView: true, futureTrainingsMapView: false, })
    if (str == 'future')
      this.setState({ searchResultsMapView: false, pendingRequestsMapView: false, approvedRequestsMapView: false, futureTrainingsMapView: true, })
  }

  goOffline() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GoOffline?UserCode=' + this.state.userCode + '&IsTrainer=' + this.state.isTrainer, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(response => { alert('Youre now Offline'); })
      .catch(error => console.warn('Error:', error.message));

    this.setState({ onlineMode: false, pendingRequestsMapView: true });
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

        this.setState({ partnerLatitude: position.coords.latitude, partnerLongitude: position.coords.longitude, latitude: position.coords.latitude, longitude: position.coords.longitude, status: 1 });// +  Math.random()/1000,
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  closeListView() {
    this.setState({ listView: false });
  }

  setOnlineMode = (mode) => {
    this.setState({ onlineMode: mode });
    this.setState({ searchResultsMapView: mode });
    if (!mode)
      this.setState({ pendingRequestsMapView: false, approvedRequestsMapView: false, futureTrainingsMapView: false })
  }

  getRequests(IsApproved) {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetSuggestions?UserCode=' + this.state.userCode + '&IsApproved=' + IsApproved, {

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
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetFutureCoupleTrainings?UserCode=' + this.state.userCode, {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ futureCoupleTrainings: response })
      })
      .catch(error => console.warn('Error:', error.message));
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetFutureGroupTrainings?UserCode=' + this.state.userCode, {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ futureGroupTrainings: response })
      })
      .catch(error => console.warn('Error:', error.message));
  }


  insertOnlineTrainer(onlineDetails) {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/insertOnlineTrainer', {
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(onlineDetails),
    })
      .catch(error => console.warn('Error1:', error.message));

    this.search(onlineDetails);
  }

  setLatLon(lat, long) {
    this.setState({ partnerLatitude: lat, partnerLongitude: long, })
  }

  render() {
    return (

      <KeyboardAvoidingView behavior='position' style={styles.formContainer} keyboardVerticalOffset={-70}>
        {this.state.status == 1 && this.state.fontLoaded ?

          <View style={styles.pageStyle}>
            {this.state.createGroupModalVisible ?
              <CreateGroupModal
                refresh={this.refresh}
                isTrainer={this.state.isTrainer}
                createGroupModalVisible={this.createGroupModalVisible}
                CreatorCode={this.state.userCode}
                IsTrainer={this.state.isTrainer} ></CreateGroupModal>
              : null}

            {this.state.onlineModalVisible ?
              <TrainerOnlineModal
                insertOnlineTrainer={this.insertOnlineTrainer}
                userCode={this.state.userCode}
                onlineModalVisible={this.onlineModalVisible}
                style={styles.trainerOnlineModal}></TrainerOnlineModal>
              : null}

            <View style={styles.mapContainer} >
              <Map refresh={this.refresh}
                style={styles.mapStyle}
                navigation={this.props.navigation}
                SenderCode={this.state.userCode}
                HomeTraineeStates={this.state}></Map>
            </View>



            <View style={styles.headerContainer}>

              <View style={styles.container}>

                <View style={styles.headerView}>


                  <View style={styles.flex}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ pendingRequestsMapView: true, approvedRequestsMapView: false, futureTrainingsMapView: false, searchResultsMapView: false });
                        this.refresh('pending');
                      }}
                    >
                      {this.state.pendingRequestsMapView ?
                        <Image source={SELECTED_PENDING_REQUESTS}
                          style={styles.headerIconImage} /> :
                        <Image source={PENDING_REQUESTS}
                          style={styles.headerIconImage} />}
                    </TouchableOpacity>
                    <View
                      style={styles.badgeContainer}>
                      <Text
                        style={styles.badgeText}
                      >{this.state.pendingRequests.length}
                      </Text>
                    </View>

                  </View>

                  <View style={styles.flex}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ approvedRequestsMapView: true, pendingRequestsMapView: false, futureTrainingsMapView: false, searchResultsMapView: false })
                        this.refresh('approved');
                      }}
                    >

                      {this.state.approvedRequestsMapView ?
                        <Image source={SELECTED_APPROVED_REQUESTS} style={styles.headerIconImage} /> :
                        <Image source={APPROVED_REQUESTS} style={styles.headerIconImage} />}


                    </TouchableOpacity>
                    <View
                      style={styles.badgeContainer}>
                      <Text
                        style={styles.badgeText}
                      >{this.state.approvedRequests.length}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.flex}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ futureTrainingsMapView: true, approvedRequestsMapView: false, pendingRequestsMapView: false, searchResultsMapView: false });
                        this.refresh('future');
                      }}
                    >
                      {this.state.futureTrainingsMapView ? <Image source={SELECTED_FUTURE_TRAININGS}
                        style={styles.headerIconImage} /> :
                        <Image source={FUTURE_TRAININGS} style={styles.headerIconImage} />}

                    </TouchableOpacity>
                    <View style={styles.badgeContainer}>
                      <Text
                        style={styles.badgeText}
                      >{this.state.futureCoupleTrainings.length + this.state.futureGroupTrainings.length}
                      </Text>
                    </View>

                  </View>
                </View>

              </View>

              {this.state.pendingRequestsMapView && this.state.listView ?
                <PendingRequestsListView navigation={this.props.navigation} refresh={this.refresh} setLatLon={this.setLatLon} closeListView={this.closeListView} PendingRequests={this.state.pendingRequests} UserCode={this.state.userCode}></PendingRequestsListView>
                : null}

              {this.state.approvedRequestsMapView && this.state.listView ?
                <ApprovedRequestsListView navigation={this.props.navigation} refresh={this.refresh} setLatLon={this.setLatLon} closeListView={this.closeListView} ApprovedRequests={this.state.approvedRequests} UserCode={this.state.userCode} ></ApprovedRequestsListView>
                : null
              }

              {this.state.futureTrainingsMapView && this.state.listView ?
                <FutureTrainingsListView navigation={this.props.navigation} refresh={this.refresh} setLatLon={this.setLatLon} closeListView={this.closeListView} FutureCoupleTrainings={this.state.futureCoupleTrainings} FutureGroupTrainings={this.state.futureGroupTrainings} UserCode={this.state.userCode}></FutureTrainingsListView>
                : null}


              {!this.state.listView && (this.state.searchResultsMapView || this.state.pendingRequestsMapView || this.state.approvedRequestsMapView || this.state.futureTrainingsMapView)
                ?
                <View style={styles.listViewButton}>

                  <ActionButton
                    onPress={() => this.setState({ listView: !this.state.listView })}
                    renderIcon={() =>
                      (<IconNew
                        name="list"
                        size={20}
                      />)
                    }
                    buttonColor='rgba(255,255,255,0.7)'
                    size={35}
                  >
                  </ActionButton>
                </View>
                : null}



              <View style={styles.searchButtonsContainer}>
                <View style={styles.actionButtonView}>
                  <ActionButton
                    onPress={() => {
                      this.getCurrentLocation()
                    }}
                    renderIcon={() =>
                      (<Icon1
                        name="navigation"
                        size={30}
                      />)
                    }
                    buttonColor='rgba(255,255,255,0.7)'
                    size={60}
                  >
                  </ActionButton>
                </View>
                <View style={{ flex: 1 }}>
                  {this.state.onlineMode ?
                    <ActionButton
                      renderIcon={active => active ? (<Icon1
                        name="search"
                        size={30}
                      />) :
                        (<Icon1
                          name="search"
                          size={30}
                        />)
                      }
                      verticalOrientation='up'
                      buttonColor='rgba(71, 224, 135,0.7)'
                      size={60}
                    >
                      <ActionButton.Item
                        buttonColor='rgba(237,29,26,0.7)'
                        onPress={() => {
                          this.goOffline();
                          this.setState({ listView: false })
                        }}
                      >
                        <Icon2
                          name="poweroff"
                          size={30}
                        />
                      </ActionButton.Item>

                      <ActionButton.Item
                        buttonColor='rgba(255,255,255,0.7)'
                        onPress={() => {
                          this.createGroupModalVisible();
                          this.setState({ listView: false })
                          this.setState({ onlineModalVisible: false })
                        }}
                      >
                        <Icon2
                          name="addusergroup"
                          size={30}
                        />
                      </ActionButton.Item>

                      <ActionButton.Item
                        buttonColor='rgba(255,255,255,0.7)'
                        onPress={() => {
                          this.onlineModalVisible();
                          this.setState({ listView: false })
                          this.setState({ createGroupModalVisible: false })
                        }
                        }
                      >
                        <Icon3
                          name="account-search-outline"
                          size={30}
                        />
                      </ActionButton.Item>
                    </ActionButton>
                    :
                    <ActionButton
                      renderIcon={active => active ? (<Icon1
                        name="search"
                        size={30}
                      />) :
                        (<Icon1
                          name="search"
                          size={30}
                        />)
                      }
                      verticalOrientation='up'
                      buttonColor='rgba(255,255,255,0.7)'
                      size={60}
                    >

                      <ActionButton.Item
                        buttonColor='rgba(255,255,255,0.7)'
                        onPress={() => {
                          this.createGroupModalVisible();
                          this.setState({ onlineModalVisible: false });
                        }}
                      >
                        <Icon2
                          name="addusergroup"
                          size={30}
                        />
                      </ActionButton.Item>

                      <ActionButton.Item
                        buttonColor='rgba(255,255,255,0.7)'
                        onPress={() => {
                          this.onlineModalVisible();
                          this.setState({ createGroupModalVisible: false });
                        }
                        }
                      >
                        <Icon3
                          name="account-search-outline"
                          size={30}
                        />
                      </ActionButton.Item>

                    </ActionButton>

                  }
                </View>
              </View>
            </View>

          </View>

          :

          <View style={styles.loading}>

            <Image source={LOADING}></Image>
          </View>
        }

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle:
    { zIndex: 0 },
  mapContainer:
  {
    flex: 6,
    zIndex: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  pageStyle:
  {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: 'white',
    height: SCREEN_HEIGHT,
    alignItems: 'center'
  },
  trainerOnlineModal:
    { zIndex: 1000 },
  listViewButton:
  {
    flex: 1,
    top: 80
  },

  badgeText:
  {
    color: 'black',
    fontFamily: 'regular',
    fontSize: 11,
    position: 'absolute'
  },
  badgeContainer:
  {
    left: -5,
    top: -58,
    width: 18,
    height: 18,
    borderRadius: 10,
    borderColor: '#75cac3',
    borderWidth: 2,
    backgroundColor: 'white',
    alignItems: "center",
    justifyContent: 'center'
  },
  headerContainer:
  {
    flex: 1,
    zIndex: 1000,
    position: 'absolute',
    left: 0,
    top: 20,
    width: SCREEN_WIDTH
  },

  headerView:
    { 
      flex: 8, 
      flexDirection: 'row', 
      alignItems: 'center',
      marginLeft: 25, 
      marginTop: 15 
    },
  flex:
    { flex: 1 },

  container: {
    flex: 1,
    zIndex: 1000,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255,0.5)',
    width: SCREEN_WIDTH,
    paddingLeft: 30,
    marginTop: 10,


  },
  headerIconImage:
    { width: 60, height: 60 },
  searchButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    top: 480,
    width: SCREEN_WIDTH,
    height: 200

  },
  actionButtonView:
    { flex: 1, left: -85 },


  formContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  loading:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

})
