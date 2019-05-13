import React from 'react';
import { Text, View, Dimensions, Image, StyleSheet } from 'react-native';
import { MapView } from 'expo';
import CoupleResultCallOut from '../Components/CoupleResultCallOut';

const { Marker } = MapView;

_Latitude = 0;
_Longitude = 0;

const SCREEN_WIDTH = Dimensions.get('window').width;

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
          <Image source={require('../../Images/MapMarker.png')} style={{ width: 40, height: 40 }} />
          <MapView.Callout>
                  <CoupleResultCallOut ReceiverCode={2} SenderCode={1} FirstName={'dana'} Distance={8} Age={26} Picture={'http://proj.ruppin.ac.il/bgroup79/test1/tar6/uploadFiles/photo_4_11_2019_6-22-00_PM.png'}></CoupleResultCallOut>
                </MapView.Callout>
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
              <Image source={require('../../Images/MapMarker.png')} style={{ width: 40, height: 40 }} />
                <MapView.Callout>
                  <CoupleResultCallOut ReceiverCode={data.UserCode} SenderCode={this.props.SenderCode} FirstName={data.FirstName} Distance={data.Distance} Age={data.Age} Picture={data.Picture}></CoupleResultCallOut>
                </MapView.Callout>
              </MapView.Marker>
            )
            )}
          {this.props.groupResults == null ? null :
            this.props.groupResults.map(data => (
              <MapView.Marker
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
                title={'Group'}
              //description={'Time: '+data.TrainingTime}
              //image={require('../assets/icon.png')}
              >
              <Image source={require('../../Images/MapMarker.png')} style={{ width: 40, height: 40 }} />
              </MapView.Marker>
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

