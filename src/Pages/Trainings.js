import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, ListView, Button, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Font } from 'expo';
import {
  Text,
  Card,
  Tile,
  ListItem,
  Avatar,
  ButtonGroup
} from 'react-native-elements';
import colors from '../config/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Trainings extends Component {
  constructor() {
    super();

    this.state = {
      fontLoaded: false,
      pastCoupleTrainings: [],
      pastGroupTrainings: [],
      selectedIndex: 0,
      userCode:0,
      isTrainer:false


    };
    this.getAdress = this.getAdress.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
    this.getLocalStorage=this.getLocalStorage.bind(this);
    this.getTrainings= this.getTrainings.bind(this);

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

  UNSAFE_componentWillMount() {
this.getLocalStorage();
  }

  getLocalStorage=async ()=>{
    await AsyncStorage.getItem('UserCode', (err, result) => {
      if (result != null) {
        this.setState({ userCode: result }, this.getTrainings);
      }
      else alert('error local storage user code');
    }
    )

    await AsyncStorage.getItem('IsTrainer', (err, result) => {
      if (result != null) {
        this.setState({ userCode: result });
      }
      else alert('error local storage is trainer');
    }
    )
  }

  getTrainings(){
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetPastCoupleTrainings?UserCode='+this.state.userCode, {
      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ pastCoupleTrainings: response })
      })
      .catch(error => console.warn('Error:', error.message));

    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetPastGroupTrainings?UserCode='+this.state.userCode, {
      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ pastGroupTrainings: response })
      })
      .catch(error => console.warn('Error:', error.message));
  }


  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }

  getAdress(latitude, longitude) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + 'AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q')
      .then((response) => response.json())
      .then((responseJson) => {
        var adress = JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'route').length > 0)[0].short_name) + ' ' +
          JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'street_number').length > 0)[0].short_name) + ', ' +
          JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'locality').length > 0)[0].short_name);
        adress = adress.replace(/"/g, '');
        return adress;

      })
  }

  render() {
    const { selectedIndex } = this.state;
    const buttons = ['Couple Trainings', 'Group Trainings'];
    return (
      <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
        {this.state.fontLoaded ?
          <View style={{ flex: 1 }}>
            <View
              style={[
                styles.headerContainer,
                { backgroundColor: '#f5f5f5', marginTop: 20 },
              ]}
            >
              <Image style={{ width: 57, height: 38, marginLeft: 18 }} source={require('../../Images/LogoOnly.png')} />
              <Text style={styles.heading}>Trainings</Text>
            </View>

            <View style={{ margin: 10 }}>
              <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{ height: 50 }}
                selectedButtonStyle={{ backgroundColor: '#f34573' }}
                textStyle={{ fontFamily: 'regular' }}
              />
            </View>


            <ScrollView style={{ flex: 1 }}>
              {/* <Text style={styles.headline}>Couple Trainings</Text> */}
              <View style={{ flex: 1 }}>
                {this.state.selectedIndex == 0 ?
                  <View style={styles.list}>
                    {this.state.pastCoupleTrainings.map((training) => (

                        <ListItem
                          style={{ fontFamily: 'regular' }}
                          key={training.TrainingCode}
                          leftIcon={() =>
                            <Image source={{ uri: training.PartnerPicture }} style={{ width: 40, height: 40, borderRadius: 20 }}></Image>}
                          title={training.PartnerFirstName + " " + training.PartnerLastName}
                          titleStyle={{ color: 'black', fontFamily: 'regular' }}
                          subtitle={this.getAdress(training.Latitude, training.Longitude)}
                          subtitleStyle={{ fontFamily: 'regular' }}
                          //subtitle={l.subtitle}
                          rightTitle={training.TrainingTime.split(" ")[0]}
                          rightTitleStyle={{ color: 'green', fontSize: 15, fontFamily: 'regular' }}
                          rightSubtitle={training.Price == 0 ? null : '$' + training.Price}
                          rightSubtitleStyle={{ textAlign: 'center', fontFamily: 'regular' }}
                          bottomDivider
                          rightIcon={() => <Icon color='#f7d84c' name='star' size={30} onPress={() => this.props.navigation.navigate('Rate', {UserCode:this.state.userCode, RatedUserCode: training.PartnerUserCode, FullName:training.PartnerFirstName + " " + training.PartnerLastName, Picture:training.PartnerPicture})} />}
                          onPress={()=> this.props.navigation.navigate('UserProfile', {UserCode: training.PartnerUserCode})}
                        />
                    ))}

                  </View>
                  : null
                }
                {/* <Text style={styles.headline}>Group Trainings</Text> */}
                {this.state.selectedIndex == 1 ?
                  <View style={styles.list}>
                    {this.state.pastGroupTrainings.map((training) => (
                      <ListItem
                        leftIcon={training.WithTrainer ?
                          <Image source={require('../../Images/GroupWithTrainer.png')} style={{ width: 40, height: 40, borderRadius: 20 }}></Image>
                          :
                          <Image source={require('../../Images/GroupWithPartners.png')} style={{ width: 40, height: 40, borderRadius: 20 }}></Image>}

                        key={training.TrainingCode}
                        title={training.SportCategory + ' Group'}
                        titleStyle={{ color: 'black', fontFamily: 'regular' }}
                        subtitleStyle={{ fontFamily: 'regular' }}
                        subtitle={'will be the location'}
                        rightTitle={training.TrainingTime.split(" ")[0]}
                        rightTitleStyle={{ color: 'green', fontSize: 15, fontFamily: 'regular' }}
                        rightSubtitle={training.Price == 0 ? null : training.Price}
                        rightSubtitleStyle={{ textAlign: 'center', fontFamily: 'regular' }}
                        onPress={()=>console.warn('ככככ')}
                        bottomDivider
                      />

                    ))}
                  </View>
                  : null}
              </View>

            </ScrollView>
          </View> : null}

      </View>
    );
  }
}

const styles = StyleSheet.create({

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#d0d4db',
    height: 80,
  },
  heading: {
    color: 'black',
    marginTop: 10,
    fontSize: 30,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'bold'
  },

  headline: {
    flex: 1,
    fontSize: 15,
    color: '#f34573',
    fontFamily: 'regular',
    margin: 10
  },

});

export default Trainings;
