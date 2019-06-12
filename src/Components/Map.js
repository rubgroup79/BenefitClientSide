import React from 'react';
import { Text, View, Dimensions, Image, StyleSheet } from 'react-native';
import { MapView } from 'expo';
import CoupleResultCallOut from '../Components/CoupleResultCallOut';
import GroupResultCallOut from '../Components/GroupResultCallOut';
import FutureTrainingsCallOut from '../Components/FutureTrainingsCallOut';
const { Marker } = MapView;

_Latitude = 0;
_Longitude = 0;

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Map extends React.Component {

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
            title="That's You!"
          >
            <Image source={require('../../Images/MyMarker.png')} style={{ width: 30, height: 36 }} />
            {/* <MapView.Callout>
              
            </MapView.Callout>  */}
          </MapView.Marker>




          {(this.props.HomeTraineeStates.coupleResults != null || this.props.HomeTraineeStates.coupleResults.length != 0) && this.props.HomeTraineeStates.searchResultsMapView ?

            this.props.HomeTraineeStates.coupleResults.map((data, index) => (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
              >
                {data.IsTrainer ? <Image source={require('../../Images/TrainerMarker.png')} style={{ width: 30, height: 36 }} /> : <Image source={require('../../Images/TraineeMarker.png')} style={{ width: 30, height: 36 }} />}
                <MapView.Callout>
                  <CoupleResultCallOut type={1} Data={data}  refresh={this.props.refresh} navigation={this.props.navigation}  UserCode={this.props.HomeTraineeStates.userCode} ></CoupleResultCallOut>
                </MapView.Callout>
              </MapView.Marker>
            )
            ) : null}






          {this.props.HomeTraineeStates.groupResults != null && this.props.HomeTraineeStates.searchResultsMapView ? this.props.HomeTraineeStates.groupResults.map((data, index) => (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: data.Latitude,
                longitude: data.Longitude
              }}
            >
              <Image source={require('../../Images/GroupMarker.png')} style={{ width: 50, height: 50 }} />
              <MapView.Callout>
                  <GroupResultCallOut type={1} refresh={this.props.refresh}  Data={data} UserCode={this.props.HomeTraineeStates.userCode}  navigation={this.props.navigation}></GroupResultCallOut>
                </MapView.Callout>
            </MapView.Marker>
          )
          ) : null
          }







          {this.props.HomeTraineeStates.pendingRequestsMapView && this.props.HomeTraineeStates.pendingRequests != null ?
            this.props.HomeTraineeStates.pendingRequests.map((data, index) => (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
                title={'Pending'}
              >
                <Image source={data.IsTrainer ? require('../../Images/TrainerMarker.png') : require('../../Images/TrainerMarker.png')} style={{ width: 30, height: 36 }} />
                <MapView.Callout>
                  <CoupleResultCallOut type={2} refresh={this.props.refresh}  Data={data} UserCode={this.props.HomeTraineeStates.userCode}  navigation={this.props.navigation}></CoupleResultCallOut>
                </MapView.Callout>
              </MapView.Marker>
            )
            )
            : null
          }






          {this.props.HomeTraineeStates.approvedRequestsMapView && this.props.HomeTraineeStates.approvedRequests != null ?
            this.props.HomeTraineeStates.approvedRequests.map((data, index) => (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
                title={'Approved'}
              >
                <Image source={data.IsTrainer ? require('../../Images/TrainerMarker.png') : require('../../Images/TrainerMarker.png')} style={{ width: 30, height: 36 }} />
                <MapView.Callout>
                  <CoupleResultCallOut type={3} refresh={this.props.refresh}  Data={data} UserCode={this.props.HomeTraineeStates.userCode}  navigation={this.props.navigation}></CoupleResultCallOut>
                </MapView.Callout>
              </MapView.Marker>
            )
            )
            : null
          }






          {this.props.HomeTraineeStates.futureTrainingsMapView && this.props.HomeTraineeStates.futureCoupleTrainings != null ?
            this.props.HomeTraineeStates.futureCoupleTrainings.map((data, index) => (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
                title={'Future Couple'}
              >
                <Image source={data.IsTrainer ? require('../../Images/TrainerMarker.png') : require('../../Images/TrainerMarker.png')} style={{ width: 30, height: 36 }} />
                <MapView.Callout>
                  <FutureTrainingsCallOut couple={true} refresh={this.props.refresh}  Data={data} UserCode={this.props.HomeTraineeStates.userCode}  navigation={this.props.navigation}></FutureTrainingsCallOut>
                </MapView.Callout>
              </MapView.Marker>
            )
            )
            : null
          }






          {this.props.HomeTraineeStates.futureTrainingsMapView && this.props.HomeTraineeStates.futureGroupTrainings != null ?
            this.props.HomeTraineeStates.futureGroupTrainings.map((data, index) => (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: data.Latitude,
                  longitude: data.Longitude
                }}
                title={'Future Group'}
              >
                <Image source={require('../../Images/GroupMarker.png')} style={{ width: 50, height: 50 }} />
                <MapView.Callout>
                  <FutureTrainingsCallOut couple={false} refresh={this.props.refresh}  Data={data} UserCode={this.props.HomeTraineeStates.userCode}  navigation={this.props.navigation}></FutureTrainingsCallOut>
                </MapView.Callout>
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

