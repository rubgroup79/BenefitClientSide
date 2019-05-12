import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Button } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import { Font } from 'expo';

import GenderButton from './genderButton';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');

export default class SearchModal extends Component {
  constructor(props){
    super(props);
  this.state = {
    modalVisible: true,
    selectedType:'',
    fontLoaded:false
  };
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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

  render() {
    return (
      <View>
      {this.state.fontLoaded ? (
      <View style={{ marginTop: 30 }}
      >
      
        <Modal
          animationType="fade"
          style={styles.modal}
          transparent={true}
          visible={this.state.modalVisible}
          >
          <View 
          
          style={styles.modal}>

            <View style={styles.modalContentContainer}>
              <View style={{ flex: 1 }}>
                <ActionButton style={styles.exitButton}
                  onPress={() => this.setModalVisible(false)}
                  size={30}
                  buttonColor='#d0d6e0'
                  renderIcon={active => active ? (<Icon1
                    name="md-create"
                    

                    style={styles.uploadImageIcon}
                  />) :
                    (<Icon
                      name='x'
                      color='black'
                      size={23}
                    />)

                  }
                ></ActionButton>
              </View>

             
            </View>

            {/* <View style={styles.partnerPreferencesStyle}>
                <Text style={style = styles.partnersGenderHeadline}>
                  Partner's Gender
                    </Text>
                <View style={styles.partnerPreferencesContainerStyle} >

                  <View style={styles.userTypesContainer}>
                    <GenderButton
                      image={MALE_AVATAR}
                      onPress={
                        () => {
                          this.setSelectedType('Male')
                          this.setState({ partnerGender: 'Male' })
                        }
                      }
                      selected={this.state.selectedType === 'Male'}
                    />
                    <GenderButton
                      image={FEMALE_AVATAR}
                      onPress={
                        () => {
                          this.setSelectedType('Female')
                          this.setState({ partnerGender: 'Female' })
                        }
                      }
                      selected={this.state.selectedType === 'Female'}
                    />
                  </View>
                </View>

              </View> */}
          </View>
        </Modal> 
      </View> ) : <View></View> }
      </View>
    );
  }
};

const styles = StyleSheet.create({

  modalContentContainer: {
    height: 150,
    width: SCREEN_WIDTH - 50,
    borderRadius: 30,
    backgroundColor: 'rgba(47,44,60,0.9)',
    marginTop: -400

  },

  exitButton:{
    marginRight:320,
    marginTop:-15
  },

  modal:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  partnerPreferencesStyle: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10
  },
  partnersGenderHeadline: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(216, 121, 112, 1)',
    fontFamily: 'regular',
    marginLeft: 40,
    marginTop: 30
  },
  partnerPreferencesContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 10,
    //alignItems: 'center',
    flexDirection: 'row',
    marginRight: 40

  },
  userTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    alignItems: 'center',
    marginTop: -18,
  },

});


//  <View style={{ flex: 1 }}>
//                 <ActionButton style={styles.searchButton}
//                   buttonColor='#46db93'
//                   size={40}
//                   renderIcon={active => active ? (<Icon1
//                     name="md-create"
//                     size={20}
//                     style={styles.uploadImageIcon}
//                   />) :
//                     (<Icon
//                       name='search'
//                       color='white'
//                       size={25}
//                     />)

//                   }
//                 ></ActionButton>
//               </View>