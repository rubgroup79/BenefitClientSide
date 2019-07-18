import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity, Text, AsyncStorage, Button } from 'react-native';
import { Avatar, Badge, Image } from 'react-native-elements';
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
import SearchResultsListView from '../Components/SearchResultsListView';
import SearchModal from '../Components/SearchModal';
import CreateGroupModal from '../Components/CreateGroupModal';

const LOADING = require('../../Images/LoadingLogo.gif');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SEARCH_VIEW = require('../../Images/SearchView.png');
const SELECTED_SEARCH_VIEW = require('../../Images/SearchViewSelected.png');
const APPROVED_REQUESTS = require('../../Images/ApprovedRequests.png');
const PENDING_REQUESTS = require('../../Images/PendingRequests.png');
const FUTURE_TRAININGS = require('../../Images/FutureTrainings.png');
const SELECTED_APPROVED_REQUESTS = require('../../Images/ApprovedRequestsSelected.png');
const SELECTED_PENDING_REQUESTS = require('../../Images/PendingRequestsSelected.png');
const SELECTED_FUTURE_TRAININGS = require('../../Images/FutureTrainingsSelected.png');
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
      createGroupModalVisible: false,
      searchMode: false,
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
      searchResultsMapView: true,
      pendingRequestsMapView: false,
      approvedRequestsMapView: false,
      futureTrainingsMapView: false,
      listView: false,
      userCode: 0,
      isTrainer: false,
      onlineTrainee: [],

    };

    this.getLocalStorage = this.getLocalStorage.bind(this);
    this.closeListView = this.closeListView.bind(this);
    this.searchModalVisible = this.searchModalVisible.bind(this);
    this.createGroupModalVisible = this.createGroupModalVisible.bind(this);
    this.checkIfUserOnline = this.checkIfUserOnline.bind(this);
    this.afterLocalStorageFunctions = this.afterLocalStorageFunctions.bind(this);
    this.search = this.search.bind(this);
    this.insertOnlineTrainee = this.insertOnlineTrainee.bind(this);
    this.getFutureTrainings = this.getFutureTrainings.bind(this);
    this.setLatLon = this.setLatLon.bind(this);
    this.refresh = this.refresh.bind(this);
    this.seachGroups= this.seachGroups.bind(this);
    this.changeSearchMode=this.changeSearchMode.bind(this);

  }

  searchModalVisible() {
    this.setState({ searchModalVisible: !this.state.searchModalVisible })
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


    setTimeout(() => {
      this.getLocalStorage()
    }, 1500);

  }

  changeMapViewAfterSearch() {
    this.setState({
      searchResultsMapView: true,
      pendingRequestsMapView: false,
      approvedRequestsMapView: false,
      futureTrainingsMapView: false,
    })
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
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckIfTraineeOnline?UserCode=' + this.state.userCode, {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {

        if (response.OnlineCode != 0) {
          this.search(response);
          this.setState({ searchMode: true, onlineDetails: response, longitude: response.Longitude, latitude: response.Latitude,partnerLongitude: response.Longitude, partnerLatitude: response.Latitude, status: 1 });
        }
        else {
          this.setState({ onlineDetails: [], pendingRequestsMapView: true })
          this.getCurrentLocation();
        }
      })
      .catch(error => console.warn('Error:', error.message));


  }

  refresh(str) {
    this.search(this.state.onlineTrainee);
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

    this.setState({ searchMode: false, pendingRequestsMapView: true, coupleResults:[], groupResults:[] });
    this.getCurrentLocation();
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

        this.setState({ partnerLatitude: position.coords.latitude, partnerLongitude: position.coords.longitude,latitude: position.coords.latitude, longitude: position.coords.longitude, status: 1 });// +  Math.random()/1000,
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  closeListView() {
    this.setState({ listView: false });
  }

  setSearchMode = (mode) => {
    this.setState({ searchMode: mode });
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


  insertOnlineTrainee(onlineDetails) {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/InsertOnlineTrainee', {
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(onlineDetails),
    })
      .catch(error => console.warn('Error1:', error.message));

    this.search(onlineDetails);
  }

changeSearchMode(){
  this.setState({searchMode:true})

}

  search(onlineDetails) {
    this.setState({
      onlineTrainee: onlineDetails,
      latitude: onlineDetails.Latitude,
      longitude: onlineDetails.Longitude,
      partnerLatitude: onlineDetails.Latitude,
      partnerLongitude:onlineDetails.Longitude,
      searchResultsMapView: true,
      pendingRequestsMapView: false,
      approvedRequestsMapView: false,
      futureTrainingsMapView: false,
    });


    //נכנס רק אם משתמש חיפש אימון זוגי עם מאמן או מתאמן
    if (onlineDetails.WithPartner == 1 || onlineDetails.WithTrainer == 1) {
      fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/SearchCoupleTraining', {
        method: 'POST',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(onlineDetails),
      })
        .then(res => res.json())
        .then(response => {
          if (response.length == 0) {
            this.setState({ coupleResults: [] }, this.seachGroups(onlineDetails));
          }
          else {
            this.setState({
              coupleResults: response,
            }, this.seachGroups(onlineDetails))
          }
        })

        .catch(error => console.warn('Error2:', error.message));
    }
    

  }

seachGroups(onlineDetails){
  if (onlineDetails.GroupWithTrainer || onlineDetails.GroupWithPartners) {

    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/SearchGroups', {

      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(onlineDetails),
    })
      .then(res => res.json())
      .then(response => {
        if (response.length == 0) {
          this.setState({ groupResults: [] });

        }

        else {
          console.warn('ff');
          this.setState({
            groupResults: response,
          })
        }

      })

      .catch(error => console.warn('Error3:', error.message));
  }
}

  setLatLon(lat, long) {
    this.setState({ partnerLatitude: lat, partnerLongitude: long, })
  }



  render() {
    return (

      <KeyboardAvoidingView behavior='position' style={styles.formContainer} keyboardVerticalOffset={-70}>
        {this.state.status == 1 && this.state.fontLoaded ?

          <View style={{ flex: 1, width: SCREEN_WIDTH, backgroundColor: 'white', height: SCREEN_HEIGHT, alignItems: 'center' }}>
            {this.state.createGroupModalVisible ?
              <CreateGroupModal refresh={this.props.refresh} isTrainer={this.state.isTrainer} createGroupModalVisible={this.createGroupModalVisible} CreatorCode={this.state.userCode} IsTrainer={this.state.isTrainer} ></CreateGroupModal>
              : null}

            {this.state.searchModalVisible ?
              <SearchModal changeSearchMode={this.changeSearchMode} searchModalVisible={this.searchModalVisible} insertOnlineTrainee={this.insertOnlineTrainee} userCode={this.state.userCode} searchModalVisible={this.searchModalVisible} style={{ zIndex: 1000 }}></SearchModal>
              : null}

            <View style={{ flex: 6, zIndex: 0, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, }} >
              <Map refresh={this.refresh} style={{ zIndex: 0, }} navigation={this.props.navigation} SenderCode={this.state.userCode} HomeTraineeStates={this.state}></Map>
            </View>



            <View style={{ flex: 1, zIndex: 1000, position: 'absolute', left: 0, top: 20, width: SCREEN_WIDTH, }}>

              <View style={styles.container}>

                <View style={{ flex: 8, flexDirection: 'row', alignItems: 'center', marginLeft: 25, marginTop: 15 }}>



                  {this.state.searchMode ?
                    <View style={{ flex: 1, }}>

                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ searchResultsMapView: true, pendingRequestsMapView: false, approvedRequestsMapView: false, futureTrainingsMapView: false, });
                          this.refresh('search');
                          this.setSearchMode(true);
                          this.setState({ searchResultsMapView: true })
                        }}
                      >
                        {this.state.searchResultsMapView ? <Image source={SELECTED_SEARCH_VIEW} style={{ width: 60, height: 60 }} /> : <Image source={SEARCH_VIEW} style={{ width: 60, height: 60 }} />}
                      </TouchableOpacity>
                      <View style={{ left: -5, top: -58, width: 18, height: 18, borderRadius: 10, borderColor: '#75cac3', borderWidth: 2, backgroundColor: 'white', alignItems: "center", justifyContent: 'center' }}>
                        <Text
                          style={{ color: 'black', fontFamily: 'regular', fontSize: 11, position: 'absolute' }}
                        >{this.state.coupleResults.length + this.state.groupResults.length}
                        </Text>
                      </View>
                    </View> : null}




                  <View style={{ flex: 1, }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ pendingRequestsMapView: true, approvedRequestsMapView: false, futureTrainingsMapView: false, searchResultsMapView: false });
                        this.refresh('pending');
                      }}
                    >
                      {this.state.pendingRequestsMapView ? <Image source={SELECTED_PENDING_REQUESTS} style={{ width: 60, height: 60 }} /> : <Image source={PENDING_REQUESTS} style={{ width: 60, height: 60 }} />}
                    </TouchableOpacity>
                    <View style={{ left: -5, top: -58, width: 18, height: 18, borderRadius: 10, borderColor: '#75cac3', borderWidth: 2, backgroundColor: 'white', alignItems: "center", justifyContent: 'center' }}>
                      <Text
                        style={{ color: 'black', fontFamily: 'regular', fontSize: 11, position: 'absolute' }}
                      >{this.state.pendingRequests.length}
                      </Text>
                    </View>

                  </View>

                  <View style={{ flex: 1, }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ approvedRequestsMapView: true, pendingRequestsMapView: false, futureTrainingsMapView: false, searchResultsMapView: false })
                        this.refresh('approved');
                      }}
                    >

                      {this.state.approvedRequestsMapView ? <Image source={SELECTED_APPROVED_REQUESTS} style={{ width: 60, height: 60 }} /> : <Image source={APPROVED_REQUESTS} style={{ width: 60, height: 60 }} />}


                    </TouchableOpacity>
                    <View style={{ left: -5, top: -58, width: 18, height: 18, borderRadius: 10, borderColor: '#75cac3', borderWidth: 2, backgroundColor: 'white', alignItems: "center", justifyContent: 'center' }}>
                      <Text
                        style={{ color: 'black', fontFamily: 'regular', fontSize: 11, position: 'absolute' }}
                      >{this.state.approvedRequests.length}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ futureTrainingsMapView: true, approvedRequestsMapView: false, pendingRequestsMapView: false, searchResultsMapView: false });
                        this.refresh('future');
                      }}
                    >
                      {this.state.futureTrainingsMapView ? <Image source={SELECTED_FUTURE_TRAININGS} style={{ width: 60, height: 60 }} /> : <Image source={FUTURE_TRAININGS} style={{ width: 60, height: 60 }} />}

                    </TouchableOpacity>
                    <View style={{ left: -5, top: -58, width: 18, height: 18, borderRadius: 10, borderColor: '#75cac3', borderWidth: 2, backgroundColor: 'white', alignItems: "center", justifyContent: 'center' }}>
                      <Text
                        style={{ color: 'black', fontFamily: 'regular', fontSize: 11, position: 'absolute' }}
                      >{this.state.futureCoupleTrainings.length + this.state.futureGroupTrainings.length}
                      </Text>
                    </View>

                  </View>
                </View>

              </View>

              {this.state.searchResultsMapView && this.state.listView ?
                <SearchResultsListView navigation={this.props.navigation} refresh={this.refresh} setLatLon={this.setLatLon} closeListView={this.closeListView} CoupleResults={this.state.coupleResults} GroupResults={this.state.groupResults} UserCode={this.state.userCode}></SearchResultsListView>
                : null}

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
                <View style={{ flex: 1, top: 80 }}>

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
                <View style={{ flex: 1, left: -85 }}>
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
                  {this.state.searchMode ?

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
                          this.setState({listView:false})
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
                          this.setState({listView:false})
                          this.setState({ searchModalVisible: false })
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
                          this.searchModalVisible();
                          this.setState({listView:false})
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
                          this.setState({ searchModalVisible: false });
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
                          this.searchModalVisible();
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

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <Image source={LOADING}></Image>
          </View>
        }

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
    justifyContent: 'center',
    height: 80,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255,0.5)',
    width: SCREEN_WIDTH,
    paddingLeft: 30,
    marginTop: 10,


  },

  searchButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    top: 480,
    width: SCREEN_WIDTH,
    height: 200

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
