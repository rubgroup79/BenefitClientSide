import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import {ListItem } from 'react-native-elements';
import { Font } from 'expo';
import Icon1 from 'react-native-vector-icons/AntDesign';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_SIZE = SCREEN_WIDTH - 150;

export default class GroupProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      userCode: 0,
      trainingTime: "",
      longitude: "",
      latitude: "",
      withTrainer: 0,
      creatorCode: 0,
      minParticipants: 0,
      maxParticipants: 0,
      currentParticipants: 0,
      sportCategory: "",
      price: 0,
      groupParticipants: [],
      address: "",
      status: 0,
      creatorPicture: "",
      creatorRate: 0,
      creatorName: "",
      creatorAge: 0
    };

    this.getGroupDetails = this.getGroupDetails.bind(this);
    this.getGroupParticipants = this.getGroupParticipants.bind(this);
    this.getAddress = this.getAddress.bind(this);
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

  componentWillMount() {

    this.getGroupDetails();


  }

  setTime(trainingTime) {
    hour = (trainingTime.split(" ")[1]).split(":")[0];
    minutes = (trainingTime.split(" ")[1]).split(":")[1];
    ampm = trainingTime.split(" ")[2];

    if (ampm == "PM") {
      if (hour == "12")
        return (hour) + ":" + minutes;
      temp = JSON.parse(hour);
      temp += 12;
      return (temp) + ":" + minutes;
    }

    else return hour + ":" + minutes;
  }

  getGroupDetails() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetGroupDetails?GroupCode=' + this.props.navigation.getParam('GroupCode', null), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ trainingTime: response.TrainingTime, latitude: response.Latitude, longitude: response.Longitude, withTrainer: response.WithTrainer, creatorCode: response.CreatorCode, minParticipants: response.MinParticipants, maxParticipants: response.MaxParticipants, currentParticipants: response.CurrentParticipants, sportCategory: response.SportCategory, price: response.Price }, this.getGroupParticipants)

      })
      .catch(error => console.warn('Error:', error.message));
  }

  getGroupParticipants() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetGroupParticipants?GroupCode=' + this.props.navigation.getParam('GroupCode', null), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ groupParticipants: response }, this.getAddress)
        response.map((participant) => {
          if (participant.UserCode == this.state.creatorCode) {
            this.setState({ creatorPicture: participant.Picture, creatorAge: participant.Age, creatorName: participant.FirstName + ' ' + participant.LastName, creatorRate: participant.Rate })

          }
        })

      })
      .catch(error => console.warn('Error:', error.message));

  }

  getAddress() {
    var address = '';

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.latitude + ',' + this.state.longitude + '&key=' + 'AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q')
      .then((response) => response.json())
      .then((responseJson) => {
        address = JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'route').length > 0)[0].short_name) + ' ' +
          JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'street_number').length > 0)[0].short_name) + ', ' +
          JSON.stringify(responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'locality').length > 0)[0].short_name);
        address = address.replace(/"/g, '');
        this.setState({ address: address, status: 1 })


      });
  }


  render() {
    const { goBack } = this.props.navigation;
    index = 1;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        {this.state.fontLoaded && this.state.status == 1 ? (
          <View style={{ flex: 1, }}>
            <Icon1 name='left' style={styles.closeIcon} size={20} color='gray' onPress={() => { goBack() }}></Icon1>
            <View style={styles.statusBar} />

            <View style={styles.navBar}>

              <Text style={styles.nameHeader}>{this.state.sportCategory + ' Group'}</Text>
              <Text style={styles.detailsBig}>{this.state.address}</Text>
              <Text style={styles.detailsBig}>{this.setTime(this.state.trainingTime) + ' ' + this.state.trainingTime.split(' ')[0].split('/')[1] + "." + this.state.trainingTime.split(' ')[0].split('/')[0] + "." + this.state.trainingTime.split(' ')[0].split('/')[2]}</Text>
              <Text style={styles.detailsSmall}>Open For {this.state.minParticipants} - {this.state.maxParticipants} Trainees </Text>

            </View>

            <ScrollView
              scrollEnabled={false}
              style={styles.scrollView}>

              {this.state.withTrainer ?

                <View style={styles.withTrainerContainer}>

                  <View style={styles.creatorPictureContainer}>
                    <Image style={styles.creatorPicture} source={{ uri: this.state.creatorPicture }}></Image>
                  </View>
                  <View style={styles.cratorContainer}>
                    <View style={styles.creatorTextContainer}>

                      <Text style={styles.creatorText}>{this.state.creatorName}</Text>
                    </View>
                    <View style={styles.creatorTextContainer}>

                      <Text style={styles.creatorText}>$ {this.state.price}</Text>
                    </View>
                    <View style={styles.rateContainer}>
                      <Image style={styles.rateStarImage} source={require('../../Images/SelectedStar.png')}></Image>
                      <Text style={styles.rateText}>{this.state.creatorRate}</Text>
                    </View>
                  </View>
                </View> :
                <View style={styles.groupImageContainer}>
                  <Image style={styles.groupImage} source={require('../../Images/GroupWithPartners.png')}></Image>
                </View>}

              <ScrollView
                style={styles.participantsView}>

                <View style={styles.list}>
                  {this.state.groupParticipants.map((participant, index) => (
                    ((participant.UserCode != this.state.creatorCode) ||
                      (participant.UserCode == this.state.creatorCode && this.state.withTrainer == 0)) &&
                    <ListItem
                      key={index}
                      leftIcon={() =>
                        <Image source={{ uri: participant.Picture }}
                          style={styles.participantImage}></Image>}
                      title={participant.FirstName + " " + participant.LastName}
                      titleStyle={styles.participantTitle}
                      subtitle={participant.Age.toString()}
                      subtitleStyle={{ fontFamily: 'regular' }}
                      rightTitle={participant.Rate.toString()}
                      rightTitleStyle={styles.participantRightTitle}
                      bottomDivider
                      rightIcon={() => <Icon1 color='#f7d84c' name='star' size={30} />}
                      onPress={() => this.props.navigation.navigate('UserProfile', { UserCode: participant.UserCode })}
                    />)
                  )}

                </View>
              </ScrollView>
              <View style={styles.currentParticipantsView}>
                <Text style={styles.currentParticipantsTxt}>
                  {this.state.withTrainer ? this.state.currentParticipants - 1 :
                    this.state.currentParticipants} Participants</Text>
              </View>
            </ScrollView>

          </View>
        ) : null}

      </SafeAreaView>
    );
  }
}



const styles = StyleSheet.create({
  detailsBig:
  {
    flex: 1,
    fontFamily: 'regular',
    textAlign: 'center',
    color: '#7384B4',
    fontSize: 18,
  },
  detailsSmall:
  {
    flex: 1,
    fontFamily: 'light',
    textAlign: 'center',
    color: '#7384B4',
    fontSize: 14,
  },
  scrollView:
  {
    flex: 1,
    flexDirection: 'column'
  },

  withTrainerContainer:
  {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  creatorPictureContainer:
  {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 5
  },
  creatorPicture:
  {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  creatorText:
  {
    fontFamily: 'light',
    color: '#7384B4',
  },
  creatorTextContainer:
  {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5
  },
  rateStarImage:
  {
    width: 20,
    height: 20
  },
  rateText:
  {
    fontFamily: 'light',
    marginLeft: 10,
    marginTop: 2,
    color: '#7384B4',
  },
  rateContainer:
  {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5
  },

  cratorContainer:
  {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 5
  },
  groupImage:
  {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  statusBar: {
    height: 10,
  },
  groupImageContainer:
  {
    flex: 1,
    alignItems: 'center',
    marginRight: 5
  },

  participantsView:
  {
    flex: 1,
    flexDirection: 'column',
    height: 400,
    marginTop: 10
  },
  participantImage:
  {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  navBar:
  {
    height: 110,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  participantTitle:
  {
    color: 'black',
    fontFamily: 'regular'
  },
  nameHeader:
  {
    color: '#f34573',
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'light'
  },
  participantRightTitle:
  {
    color: 'green',
    fontSize: 15,
    fontFamily: 'regular'
  },
  sliderStyle:
  {
    width: SLIDER_SIZE,
    marginTop: 35,
  },

  numericInput: {
    flex: 1,
  },
  closeIcon: {
    top: 20,
    left: 20
  },
  currentParticipantsTxt:
  {
    fontFamily: 'light',
    color: '#7384B4',
    marginRight: 8
  },
  currentParticipantsView:
  {
    flex: 1,
    alignItems: 'flex-end'
  }
});
