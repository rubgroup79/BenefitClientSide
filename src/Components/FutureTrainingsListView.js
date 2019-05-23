import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity,Dimensions } from 'react-native';
import { Avatar, } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Foundation';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class FutureTrainingsListView extends Component {
    constructor(props) {
        super(props);

    }
    
    
    cancelCoupleTraining(CoupleTrainingCode){
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CancelCoupleTraining?CoupleTrainingCode='+CoupleTrainingCode+'&UserCode='+this.props.UserCode, {
      body:JSON.stringify({}),
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
          alert("The training is canceled!");
          console.warn(response);
          fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetToken?UserCode=' + response, {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
          })
            .then(res => res.json())
            .then(response => {
                console.warn(response);
              this.sendPushNotification(response);
            })
            .catch(error => console.warn('Error:', error.message));
      })
      .catch(error => console.warn('Error:', error.message));
  }

  
  
  sendPushNotification(Token){
    var pnd = {
      to: Token,
      title: 'Your partner has canceled the training',
      body: '',
      badge: 1
    }
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/sendpushnotification', {
      body:JSON.stringify(pnd),
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(response => {
      })
      .catch(error => console.warn('Error:', error.message));
  }
    

    renderFutureCoupleTrainings(x) {
        return (
            <View
                style={styles.trainingCard}
            >
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ marginLeft: 15 }}>
                        <Avatar
                            small
                            rounded
                            source={{ uri: x.PartnerPicture.toString() }}
                            activeOpacity={0.7}
                        />
                    </View>

                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text
                            style={{
                                fontFamily: 'regular',
                                fontSize: 17,
                                marginLeft: 10,
                                color: 'green',
                                flex: 1
                            }}
                        >
                            {x.TrainingTime}

                        </Text>
                        <Text
                            style={{
                                fontFamily: 'regular',
                                fontSize: 15,
                                marginLeft: 10,
                                color: 'gray',
                                flex: 1
                            }}
                        >
                            {x.WithTrainer == 1 ? "Trainer: " : null} {x.PartnerFirstName + ' ' + x.PartnerLastName + ', ' + x.PartnerAge}
                        </Text>

                        {x.WithTrainer ?
                            <View
                                style={{
                                    backgroundColor: 'rgba(222,222,222,1)',
                                    width: 60,
                                    height: 20,
                                    borderRadius: 5,
                                    marginHorizontal: 10,
                                    flexDirection: 'row',
                                    flex: 1,
                                    //alignContent:'center',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text style={{ flex: 1, textAlign: 'center', marginLeft:8 }}>{x.Price}</Text>
                                <Icon3 style={{ flex: 1, textAlign: 'center' }} name="dollar" color="blue" size={20} />

                            </View>
                            : null
                        }

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
                            onPress={() => alert('go to chat')}
                        >
                            <Icon2 name="message1" color="green" size={20} />
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
                            onPress={() => this.cancelCoupleTraining(x.TrainingCode)}
                        >
                            <Icon2 name="close" color="red" size={20} />
                        </TouchableOpacity>
                    </View>


                </View>
            </View>

        )
    }


    renderFutureGroupTrainings(x) {
        return (
            <View
                style={styles.trainingCard}
            >
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ marginLeft: 15 }}>
                        <Avatar
                            small
                            rounded
                            source={require("../../Images/GroupAvatar.png")}
                            activeOpacity={0.7}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text
                            style={{
                                fontFamily: 'regular',
                                fontSize: 17,
                                marginLeft: 10,
                                color: 'green',
                                flex: 1
                            }}
                        >
                            {x.TrainingTime}

                        </Text>
                        <Text
                            style={{
                                fontFamily: 'regular',
                                fontSize: 15,
                                marginLeft: 10,
                                color: 'gray',
                                flex: 1
                            }}
                        >
                            {x.SportCategory} Group
                    </Text>
                    {x.WithTrainer ?
                            <View
                                style={{
                                    backgroundColor: 'rgba(222,222,222,1)',
                                    width: 60,
                                    height: 20,
                                    borderRadius: 5,
                                    marginHorizontal: 10,
                                    flexDirection: 'row',
                                    flex: 1,
                                    //alignContent:'center',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text style={{ flex: 1, textAlign: 'center', marginLeft:8 }}>{x.Price}</Text>
                                <Icon3 style={{ flex: 1, textAlign: 'center' }} name="dollar" color="blue" size={20} />

                            </View>
                            : null
                        }
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
                            onPress={() => alert('go to chat')}
                        >
                            <Icon2 name="message1" color="green" size={20} />
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
                            //onPress={() => this.replySuggestion(x.SuggestionCode, false)}
                        >
                            <Icon2 name="close" color="red" size={20} />
                        </TouchableOpacity>
                    </View>


                </View>
            </View>

        )
    }


    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.9)', alignContent: "center", position:'absolute', zIndex:2, top:90, width:SCREEN_WIDTH }}>
                {/* <View style={{ flex: 0.2, flexDirection: 'column', alignContent: 'center' }}>
                    <Text style={style = styles.trainingsHeadline}>
                        Your Future Trainings
                      </Text>
                </View> */}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => this.props.closeListView()}></Icon>
                    <Text style={styles.headline}>Future Trainings</Text>
                </View>

                <ScrollView style={{ flex: 1, marginBottom: 20 }}>
                    {this.props.FutureCoupleTrainings.map((x) => {
                        return (<View>{this.renderFutureCoupleTrainings(x)}</View>)
                    }
                    )}

                    {this.props.FutureGroupTrainings.map((x) => {
                        return (<View>{this.renderFutureGroupTrainings(x)}</View>)
                    }
                    )}

                </ScrollView>

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

    trainingCard: {
        height: 80,
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
    closeIcon: {
        left: 20,
        flex:1
    },
    headline: {
        flex: 3,
        fontSize: 23,
        color: '#f34573',
        fontFamily: 'regular',
    },
})