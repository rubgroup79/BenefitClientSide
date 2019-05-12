import React from 'react';
import { Text, View, Dimensions, Image, StyleSheet } from 'react-native';
import { MapView, MapMarkerWaypoint, CalloutSubview, Callout } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { Button, ButtonGroup } from 'react-native-elements';

const { Marker } = MapView;

_Latitude = 0;
_Longitude = 0;

const SCREEN_WIDTH = Dimensions.get('window').width;

export class CallOutCard extends React.Component {
  constructor(props) {
    super(props);

    this.sendSuggestion= this.sendSuggestion.bind(this);
    this.sendPushNotification= this.sendPushNotification.bind(this);
  }

  

  sendSuggestion() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckActiveSuggestions?SenderCode=' + this.props.SenderCode + '&ReceiverCode=' + this.props.ReceiverCode, {
      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        alert(response);
        if (response.toString()=='Suggestion Sent!')
        {
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

  sendPushNotification(ReceiverCode){
    var pnd = {
      to: ReceiverCode,
      title: 'You have a new suggestion!',
      body: '',
      badge: 1
    }
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/sendpushnotification', {
      body:JSON.stringify(pnd),
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      // .then(res => res.json())
      .then(response => {
      })
      .catch(error => console.warn('Error:', error.message));
  }
  

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 2, flexDirection: 'column', justifyContent: "center" }}>
          <Image
            //source={{uri: this.props.Picture}}
            source={{uri:this.props.Picture.toString()}}
            style={{ width: 35, height: 35, borderRadius:18 }}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: "center" }}>
          <Text style={{ fontSize: 10 }}>{this.props.FirstName + " " + this.props.LastName + ", " + this.props.Age}</Text>
          <Text style={{ fontSize: 10 }}>{(Math.floor(this.props.Distance * 10) / 10).toString() + ' KM away from you'}</Text>
        </View>
        <Button
          title="Send Suggestion"
          titleStyle={{ fontWeight: 'bold', fontSize: 10 }}
          onPress={() => { this.sendSuggestion() }}
          linearGradientProps={{
            colors: ['#FF9800', '#F44336'],
            start: [1, 0],
            end: [0.2, 0],
          }}
          buttonStyle={{
            borderWidth: 0,
            borderColor: 'transparent',
            borderRadius: 20,
          }}
          containerStyle={{ marginVertical: 5, height: 30, width: 110 }}
          icon={{
            name: 'arrow-right',
            type: 'font-awesome',
            size: 10,
            color: 'white',
          }}
          iconRight
          iconContainerStyle={{ marginLeft: 5, marginRight: -10 }}
        />
      </View>
    )
  }
}

export default class LocationPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0
    }

  }

  render() {
    return (
      <View style={styles.container}>

        <MapView
          style={{
            flex: 1,
            width: Dimensions.get('window').width - 30
          }}

          region={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: 0.01322,
            longitudeDelta: 0.01321,
          }}

        >
          <MapView.Marker
            coordinate={{
              latitude: this.props.latitude,
              longitude: this.props.longitude
            }}
          // title='my place:)'
          // description='here i am'
          >

          </MapView.Marker>
          {this.props.coupleResults == null || this.props.coupleResults.length == 0 ? null :
            this.props.coupleResults.map(data => (
              <MapView.Marker
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
              //  title={data.FirstName + ' ' + data.LastName + ', ' + data.Age.toString()}
              //  description={(Math.floor(data.Distance * 10) / 10).toString() + ' KM away from you'}
              //image={require('../assets/icon.png')}

              >
                <MapView.Callout>
                  <CallOutCard ReceiverCode={data.UserCode} SenderCode={this.props.SenderCode} FirstName={data.FirstName} LastName={data.LastName} Distance={data.Distance} Age={data.Age} Picture={data.Picture}></CallOutCard>
                </MapView.Callout>
              </MapView.Marker>
            )
            )}
          {this.props.groupResults == null ? null :
            this.props.groupResults.map(data => (
              <Marker
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
                title={'Group'}
              //description={'Time: '+data.TrainingTime}
              //image={require('../assets/icon.png')}
              />
            )
            )}

        </MapView>

      </View>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    marginTop: -14,
    width: SCREEN_WIDTH + 20,

  },

  textBig: {
    fontSize: 35,
    color: 'red',
    margin: 10
  },
  textMedium: {
    fontSize: 30,
    color: 'blue'
  },
  Button: {
    backgroundColor: 'lightgray',
    padding: 20,
    borderRadius: 15
  },
  TxtInp: {
    height: 50,
    width: 200,
    borderColor: 'gray',
    borderWidth: 2,
    margin: 15,
    fontSize: 30,
    padding: 5,
    borderRadius: 5
  },
  Err: {
    color: 'red',
    margin: 15,

  },
  lblText: {
    fontSize: 30
  }
});

