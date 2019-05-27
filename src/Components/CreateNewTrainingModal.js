import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, LayoutAnimation, ScrollView, UIManager } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Input, Button, withTheme } from 'react-native-elements';
import { Font } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/Entypo';
import TimePickerNew from './TimePicker';
import NumericInput from 'react-native-numeric-input';
import moment from 'moment';
import ActionButton from 'react-native-action-button';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');
const TRAINER_AVATAR = require('../../Images/TrainerAvatar.png');
const TRAINEE_AVATAR = require('../../Images/TraineeAvatar.png');

var hours_now = new Date().getHours();
var minutes_now = new Date().getMinutes();
var timeNow = hours_now + ":" + minutes_now;
var MaxDate = "01-01-" + (new Date().getFullYear() - 18);


export default class CreateNewTrainingModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            fontLoaded: false,
            trainingTime: (moment(new Date()).format('YYYY-MM-DD HH:mm:ss')),
            latitude: 0,
            longitude: 0,
        };


    }

    async componentDidMount() {
        await Font.loadAsync({
            regular: require('../../assets/fonts/Montserrat-Regular.ttf'),
            light: require('../../assets/fonts/Ubuntu-Light.ttf'),
            bold: require('../../assets/fonts/Ubuntu-Bold.ttf'),
            lightitalic: require('../../assets/fonts/Ubuntu-Light-Italic.ttf'),
        });

        this.setState({
            fontLoaded: true,
        })
    }

    onConfirmStartTime = (hour, minute) => {
        time = hour + ":" + minute;
        this.setState({ trainingTime: moment(new Date()).format('YYYY-MM-DD') + " " + time + ":00.000" });
    }

    createNewTraining() {
        const isLocationValid = this.validateLocation();
        
        if (
            isLocationValid
        ) {

            this.setState({ isLoading: true });

            setTimeout(() => {
                LayoutAnimation.easeInEaseOut();
                this.setState({
                    isLoading: false,
                });

                var CoupleTraining = {
                    SuggestionCode: this.props.SuggestionCode,
                    Latitude: this.state.latitude,
                    Longitude: this.state.longitude,
                    TrainingTime: this.state.trainingTime,
                    WithTrainer:  this.props.WithTrainer,
                    Price: 0
                }

            

                fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/InsertCoupleTraining', {
                    method: 'POST',
                    headers: { "Content-type": "application/json; charset=UTF-8" },
                    body: JSON.stringify(CoupleTraining),
                })
                    .then(() => { 
                        alert('Great');
                        this.props.createNewTrainingModalVisible(false);
                        this.props.newTrainingButtonDisabled();
                     })
                    .catch(error => console.warn('Error:', error.message));

            }, 1500);
        }
    }


    validateLocation() {
        if (this.state.latitude == 0 && this.state.longitude == 0) {
            alert('Please choose location for the group training');
            return false;
        }
        return true;
    }

    render() {
        return (

            <ScrollView style={styles.mainContainer}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => {this.props.createNewTrainingModalVisible(false)}}></Icon>
                    <Text style={styles.headline}>Create New Training</Text>
                </View>

                {this.state.fontLoaded ?

                    <View style={styles.searchContainer}>
                        <View style={styles.timePickerContainer}>
                            <Text style={styles.subHeadline}>
                                When?
                            </Text>
                            <View style={{ flex: 1, marginLeft: -600, marginTop:6 }}>
                                <TimePickerNew setTime={this.onConfirmStartTime} title={''}></TimePickerNew>
                            </View>
                        </View>

                        <View style={styles.locationContainer}>

                            <GooglePlacesAutocomplete
                                MODE_OVERLAY={true}
                                placeholder="Location"
                                minLength={1} // minimum length of text to search
                                autoFocus={false}
                                returnKeyType={'search'}
                                listViewDisplayed="false"
                                fetchDetails={true}
                                renderDescription={row => row.description || row.formatted_address || row.name}
                                onPress={(data, details = null) => {
                                    this.setState({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng });
                                }}
                                getDefaultValue={() => {
                                    return ''; // text input default value
                                }}
                                query={{
                                    key: 'AIzaSyB_OIuPsnUNvJ-CN0z2dir7cVbqJ7Xj3_Q',
                                    language: 'en', // language of the results
                                    //types: '(regions)', // default: 'geocode',
                                }}

                                styles={{
                                    description: {
                                        color: 'black',
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#f34573',
                                    },
                                    textInput: {
                                        backgroundColor: 'rgba(0,0,0,0)',
                                        borderTopWidth: 1.5,
                                        borderBottomWidth: 1.5,
                                        borderLeftWidth: 1,
                                        borderRightWidth: 1,
                                        borderColor: 'gray',
                                        borderRadius: 10
                                    },
                                    textInputContainer: {
                                        backgroundColor: 'rgba(255,255,255,0)',
                                        borderBottomColor: 'rgba(255,255,255,0)',
                                        borderTopColor: 'rgba(255,255,255,0)',
                                        borderColor: 'rgba(255,255,255,0)'
                                    },
                                }}
                                enablePoweredByContainer={true}
                                currentLocation={true}
                                currentLocationLable='Current Location'
                                nearbyPlacesAPI="GoogleReverseGeocoding"
                                GooglePlacesSearchQuery={{
                                    rankby: 'distance',
                                    types: 'food',
                                }}
                                filterReverseGeocodingByTypes={[
                                    'locality',
                                    'administrative_area_level_3',
                                    'street_address'
                                ]}

                                debounce={200}
                                renderLeftButton={() => <Icon4 size={25} style={styles.locationIcon} name='location-pin'></Icon4>}
                            />



                        </View>

                        <Button
                            containerStyle={{ marginVertical: 20 }}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                //marginBottom: 10,
                                marginTop:-10
                            }}
                            buttonStyle={{
                                height: 40,
                                width: 65,
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f34573'
                            }}
                            title="Go"
                            titleStyle={{
                                fontFamily: 'regular',
                                fontSize: 15,
                                color: 'white',
                                textAlign: 'center',
                            }}
                            onPress={() => {
                                this.createNewTraining();
                            }}
                            activeOpacity={0.5}
                        />


                    </View>

                    : null}

            </ScrollView>

        );
    }

}

const styles = StyleSheet.create({
    mainContainer: {
        width: SCREEN_WIDTH - 40,        
        height: 250,
        backgroundColor: 'rgba(255,255,255,1)',
        borderWidth:3,
        borderColor:'gray',
        position: 'absolute',
        borderRadius: 40,
        top: 100,
        zIndex: 1,

    },

    closeIcon: {
        flex: 1,
        top: 20,
        left: 20
    },

    searchContainer: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: 15,
        marginTop: 30
    },

    headline: {
        flex: 3,
        fontSize: 23,
        color: '#f34573',
        fontFamily: 'regular',
        top: 20,
    },

    trainWithContainer: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 50,
        marginLeft: 50,
        marginTop: 15,
        justifyContent: 'center',
    },

    trainWith: {
        margin: 10
    },

    timePickerContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center'
    },

    locationContainer: {
        flex: 2,
        width: SCREEN_WIDTH - 100,
        justifyContent: 'center',
        marginLeft:20
    },

    locationIcon: {
        top: 5,
        left: 5,
        color: 'gray'
    },

    subHeadline: {
        flex: 1,
        fontSize: 15,
        color: 'gray',
        fontFamily: 'regular',
        marginLeft: 30,
    },
    container: {
        flex: 1,
        paddingBottom: 20,
        paddingTop: 30,
        backgroundColor: '#293046',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    formContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    signUpText: {
        flex: 1,
        color: 'white',
        fontSize: 28,
        fontFamily: 'light',
        marginTop: 15,
        textAlign: 'center',
    },

    whoAreYouText: {
        flex: 1,
        color: '#7384B4',
        fontFamily: 'bold',
        fontSize: 14,
        marginTop: 15,
        textAlign: 'center',
    },

    userTypesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: SCREEN_WIDTH,
        alignItems: 'center',
        marginTop: 30,
    },

    inputContainer: {
        paddingLeft: 8,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'rgba(110, 120, 170, 1)',
        height: 45,
        marginVertical: 10,
    },

    inputStyle: {
        flex: 1,
        marginLeft: 10,
        color: 'white',
        fontFamily: 'light',
        fontSize: 16,
    },

    errorInputStyle: {
        marginTop: 0,
        textAlign: 'center',
        color: '#F44336',
    },

    signUpButtonText: {
        fontFamily: 'bold',
        fontSize: 13,
    },

    signUpButton: {
        width: 250,
        borderRadius: 50,
        height: 45,
    },

    loginHereContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    alreadyAccountText: {
        fontFamily: 'lightitalic',
        fontSize: 12,
        color: 'white',
    },

    loginHereText: {
        color: '#FF9800',
        fontFamily: 'lightitalic',
        fontSize: 12,
    },

    viewContainer:
    {
        flex: 1,
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        margin: 35,
    },

    dateOfBirthLabel: {
        marginTop: 9,
        color: 'rgba(216, 121, 112, 1)',
        fontSize: 16,
        marginLeft: -33,
        fontFamily: 'light',
        flex: 1,
        textAlign: 'center'
    },

    textHeadlines: {
        flex: 1,
        fontSize: 15,
        color: 'rgba(216, 121, 112, 1)',
        fontFamily: 'regular',
        marginLeft: 40,
        marginTop: 30
    },

    partnersGenderHeadline: {
        flex: 1,
        fontSize: 15,
        color: 'rgba(216, 121, 112, 1)',
        fontFamily: 'regular',
        marginLeft: 40,
        marginTop: 30
    },

    genderHeadline: {
        flex: 1,
        fontSize: 15,
        color: 'rgba(216, 121, 112, 1)',
        fontFamily: 'regular',
        marginTop: 30
    },

    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: SCREEN_WIDTH,
        alignItems: 'center',
        marginTop: -18,
    },

    partnerPreferencesStyle: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10
    },

    partnerPreferencesContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        margin: 10,
        flexDirection: 'row',
        marginRight: 40
    },

})
