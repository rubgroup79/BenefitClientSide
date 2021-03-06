import _ from 'lodash';

import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, ListView, AsyncStorage } from 'react-native';
import { Font } from 'expo';
import {
  Text, Card, Tile,
  Icon,
  ListItem,
  Avatar,

} from 'react-native-elements';
import colors from '../config/colors';

class Chats extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      selectedIndex: 0,
      value: 0.5,
      chats: [],
      fontLoaded: false,
      userCode: 0,
      isTrainer: false

    };

    this.updateIndex = this.updateIndex.bind(this);
    this.getChats = this.getChats.bind(this);
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
    setTimeout(() => {
      this.getLocalStorage();
    }, 1000);
  }


  getLocalStorage=async ()=>{
    await AsyncStorage.getItem('UserCode', (err, result) => {
      if (result != null) {
        this.setState({ userCode: result }, this.getChats);
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

  getChats() {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetAllChats?UserCode=' + this.state.userCode, {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ chats: response })
      })
      .catch(error => console.warn('Error:', error.message));
  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
  }




  render() {

    return (
      <ScrollView>
        {this.state.fontLoaded ?
          <View>
            <View
              style={styles.headerContainer}>
              <Image style={styles.logoImage} source={require('../../Images/LogoOnly.png')} />
              <Text style={styles.heading}>Chats</Text>
            </View>
            <View style={{paddingVertical: 8}}>
              {this.state.chats.map((chat, index) => (
                <ListItem
                key={index}
                  onPress={() => this.props.navigation.navigate('Chat', { ChatCode: chat.ChatCode, FullName: chat.FirstName + " " + chat.LastName, Picture: chat.Picture, UserCode: chat.UserCode1, PartnerUserCode: chat.UserCode2 })}

                  //component={TouchableScale}
                  // friction={90}
                  // tension={100}
                  //activeScale={0.95}
                  leftAvatar={{ rounded: true, source: { uri: chat.Picture } }}
                  key={chat.ChatCode}
                  title={chat.FirstName + " " + chat.LastName}
                  titleStyle={{ color: 'black', fontFamily: 'bold' }}
                  subtitleStyle={{ color: 'gray', fontFamily: 'regular' }}
                  subtitle={chat.LastMessage}
                  chevronColor="white"
                  chevron

                  containerStyle={styles.conatinerStyle}/>
              ))}
            </View>

          </View> : null}

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: colors.greyOutline,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#d0d4db',
    height: 80,
    backgroundColor: '#f5f5f5', 
    marginTop: 20 
    //paddingBottom:10
  },
  containerStyle:
  {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    borderColor: '#75cac3',
    borderWidth: 2,
  },
 

  logoImage:
  { width: 57, 
    height: 38, 
    marginLeft: 18 },
  heading: {
    color: 'black',
    fontSize: 23,
    flex: 1,
    justifyContent: "center",
    marginLeft: 15,
    fontFamily: 'light',
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  social: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
  },
  ratingImage: {
    height: 19.21,
    width: 100,
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey',
  },
});

export default Chats;
