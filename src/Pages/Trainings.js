import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, ListView, Button, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Geocode from "react-geocode";
import { Font } from 'expo';
import {
  Text,
  ListItem,
  ButtonGroup
} from 'react-native-elements';


var coupleAddresses = [];
var groupAddresses = [];
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
Geocode.setApiKey("AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q");
class Trainings extends Component {
  constructor() {
    super();

    this.state = {
      fontLoaded: false,
      pastCoupleTrainings: [],
      pastGroupTrainings: [],
      selectedIndex: 0,
      userCode: 0,
      isTrainer: false,
      coupleAddresses: [],
      groupAddresses: [],
      status: 0


    };
    this.getAddress = this.getAddress.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
    this.getLocalStorage = this.getLocalStorage.bind(this);
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

  getLocalStorage = async () => {
    await AsyncStorage.getItem('UserCode', (err, result) => {
      if (result != null) {
        this.setState({ userCode: result }, this.getCoupleTrainings);
      }
      else alert('error local storage user code');
    }
    )

    await AsyncStorage.getItem('IsTrainer', (err, result) => {
      if (result != null) {

        this.setState({ isTrainer: result });
      }
      else alert('error local storage is trainer');
    }
    )
  }

  getCoupleTrainings() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetPastCoupleTrainings?UserCode=' + this.state.userCode, {
      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ pastCoupleTrainings: response }, this.getGroupTrainings);
        response.map((training) => {
          this.getAddress(training.Latitude, training.Longitude, true);

        })
      })
      .catch(error => console.warn('Error:', error.message));
  }

  getGroupTrainings() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetPastGroupTrainings?UserCode=' + this.state.userCode, {
      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ pastGroupTrainings: response });
        response.map((training) => {
          this.getAddress(training.Latitude, training.Longitude, false);

        })
      })
      .catch(error => console.warn('Error:', error.message));
  }


  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }



  getAddress(latitude, longitude, couple) {
    var address = ''
    Geocode.setApiKey("AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q");

    Geocode.fromLatLng(latitude, longitude).then(
      response => {
        address = response.results[0].formatted_address;

      },
      error => {
        console.error(error);
      }
    );

    setTimeout(() => {
      if (couple)
        coupleAddresses.push(address);
      else groupAddresses.push(address);

      if ((coupleAddresses.length == this.state.pastCoupleTrainings.length) && (groupAddresses.length == this.state.pastGroupTrainings.length))
        this.setState({ coupleAddresses: coupleAddresses, groupAddresses: groupAddresses, status: 1 });
    }, 1000);

  }



  render() {
    const { selectedIndex } = this.state;
    const buttons = ['Couple Trainings', 'Group Trainings'];
    return (
      <View style={styles.container}>
        {this.state.fontLoaded && this.state.status == 1 ?
          <View style={styles.flex}>
            <View style={styles.headerContainer} >
              <Image style={styles.logoImage} source={require('../../Images/LogoOnly.png')} />
              <Text style={styles.heading}>Trainings</Text>
            </View>

            <View style={styles.navBar}>
              <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={styles.navBarButtonsContainer}
                selectedButtonStyle={styles.selectedButtonStyle}
                textStyle={styles.navBarText}
              />
            </View>


            <ScrollView style={styles.scrollView}>
              <View style={styles.flex}>
                {this.state.selectedIndex == 0 ?
                  <View style={styles.list}>
                    {this.state.pastCoupleTrainings.map((training, index) => (

                      <ListItem
                        key={index}
                        leftIcon={() =>
                          <Image source={{ uri: training.PartnerPicture }}
                            style={styles.partnerPicture}></Image>}
                        title={training.PartnerFirstName + " " + training.PartnerLastName}
                        titleStyle={styles.title}
                        subtitle={this.state.coupleAddresses[index]}
                        subtitleStyle={styles.subtitleStyle}
                        rightTitle={training.TrainingTime.split(" ")[0].split('/')[1] + "." + training.TrainingTime.split(" ")[0].split('/')[0] + "." + training.TrainingTime.split(" ")[0].split('/')[2]}
                        rightTitleStyle={styles.rightTitle}
                        rightSubtitle={training.Price == 0 ? null : '$' + training.Price}
                        rightSubtitleStyle={styles.rightSubtitle}
                        bottomDivider
                        rightIcon={() => this.state.isTrainer == 0 ?
                          <Icon color='#f7d84c' name='star' size={30} onPress={() => this.props.navigation.navigate('Rate', { UserCode: this.state.userCode, RatedUserCode: training.PartnerUserCode, FullName: training.PartnerFirstName + " " + training.PartnerLastName, Picture: training.PartnerPicture })} /> : null}
                        onPress={() => this.props.navigation.navigate('UserProfile', { UserCode: training.PartnerUserCode })}
                      />

                    ))}

                  </View>
                  : null
                }
                {this.state.selectedIndex == 1 ?
                  <View style={styles.list}>
                    {this.state.pastGroupTrainings.map((training, index) => (
                      <ListItem
                        leftIcon={training.WithTrainer ?
                          <Image source={require('../../Images/GroupWithTrainer.png')} style={styles.partnerPicture}></Image>
                          :
                          <Image source={require('../../Images/GroupWithPartners.png')} style={styles.partnerPicture}></Image>}

                        key={training.TrainingCode}
                        title={training.SportCategory + ' Group'}
                        titleStyle={styles.title}
                        subtitleStyle={styles.subtitle}
                        subtitle={this.state.groupAddresses[index]}
                        rightTitle={training.TrainingTime.split(" ")[0].split('/')[1] + "." + training.TrainingTime.split(" ")[0].split('/')[0] + "." + training.TrainingTime.split(" ")[0].split('/')[2]}
                        rightTitleStyle={styles.rightTitle}
                        rightSubtitle={training.Price == 0 ? null : '$' + training.Price}
                        rightSubtitleStyle={styles.rightSubtitleStyle}
                        onPress={() => this.props.navigation.navigate('GroupProfile', { GroupCode: training.TrainingCode })}
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
  container:
  {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  flex:
  {
    flex: 1
  },
  logoImage:
  {
    width: 57,
    height: 38,
    marginLeft: 18
  },
  navBar:
  {
    margin: 10
  },
  navBarButtonsContainer:
  {
    height: 50
  },
  selectedButtonStyle:
  {
    backgroundColor: '#f34573'
  },
  navBarText:
  {
    fontFamily: 'regular'
  },
  title:
  {
    color: 'black',
    fontFamily: 'regular'
  },
  subtitle:
  {
    fontFamily: 'regular'
  },
  rightTitle:
  {
    color: 'green',
    fontSize: 15,
    fontFamily: 'regular'
  },
  rightSubtitle:
  {
    textAlign: 'center',
    fontFamily: 'regular'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    height: 80,
  },
  partnerPicture:
  {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  heading: {
    color: 'black',
    fontSize: 23,
    flex: 1,
    justifyContent: "center",
    marginLeft: 15,
    fontFamily: 'light',
  },
  scrollView:
  {
    flex: 1,
    marginBottom: 50
  },

});

export default Trainings;
