import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, LayoutAnimation, ScrollView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {  Button } from 'react-native-elements';
import { Font } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/Entypo';
import TimePickerNew from './TimePicker';
import moment from 'moment';
const SCREEN_WIDTH = Dimensions.get('window').width;

var hours_now = new Date().getHours();
var inserted_hour = "20";
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
            forecastTemp: "",
            forecastDesc:""
        };

        this.getWeather = this.getWeather.bind(this);


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
        inserted_hour = hour;
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
                    WithTrainer: this.props.WithTrainer,
                    Price: 0
                }

               

                fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/InsertCoupleTraining', {
                    method: 'POST',
                    headers: { "Content-type": "application/json; charset=UTF-8" },
                    body: JSON.stringify(CoupleTraining),
                })
                    .then(() => {
                        alert('Your training is booked! Please notice that the weather will be '+this.state.forecastTemp+"°c with "+this.state.forecastDesc);
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

    getWeather() {
        index = Math.floor(((inserted_hour - new Date().getHours()) / 3));
        // Construct the API url to call
        let url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + this.state.latitude + '&lon=' + this.state.longitude + "&units=metric&appid=5c2433d8113849df4c21949af64f6f74";

        // Call the API, and set the state of the weather forecast
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState((prevState, props) => ({
                    forecastTemp: Math.floor(data.list[index].main.temp), forecastDesc:data.list[index].weather[0].description
                }));
                this.createNewTraining();
            })
    }

    render() {
        return (

            <ScrollView style={styles.mainContainer}>
                <View style={styles.header}>
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => { this.props.createNewTrainingModalVisible(false) }}></Icon>
                    <Text style={styles.headline}>Create New Training</Text>
                </View>

                {this.state.fontLoaded ?

                    <View style={styles.searchContainer}>
                        <View style={styles.timePickerContainer}>
                            <Text style={styles.subHeadline}>
                                When?
                            </Text>
                            <View style={styles.timePickerView}>
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
                            containerStyle={styles.goButtonContainerStyle}
                            style={styles.goButton}
                            buttonStyle={styles.goButtonStyle}
                            title="Go"
                            titleStyle={styles.goButtonTitle}
                            onPress={() => {
                                this.getWeather();
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
        borderWidth: 3,
        borderColor: 'gray',
        position: 'absolute',
        borderRadius: 40,
        top: 100,
        zIndex: 1,

    },
    header:
    { flex: 1, flexDirection: 'row', alignItems: 'center' },
timePickerView:
{ flex: 1, marginLeft: -600, marginTop: 6 },

goButtonContainerStyle:
{ marginVertical: 20 },
goButton:
{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10
},
goButtonStyle:
{
    height: 40,
    width: 65,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f34573'
},
goButtonTitle:
{
    fontFamily: 'regular',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
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
        marginLeft: 20
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

})
