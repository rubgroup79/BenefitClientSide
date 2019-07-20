import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,

} from 'react-native';
import { Button } from 'react-native-elements';
import { Font } from 'expo';
import Icon1 from 'react-native-vector-icons/AntDesign';
import CustomButton from '../Components/CategoriesButton';
const STAR = require('../../Images/SelectedStar.png');
const SCREEN_WIDTH = Dimensions.get('window').width;


export default class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
      userCode: 0,
      firstName: '',
      lastName: '',
      gender: '',
      picture: '',
      rate: 0,
      sportCategories: [],
      userSportCategories: [],
      selectedSportCategories: [],
      averageRates: [],
      status: 0

    };

    this.getProfileDetails = this.getProfileDetails.bind(this);
    this.getSportCategories = this.getSportCategories.bind(this);
    this.setSelectedSportCategories = this.setSelectedSportCategories.bind(this);
    this.getAvarageParametersRate = this.getAvarageParametersRate.bind(this);
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

    this.getProfileDetails();
    this.getAvarageParametersRate();


  }

  getProfileDetails() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/ShowProfile?UserCode=' + this.props.navigation.getParam('UserCode', null), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ userCode: response.UserCode, firstName: response.FirstName, lastName: response.LastName, gender: response.Gender, picture: response.Picture, age: response.Age, userSportCategories: response.SportCategories, rate: response.Rate }, this.getSportCategories)

      })
      .catch(error => console.warn('Error:', error.message));
  }

  getSportCategories() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetSportCategories', {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ sportCategories: response }, this.setSelectedSportCategories);
      })
      .catch(error => console.warn('Error:', error.message));

  }

  getAvarageParametersRate() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetAvarageParametersRate?UserCode=' + this.props.navigation.getParam('UserCode', null), {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ averageRates: response });
      })
      .catch(error => console.warn('Error:', error.message));

  }

  setSelectedSportCategories() {
    temp = this.state.sportCategories.map((category) => {
      counter = 0;
      this.state.userSportCategories.map((userCategory) => {
        if (category.Description == userCategory.Description)
          counter++;
      })
      if (counter == 1) return { CategoryCode: category.CategoryCode, Description: category.Description, Selected: true };
      else return { CategoryCode: category.CategoryCode, Description: category.Description, Selected: false };
    });
    this.setState({ selectedSportCategories: temp, status: 1 });

  }

  render() {
    const { goBack } = this.props.navigation;
    index = 1;
    return (
      <View style={styles.flex}>

        {this.state.fontLoaded && this.state.status == 1 && this.state.selectedSportCategories.length != 0 ? (
          <View style={styles.flex}>
            <View style={styles.headerContainer}>
              <View style={styles.flex}>
                <Button
                  icon={() =>
                    <Icon1 name='left' size={20} />}
                  style={styles.backButtonView}
                  buttonStyle={styles.backButtonStyle}
                  onPress={() => goBack()}
                  activeOpacity={0.5}
                />
              </View>
              <View style={styles.nameContainer}>

                <Text style={styles.heading}>{this.state.firstName + ' ' + this.state.lastName}</Text>
              </View>
            </View>

            <ScrollView
              scrollEnabled={false}
              style={styles.scrollView}>

              <View style={{ flex: 1, alignItems: 'center', marginTop: 10, flexDirection: 'column', }}>

                <Image style={styles.userImage} source={{ uri: this.state.picture }} ></Image>
                <Text style={styles.genderText}>{this.state.gender}</Text>
                <Text style={styles.ageText}>{this.state.age}</Text>
              </View>

              <View style={styles.container}>
                <Text style={styles.categoriesHeadline}>{this.state.firstName + "'s Favorite sports"} </Text>

                <View
                  style={styles.categoriesView}
                >

                  <View style={styles.categoriesTopRow}>

                    <CustomButton title={this.state.sportCategories[0].Description} selected={this.state.selectedSportCategories[0].Selected} />
                    <CustomButton title={this.state.sportCategories[1].Description} selected={this.state.selectedSportCategories[1].Selected} />
                    <CustomButton title={this.state.sportCategories[2].Description} selected={this.state.selectedSportCategories[2].Selected} />

                  </View>

                  <View style={styles.categoriesRow}>

                    <CustomButton title={this.state.sportCategories[3].Description} selected={this.state.selectedSportCategories[3].Selected} />
                    <CustomButton title={this.state.sportCategories[4].Description} selected={this.state.selectedSportCategories[4].Selected} />
                    <CustomButton title={this.state.sportCategories[5].Description} selected={this.state.selectedSportCategories[5].Selected} />

                  </View>
                  <View style={styles.categoriesRow}>

                    <CustomButton title={this.state.sportCategories[6].Description} selected={this.state.selectedSportCategories[6].Selected} />
                    <CustomButton title={this.state.sportCategories[7].Description} selected={this.state.selectedSportCategories[7].Selected} />
                    <CustomButton title={this.state.sportCategories[8].Description} selected={this.state.selectedSportCategories[8].Selected} />

                  </View>

                </View>
              </View>

              <View style={styles.ratesContainer}>
                <Image source={STAR}></Image>
                <Text style={styles.rateText}>{this.state.rate}</Text>
              </View>
              <View style={styles.ratingView}>
                {this.state.averageRates.map((parameter, index) => {
                  return (<View key={index} style={styles.rateStyle}>
                    <Image source={STAR} style={styles.starImage}></Image>
                    <Text style={styles.rateText}>{parameter.Parameter.Description + " :" + parameter.AverageRate}</Text>
                  </View>)
                })}

              </View>




            </ScrollView>

          </View>
        ) : null}

      </View>
    );
  }
}



const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  backButtonView:
  {
    justifyContent: 'center',
  },
  backButtonStyle:
  {
    height: 45,
    width: 45,
    borderRadius: 30,
    backgroundColor: 'transparent',

  },
  scrollView:
  {
    flex: 1,
    flexDirection: 'column'
  },
  nameContainer:
  {
    flex: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    height: 80,
    zIndex: 1,
  },
  userImage:
  {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  genderText:
  {
    flex: 1,
    fontFamily: 'regular',
    color: '#7384B4',
    fontSize: 18,
    margin: 5
  },
  ageText:
  {
    flex: 1,
    fontFamily: 'regular',
    color: '#7384B4',
    fontSize: 15,
  },
  container:
  {
    flex: 1,
    marginTop: 10,
    flexDirection: 'column',
    margin: 20,
    justifyContent: 'center'
  },
  categoriesHeadline:
  {
    flex: 1,
    fontFamily: 'regular',
    color: '#f34573',
    fontSize: 15,
  },
  categoriesView:
  {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    height: 160,
    marginTop: 10

  },
  categoriesTopRow:
  {
    flex: 1,
    flexDirection: 'row'
  },
  categoriesRow:
  {
    flex: 1,
    flexDirection: 'row',
    marginTop: -40
  },
  heading: {
    color: '#f34573',
    fontSize: 20,
    flex: 1,
    fontFamily: 'regular',
    justifyContent: 'center'
  },
  rateText: {
    fontFamily: 'bold',
    fontSize: 20,
    color: "#7384B4"
  },
  ratingView:
  {
    flex: 1,
    marginTop: 10
  },
  rateStyle:
  {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'center',
    marginBottom: 10
  },
  starImage:
  {
    width: 20,
    height: 20
  },
  rateText:
  {
    flex: 1,
    fontFamily: 'light',
    color: '#7384B4',
    fontSize: 18,
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  ratesContainer:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40
  },
});
