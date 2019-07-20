import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Avatar, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocode from "react-geocode";

const SCREEN_WIDTH = Dimensions.get('window').width;

addresses = [];
export default class ApprovedRequestsListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0
    }
  }

  UNSAFE_componentWillMount() {
    addresses = [];
    this.props.ApprovedRequests.map((x, index) =>
      this.getAddress(x.Latitude, x.Longitude))

  }

  cancelSuggestion(suggestionCode) {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CancelSuggestion?SuggestionCode=' + suggestionCode, {
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({}),
    })
      .then(() => {
        alert('Suggestion Canceled');
      })
      .catch(error => console.warn('Error:', error.message));
  }

  getAddress(latitude, longitude) {
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

    setTimeout(() => {
      addresses.push(address);
      if (addresses.length == this.props.ApprovedRequests.length) {
        this.setState({ status: 1 });
      }
    }, 1000);
  }

  renderApprovedSuggestions(x, index) {

    return (

      <View style={styles.suggestionsContainer} >
        <View style={styles.suggestionRow}>

          <View style={styles.avatarView}>

            <Avatar
              small
              rounded
              source={{ uri: x.Picture.toString() }}
              activeOpacity={0.7}
              onPress={() => this.props.navigation.navigate('UserProfile', { UserCode: x.SenderCode == this.props.UserCode ? x.ReceiverCode : x.SenderCode })}
            />

          </View>

          <View style={styles.suggestionColumn}>

            <View style={styles.userDetailsView}>

              {x.IsTrainer == 1 ? <Icon4 name={'whistle'} size={20} color={'blue'} style={styles.trainerIcon} ></Icon4> : null}

              <Text
                style={styles.nameText}
              >
                {x.FirstName + ' ' + x.LastName + ', ' + x.Age}
              </Text>

            </View>

            <View style={styles.adressContainer}>

              <Text
                style={styles.adressText}
              >

                {((addresses[index]).length > 25) ?
                  (((addresses[index]).substring(0, 25 - 3)) + '...') :
                  addresses[index]}
              </Text>

              <Icon1 style={styles.locationIcon} name='location-pin' color='gray' textAlign='center' size={20} onPress={() => this.props.setLatLon(x.Latitude, x.Longitude)}></Icon1>

            </View>

            {x.IsTrainer ? <Text
              style={styles.priceText}
            >
              {x.Price + "$"}
            </Text> : null}

          </View>

        </View>

        <View
          style={styles.buttonsContainer}
        >

          <View style={styles.buttonsView}>

            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => {
                this.props.UserCode == x.SenderCode ? partnerUserCode = x.ReceiverCode : partnerUserCode = x.SenderCode;
                this.props.navigation.navigate('Chat', { UserCode: this.props.UserCode, PartnerUserCode: partnerUserCode, FullName: x.FirstName + " " + x.LastName, Picture: x.Picture })
              }
              }
            >

              <Icon2 name="message1" color="green" size={20} />

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelSuggestionButton}
              onPress={() => {
                this.cancelSuggestion(x.SuggestionCode)
                this.props.refresh("approved");
              }}
            >

              <Icon2 name="close" color="red" size={20} />

            </TouchableOpacity>

          </View>

        </View>

      </View >

    )
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.listViewStyle}>

          <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => this.props.closeListView()}></Icon>

          <Text style={styles.headline}>Approved Requests</Text>

        </View>
        {this.props.ApprovedRequests.length != 0 ?
          <ScrollView style={styles.scrollView}>

            {this.state.status == 1 ?

              <View>
                {this.props.ApprovedRequests.map((x, index) => {
                  return (<View key={index}>{this.renderApprovedSuggestions(x, index)}</View>)
                }
                )}
              </View>

              : <ActivityIndicator style={styles.activityIndicator} size="small" color="gray" />}

          </ScrollView> :

          <Text style={styles.noApprovedText}>No Approved Requests</Text>}

      </View>

    );
  }
}


const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignContent: "center",
    position: 'absolute',
    zIndex: 2, top: 90,
    width: SCREEN_WIDTH
  },
  activityIndicator:
  {
    marginTop: 20
  },
  scrollView:
  {
    flex: 1,
    marginBottom: 20,
    maxHeight: 200
  },
  listViewStyle:
  {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  noApprovedText:
  {
    fontFamily: 'regular',
    fontSize: 15,
    textAlign: 'center',
    color: 'gray'
  },

  suggestionsContainer:
  {
    height: 60,
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1

  },
  avatarView:
    { marginLeft: 15 },
  suggestionRow:
  {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  suggestionColumn:
  {
    flex: 1,
    flexDirection: 'column'
  },
  nameText:
  {
    fontFamily: 'regular',
    fontSize: 15,
    color: 'gray',
    flex: 5
  },
  trainerIcon:
  {
    transform: [{ rotate: '-30deg' }],
    flex: 1
  },

  userDetailsView:
  {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'flex-start',
    marginLeft: 10
  },

  adressText:
  {
    fontFamily: 'regular',
    fontSize: 12,
    marginLeft: 10,
    color: 'gray',
    flex: 6,
    justifyContent: 'center',
    textAlign: 'right',
    marginTop: 3
  },
  adressContainer:
  {
    flex: 1,
    flexDirection: 'row',
    marginRight: 25,
    justifyContent: 'center'
  },
  locationIcon:
  {
    flex: 1,
    marginLeft: 5
  },
  priceText:
  {
    fontFamily: 'light',
    fontSize: 12,
    marginLeft: 10,
    color: 'blue',
  },
  messageButton:
  {
    backgroundColor: 'rgba(222,222,222,1)',
    width: 28,
    height: 28,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonsView:
  {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-end'
  },
  cancelSuggestionButton:
  {
    backgroundColor: 'rgba(222,222,222,1)',
    width: 28,
    height: 28,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonsContainer:
  {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
    flex: 1
  },
  closeIcon: {
    left: 20,
    flex: 1
  },
  headline: {
    flex: 3,
    fontSize: 23,
    color: '#f34573',
    fontFamily: 'regular',
  },
})