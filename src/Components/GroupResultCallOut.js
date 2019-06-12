import React from 'react';
import { Text, View, Dimensions, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { MapView, MapMarkerWaypoint, CalloutSubview, Callout, Font } from 'expo';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, ButtonGroup } from 'react-native-elements';
import ActionButton from 'react-native-action-button';


const { Marker } = MapView;

_Latitude = 0;
_Longitude = 0;

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class GroupResultCallOut extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fontLoaded: false,
        }

        this.joinGroup = this.joinGroup.bind(this);
        this.sendPushNotification = this.sendPushNotification.bind(this);
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

    joinGroup() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/JoinGroup?UserCode=' + this.props.UserCode + '&GroupTrainingCode=' + this.props.Data.TrainingCode, {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })

            .then(() => {
                fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetToken?UserCode=' + this.props.Data.CreatorCode, {
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


    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", alignItems: "center", width: 150, }}>
                {this.state.fontLoaded ? 
                <View style={{flex:1}}>


                    {this.props.Data.WithTrainer ? <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', top: 0, left: 90 }}>

                        <Icon2 name={'whistle'} size={20} color={'blue'} style={{ transform: [{ rotate: '-30deg'}]}} ></Icon2>

                    </View> : null}


                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "center", zIndex: 0 }} >

                        <TouchableHighlight
                            onPress={() => {
                                this.props.navigation.navigate('GroupProfile', { GroupCode: this.props.Data.TrainingCode });
                            }
                            }>
                            <Image

                                source={this.props.Data.WithTrainer ? require('../../Images/GroupWithTrainer.png'): require('../../Images/GroupWithPartners.png') }
                                style={{ width: 60, height: 60, borderRadius: 30 }}
                            />
                        </TouchableHighlight>


                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>

                        <Text style={{ fontFamily: 'regular', fontSize: 15, flex: 1, textAlign: 'center' }}>{this.props.Data.SportCategory + " Group" }</Text>

                        {this.props.Data.WithTrainer ? <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'row' }}>

                        <Text style={{ fontFamily: 'regular', color: 'blue' }}>{this.props.Data.Price + "$"}</Text>
                        </View> : null}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            
                            <View style={{ flex: 1, alignItems: 'center' }}>

                                <Button
                                    onPress={() => { this.joinGroup() }}
                                    title={'Join Group'}
                                    titleStyle={{fontFamily:'regular', fontSize:12, marginLeft:5,  marginTop:-3,}}
                                    buttonStyle={{
                                       
                                        borderWidth: 0,
                                        borderColor: 'transparent',
                                        borderRadius: 20,
                                        backgroundColor: '#f34573'
                                    }}
                                    containerStyle={{ height: 30, width: 130, alignItems: 'center' }}
                                    icon={() => <Icon1 name="paper-plane" size={15} color={'white'}></Icon1>}


                                />
                            </View>

                        </View>
                        <View style={{ flex: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: -45, }}>

                                <Icon style={{ flex: 1 }} name='location-pin' color='gray' size={16}></Icon>

                                <Text style={{ fontSize: 10, fontFamily: 'light', flex: 4, justifyContent: 'center' }}>{(Math.floor(this.props.Data.Distance * 10) / 10).toString() + ' KM'}</Text>


                            </View>


                    </View>
                </View> : null}


            </View >

        )
    }
}