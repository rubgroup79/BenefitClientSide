import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Foundation';

export default class PendingRequests extends Component {
    constructor(props) {
        super(props);

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

    renderPendingSuggestion(x) {
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
                    {console.warn(x.Picture)}
                    <View style={{ marginLeft: 15 }}>
                        <Avatar
                            small
                            rounded
                            source={{ uri: x.Picture.toString() }}
                            activeOpacity={0.7}
                        />
                    </View>
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
                                onPress={() => this.cancelSuggestion(x.SuggestionCode)}
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
                                onPress={() => this.replySuggestion(x.SuggestionCode, true)}
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
                                onPress={() => this.replySuggestion(x.SuggestionCode, false)}
                            >
                                <Icon2 name="close" color="red" size={20} />
                            </TouchableOpacity>
                        </View>

                    }
                </View>
            </View>

        )
    }
    render() {
        return (
            <View style={{ flex: 4, flexDirection: 'column', backgroundColor: 'rgba(222,222,222,1)', alignContent: "center" }}>
                <View style={{ flex: 0.2, flexDirection: 'column', alignContent: 'center' }}>
                    <Text style={style = styles.trainingsHeadline}>
                        Your Pending Requests
                      </Text>
                </View>

                <ScrollView style={{ flex: 1, marginBottom: 20 }}>
                    {this.props.PendingRequests.map((x) => {
                        return (<View>{this.renderPendingSuggestion(x)}</View>)
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
})