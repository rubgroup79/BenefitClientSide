import React from 'react';
import { Text, View, Dimensions, Image, TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native';
import { MapView, Font } from 'expo';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import { Button } from 'react-native-elements';


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
            <View style={styles.container}>
                {this.state.fontLoaded ?
                    <View style={styles.flex}>

                        <View style={styles.rateView}>

                            <Image style={styles.starImage} source={require('../../Images/SelectedStar.png')}></Image>
                            <Text style={styles.rateText}> {this.props.Data.Rate}</Text>

                        </View>

                        {this.props.Data.IsTrainer ?
                            <View style={styles.trainerView}>

                                <Icon2 name={'whistle'} size={20} color={'blue'} style={styles.trainerIcon} ></Icon2>

                            </View> : null}


                        <View style={styles.touchableHighlightView} >

                            <TouchableHighlight
                                onPress={() => {
                                    console.warn('g');
                                    this.props.navigation.navigate('UserProfile', { UserCode: this.props.Data.ReceiverCode });
                                }
                                }>
                                <Image

                                    source={{ uri: this.props.Data.Picture.toString() }}
                                    style={styles.userImage}
                                />
                            </TouchableHighlight>


                        </View>

                        <View style={styles.detailsView}>

                            <Text style={styles.nameText}>{this.props.Data.FirstName + ", " + this.props.Data.Age}</Text>

                            {this.props.Data.IsTrainer ?
                                <View style={styles.priceView}>

                                    <Text style={styles.priceText}>{this.props.Data.Price + "$"}</Text>
                                </View> : null}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                                {this.props.type == 1 ?
                                    <View style={styles.buttonContainer}>

                                        <Button
                                            onPress={() => { this.sendSuggestion() }}
                                            title={'Send Suggestion'}
                                            titleStyle={styles.sendSuggestion}
                                            buttonStyle={styles.sendSuggestionButton}
                                            containerStyle={styles.sendSuggestionContainer}
                                            icon={() => <Icon1 name="paper-plane" size={15} color={'white'}></Icon1>}


                                        />
                                    </View> : null}

                                {this.props.type == 2 ?
                                    <View style={styles.cancelOrApproveView}>

                                        {this.props.Data.SenderCode == this.props.UserCode ?

                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.cancelSuggestion()
                                                    this.props.refresh("pending");
                                                }}
                                                style={styles.cancelSuggestionButton}
                                            >
                                                <Icon2 name="close" color="red" size={20} />
                                            </TouchableOpacity> :
                                            <View style={styles.buttonsContainer}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.replySuggestion(false)
                                                    }}
                                                    style={styles.replySuggestionView}
                                                >
                                                    <Icon2 name="close" color="red" size={20} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.replySuggestionView}
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
                                    <View style={styles.type3ButtonsContainer}>
                                        <TouchableOpacity
                                            style={styles.sendMessageView}
                                            onPress={() => {
                                                this.props.UserCode == this.props.Data.SenderCode ? partnerUserCode = this.props.Data.ReceiverCode : partnerUserCode = this.props.Data.SenderCode;
                                                this.props.navigation.navigate('Chat', { UserCode: this.props.UserCode, PartnerUserCode: partnerUserCode, FullName: this.props.Data.FirstName + " " + this.props.Data.LastName, Picture: this.props.Data.Picture })
                                            }
                                            }
                                        >
                                            <Icon3 name="message1" color="green" size={20} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.cancelSuggestion()
                                                this.props.refresh("approved");
                                            }}
                                            style={styles.sendMessageView}
                                        >
                                            <Icon2 name="close" color="red" size={20} />
                                        </TouchableOpacity>
                                    </View>
                                    : null}



                            </View>
                            {this.props.type == 1 ? <View style={styles.distanceView}>

                                <Icon style={styles.flex} name='location-pin' color='gray' size={16}></Icon>

                                <Text style={styles.distanceText}>{(Math.floor(this.props.Data.Distance * 10) / 10).toString() + ' KM'}</Text>


                            </View> : null}


                        </View>
                    </View> : null}


            </View >

        )
    }
}



const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        width: 150,
    },
    flex:
    {
        flex: 1
    },
    rateView:
    {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: -35
    },
    starImage:
    {
        height: 15,
        width: 15
    },
    rateText:
    {
        fontFamily: 'light',
        fontSize: 12
    },
    trainerView:
    {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 90
    },
    trainerIcon:
    {
        transform: [{ rotate: '-30deg' }]
    },

    userImageView:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        zIndex: 0
    },
    userImage:
    {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    nameText:
    {
        fontFamily: 'regular',
        fontSize: 15,
        flex: 1,
        textAlign: 'center'
    },
    priceText:
    {
        fontFamily: 'regular',
        color: 'blue'
    },
    priceView:
    {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    detailsView:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center'
    },
    sendSuggestionButton:
    {

        borderWidth: 0,
        borderColor: 'transparent',
        borderRadius: 20,
        backgroundColor: '#f34573'
    },
    sendSuggestionContainer:
    {
        height: 30,
        width: 130,
        alignItems: 'center'
    },
    buttonContainer:
    {
        flex: 1,
        alignItems: 'center'
    },

    cancelOrApproveView:
    {
        flex: 1,
        alignItems:'center'
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
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',

    },
    replySuggestionView:
    {
        backgroundColor: 'rgba(222,222,222,1)',
        width: 28,
        height: 28,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    sendMessageView:
    {
        backgroundColor: 'rgba(222,222,222,1)',
        width: 28,
        height: 28,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    distanceText:
    {
        fontSize: 10,
        fontFamily: 'light',
        flex: 4,
        justifyContent: 'center'
    },
    distanceView:
    {
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -45,
    },

    type3ButtonsContainer:
    {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    touchableHighlightView:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        zIndex: 0
    },
})