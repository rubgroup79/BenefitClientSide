import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, ListView, Button, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Geocode from "react-geocode";
import { Font } from 'expo';
import {
  Text,
  Card,
  Tile,
  ListItem,
  Avatar,
  ButtonGroup
} from 'react-native-elements';
import colors from '../config/colors';

var coupleAddresses = [];
var groupAddresses = [];
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
Geocode.setApiKey("AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q");
class Trainings extends Component {
  constructor() {
    super();

    this.state = {
      fontLoaded: false,
      pastCoupleTrainings: [],
      pastGroupTrainings: [],
      selectedIndex: 0,
      userCode: 0,
      isTrainer: false,
      coupleAddresses: [],
      groupAddresses: [],
      status: 0


    };
    this.getAddress = this.getAddress.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
    this.getLocalStorage = this.getLocalStorage.bind(this);
    //this.getCoupleTrainings = this.getCoupleTrainings.bind(this);
    // this.renderCoupleTraining = this.renderCoupleTraining.bind(this);
    // this.getAddresses = this.getAddresses.bind(this);
    // this.getGroupTrainings = this.getGroupTrainings.bind(this);
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
   this.getLocalStorage();
  }

  getLocalStorage = async () => {
    await AsyncStorage.getItem('UserCode', (err, result) => {
      if (result != null) {
        console.warn(result)
        this.setState({ userCode: result }, this.getCoupleTrainings);
      }
      else alert('error local storage user code');
    }
    )

    await AsyncStorage.getItem('IsTrainer', (err, result) => {
      if (result != null) {
        console.warn(result)

        this.setState({ isTrainer: result });
      }
      else alert('error local storage is trainer');
    }
    )
  }

  getCoupleTrainings() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetPastCoupleTrainings?UserCode=' + this.state.userCode, {
      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ pastCoupleTrainings: response }, this.getGroupTrainings);
        response.map((training) => {
          this.getAddress(training.Latitude, training.Longitude, true);
        
         } )})
          .catch(error => console.warn('Error:', error.message));
    }

  getGroupTrainings() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetPastGroupTrainings?UserCode=' + this.state.userCode, {
      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ pastGroupTrainings: response });
        response.map((training) => {
          this.getAddress(training.Latitude, training.Longitude, false);
        
         } )})
      .catch(error => console.warn('Error:', error.message));
  }


  //   var promise = new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       console.log('timeout executed after 2s');
  //       resolve(); // resolve when setTimeout is done.
  //     }, 2000);
  // });

  //  getAddresses ()  {
  //     var address = "";
  //     var addresses = [];
  //     addresses = this.state.pastCoupleTrainings.map((x) => {
  //       address =  setTimeout(this.getAddress(x.Latitude, x.Longitude),2000);
  //       // while (address=="") {
  //       // }
  //       console.warn(address)
  //       return address;
  //       // setTimeout(()=>
  //       //  { console.warn(address)
  //       //   return address;
  //       // },4000)
  //     }, this.setState({ addresses: addresses })
  //     );
  //   }




  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }



  getAddress(latitude, longitude, couple) {
    var address = '';

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + 'AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q')
      .then((response) => response.json())
      .then((responseJson) => {
        address = JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'route').length > 0)[0].short_name) + ' ' +
          JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'street_number').length > 0)[0].short_name) + ', ' +
          JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'locality').length > 0)[0].short_name);
        address = address.replace(/"/g, '');
        
        if(couple)
          coupleAddresses.push(address);
        else groupAddresses.push(address);

        if ((coupleAddresses.length == this.state.pastCoupleTrainings.length) && (groupAddresses.length == this.state.pastGroupTrainings.length) )
          this.setState({ coupleAddresses: coupleAddresses, groupAddresses: groupAddresses, status:1 });

      });
  }


  render() {
    //&& this.state.addresses.length != 0
    const { selectedIndex } = this.state;
    const buttons = ['Couple Trainings', 'Group Trainings'];
    return (
      <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
        {this.state.fontLoaded && this.state.status==1?
          <View style={{ flex: 1 }}>
            <View
              style={[
                styles.headerContainer,
                { backgroundColor: '#f5f5f5', marginTop: 20 },
              ]}
            >
              <Image style={{ width: 57, height: 38, marginLeft: 18 }} source={require('../../Images/LogoOnly.png')} />
              <Text style={styles.heading}>Trainings</Text>
            </View>

            <View style={{ margin: 10 }}>
              <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{ height: 50 }}
                selectedButtonStyle={{ backgroundColor: '#f34573' }}
                textStyle={{ fontFamily: 'regular' }}
              />
            </View>


            <ScrollView style={{ flex: 1 }}>
              {/* <Text style={styles.headline}>Couple Trainings</Text> */}
              <View style={{ flex: 1 }}>
                {this.state.selectedIndex == 0 ?
                  <View style={styles.list}>
                    {this.state.pastCoupleTrainings.map((training, index) => (
                      <ListItem
                        key={index}
                        leftIcon={() =>
                          <Image source={{ uri: training.PartnerPicture }} style={{ width: 40, height: 40, borderRadius: 20 }}></Image>}
                        title={training.PartnerFirstName + " " + training.PartnerLastName}
                        titleStyle={{ color: 'black', fontFamily: 'regular' }}
                        subtitle={this.state.coupleAddresses[index]}
                        subtitleStyle={{ fontFamily: 'regular' }}
                        rightTitle={training.TrainingTime.split(" ")[0]}
                        rightTitleStyle={{ color: 'green', fontSize: 15, fontFamily: 'regular' }}
                        rightSubtitle={training.Price == 0 ? null : '$' + training.Price}
                        rightSubtitleStyle={{ textAlign: 'center', fontFamily: 'regular' }}
                        bottomDivider
                        rightIcon={() => this.state.isTrainer==0 ? <Icon color='#f7d84c' name='star' size={30} onPress={() => this.props.navigation.navigate('Rate', { UserCode: this.state.userCode, RatedUserCode: training.PartnerUserCode, FullName: training.PartnerFirstName + " " + training.PartnerLastName, Picture: training.PartnerPicture })} /> : null}
                        onPress={() => this.props.navigation.navigate('UserProfile', { UserCode: training.PartnerUserCode })}
                      />

                    ))}

                  </View>
                  : null
                }
                {/* <Text style={styles.headline}>Group Trainings</Text> */}
                {this.state.selectedIndex == 1 ?
                  <View style={styles.list}>
                    {this.state.pastGroupTrainings.map((training, index) => (
                      <ListItem
                        leftIcon={training.WithTrainer ?
                          <Image source={require('../../Images/GroupWithTrainer.png')} style={{ width: 40, height: 40, borderRadius: 20 }}></Image>
                          :
                          <Image source={require('../../Images/GroupWithPartners.png')} style={{ width: 40, height: 40, borderRadius: 20 }}></Image>}

                        key={training.TrainingCode}
                        title={training.SportCategory + ' Group'}
                        titleStyle={{ color: 'black', fontFamily: 'regular' }}
                        subtitleStyle={{ fontFamily: 'regular' }}
                        subtitle={this.state.groupAddresses[index]}
                        rightTitle={training.TrainingTime.split(" ")[0]}
                        rightTitleStyle={{ color: 'green', fontSize: 15, fontFamily: 'regular' }}
                        rightSubtitle={training.Price == 0 ? null :'$'+ training.Price}
                        rightSubtitleStyle={{ textAlign: 'center', fontFamily: 'regular' }}
                        onPress={() => this.props.navigation.navigate('GroupProfile',{ GroupCode:training.TrainingCode })}
                        bottomDivider
                      />

                    ))}
                  </View>
                  : null}
              </View>

            </ScrollView>
          </View> : null}

      </View>
    );
  }
}

const styles = StyleSheet.create({

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#d0d4db',
    height: 80,
  },
  heading: {
    color: 'black',
    fontSize: 23,
    flex: 1,
    justifyContent: "center",
    marginLeft: 15,
    fontFamily: 'light',
  },

  headline: {
    flex: 1,
    fontSize: 15,
    color: '#f34573',
    fontFamily: 'regular',
    margin: 10
  },

});

export default Trainings;
