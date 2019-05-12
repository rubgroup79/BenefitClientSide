// import _ from 'lodash';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { Font } from 'expo';
import Icon3 from 'react-native-vector-icons/Ionicons';

export default class ListTest extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   fontLoaded: false,
    // };
  }

  // async componentDidMount() {
  //   await Font.loadAsync({
  //     georgia: require('../../assets/fonts/Georgia.ttf'),
  //     regular: require('../../assets/fonts/Montserrat-Regular.ttf'),
  //     light: require('../../assets/fonts/Montserrat-Light.ttf'),
  //     bold: require('../../assets/fonts/Montserrat-Bold.ttf'),
  //   });

  //   this.setState({ fontLoaded: true });
  // }


  render() {
    return (
      <View>
        {/* {this.state.fontLoaded ? ( */}
         
         <ScrollView style={{ flex: 1, marginBottom: 20 }}>
         <View
     // key={index}
     style={{
       height: 60,
       marginHorizontal: 10,
       marginTop: 10,
       backgroundColor: 'white',
       borderRadius: 5,
       alignItems: 'center',
       flexDirection: 'row',
     }}
   >
     <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
       <View style={{ marginLeft: 15 }}>
         <Avatar
           small
           rounded
           source={{
             uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/andyvitale/128.jpg',
           }}
           activeOpacity={0.7}
         />
       </View>
       <Text
         style={{
           fontFamily: 'regular',
           fontSize: 15,
           marginLeft: 10,
           color: 'gray',
         }}
       >
         noam
       </Text>
     </View>
     <View
       style={{
         flexDirection: 'row',
         justifyContent: 'center',
         marginRight: 10,
       }}
     >
       {/* {this.renderValue(user)} */}
       <View
         style={{
           backgroundColor: 'rgba(222,222,222,1)',
           width: 35,
           height: 28,
           borderRadius: 5,
           justifyContent: 'center',
           alignItems: 'center',
           marginHorizontal: 10,
         }}
       >
         <Icon3 name="md-person-add" color="gray" size={20} />
       </View>
     </View>
   </View>
           {/* {this.renderListCards()} */}
         </ScrollView>
        {/* ) : (
          <Text>Loading...</Text>
        )} */}
      </View>
    );
  }
}
