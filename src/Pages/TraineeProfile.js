import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Font } from 'expo';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH - 80;

const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');

class CustomButton extends Component {
  constructor() {
    super();

    this.state = {
      selected: false,
    };
  }

  componentDidMount() {
    const { selected } = this.props;

    this.setState({
      selected,
    });
  }

  render() {
    const { title } = this.props;
    const { selected } = this.state;

    return (
      <Button
        title={title}
        titleStyle={{ fontSize: 15, color: 'white', fontFamily: 'regular' }}
        buttonStyle={
          selected
            ? {
              backgroundColor: 'rgba(213, 100, 140, 1)',
              borderRadius: 100,
              width: 127,
            }
            : {
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 30,
              width: 127,
              backgroundColor: 'transparent',
            }
        }
        containerStyle={{ marginRight: 10 }}
        onPress={() => this.setState({ selected: !selected })}
      />
    );
  }
}

export default class TraineeProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      //userCode: 0,
      firstName: '',
      lastName: '',
      gender: '',
      picture: '',
      sportCategories: [],
      hiddenGenderPic: true
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require('../../assets/fonts/Georgia.ttf'),
      regular: require('../../assets/fonts/Montserrat-Regular.ttf'),
      light: require('../../assets/fonts/Montserrat-Light.ttf'),
      bold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  showProfile() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/ShowProfile?UserCode=29', {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        if (response.UserCode != 0) {
          this.setState({ userCode: response.UserCode, firstName: response.FirstName, lastName: response.LastName, gender: response.Gender, picture: response.Picture })
          this.setState({hiddenGenderPic: false})
        }
        console.warn(response)
      })
      .catch(error => console.warn('Error:', error.message));
  }

  render() {
    //this.showProfile();
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        {this.state.fontLoaded ? (
          <View style={{ flex: 1, backgroundColor: 'rgba(47,44,60,1)' }}>
            <View>
              <Button
                buttonStyle={
                  {
                    backgroundColor: 'yellow',
                    borderRadius: 100,
                    width: 127,
                  }}
                title='Push'
                onPress={() => {
                  this.showProfile()
                }}
              >
              </Button>
            </View>
            <View style={styles.statusBar} />
            <View style={styles.navBar}>
              <Text style={styles.nameHeader}> {this.state.firstName + ' ' + this.state.lastName}</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{ uri: this.state.picture }}
                  style={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    borderRadius: 10,
                  }}
                />
                {this.state.hiddenGenderPic==false?
                <View style={{ flex: 1, position: "relative" }}>
                  <Image 
                    source={this.state.gender == 'Female' ? FEMALE_AVATAR : MALE_AVATAR}
                    style={{
                      width: 60,
                      height: 60,
                      marginLeft: IMAGE_SIZE,
                      marginTop: -40
                    }}
                  />
                </View> : null}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginTop: 20,
                  marginHorizontal: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 26,
                    color: 'white',
                    fontFamily: 'bold',
                  }}
                >
                  Theresa
                </Text>
                <Text
                  style={{
                    flex: 0.5,
                    fontSize: 15,
                    color: 'gray',
                    textAlign: 'left',
                    marginTop: 5,
                  }}
                >
                  0.8 mi
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 26,
                    color: 'green',
                    fontFamily: 'bold',
                    textAlign: 'right',
                  }}
                >
                  84%
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  width: SCREEN_WIDTH - 80,
                  marginLeft: 40,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: 'white',
                    fontFamily: 'regular',
                  }}
                >
                  100% Italian, fun loving, affectionate, young lady who knows
                  what it takes to make a relationship work.
                </Text>
              </View>
              <View style={{ flex: 1, marginTop: 30 }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: 'rgba(216, 121, 112, 1)',
                    fontFamily: 'regular',
                    marginLeft: 40,
                  }}
                >
                  INTERESTS
                </Text>
                <View style={{ flex: 1, width: SCREEN_WIDTH, marginTop: 20 }}>
                  <ScrollView
                    style={{ flex: 1 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        height: 170,
                        marginLeft: 40,
                        marginRight: 10,
                      }}
                    >
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <CustomButton title="Philosophy" selected={true} />
                        <CustomButton title="Sport" />
                        <CustomButton title="Swimming" selected={true} />
                        <CustomButton title="Religion" />
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <CustomButton title="Music" />
                        <CustomButton title="Soccer" selected={true} />
                        <CustomButton title="Radiohead" selected={true} />
                        <CustomButton title="Micheal Jackson" />
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <CustomButton title="Travelling" selected={true} />
                        <CustomButton title="Rock'n'Roll" />
                        <CustomButton title="Dogs" selected={true} />
                        <CustomButton title="France" selected={true} />
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
              <View style={{ flex: 1, marginTop: 30 }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: 'rgba(216, 121, 112, 1)',
                    fontFamily: 'regular',
                    marginLeft: 40,
                  }}
                >
                  INFO
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: 20,
                    marginHorizontal: 30,
                  }}
                >
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoTypeLabel}>Age</Text>
                      <Text style={styles.infoTypeLabel}>Height</Text>
                      <Text style={styles.infoTypeLabel}>Ethnicity</Text>
                      <Text style={styles.infoTypeLabel}>Sign</Text>
                      <Text style={styles.infoTypeLabel}>Religion</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.infoAnswerLabel}>26</Text>
                      <Text style={styles.infoAnswerLabel}>5'4"</Text>
                      <Text style={styles.infoAnswerLabel}>White</Text>
                      <Text style={styles.infoAnswerLabel}>Pisces</Text>
                      <Text style={styles.infoAnswerLabel}>Catholic</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoTypeLabel}>Body Type</Text>
                      <Text style={styles.infoTypeLabel}>Diet</Text>
                      <Text style={styles.infoTypeLabel}>Smoke</Text>
                      <Text style={styles.infoTypeLabel}>Drink</Text>
                      <Text style={styles.infoTypeLabel}>Drugs</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10, marginRight: -20 }}>
                      <Text style={styles.infoAnswerLabel}>Fit</Text>
                      <Text style={styles.infoAnswerLabel}>Vegan</Text>
                      <Text style={styles.infoAnswerLabel}>No</Text>
                      <Text style={styles.infoAnswerLabel}>No</Text>
                      <Text style={styles.infoAnswerLabel}>Never</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Button
                containerStyle={{ marginVertical: 20 }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                buttonStyle={{
                  height: 55,
                  width: SCREEN_WIDTH - 40,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                linearGradientProps={{
                  colors: ['rgba(214,116,112,1)', 'rgba(233,174,87,1)'],
                  start: [1, 0],
                  end: [0.2, 0],
                }}
                title="Message Theresa"
                titleStyle={{
                  fontFamily: 'regular',
                  fontSize: 20,
                  color: 'white',
                  textAlign: 'center',
                }}
                onPress={() => console.log('Message Theresa')}
                activeOpacity={0.5}
              />
            </ScrollView>
          </View>
        ) : (
            <Text>Loading...</Text>
          )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: 10,
  },
  navBar: {
    height: 60,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignContent: 'center',
  },
  nameHeader: {
    color: 'white',
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'bold',
  },
  infoTypeLabel: {
    fontSize: 15,
    textAlign: 'right',
    color: 'rgba(126,123,138,1)',
    fontFamily: 'regular',
    paddingBottom: 10,
  },
  infoAnswerLabel: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'regular',
    paddingBottom: 10,
  },
});
