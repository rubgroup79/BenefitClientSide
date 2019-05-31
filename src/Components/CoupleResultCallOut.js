import React from 'react';
import { Text, View, Dimensions, Image, StyleSheet } from 'react-native';
import { MapView, MapMarkerWaypoint, CalloutSubview, Callout } from 'expo';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { Button, ButtonGroup } from 'react-native-elements';
import ActionButton from 'react-native-action-button';

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
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", alignItems: "center", width: 120, }}>
                <View  style={{flex:1, zIndex:1, top:-35, left:-25}}>
                <ActionButton
               
                    onPress={() => {
                        this.props.navigation.navigate('UserProfile', {UserCode: this.props.ReceiverCode});
                        
                    }}
                    renderIcon={() =>
                        (<Icon1
                            name="user-o"
                            size={15}
                        />)
                    }
                    buttonColor='rgba(255,255,255,0.7)'
                    size={20}
                >
                </ActionButton>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: "center", zIndex:0 }}>

                    <Image
                        source={{ uri: this.props.Picture.toString() }}
                        style={{  width: 60, height: 60, borderRadius: 30 }}
                    />

                </View>

                <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>

                    <Text style={{ fontSize: 15, flex: 1 }}>{this.props.FirstName + ", " + this.props.Age}</Text>

                    <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>

                        <Icon style={{ flex: 1, marginLeft: 30 }} name='location-pin' color='gray' textAlign='center' size={20}></Icon>

                        <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, justifyContent: 'center', marginLeft: -35 }}>{(Math.floor(this.props.Distance * 10) / 10).toString() + ' KM'}</Text>


                    </View>
                    <Button
                        style={{ flex: 1 }}
                        titleStyle={{ fontWeight: 'bold', fontSize: 10 }}
                        title={'Send Suggestion'}
                        onPress={() => { this.sendSuggestion() }}
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
        )
    }
}