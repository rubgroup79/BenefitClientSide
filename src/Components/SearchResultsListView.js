import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocode from "react-geocode";


const SCREEN_WIDTH = Dimensions.get('window').width;
var coupleAddresses = [];
var groupAddresses = [];
export default class SearchResultsListView extends Component {
    constructor(props) {

        super(props);

        this.state = {
            status: 0
        }


        this.renderCoupleResults = this.renderCoupleResults.bind(this);
        this.renderGroupResults = this.renderGroupResults.bind(this);
        this.sendSuggestion = this.sendSuggestion.bind(this);
        this.sendPushNotification = this.sendPushNotification.bind(this);
        this.getAddress = this.getAddress.bind(this);
    }


    sendSuggestion(receiverCode) {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckActiveSuggestions?SenderCode=' + this.props.UserCode + '&ReceiverCode=' + receiverCode, {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                alert(response);
                if (response.toString() == 'Suggestion Sent!') {
                    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetToken?UserCode=' + receiverCode, {
                        method: 'GET',
                        headers: { "Content-type": "application/json; charset=UTF-8" },
                    })
                        .then(res => res.json())
                        .then(response => {
                            this.sendPushNotification(response, "You have a new suggestion!");
                            this.setState({});
                        })
                        .catch(error => console.warn('Error:', error.message));
                }

            })
            .catch(error => console.warn('Error:', error.message));
        this.props.refresh("search");
    }


    UNSAFE_componentWillMount() {
        coupleAddresses = [];
        groupAddresses = [];

        this.props.CoupleResults.map((x) => {
            this.getAddress(x.Latitude, x.Longitude, true)
        })

        this.props.GroupResults.map((x) => {
            this.getAddress(x.Latitude, x.Longitude, false)
        })


    }


    sendPushNotification(ReceiverToken, message) {
        var pnd = {
            to: ReceiverToken,
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

    joinGroup(GroupCode, CreatorCode) {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/JoinGroup?UserCode=' + this.props.UserCode + '&GroupTrainingCode=' + GroupCode, {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })

            .then(() => {
                fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetToken?UserCode=' + CreatorCode, {
                    method: 'GET',
                    headers: { "Content-type": "application/json; charset=UTF-8" },
                })
                    .then(res => res.json())
                    .then(response => {
                        this.sendPushNotification(response, 'Your group has a new member!');
                        alert('Welcome to the group');
                        this.setState({});
                    })
                    .catch(error => console.warn('Error:', error.message));
            })
            .catch(error => console.warn('Error:', error.message));
        this.props.refresh("search");
    }



    renderCoupleResults(x, index) {
        return (
            <View
                style={styles.resultContainer}
            >

                <View style={styles.leftView}>

                    <View style={styles.avatarView}>
                        <Avatar
                            small
                            rounded
                            source={{ uri: x.Picture.toString() }}
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('UserProfile', { UserCode: x.UserCode })}

                        />
                    </View>
                    <View style={styles.detailsView}>

                        <View style={styles.nameView}>
                            {x.IsTrainer == 1 ? <Icon2 name={'whistle'} size={20} color={'blue'} style={styles.iconStyle} ></Icon2> : null}
                            <Text
                                style={styles.nameText}
                            >
                                {x.FirstName + ' ' + x.LastName + ', ' + x.Age}
                            </Text>
                        </View>
                        <View style={styles.addressView}>


                            <Text
                                style={styles.addressText}
                            >
                                {((coupleAddresses[index]).length > 25) ?
                                    (((coupleAddresses[index]).substring(0, 25 - 3)) + '...') :
                                    coupleAddresses[index]}

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
                    style={styles.bottom}
                >

                    <View style={styles.buttonView}>

                        <Button
                            style={{ flex: 1 }}
                            titleStyle={styles.title}
                            title={'Send Suggestion'}
                            onPress={() => {
                                this.sendSuggestion(x.UserCode)

                            }}
                            buttonStyle={styles.buttonStyle}
                            containerStyle={styles.buttonContainer}
                            icon={{
                                name: 'mail',
                                type: 'Octicons',
                                size: 15,
                                color: 'white',
                            }}
                            iconContainerStyle={{ width: 15 }}
                        />
                    </View>



                </View>
            </View>

        )
    }

    getAddress(latitude, longitude, couple) {
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
                if (couple)
                coupleAddresses.push(address);
            else groupAddresses.push(address);


            if ((coupleAddresses.length == this.props.CoupleResults.length) && (groupAddresses.length == this.props.GroupResults.length)) {
                this.setState({ status: 1 });
            } 
            }, 1000);
    }

    renderGroupResults(x, index) {

        return (
            <View
                style={styles.resultContainer}
            >

                <View style={style.leftView}>

                    <View style={styles.avatarView}>
                        <Avatar
                            small
                            rounded
                            source={x.WithTrainer ? require('../../Images/GroupWithTrainer.png') : require('../../Images/GroupWithPartners.png')}
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('GroupProfile', { GroupCode: x.TrainingCode })}
                        />
                    </View>
                    <View style={styles.groupDetailsView}>
                        <View style={styles.groupHeaderView}>
                            {x.WithTrainer == 1 ? 
                            <Icon2 name={'whistle'} size={20} color={'blue'} style={styles.iconStyle} ></Icon2> : null}
                            <Text
                                style={styles.groupHeadline}
                            >
                                {x.SportCategory + " Group"}
                            </Text>
                        </View>


                        <View style={styles.addressView}>


                            <Text
                                style={styles.addressText}
                            >
                                {((groupAddresses[index]).length > 25) ?
                                    (((groupAddresses[index]).substring(0, 25 - 3)) + '...') :
                                    groupAddresses[index]}

                            </Text>
                            <Icon1 style={styles.locationIcon} name='location-pin' color='gray' textAlign='center' size={20} onPress={() => this.props.setLatLon(x.Latitude, x.Longitude)}></Icon1>

                        </View>
                        {x.WithTrainer ? <Text
                            style={styles.priceText}
                        >
                            {x.Price + "$"}
                        </Text> : null}
                    </View>
                </View>
                <View
                    style={styles.bottom}
                >

                    <View style={styles.joinGroupView}>
                        <Button
                            style={{ flex: 1 }}
                            titleStyle={styles.title}
                            title={'Join Group'}
                            onPress={() => {
                                this.joinGroup(x.TrainingCode, x.CreatorCode);

                            }}
                            buttonStyle={styles.buttonStyle}
                            containerStyle={styles.buttonContainer}
                            icon={{
                                name: 'mail',
                                type: 'Octicons',
                                size: 15,
                                color: 'white',
                            }}
                            iconContainerStyle={{ width: 15 }}
                        />
                    </View>



                </View>
            </View>

        )
    }


    render() {
        return (
            <View style={styles.conatiner}>

                <View style={styles.headerView}>
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => this.props.closeListView()}></Icon>
                    <Text style={styles.headline}>Search Results</Text>
                </View>

                {(this.props.CoupleResults.length != 0 || this.props.GroupResults.length != 0) ?
                    <ScrollView style={style.scrollView}>
                        {this.state.status == 1 ?
                            <View>
                                {this.props.CoupleResults.map((x, index) => {
                                    return (<View key={index}>{this.renderCoupleResults(x, index)}</View>)
                                }
                                )}
                                {this.props.GroupResults.map((x, index) => {
                                    return (<View key={index}>{this.renderGroupResults(x, index)}</View>)
                                }
                                )}
                            </View> : <ActivityIndicator style={{ marginTop: 20 }} size="small" color="gray" />}


                    </ScrollView> : <Text style={{ fontFamily: 'regular', fontSize: 15, textAlign: 'center', color: 'gray' }}>No Results</Text>}

            </View>



        );

    }

}


const styles = StyleSheet.create({
resultContainer:
{
    height: 60,
    marginHorizontal: 10,
    marginTop: 10,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1

},
container:
{ flex: 1, alignItems: 'center', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.9)', alignContent: "center", position: 'absolute', zIndex: 2, top: 90, width: SCREEN_WIDTH, },
headerView:
{ flex: 1, flexDirection: 'row', alignItems: 'center' },
leftView:
{ flex: 2, flexDirection: 'row', alignItems: 'center' },
detailsView:
{ flex: 1, flexDirection: 'column', justifyContent: 'center', justifyContent: 'center' },
groupDetailsView:
{ flex: 1, flexDirection: 'column', justifyContent: 'center' },
avatarView:
{ marginLeft: 15 },
iconStyle:
{ transform: [{ rotate: '-30deg' }], flex: 1 },
nameText:
{
    fontFamily: 'regular',
    fontSize: 15,
    color: 'gray',
    flex: 5
},
nameView:
{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-start', marginLeft: 10 },
addressText:{
    fontFamily: 'regular',
    fontSize: 12,
    marginLeft: 10,
    color: 'gray',
    flex: 5,
    justifyContent: 'center',
    textAlign: 'right',
    marginTop: 3
},

addressView:
{ flex: 1, flexDirection: 'row', marginRight: 25, justifyContent: 'center' },
locationIcon:
{ flex: 1, marginLeft: 5 },
priceText:
{
    fontFamily: 'light',
    fontSize: 12,
    marginLeft: 10,
    color: 'blue',
},

groupHeadline:
{
    marginTop: 5,
    fontFamily: 'regular',
    fontSize: 15,
    color: 'gray',
    flex: 5
},
groupHeaderView:
{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-start', marginLeft: 10 },
buttonView:
{ flex: 1, alignItems: 'center' },
buttonStyle:
{
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 20,
    backgroundColor: '#f34573'
},
buttonContainer:
{ marginVertical: 3, height: 30, width: 115, alignItems: 'center' },
title:
{ fontWeight: 'bold', fontSize: 10 },
bottom:
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
        marginLeft: 20
    },

joinGroupView:
{ flex: 1, alignItems: 'center' },
 
scrollView:
{ flex: 1, marginBottom: 20, width: SCREEN_WIDTH, maxHeight: 200 },





})