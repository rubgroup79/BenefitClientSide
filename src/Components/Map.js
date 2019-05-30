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
          //provider = { MapView.PROVIDER_GOOGLE }
          style={{
            flex: 1,
            width: SCREEN_WIDTH + 30
          }}
          region={{
            latitude: this.props.HomeTraineeStates.latitude,
            longitude: this.props.HomeTraineeStates.longitude,
            latitudeDelta: 0.01322,
            longitudeDelta: 0.01321,
          }}

        >




          <MapView.Marker
            coordinate={{
              latitude: this.props.HomeTraineeStates.latitude,
              longitude: this.props.HomeTraineeStates.longitude
            }}
          >
            <Image source={require('../../Images/MyMarker.png')} style={{ width: 30, height: 36 }} />
            {/* <MapView.Callout>
              <CoupleResultCallOut ReceiverCode={2} SenderCode={1} FirstName={'dana'} Distance={8} Age={26} Picture={'http://proj.ruppin.ac.il/bgroup79/test1/tar6/uploadFiles/photo_5_17_2019_9-56-07_PM.jpg'}></CoupleResultCallOut>
            </MapView.Callout> */}
          </MapView.Marker>
          
          
          
          
          {(this.props.HomeTraineeStates.coupleResults != null || this.props.HomeTraineeStates.coupleResults.length != 0) && this.props.HomeTraineeStates.searchResultsMapView ?

            this.props.HomeTraineeStates.coupleResults.map(data => (
              <MapView.Marker
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
              >
               {data.IsTrainer ? <Image source={require('../../Images/TrainerMarker.png')} style={{ width: 30, height: 36 }} /> : <Image source={require('../../Images/TraineeMarker.png')} style={{ width: 30, height: 36 }} />}
                <MapView.Callout>
                  <CoupleResultCallOut ReceiverCode={data.UserCode} SenderCode={this.props.HomeTraineeStates.SenderCode} FirstName={data.FirstName} Distance={data.Distance} Age={data.Age} Picture={data.Picture}></CoupleResultCallOut>
                </MapView.Callout>
              </MapView.Marker>
            )
            ) : null}






          {this.props.HomeTraineeStates.groupResults != null && this.props.HomeTraineeStates.searchResultsMapView ? this.props.HomeTraineeStates.groupResults.map(data => (
            <MapView.Marker
              coordinate={{
                latitude: data.Latitude,
                longitude: data.Longitude
              }}
              title={'Group'}
            >
              <Image source={require('../../Images/LogoOnly.png')} style={{ width: 30, height: 25 }} />
          
            </MapView.Marker>
          )
          ) : null
          }







          {this.props.HomeTraineeStates.pendingRequestsMapView && this.props.HomeTraineeStates.pendingRequests != null ?
            this.props.HomeTraineeStates.pendingRequests.map(data => (
              <MapView.Marker
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
                title={'Pending'}
              >
                {data.WithTrainer?<Image source={require('../../Images/MapMarker.png')} style={{ width: 40, height: 50 }} /> : <Image source={require('../../Images/LogoOnly.png')} style={{ width: 40, height: 40 }} />  }
              </MapView.Marker>
            )
            )
            : null
          }






          {this.props.HomeTraineeStates.approvedRequestsMapView && this.props.HomeTraineeStates.approvedRequests != null ?
            this.props.HomeTraineeStates.approvedRequests.map(data => (
              <MapView.Marker
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
                title={'Approved'}
              >
                <Image source={require('../../Images/MapMarker.png')} style={{ width: 50, height: 50 }} />
              </MapView.Marker>
            )
            )
            : null
          }






          {this.props.HomeTraineeStates.futureTrainingsMapView && this.props.HomeTraineeStates.futureCoupleTrainings != null ?
            this.props.HomeTraineeStates.futureCoupleTrainings.map(data => (
              <MapView.Marker
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
                title={'Future Couple'}
              >
                <Image source={require('../../Images/MapMarker.png')} style={{ width: 40, height: 40 }} />
              </MapView.Marker>
            )
            )
            : null
          }






          {this.props.HomeTraineeStates.futureTrainingsMapView && this.props.HomeTraineeStates.futureGroupTrainings != null ?
            this.props.HomeTraineeStates.futureGroupTrainings.map(data => (
              <MapView.Marker
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
                title={'Future Group'}
              >
                <Image source={require('../../Images/MapMarker.png')} style={{ width: 40, height: 40 }} />
              </MapView.Marker>
            )
            )
            : null
          }





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
    backgroundColor: 'white',

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

});

