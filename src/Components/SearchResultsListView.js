import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';


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
                            source={{ uri: x.Picture.toString() }}
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('UserProfile', { UserCode: x.UserCode })}

                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', justifyContent: 'center' }}>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-start', marginLeft: 10 }}>
                            {x.IsTrainer == 1 ? <Icon2 name={'whistle'} size={20} color={'blue'} style={{ transform: [{ rotate: '-30deg' }], flex: 1 }} ></Icon2> : null}
                            <Text
                                style={{
                                    fontFamily: 'regular',
                                    fontSize: 15,
                                    //marginLeft: 10,
                                    color: 'gray',
                                    flex: 5
                                }}
                            >
                                {x.FirstName + ' ' + x.LastName + ', ' + x.Age}
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
                                {((coupleAddresses[index]).length > 25) ?
                                    (((coupleAddresses[index]).substring(0, 25 - 3)) + '...') :
                                    coupleAddresses[index]}

                            </Text>
                            <Icon1 style={{ flex: 1, marginLeft: 5 }} name='location-pin' color='gray' textAlign='center' size={20} onPress={() => this.props.setLatLon(x.Latitude, x.Longitude)}></Icon1>


                        </View>
                        {x.IsTrainer ? <Text
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

                    <View style={{ flex: 1, alignItems: 'center' }}>

                        <Button
                            style={{ flex: 1 }}
                            titleStyle={{ fontWeight: 'bold', fontSize: 10 }}
                            title={'Send Suggestion'}
                            onPress={() => {
                                this.sendSuggestion(x.UserCode)

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
                    </View>



                </View>
            </View>

        )
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
                if (couple)
                    coupleAddresses.push(address);
                else groupAddresses.push(address);


                if ((coupleAddresses.length == this.props.CoupleResults.length) && (groupAddresses.length == this.props.GroupResults.length)) {
                    this.setState({ status: 1 });
                }
            });
    }

    renderGroupResults(x, index) {

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
                                {((groupAddresses[index]).length > 25) ?
                                    (((groupAddresses[index]).substring(0, 25 - 3)) + '...') :
                                    groupAddresses[index]}

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

                    <View style={{ flex: 1, alignItems: 'center' }}>
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
                    </View>



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

                {(this.props.CoupleResults.length != 0 || this.props.GroupResults.length != 0) ?
                    <ScrollView style={{ flex: 1, marginBottom: 20, width: SCREEN_WIDTH, maxHeight: 200 }}>
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