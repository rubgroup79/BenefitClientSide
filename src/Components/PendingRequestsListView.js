import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Avatar, } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Foundation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';


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

        {
            this.props.PendingRequests.map((x, index) => {
                this.getAddress(x.Latitude, x.Longitude)
            })
        }
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
                style={{
                    height: 60,
                    marginHorizontal: 10,
                    marginTop: 10,
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
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text
                            style={{
                                fontFamily: 'regular',
                                fontSize: 15,
                                marginLeft: 10,
                                color: 'gray',
                            }}
                        >
                            {x.FirstName + ' ' + x.LastName + ', ' + x.Age}
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row', marginRight: 25, justifyContent: 'center' }}>
                            <Icon1 style={{ flex: 1, marginLeft: 15 }} name='location-pin' color='gray' textAlign='center' size={20} onPress={() => this.props.setLatLon(x.Latitude, x.Longitude)}></Icon1>

                            <Text
                                style={{
                                    fontFamily: 'regular',
                                    fontSize: 12,
                                    marginLeft: 10,
                                    color: 'gray',
                                    flex: 6,
                                    justifyContent: 'center',
                                    textAlign: 'right',
                                    marginTop: 3
                                }}
                            >
                                {((addresses[index]).length > 25) ?
                                    (((addresses[index]).substring(0, 25 - 3)) + '...') :
                                    addresses[index]}

                            </Text>
                        </View>
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


                    {x.isTrainer ?
                        <View
                            style={{
                                backgroundColor: 'rgba(222,222,222,1)',
                                width: 28,
                                height: 28,
                                borderRadius: 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginHorizontal: 10,
                            }}
                        >
                            <Icon3 name="dollar" color="red" size={20} />
                        </View>
                        : null
                    }

                    {x.SenderCode == this.props.UserCode ?
                        (
                            <TouchableOpacity
                                onPress={() => {
                                    this.cancelSuggestion(x.SuggestionCode)
                                    this.props.refresh("pending");
                                }}
                                style={{
                                    backgroundColor: 'rgba(222,222,222,1)',
                                    width: 28,
                                    height: 28,
                                    borderRadius: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 10,
                                }}
                            >
                                <Icon2 name="close" color="red" size={20} />
                            </TouchableOpacity>

                        )
                        :
                        <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'rgba(222,222,222,1)',
                                    width: 28,
                                    height: 28,
                                    borderRadius: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 10,
                                }}
                                onPress={() => {
                                    this.replySuggestion(x.SuggestionCode, true)
                                    this.props.refresh("pending")
                                    
                                }}
                            >
                                <Icon2 name="check" color="green" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'rgba(222,222,222,1)',
                                    width: 28,
                                    height: 28,
                                    borderRadius: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 10,
                                }}
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
        var address = '';
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + 'AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q')
            .then((response) => response.json())
            .then((responseJson) => {
                address = JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'route').length > 0)[0].short_name) + ' ' +
                    JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'street_number').length > 0)[0].short_name) + ', ' +
                    JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'locality').length > 0)[0].short_name);
                address = address.replace(/"/g, '');

                addresses.push(address);

                if (addresses.length == this.props.PendingRequests.length) {
                    this.setState({ status: 1 });


                }

            });
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.9)', alignContent: "center", position: 'absolute', zIndex: 2, top: 90, width: SCREEN_WIDTH }}>
          
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => this.props.closeListView()}></Icon>
                    <Text style={styles.headline}>Pending Requests</Text>
                </View>

                {this.props.PendingRequests.length != 0 && this.state.status == 1 ?
                    <ScrollView style={{ flex: 1, marginBottom: 20 }}>
                        {this.props.PendingRequests.map((x, index) => {
                            return (<View key={index}>{this.renderPendingSuggestion(x, index)}</View>)
                        }
                        )}

                    </ScrollView> : <Text style={{ fontFamily: 'regular', fontSize: 15, textAlign: 'center', color: 'gray' }}>No Pending Requests</Text>}

            </View>

        );

    }

}


const styles = StyleSheet.create({

    trainingsHeadline: {
        flex: 1,
        fontSize: 23,
        color: 'rgba(216, 121, 112, 1)',
        fontFamily: 'regular',

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