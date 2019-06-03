import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Foundation';
import Icon from 'react-native-vector-icons/FontAwesome';


const SCREEN_WIDTH = Dimensions.get('window').width;

export default class SearchResultsListView extends Component {
    constructor(props) {
        super(props);

        this.renderCoupleResults = this.renderCoupleResults.bind(this);
        this.renderGroupResults = this.renderGroupResults.bind(this);
        this.sendSuggestion=this.sendSuggestion.bind(this);
        this.sendPushNotification=this.sendPushNotification.bind(this);
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
                            this.sendPushNotification(response,  "You have a new suggestion!");
                            this.setState({});
                        })
                        .catch(error => console.warn('Error:', error.message));
                }

            })
            .catch(error => console.warn('Error:', error.message));
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
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/JoinGroup?UserCode='+ this.props.UserCode +'&GroupTrainingCode='+GroupCode , {
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
    }



    renderCoupleResults(x) {
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
                        />
                    </View>
                    <View style={{flex:1, flexDirection:'column',  justifyContent:'center'}}>
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
                    {x.IsTrainer? <Text
                        style={{
                            fontFamily: 'light',
                            fontSize: 12,
                            marginLeft: 10,
                            color: 'blue',
                        }}
                    >
                        Trainer
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
                            onPress={() => { this.sendSuggestion(x.UserCode) }}
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

    renderGroupResults(x) {
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
                        source={x.WithTrainer? require('../../Images/GroupWithTrainer.png') : require('../../Images/GroupWithPartners.png')}
                        activeOpacity={0.7}
                    />
                </View>
                <View style={{flex:1, flexDirection:'column',  justifyContent:'center'}}>
                <Text
                    style={{
                        fontFamily: 'regular',
                        fontSize: 15,
                        marginLeft: 10,
                        color: 'gray',
                    }}
                >
                    {'x.SportCategory' + ' Group'}
                </Text>
                {x.WithTrainer? <Text
                    style={{
                        fontFamily: 'light',
                        fontSize: 12,
                        marginLeft: 10,
                        color: 'blue',
                    }}
                >
                    Trainer
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
                        onPress={() => { this.joinGroup(x.TrainingCode, x.CreatorCode) }}
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
            <View style={{ flex: 1,alignItems:'center', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.9)', alignContent: "center", position: 'absolute', zIndex: 2, top: 90, width: SCREEN_WIDTH, }}>

                <View style={{ flex: 1, flexDirection: 'row', alignItems:'center' }}>
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={()=>this.props.closeListView()}></Icon>
                    <Text style={styles.headline}>Search Results</Text>
                </View>
            {this.props.CoupleResults.length!=0 || this.props.GroupResults.length!=0 ?  
                <ScrollView style={{ flex: 1, marginBottom: 20 }}>
                    {this.props.CoupleResults.map((x, index) => {
                        return (<View key={index}>{this.renderCoupleResults(x)}</View>)
                    }
                    )}
                     {this.props.GroupResults.map((x, index) => {
                        return (<View key={index}>{this.renderGroupResults(x)}</View>)
                    }
                    )}

                </ScrollView> : <Text style={{fontFamily:'regular', fontSize:15, textAlign:'center', color:'gray'}}>No Results</Text>}   
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
        marginLeft:20
    },

})