import React from 'react';
import { Text, View, Image, TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native';
import { Font } from 'expo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';

_Latitude = 0;
_Longitude = 0;

export default class FutureTrainingsCallOut extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fontLoaded: false,
            creatorDetails: []
        }

        this.sendPushNotification = this.sendPushNotification.bind(this);
        this.cancelCoupleTraining = this.cancelCoupleTraining.bind(this);
        this.cancelGroupParticipant = this.cancelGroupParticipant.bind(this);
        this.getCreatorDetails = this.getCreatorDetails.bind(this);
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

    cancelCoupleTraining() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CancelCoupleTraining?CoupleTrainingCode=' + this.props.Data.TrainingCode + '&UserCode=' + this.props.UserCode, {
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
                        this.sendPushNotification(response);
                    })
                    .catch(error => console.warn('Error:', error.message));
            })
            .catch(error => console.warn('Error:', error.message));
        this.props.refresh("future");
    }


    cancelGroupParticipant() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CancelGroupParticipant?GroupTrainingCode=' + this.props.Data.TrainingCode + '&UserCode=' + this.props.UserCode, {
            body: JSON.stringify({}),
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                alert("You left the group :(");
                if (response.length == 0) {
                    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetToken?UserCode=' + this.props.Data.CreatorCode, {
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



    sendPushNotification(ReceiverToken) {
        var pnd = {
            to: ReceiverToken,
            title: 'Youre Training is Canceled',
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

    getCreatorDetails(creatorCode) {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/ShowProfile?UserCode=' + creatorCode, {

            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                this.setState({ creatorDetails: response })
            })
            .catch(error => console.warn('Error:', error.message));
    }



    render() {
        if (!this.props.couple)
            this.getCreatorDetails(this.props.Data.CreatorCode)
        return (
            <View style={styles.container}>
                {this.state.fontLoaded ?
                    <View style={styles.flex}>
                        {this.props.couple ?
                            <View style={styles.rateView}>
                                <Image style={styles.starImage} source={require('../../Images/SelectedStar.png')}></Image>
                                <Text style={styles.rateText}> {this.props.Data.Rate}</Text>
                            </View> : null}


                        {this.props.Data.WithTrainer ?
                            <View style={styles.trainerView}>

                                <Icon2 name={'whistle'} size={20} color={'blue'} style={styles.trainerIcon} ></Icon2>

                            </View> : null}


                        <View style={styles.userImageView} >

                            <TouchableHighlight
                                onPress={() => {
                                    this.props.couple ?
                                        this.props.navigation.navigate('UserProfile', { UserCode: this.props.Data.PartnerCode })
                                        : this.props.navigation.navigate('GroupProfile', { GroupCode: this.props.Data.TrainingCode })
                                }
                                }>
                                <Image
                                    source={this.props.couple ? { uri: this.props.Data.PartnerPicture.toString() } : (this.props.Data.WithTrainer ? require('../../Images/GroupWithTrainer.png') : require('../../Images/GroupWithPartners.png'))}
                                    style={styles.userImage}
                                />
                            </TouchableHighlight>


                        </View>

                        <View style={styles.trainingView}>

                            <Text style={styles.groupHeadlineText}>
                                {this.props.couple ? this.props.Data.PartnerFirstName + ", " + this.props.Data.PartnerAge
                                    : this.props.Data.SportCategory + ' Group'
                                }
                            </Text>

                            <Text style={styles.trainingTime}>
                                {(this.props.Data.TrainingTime.split(" ")[1]).split(":")[0] + ":" + (this.props.Data.TrainingTime.split(" ")[1]).split(":")[1] + " " + this.props.Data.TrainingTime.split(" ")[2]}</Text>
                            {this.props.Data.WithTrainer ?
                                <View style={styles.priceView}>
                                    <Text style={styles.priceText}>{this.props.Data.Price + "$"}</Text>
                                </View> : null}
                            <View style={styles.cancelView}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.couple ?
                                            this.cancelCoupleTraining()
                                            : this.cancelGroupParticipant()
                                    }}
                                    style={styles.cancelButton}
                                >
                                    <Icon2 name="close" color="red" size={20} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.refresh("future")
                                        this.props.couple ?
                                            this.props.navigation.navigate('Chat', { UserCode: this.props.UserCode, PartnerUserCode: this.props.Data.PartnerUserCode, FullName: this.props.Data.PartnerFirstName + " " + this.props.Data.PartnerLastName, Picture: this.props.Data.PartnerPicture })
                                            : this.props.navigation.navigate('Chat', { UserCode: this.props.UserCode, PartnerUserCode: this.props.Data.CreatorCode, FullName: this.state.creatorDetails.FirstName + " " + this.state.creatorDetails.LastName, Picture: this.state.creatorDetails.Picture })
                                    }}
                                    style={styles.cancelButton}
                                >
                                    <Icon3 name="message1" color="green" size={20} />
                                </TouchableOpacity>
                            </View>

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
    groupHeadlineText:
    {
        fontFamily: 'regular',
        fontSize: 15,
        flex: 1,
        textAlign: 'center'
    },
    trainingTime:
    {
        fontFamily: 'regular',
        fontSize: 15,
        flex: 1,
        textAlign: 'center'
    },
    trainingView:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center'
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

    cancelView:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    cancelButton:
    {
        backgroundColor: 'rgba(222,222,222,1)',
        width: 28,
        height: 28,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
})