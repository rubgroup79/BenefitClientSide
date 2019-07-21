import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Avatar, } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import { NavigationApps, actions, googleMapsTravelModes } from "react-native-navigation-apps";

import Geocode from "react-geocode";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
coupleTrainingAddresses = [];
groupTrainingAddresses = [];
coupleForecasts = [];
groupForecasts = [];

export default class FutureTrainingsListView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: 0,
            forecastStatus: 0,
            creatorDetails: [],
        }
        this.getCreatorDetails = this.getCreatorDetails.bind(this);
        this.setTime = this.setTime.bind(this);
        this.cancelCoupleTraining = this.cancelCoupleTraining.bind(this);
        this.cancelGroupParticipant = this.cancelGroupParticipant.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.getWeather = this.getWeather.bind(this);
        this.getCoupleAdresses = this.getCoupleAdresses.bind(this);
        this.getGroupsAdresses = this.getGroupsAdresses.bind(this);

    }

    setTime(trainingTime) {
        hour = (trainingTime.split(" ")[1]).split(":")[0];
        minutes = (trainingTime.split(" ")[1]).split(":")[1];
        ampm = trainingTime.split(" ")[2];

        if (ampm == "PM") {
            if (hour == "12")
                return (hour) + ":" + minutes;
            temp = JSON.parse(hour);
            temp += 12;
            return (temp) + ":" + minutes;
        }

        else return hour + ":" + minutes;
    }


    cancelCoupleTraining(CoupleTraining) {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CancelCoupleTraining?CoupleTrainingCode=' + CoupleTraining.TrainingCode + '&UserCode=' + this.props.UserCode, {
            body: JSON.stringify({}),
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                alert("The training is canceled!");
                fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetToken?UserCode=' + response, {
                    method: 'GET',
                    headers: { "Content-type": "application/json; charset=UTF-8" },
                })
                    .then(res => res.json())
                    .then(response => {
                        this.sendPushNotification(response, "your partner has canceled the training");
                    })
                    .catch(error => console.warn('Error:', error.message));
            })
            .catch(error => console.warn('Error:', error.message));
        this.props.refresh("future");
    }



    cancelGroupParticipant(groupTraining) {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CancelGroupParticipant?GroupTrainingCode=' + groupTraining.TrainingCode + '&UserCode=' + this.props.UserCode, {
            body: JSON.stringify({}),
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                alert("You left the group :(");
                if (response.length == 0) {
                    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetToken?UserCode=' + groupTraining.CreatorCode, {
                        method: 'GET',
                        headers: { "Content-type": "application/json; charset=UTF-8" },
                    })
                        .then(res => res.json())
                        .then(response => {
                            this.sendPushNotification(response, "one of your group members has canceled");
                        })
                        .catch(error => console.warn('Error:', error.message));
                }
                else {
                    response.map((user) => this.sendPushNotification(user.Token, "Your group training has been canceled"));
                }
            })
            .catch(error => console.warn('Error:', error.message));
        this.props.refresh("future");
    }


    getCreatorDetails(creatorCode) {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/ShowProfile?UserCode=' + creatorCode, {

            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                return response;
            })
            .catch(error => console.warn('Error:', error.message));
    }


    UNSAFE_componentWillMount() {
        coupleTrainingAddresses = [];
        groupTrainingAddresses = [];
        coupleForecasts = [];
        groupForecasts = [];
        this.getCoupleAdresses();
        this.getGroupsAdresses();
    }


    getCoupleAdresses() {

        this.props.FutureCoupleTrainings.map((x) => {
            this.getAddress(x.Latitude, x.Longitude, true)
            this.getWeather(x.Latitude, x.Longitude, x.TrainingTime, true)
        });
    }

    getGroupsAdresses() {
        this.props.FutureGroupTrainings.map((x) => {
            this.getAddress(x.Latitude, x.Longitude, false)
        });

        this.props.FutureGroupTrainings.map((x) => {
            this.getWeather(x.Latitude, x.Longitude, x.TrainingTime, false)
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


    renderFutureCoupleTrainings(x, index) {

        return (
            <View
                style={styles.trainingCard}
                key={index}
            >
                <View style={styles.trainingDetails}>
                    <View style={{ marginLeft: 15 }}>
                        <Avatar
                            small
                            rounded
                            source={{ uri: x.PartnerPicture.toString() }}
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('UserProfile', { UserCode: x.PartnerUserCode })}
                        />
                    </View>

                    <View style={styles.training}>
                        <View style={styles.timeView}>
                            <Text style={styles.trainingTimeText}>
                                {this.setTime(x.TrainingTime)}
                            </Text>
                            <View style={styles.forcastView}>
                                <Image style={styles.forcastImage} source={{ uri: "https://openweathermap.org/img/w/" + coupleForecasts[index].icon + ".png" }}></Image>
                                <Text style={styles.forcastText}>{Math.floor(coupleForecasts[index].temp) + "°c"}</Text>
                            </View>


                        </View>
                        <Text
                            style={styles.nameText}
                        >
                            {x.PartnerFirstName + ' ' + x.PartnerLastName + ', ' + x.PartnerAge}
                        </Text>
                        <View style={styles.locationView}>
                            <Icon1 style={styles.locationIcon} name='location-pin' color='gray' textAlign='center' size={20} onPress={() => this.props.setLatLon(x.Latitude, x.Longitude)}></Icon1>
                            <Text
                                style={styles.locationText}
                            >

                                {((coupleTrainingAddresses[index]).length > 25) ?
                                    (((coupleTrainingAddresses[index]).substring(0, 25 - 3)) + '...') :
                                    coupleTrainingAddresses[index]}

                            </Text>
                        </View>
                        {x.WithTrainer ?
                            <Text
                                style={styles.priceText}
                            >
                                {x.Price + "$"}
                            </Text> : null}

                    </View>
                </View>
                <View
                    style={styles.trainingRightView}
                >
                    {x.StatusCode != 2 ?
                        <View style={styles.rightSideView}>
                            <View style={styles.navigationAppsView}>
                                <NavigationApps
                                    iconSize={20}
                                    row
                                    viewMode={'sheet'}
                                    actionSheetBtnCloseTitle={'Cancel'}
                                    actionSheetBtnOpenTitle={<Icon style={{ flex: 1 }} name='car' color='black' size={17}></Icon>}
                                    actionSheetBtnOpenStyle={{ backgroundColor: 'rgba(222,222,222,1)', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
                                    address={coupleTrainingAddresses[index]} // address to navigate by for all apps 
                                    waze={{ lat: '32.6854', lon: '34.5523', action: actions.navigateByAddress }} // specific settings for waze
                                    googleMaps={{ lat: '', lon: '', action: actions.navigateByAddress }} // specific settings for google maps
                                    maps={{ lat: '32.6854', lon: '34.5523', action: actions.navigateByAddress }} // specific settings for maps

                                />
                            </View>
                            <TouchableOpacity
                                style={styles.chatButton}
                                onPress={() => {
                                    this.props.navigation.navigate('Chat', { UserCode: this.props.UserCode, PartnerUserCode: x.PartnerUserCode, FullName: x.PartnerFirstName + " " + x.PartnerLastName, Picture: x.PartnerPicture })
                                }}
                            >
                                <Icon2 name="message1" color="green" size={20} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    this.cancelCoupleTraining(x)

                                }}
                            >
                                <Icon2 name="close" color="red" size={20} />
                            </TouchableOpacity>

                        </View> : <Text style={styles.canceledText}>Canceled</Text>}
                </View>
                <View>



                </View>
            </View>

        )
    }


    renderFutureGroupTrainings(x, index) {
        var CreatorDetails = this.getCreatorDetails(x.CreatorCode);

        return (

            <View
                key={index}
                style={styles.trainingCard}
            >
                <View style={styles.trainingDetails}>
                    <View style={{ marginLeft: 15 }}>
                        <Avatar
                            small
                            rounded
                            source={x.WithTrainer ? require("../../Images/GroupWithTrainer.png") : require("../../Images/GroupWithPartners.png")}
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('GroupProfile', { GroupCode: x.TrainingCode })}
                        />
                    </View>
                    <View style={styles.columnView}>
                        <View style={styles.trainingTimeView}>
                            <Text
                                style={styles.trainingTimeText}
                            >
                                {this.setTime(x.TrainingTime)}

                            </Text>
                            <View style={styles.timeView}>
                                <Image style={styles.forcastImage} source={{ uri: "https://openweathermap.org/img/w/" + groupForecasts[index].icon + ".png" }}></Image>
                                <Text style={styles.forcastText}>{Math.floor(groupForecasts[index].temp) + "°c"}</Text>
                            </View>
                        </View>

                        <View style={styles.groupHeadlineView}>
                            <Text
                                style={styles.groupHeadline}
                            >
                                {x.SportCategory} Group
                    </Text>

                        </View>

                        <View style={styles.locationView}>
                            <Icon1 style={styles.locationIcon} name='location-pin' color='gray' textAlign='center' size={20} onPress={() => this.props.setLatLon(x.Latitude, x.Longitude)}></Icon1>
                            <Text
                                style={styles.locationText}
                            >

                                {((groupTrainingAddresses[index]).length > 25) ?
                                    (((groupTrainingAddresses[index]).substring(0, 25 - 3)) + '...') :
                                    groupTrainingAddresses[index]}

                            </Text>
                        </View>
                        <Text
                            style={styles.groupPriceText}
                        >
                            {x.WithTrainer ? x.Price + "$" : null}
                        </Text>

                    </View>

                </View>
                <View
                    style={styles.detailsContainer}
                >
                    {x.StatusCode != 2 ?
                        <View style={styles.rightSideView}>
                            <View style={styles.navigationAppsView}>
                                <NavigationApps
                                    iconSize={20}
                                    row
                                    viewMode={'sheet'}
                                    actionSheetBtnCloseTitle={'Cancel'}
                                    actionSheetBtnOpenTitle={<Icon style={{ flex: 1 }} name='car' color='black' size={17}></Icon>}
                                    actionSheetBtnOpenStyle={{ backgroundColor: 'rgba(222,222,222,1)', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
                                    address={coupleTrainingAddresses[index]} // address to navigate by for all apps 
                                    waze={{ lat: '32.6854', lon: '34.5523', action: actions.navigateByAddress }} // specific settings for waze
                                    googleMaps={{ lat: '', lon: '', action: actions.navigateByAddress }} // specific settings for google maps
                                    maps={{ lat: '32.6854', lon: '34.5523', action: actions.navigateByAddress }} // specific settings for maps

                                />
                            </View>


                            {this.props.UserCode != x.CreatorCode && this.state.creatorDetails.length != 0 ?
                                <TouchableOpacity
                                    style={styles.chatButton}
                                    onPress={() => {
                                        this.props.navigation.navigate('Chat', { UserCode: this.props.UserCode, PartnerUserCode: x.CreatorCode, FullName: CreatorDetails.FirstName + " " + CreatorDetails.LastName, Picture: CreatorDetails.Picture })
                                    }}
                                >
                                    <Icon2 name="message1" color="green" size={20} />
                                </TouchableOpacity> : null}

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => this.cancelGroupParticipant(x)}
                            >
                                <Icon2 name="close" color="red" size={20} />
                            </TouchableOpacity>
                        </View> : <Text style={styles.canceledText}>Canceled</Text>}


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
                coupleTrainingAddresses.push(address);
            else groupTrainingAddresses.push(address);

            if (coupleTrainingAddresses.length == this.props.FutureCoupleTrainings.length && groupTrainingAddresses.length == this.props.FutureGroupTrainings.length) {
                this.setState({ status: 1 });
            }
        }, 3000);


    }

    getWeather(lat, lon, time, couple) {
        hour = this.setTime(time).split(":")[0];
        let index = Math.floor(((hour - new Date().getHours()) / 3));
        // Construct the API url to call
        let url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + "&units=metric&appid=5c2433d8113849df4c21949af64f6f74";
        forecast = {
            icon: '',
            temp: ''
        }
        // Call the API, and set the state of the weather forecast
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.warn(data.list[index].weather[0].icon)
                forecast = {
                    icon: data.list[index].weather[0].icon,
                    temp: data.list[index].main.temp
                }

            })
            .catch(error => console.warn('Error:', error.message));



        setTimeout(() => {
            if (couple) {
                coupleForecasts.push(forecast);
            }
            else groupForecasts.push(forecast);
            if (coupleForecasts.length == this.props.FutureCoupleTrainings.length && groupForecasts.length == this.props.FutureGroupTrainings.length) {

                this.setState({ forecastStatus: 1 })
            }
        }, 3000);


    }

    render() {
        return (
            <View style={styles.container}>


                <View style={styles.headerContainer}>
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => this.props.closeListView()}></Icon>
                    <Text style={styles.headline}>Future Trainings</Text>
                </View>
                {(this.props.FutureCoupleTrainings.length != 0 || this.props.FutureGroupTrainings.length != 0) ?
                    <ScrollView style={styles.scrollView}>
                        {this.state.status == 1 && this.state.forecastStatus == 1 ?
                            <View>
                                {this.props.FutureCoupleTrainings.map((x, index) => {
                                    return (<View key={index}>{this.renderFutureCoupleTrainings(x, index)}</View>)
                                }
                                )}

                                {this.props.FutureGroupTrainings.map((x, index) => {
                                    return (<View key={index}>{this.renderFutureGroupTrainings(x, index)}</View>)
                                }
                                )}
                            </View>
                            : <ActivityIndicator style={{ marginTop: 20 }} size="small" color="gray" />}


                    </ScrollView> : < Text style={styles.noTrainingText}>No Future Trainings</Text>}

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
        zIndex: 2,
        top: 90,
        width: SCREEN_WIDTH
    },
    training:
    { flex: 1, flexDirection: "column", justifyContent: 'center' },
    forcastView:
    { flex: 1, flexDirection: 'row', justifyContent: 'center' },
    trainingRightView:
    {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10,
        flex: 1
    },
    headerContainer:
    {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },

    scrollView:
    {
        flex: 1,
        marginBottom: 20,
        maxHeight: 200
    },

    noTrainingText:
    {
        fontFamily: 'regular',
        fontSize: 15,
        textAlign: 'center',
        color: 'gray'
    },


    trainingDetails:
    {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    trainingTimeText:
    {
        fontFamily: 'regular',
        fontSize: 17,
        marginLeft: 10,
        color: 'green',
        flex: 1
    },

    forcastImage:
    {
        width: 30,
        height: 30,
        marginTop: -5
    },
    forcastText:
    {
        fontSize: 12,
        fontFamily: 'light',
        marginTop: 2
    },
    trainingCard: {
        marginHorizontal: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1
    },
    timeView:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    nameText:
    {
        fontFamily: 'regular',
        fontSize: 15,
        marginLeft: 10,
        color: 'gray',
        flex: 1
    },
    locationIcon:
    {
        flex: 1,
        marginLeft: 15
    },
    locationView:
    {
        flex: 1,
        flexDirection: 'row',
        marginRight: 25,
        justifyContent: 'center'
    },
    locationText:
    {
        fontFamily: 'regular',
        fontSize: 12,
        marginLeft: 10,
        color: 'gray',
        flex: 5,
        justifyContent: 'center',
        textAlign: 'right',
        marginTop: 3
    },
    priceText: {
        fontFamily: 'light',
        fontSize: 12,
        marginLeft: 10,
        color: 'blue',
    },
    groupPriceText:
    {
        fontFamily: 'light',
        fontSize: 13,
        marginLeft: 2,
        color: 'blue',
        flex: 1,
    },
    rightSideView:
    {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center'
    },
    navigationAppsView:
    {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    button:
    {
        backgroundColor: 'rgba(222,222,222,1)',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 23
    },
    cancelButton:
    {
        backgroundColor: 'rgba(222,222,222,1)',
        width: 28,
        height: 28,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButton:
    {
        backgroundColor: 'rgba(222,222,222,1)',
        width: 28,
        height: 28,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 23,
    },
    canceledText:
    {
        fontFamily: 'bold',
        color: 'red'
    },
    closeIcon: {
        left: 20,
        flex: 1
    },
    groupHeadline:
    {
        fontFamily: 'regular',
        fontSize: 15,
        marginLeft: 10,
        color: 'gray',
        flex: 1,
    },
    groupHeadlineView:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    detailsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10,
        flex: 1
    },

    trainingTimeView:
    {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    columnView:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    headline: {
        flex: 3,
        fontSize: 23,
        color: '#f34573',
        fontFamily: 'regular',
        marginLeft: 15
    },
})