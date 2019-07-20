import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Avatar, } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocode from "react-geocode";


const SCREEN_WIDTH = Dimensions.get('window').width;
addresses = [];

export default class PendingRequestsListView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: 0
        }
        this.getAddress = this.getAddress.bind(this);
    }


    UNSAFE_componentWillMount() {
        addresses = [];

        this.props.PendingRequests.map((x, index) => {
            this.getAddress(x.Latitude, x.Longitude)
        })

    }
    replySuggestion(suggestionCode, reply) {

        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/ReplySuggestion?SuggestionCode=' + suggestionCode + '&Reply=' + reply, {

            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({}),
        })

            .then(response => {
                if (reply)
                    alert('Suggestion Accepted!');
                else alert('Suggestion Rejected!');

            })
            .catch(error => console.warn('Error:', error.message));
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

    renderPendingSuggestion(x, index) {
        return (
            <View
                style={styles.suggenstionContainer}
            >

                <View style={styles.suggestionView}>
                    <View style={styles.avatarView}>
                        <Avatar
                            small
                            rounded
                            source={{ uri: x.Picture.toString() }}
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('UserProfile', { UserCode: x.SenderCode == this.props.UserCode ? x.ReceiverCode : x.SenderCode })}
                        />
                    </View>
                    <View style={styles.detailsView}>

                        <View style={styles.nameView}>
                            {x.IsTrainer == 1 ?
                                <Icon4 name={'whistle'} size={20} color={'blue'} style={styles.trainerIcon} ></Icon4> : null}
                            <Text
                                style={styles.nameText}
                            >
                                {x.FirstName + ' ' + x.LastName + ', ' + x.Age}
                            </Text>
                        </View>

                        <View style={styles.addressView}>


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
                    style={styles.buttonView}>

                    {x.SenderCode == this.props.UserCode ?
                        (
                            <TouchableOpacity
                                onPress={() => {
                                    this.cancelSuggestion(x.SuggestionCode)
                                    this.props.refresh("pending");
                                }}
                                style={styles.button}
                            >
                                <Icon2 name="close" color="red" size={20} />
                            </TouchableOpacity>

                        )
                        :
                        <View style={styles.replyButtonsView}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    this.replySuggestion(x.SuggestionCode, true)
                                    this.props.refresh("pending")

                                }}
                            >
                                <Icon2 name="check" color="green" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    this.replySuggestion(x.SuggestionCode, false)
                                    this.props.refresh("pending");

                                }

                                }
                            >
                                <Icon2 name="close" color="red" size={20} />
                            </TouchableOpacity>
                        </View>

                    }
                </View>
            </View>

        )
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

            if (addresses.length == this.props.PendingRequests.length) {
                this.setState({ status: 1 });


            }
        }, 1000);

    }
    render() {
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => this.props.closeListView()}></Icon>
                    <Text style={styles.headline}>Pending Requests</Text>
                </View>

                {this.props.PendingRequests.length != 0 ?
                    <ScrollView style={styles.scrollView}>
                        {this.state.status == 1 ? <View>
                            {this.props.PendingRequests.map((x, index) => {
                                return (<View key={index}>{this.renderPendingSuggestion(x, index)}</View>)
                            }
                            )}
                        </View> : <ActivityIndicator style={styles.activityIndicator} size="small" color="gray" />}

                    </ScrollView> :
                    <Text style={styles.noPendingText}>No Pending Requests</Text>}

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


    header:
    {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    suggenstionContainer: {
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
    nameText:
    {
        fontFamily: 'regular',
        fontSize: 15,
        color: 'gray',
        flex: 5
    },
    nameView:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'flex-start',
        marginLeft: 10
    },
    trainerIcon:
    {
        transform: [{ rotate: '-30deg' }],
        flex: 1
    },
    addressView:
    {
        flex: 1,
        flexDirection: 'row',
        marginRight: 25,
        justifyContent: 'center'
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
    button:
    {
        backgroundColor: 'rgba(222,222,222,1)',
        width: 28,
        height: 28,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    replyButtonsView:
    {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'flex-end'
    },
    buttonView:
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
    noPendingText:
    {
        fontFamily: 'regular',
        fontSize: 15,
        textAlign: 'center',
        color: 'gray'
    },
    activityIndicator:
        { marginTop: 20 },
    scrollView:
    {
        flex: 1,
        marginBottom: 20,
        maxHeight: 200
    },
    detailsView:
    {
        flex: 1,
        flexDirection: 'column'
    },
    suggestionView:
    {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
})