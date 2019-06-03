import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity,Dimensions } from 'react-native';
import { Avatar, } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Foundation';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class ApprovedRequestsListView extends Component {
  constructor(props) {
    super(props);

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

  renderApprovedSuggestions(x) {
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
              onPress={() => this.cancelSuggestion(x.SuggestionCode)}
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


<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => this.props.closeListView()}></Icon>
                    <Text style={styles.headline}>Approved Requests</Text>
                </View>
                {this.props.ApprovedRequests.length!=0 ?  
        <ScrollView style={{ flex: 1, marginBottom: 20 }}>
          {this.props.ApprovedRequests.map((x, index) => {
            return (<View key={index}>{this.renderApprovedSuggestions(x)}</View>)
          }
          )}

        </ScrollView>: <Text style={{fontFamily:'regular', fontSize:15, textAlign:'center', color:'gray'}}>No Approved Requests</Text>}  



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
    flex:1
},
headline: {
    flex: 3,
    fontSize: 23,
    color: '#f34573',
    fontFamily: 'regular',
},
})