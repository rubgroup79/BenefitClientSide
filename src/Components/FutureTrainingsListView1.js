import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocode from "react-geocode";


const SCREEN_WIDTH = Dimensions.get('window').width;
coupleTrainingAddresses = [];
groupTrainingAddresses = [];
coupleForecasts = [];
groupForecasts = [];

export default class FutureTrainingsListView1 extends Component {
  constructor(props) {

    super(props);

    this.state = {
      status: 0,
      forecastStatus: 0,
      creatorDetails: [],
    }
    //  this.getCreatorDetails = this.FutureTrainingsListView1.bind(this);
    this.getAddress = this.getAddress.bind(this);
    // this.getWeather=this.getWeather.bind(this);

  }

componentWillMount() {

    coupleTrainingAddresses = [];
    groupTrainingAddresses = [];
    coupleForecasts = [];
    groupForecasts = [];

   
      this.props.FutureCoupleTrainings.map((x) => {
        this.getAddress(x.Latitude, x.Longitude, true)
        // this.getWeather(x.Latitude, x.Longitude, x.TrainingTime, true)
      });
    

  

      this.props.FutureGroupTrainings.map((x) => {
        this.getAddress(x.Latitude, x.Longitude, false)
        // this.getWeather(x.Latitude, x.Longitude, x.TrainingTime, false)
      });
    
  }






  sendPushNotification(Token, message) {
    var pnd = {
      to: Token,
      title: message,
      body: '',
      badge: 1
    }
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/sendpushnotification', {
      body: JSON.stringify(pnd),
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(response => {
      })
      .catch(error => console.warn('Error:', error.message));
  }



  getAddress(latitude, longitude, couple) {
    console.warn('getadress')
    var address = ''
    Geocode.setApiKey("AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q");

    Geocode.fromLatLng(latitude, longitude).then(
      response => {
        address = response.results[0].formatted_address;

      },
      error => {
        console.error(error);
      }
    );

    // var address = '';
    // fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + 'AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q')
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         address = JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'route').length > 0)[0].short_name) + ' ' +
    //             JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'street_number').length > 0)[0].short_name) + ', ' +
    //             JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'locality').length > 0)[0].short_name);
    //         address = address.replace(/"/g, '');
    //     });

    setTimeout(() => {
      if (couple)
        coupleTrainingAddresses.push(address);
      else groupTrainingAddresses.push(address);

      if (coupleTrainingAddresses.length == this.props.FutureCoupleTrainings.length && groupTrainingAddresses.length == this.props.FutureGroupTrainings.length) {
        this.setState({ status: 1 });
      }
    }, 3000);


  }

  renderFutureCoupleTrainings(x, index) {
    return (
      <View
        style={{
          height: 60,
          marginHorizontal: 10,
          marginTop: 10,
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 5,
          alignItems: 'center',
          flexDirection: 'row',
          flex: 1

        }}
      >

        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>

          <View style={{ marginLeft: 15 }}>
            <Avatar
              small
              rounded
              source={{ uri: x.PartnerPicture.toString() }}
              activeOpacity={0.7}
              onPress={() => this.props.navigation.navigate('UserProfile', { UserCode: x.PartnerUserCode })}

            />
          </View>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', justifyContent: 'center' }}>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-start', marginLeft: 10 }}>
              {x.WithTrainer == 1 ? <Icon2 name={'whistle'} size={20} color={'blue'} style={{ transform: [{ rotate: '-30deg' }], flex: 1 }} ></Icon2> : null}
              <Text
                style={{
                  fontFamily: 'regular',
                  fontSize: 15,
                  //marginLeft: 10,
                  color: 'gray',
                  flex: 5
                }}
              >
                {x.PartnerFirstName + ' ' + x.PartnerLastName + ', ' + x.PartnerAge}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', marginRight: 25, justifyContent: 'center' }}>


              <Text
                style={{
                  fontFamily: 'regular',
                  fontSize: 12,
                  marginLeft: 10,
                  color: 'gray',
                  flex: 5,
                  justifyContent: 'center',
                  textAlign: 'right',
                  marginTop: 3
                }}
              >
                {((coupleTrainingAddresses[index]).length > 25) ?
                  (((coupleTrainingAddresses[index]).substring(0, 25 - 3)) + '...') :
                  coupleTrainingAddresses[index]}

              </Text>
              <Icon1 style={{ flex: 1, marginLeft: 5 }} name='location-pin' color='gray' textAlign='center' size={20} onPress={() => this.props.setLatLon(x.Latitude, x.Longitude)}></Icon1>


            </View>
            {x.WithTrainer ? <Text
              style={{
                fontFamily: 'light',
                fontSize: 12,
                marginLeft: 10,
                color: 'blue',
              }}
            >
              {x.Price + "$"}
            </Text> : null}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 10,
            flex: 1
          }}
        >

          {/* <View style={{ flex: 1, alignItems: 'center' }}>

                        <Button
                            style={{ flex: 1 }}
                            titleStyle={{ fontWeight: 'bold', fontSize: 10 }}
                            title={'Send Suggestion'}
                            onPress={() => {
                                this.sendSuggestion(x.Partner)

                            }}
                            buttonStyle={{
                                borderWidth: 0,
                                borderColor: 'transparent',
                                borderRadius: 20,
                                backgroundColor: '#f34573'
                            }}
                            containerStyle={{ marginVertical: 3, height: 30, width: 115, alignItems: 'center' }}
                            icon={{
                                name: 'mail',
                                type: 'Octicons',
                                size: 15,
                                color: 'white',
                            }}
                            iconContainerStyle={{ width: 15 }}
                        />
                    </View> */}



        </View>
      </View>

    )
  }

  renderFutureGroupTrainings(x, index) {

    return (
      <View
        style={{
          height: 60,
          marginHorizontal: 10,
          marginTop: 10,
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 5,
          alignItems: 'center',
          flexDirection: 'row',
          flex: 1

        }}
      >

        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>

          <View style={{ marginLeft: 15, }}>
            <Avatar
              small
              rounded
              source={x.WithTrainer ? require('../../Images/GroupWithTrainer.png') : require('../../Images/GroupWithPartners.png')}
              activeOpacity={0.7}
              onPress={() => this.props.navigation.navigate('GroupProfile', { GroupCode: x.TrainingCode })}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-start', marginLeft: 10 }}>
              {x.WithTrainer == 1 ? <Icon2 name={'whistle'} size={20} color={'blue'} style={{ transform: [{ rotate: '-30deg' }], flex: 1 }} ></Icon2> : null}
              <Text
                style={{
                  marginTop: 5,
                  fontFamily: 'regular',
                  fontSize: 15,
                  //marginLeft: 10,
                  color: 'gray',
                  flex: 5
                }}
              >
                {x.SportCategory + " Group"}
              </Text>
            </View>


            <View style={{ flex: 1, flexDirection: 'row', marginRight: 25, justifyContent: 'center' }}>


              <Text
                style={{
                  fontFamily: 'regular',
                  fontSize: 12,
                  marginLeft: 10,
                  color: 'gray',
                  flex: 5,
                  justifyContent: 'center',
                  textAlign: 'right',
                  marginTop: 3
                }}
              >
                {((groupTrainingAddresses[index]).length > 25) ?
                  (((groupTrainingAddresses[index]).substring(0, 25 - 3)) + '...') :
                  groupTrainingAddresses[index]}

              </Text>
              <Icon1 style={{ flex: 1, marginLeft: 5 }} name='location-pin' color='gray' textAlign='center' size={20} onPress={() => this.props.setLatLon(x.Latitude, x.Longitude)}></Icon1>

            </View>
            {x.WithTrainer ? <Text
              style={{
                fontFamily: 'light',
                fontSize: 12,
                marginLeft: 10,
                color: 'blue',
              }}
            >
              {x.Price + "$"}
            </Text> : null}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 10,
            flex: 1
          }}
        >

          {/* <View style={{ flex: 1, alignItems: 'center' }}>
                        <Button
                            style={{ flex: 1 }}
                            titleStyle={{ fontWeight: 'bold', fontSize: 10 }}
                            title={'Join Group'}
                            onPress={() => {
                                this.joinGroup(x.TrainingCode, x.CreatorCode);

                            }}
                            buttonStyle={{
                                borderWidth: 0,
                                borderColor: 'transparent',
                                borderRadius: 20,
                                backgroundColor: '#f34573'
                            }}
                            containerStyle={{ marginVertical: 3, height: 30, width: 115, alignItems: 'center' }}
                            icon={{
                                name: 'mail',
                                type: 'Octicons',
                                size: 15,
                                color: 'white',
                            }}
                            iconContainerStyle={{ width: 15 }}
                        />
                    </View> */}



        </View>
      </View>

    )
  }


  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.9)', alignContent: "center", position: 'absolute', zIndex: 2, top: 90, width: SCREEN_WIDTH, }}>

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => this.props.closeListView()}></Icon>
          <Text style={styles.headline}>Search Results</Text>
        </View>

        {(this.props.FutureCoupleTrainings.length != 0 || this.props.FutureGroupTrainings.length != 0) ?
          <ScrollView style={{ flex: 1, marginBottom: 20, width: SCREEN_WIDTH, maxHeight: 200 }}>
            {this.state.status == 1 ?
              <View>
                {this.props.FutureCoupleTrainings.map((x, index) => {
                  return (<View key={index}>{this.renderFutureCoupleTrainings(x, index)}</View>)
                }
                )}
                {this.props.FutureGroupTrainings.map((x, index) => {
                  return (<View key={index}>{this.renderFutureGroupTrainings(x, index)}</View>)
                }
                )}
              </View> : <ActivityIndicator style={{ marginTop: 20 }} size="small" color="gray" />}


          </ScrollView> : <Text style={{ fontFamily: 'regular', fontSize: 15, textAlign: 'center', color: 'gray' }}>No Results</Text>}

      </View>



    );

  }

}


const styles = StyleSheet.create({

  closeIcon: {
    left: 20,
    flex: 1
  },
  headline: {
    flex: 3,
    fontSize: 23,
    color: '#f34573',
    fontFamily: 'regular',
    marginLeft: 20
  },

})