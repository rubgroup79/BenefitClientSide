import React from 'react';
import { Text, View, Dimensions, Image, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import { MapView, MapMarkerWaypoint, CalloutSubview, Callout, Font } from 'expo';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import { Button, ButtonGroup } from 'react-native-elements';
import ActionButton from 'react-native-action-button';


const { Marker } = MapView;

_Latitude = 0;
_Longitude = 0;

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class CoupleResultCallOut extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fontLoaded: false,
        }

        this.sendSuggestion = this.sendSuggestion.bind(this);
        this.sendPushNotification = this.sendPushNotification.bind(this);
        this.cancelSuggestion = this.cancelSuggestion.bind(this);
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

    cancelSuggestion() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CancelSuggestion?SuggestionCode=' + this.props.Data.SuggestionCode, {

            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({}),
        })
            .then(() => {
                alert('Suggestion Canceled');
            })
            .catch(error => console.warn('Error:', error.message));
    }


    sendSuggestion() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckActiveSuggestions?SenderCode=' + this.props.UserCode + '&ReceiverCode=' + this.props.Data.UserCode, {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                alert(response);
                if (response.toString() == 'Suggestion Sent!') {
                    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetToken?UserCode=' + this.props.Data.UserCode, {
                        method: 'GET',
                        headers: { "Content-type": "application/json; charset=UTF-8" },
                    })
                        .then(res => res.json())
                        .then(response => {
                            this.sendPushNotification(response);
                        })
                        .catch(error => console.warn('Error:', error.message));
                }

            })
            .catch(error => console.warn('Error:', error.message));

        this.props.refresh("search");
    }

    replySuggestion(reply) {

        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/ReplySuggestion?SuggestionCode=' + this.props.Data.SuggestionCode + '&Reply=' + reply, {

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
            this.props.refresh("pending");
    }




    sendPushNotification(ReceiverToken) {
        var pnd = {
            to: ReceiverToken,
            title: 'You have a new suggestion!',
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


    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", alignItems: "center", width: 150, }}>
                {this.state.fontLoaded ?
                    <View style={{ flex: 1 }}>

                        <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', top: 0, left: -35 }}>

                            <Image style={{ height: 15, width: 15 }} source={require('../../Images/SelectedStar.png')}></Image>
                            <Text style={{ fontFamily: 'light', fontSize: 12 }}> {this.props.Data.Rate}</Text>

                        </View>

                        {this.props.Data.IsTrainer ? <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', top: 0, left: 90 }}>

                            <Icon2 name={'whistle'} size={20} color={'blue'} style={{ transform: [{ rotate: '-30deg' }] }} ></Icon2>

                        </View> : null}


                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: "center", zIndex: 0 }} >

                            <TouchableHighlight
                                onPress={() => {
                                    console.warn('g');
                                    this.props.navigation.navigate('UserProfile', { UserCode: this.props.Data.ReceiverCode });
                                }
                                }>
                                <Image

                                    source={{ uri: this.props.Data.Picture.toString() }}
                                    style={{ width: 60, height: 60, borderRadius: 30 }}
                                />
                            </TouchableHighlight>


                        </View>

                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>

                            <Text style={{ fontFamily: 'regular', fontSize: 15, flex: 1, textAlign: 'center' }}>{this.props.Data.FirstName + ", " + this.props.Data.Age}</Text>

                            {this.props.Data.IsTrainer ? <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'row' }}>

                                <Text style={{ fontFamily: 'regular', color: 'blue' }}>{this.props.Data.Price + "$"}</Text>
                            </View> : null}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                                {this.props.type == 1 ? <View style={{ flex: 1, alignItems: 'center' }}>

                                    <Button
                                        onPress={() => { this.sendSuggestion() }}
                                        title={'Send Suggestion'}
                                        titleStyle={{ fontFamily: 'regular', fontSize: 12, marginLeft: 5, marginTop: -3, }}
                                        buttonStyle={{

                                            borderWidth: 0,
                                            borderColor: 'transparent',
                                            borderRadius: 20,
                                            backgroundColor: '#f34573'
                                        }}
                                        containerStyle={{ height: 30, width: 130, alignItems: 'center' }}
                                        icon={() => <Icon1 name="paper-plane" size={15} color={'white'}></Icon1>}


                                    />
                                </View> : null}

                                {this.props.type == 2 ? <View style={{ flex: 1, alignItems: 'center' }}>

                                    {this.props.Data.SenderCode == this.props.UserCode ?

                                        <TouchableOpacity
                                            onPress={() => {
                                                this.cancelSuggestion()
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
                                        </TouchableOpacity> :
                                        <View style={{ flex: 1, flexDirection: 'row' }}>



                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.replySuggestion(false)
                                                   
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
                                                    this.replySuggestion(true)
                                                    this.props.refresh("pending")

                                                }}
                                            >
                                                <Icon2 name="check" color="green" size={20} />
                                            </TouchableOpacity>
                                        </View>
                                    }

                                </View> : null}

                                {this.props.type == 3 ? 
                                <View style={{ flex: 1, alignItems: 'center',justifyContent:'center' ,flexDirection:'row'}}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: 'rgba(222,222,222,1)',
                                            width: 28,
                                            height: 28,
                                            borderRadius: 100,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                           marginHorizontal: 5,
                                        }}
                                        onPress={() => {
                                            this.props.UserCode==this.props.Data.SenderCode ? partnerUserCode=this.props.Data.ReceiverCode  :  partnerUserCode=this.props.Data.SenderCode;
                                            this.props.navigation.navigate('Chat', { UserCode: this.props.UserCode, PartnerUserCode: partnerUserCode, FullName: this.props.Data.FirstName + " " + this.props.Data.LastName, Picture: this.props.Data.Picture })}
                                        }
                                            >
                                        <Icon3 name="message1" color="green" size={20} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.cancelSuggestion()
                                            this.props.refresh("approved");
                                        }}
                                        style={{
                                            backgroundColor: 'rgba(222,222,222,1)',
                                            width: 28,
                                            height: 28,
                                            borderRadius: 100,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        marginHorizontal: 5,
                                        }}
                                    >
                                        <Icon2 name="close" color="red" size={20} />
                                    </TouchableOpacity>
                                </View> 
                                : null}

                          

                            </View>
                            {this.props.type == 1 ? <View style={{ flex: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: -45, }}>

                                <Icon style={{ flex: 1 }} name='location-pin' color='gray' size={16}></Icon>

                                <Text style={{ fontSize: 10, fontFamily: 'light', flex: 4, justifyContent: 'center' }}>{(Math.floor(this.props.Data.Distance * 10) / 10).toString() + ' KM'}</Text>


                            </View> : null}


                        </View>
                    </View> : null}


            </View >

        )
    }
}