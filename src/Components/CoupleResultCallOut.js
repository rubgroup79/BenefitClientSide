import React from 'react';
import { Text, View, Dimensions, Image, StyleSheet } from 'react-native';
import { MapView, MapMarkerWaypoint, CalloutSubview, Callout } from 'expo';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { Button, ButtonGroup } from 'react-native-elements';

const { Marker } = MapView;

_Latitude = 0;
_Longitude = 0;

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class CoupleResultCallOut extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     fontLoaded: false,
        // }

        this.sendSuggestion = this.sendSuggestion.bind(this);
        this.sendPushNotification = this.sendPushNotification.bind(this);
    }

    // async componentDidMount() {

    //     await Font.loadAsync({
    //         georgia: require('../../assets/fonts/Georgia.ttf'),
    //         regular: require('../../assets/fonts/Montserrat-Regular.ttf'),
    //         light: require('../../assets/fonts/Montserrat-Light.ttf'),
    //         bold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    //     });

    //     this.setState({
    //         fontLoaded: true,
    //     });

    // }

    sendSuggestion() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckActiveSuggestions?SenderCode=' + this.props.SenderCode + '&ReceiverCode=' + this.props.ReceiverCode, {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                alert(response);
                if (response.toString() == 'Suggestion Sent!') {
                    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetToken?UserCode=' + this.props.ReceiverCode, {
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
    }

    sendPushNotification(ReceiverCode) {
        var pnd = {
            to: ReceiverCode,
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
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", alignItems: "center", width: 120, height: 100 }}>
                
                <View style={{ flex: 2, flexDirection: 'row', justifyContent: "center" }}>
                    
                    <Image
                        source={{ uri: this.props.Picture.toString() }}
                        style={{ top: -8, width: 50, height: 50, borderRadius: 25 }}
                    />

                </View>
                
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center" }}>
                    
                    <Text style={{ fontSize: 15, }}>{this.props.FirstName + ", " + this.props.Age}</Text>
                    
                    <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
                        
                        <Icon style={{ flex: 1 }} name='location-pin' color='gray' textAlign='center' size={20}></Icon>
                        
                        <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>{(Math.floor(this.props.Distance * 10) / 10).toString() + ' KM'}</Text>
                    
                    </View>
                
                </View>

                <Button
                    titleStyle={{ fontWeight: 'bold', fontSize: 10 }}
                    onPress={() => { this.sendSuggestion() }}
                    buttonStyle={{
                        borderWidth: 0,
                        borderColor: 'transparent',
                        borderRadius: 20,
                        backgroundColor: '#f34573'
                    }}
                    containerStyle={{ marginVertical: 5, height: 30, width: 30, alignItems: 'center' }}
                    icon={{
                        name: 'mail',
                        type: 'Octicons',
                        size: 15,
                        color: 'white',
                    }}
                    iconContainerStyle={{ width: 20 }}
                />
                
            </View>
        )
    }
}