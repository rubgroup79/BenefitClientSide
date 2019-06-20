import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, LayoutAnimation, ScrollView, UIManager, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Input, Button, withTheme, Slider } from 'react-native-elements';
import { Font } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/Entypo';
import TimePickerNew from './TimePicker';
import NumericInput from 'react-native-numeric-input';
import CustomButton from '../Components/CategoriesButton';
import moment from 'moment';
import ActionButton from 'react-native-action-button';
const SLIDER_SIZE = SCREEN_WIDTH - 100;
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


UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);


export default class CreateGroupModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            fontLoaded: false,
            groupTime: (moment(new Date()).format('YYYY-MM-DD HH:mm:ss')),
            latitude: 0,
            longitude: 0,
            minParticipants: 3,
            maxParticipants: 7,
            sportCategory: 0,
            selectedSportCategories: [],
            price: 0
        };

        //this.validateCategories = this.validateCategories.bind(this);
        this.getSportCategories = this.getSportCategories.bind(this);
        this.setCategories = this.setCategories.bind(this);

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
        this.setState({ groupTime: moment(new Date()).format('YYYY-MM-DD') + " " + time + ":00.000" });
    }

    UNSAFE_componentWillMount() {
        this.getSportCategories();
    }

    getSportCategories() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetSportCategories', {

            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {

                temp = response.map((category) => {
                    return ({ CategoryCode: category.CategoryCode, Description: category.Description, Selected: false })
                })
                this.setState({ sportCategories: response, selectedSportCategories: temp, status: 1 });
            })

            .catch(error => console.warn('Error:', error.message));

    }


    checkForCloseTrainings() {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/checkForCloseTrainings?UserCode=' + this.props.CreatorCode + '&TrainingTime=' + this.state.groupTime, {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
        .then(res => res.json())
            .then(response => {
                if (response)
                    Alert.alert(
                        'Warning',
                        'You have already booked a training for this time! Are you sure you want to continue?',
                        [
                            { text: "Yes, I'm sure!", onPress: () => this.createGroup() },
                            {
                                text: 'Cancel',
                                onPress: () => { },
                                style: 'cancel',
                            },
                        ],
                        { cancelable: false },
                    );
                    else this.createGroup();
            })
            .catch(error => console.warn('Error:', error.message));
    }

    createGroup() {
        const isLocationValid = this.validateLocation();
        var Group = null;
        if (

            isLocationValid
        ) {

            this.setState({ isLoading: true });

            setTimeout(() => {
                LayoutAnimation.easeInEaseOut();
                this.setState({
                    isLoading: false,
                });

                Group = {
                    CreatorCode: this.props.CreatorCode,
                    Latitude: this.state.latitude,
                    Longitude: this.state.longitude,
                    TrainingTime: this.state.groupTime,
                    MinParticipants: this.state.minParticipants,
                    MaxParticipants: this.state.maxParticipants,
                    WithTrainer: this.props.IsTrainer,
                    SportCategoryCode: this.state.sportCategory,
                    Price: this.state.price
                }

                fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/InsertGroupTraining', {
                    method: 'POST',
                    headers: { "Content-type": "application/json; charset=UTF-8" },
                    body: JSON.stringify(Group),
                })

                    .then(response => {
                        alert('Your group is now open for partners!');
                        this.props.createGroupModalVisible();
                        this.props.refresh('future');
                    })
                    .catch(error => console.warn('Error:', error.message));

            }, 1500);
           
        }
    }


    setCategories(category) {
        selectedCategory = 0;
        this.state.selectedSportCategories.map(function (x) {
            if (x.Description == category) {
                x.Selected = !x.Selected;
                selectedCategory = x.CategoryCode;
            }
            else x.Selected = false;
        });

        this.setState({ sportCategory: selectedCategory });
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
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => { this.props.createGroupModalVisible() }}></Icon>
                    <Text style={styles.headline}>Create Your Group</Text>
                </View>

                {this.state.fontLoaded && this.state.status == 1 ?

                    <View style={styles.searchContainer}>
                        <View style={styles.timePickerContainer}>
                            <Text style={styles.subHeadline}>
                                When?
                            </Text>
                            <View style={{ flex: 1, marginLeft: -600, marginTop: 6 }}>
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

                        <View style={{ flex: 1, flexDirection: 'column', marginTop: 15, marginBottom: 15 }}>
                            <Text style={styles.subHeadline}>
                                Participants
                            </Text>
                            <View style={styles.trainWithContainer} >

                                <NumericInput
                                    value={this.state.minParticipants}
                                    onChange={value => this.setState({ minParticipants: value })}
                                    type='up-down'
                                    initValue={this.state.minParticipants}
                                    totalWidth={100}
                                    textColor='gray'
                                    minValue={3}
                                    maxValue={this.state.maxParticipants}
                                    rounded
                                />

                                <Text style={{ flex: 1, color: 'gray', textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>to</Text>

                                <NumericInput
                                    value={this.state.maxParticipants}
                                    onChange={value => this.setState({ maxParticipants: value })}
                                    type='up-down'
                                    initValue={this.state.maxParticipants}
                                    totalWidth={100}
                                    textColor='gray'
                                    minValue={this.state.minParticipants}
                                    maxValue={20}
                                    rounded
                                />

                            </View>


                        </View>
                        {this.props.isTrainer==1 ? 
                        <View style={{flex:1, flexDirection:'column'}}>
                        <Text style={styles.subHeadline}>
                            Price
                            </Text>
                        <View style={styles.sliderContainerStyle} >

                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={styles.sliderRangeText}>0</Text >

                                <Slider
                                    minimumTrackTintColor='gray'
                                    maximumTrackTintColor='#c7c9cc'
                                    thumbTintColor='#f34573'
                                    style={styles.sliderStyle}
                                    minimumValue={0}
                                    step={10}
                                    maximumValue={500}
                                    value={this.state.maxBudget}
                                    onValueChange={value => this.setState({ price: value })}
                                />

                                <Text style={style = styles.sliderRangeText}>500</Text>

                            </View>
                            <Text style={{ color: '#f34573', textAlign: 'center', fontSize: 13 }}>Price: {this.state.price} $</Text>
                        </View>
                        </View> :null}
                        

                        <View style={{ flex: 1, marginTop: 20, }}>

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    height: 150,
                                    marginLeft: 20,
                                    marginRight: 10,
                                }}
                            >

                                <View style={{ flex: 1, flexDirection: 'row' }}>

                                    <CustomButton selected={this.state.selectedSportCategories[0].Selected} editMode={true} title="Short Run" setCategories={this.setCategories} />
                                    <CustomButton selected={this.state.selectedSportCategories[1].Selected} editMode={true} title="Yoga" setCategories={this.setCategories} />
                                    <CustomButton selected={this.state.selectedSportCategories[2].Selected} editMode={true} title="Jogging" setCategories={this.setCategories} />

                                </View>

                                <View style={{ flex: 1, flexDirection: 'row' }}>

                                    <CustomButton selected={this.state.selectedSportCategories[3].Selected} editMode={true} title="Long Run" setCategories={this.setCategories} />
                                    <CustomButton selected={this.state.selectedSportCategories[4].Selected} editMode={true} title="Walking" setCategories={this.setCategories} />
                                    <CustomButton selected={this.state.selectedSportCategories[5].Selected} editMode={true} title="Functional" setCategories={this.setCategories} />

                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>

                                    <CustomButton selected={this.state.selectedSportCategories[6].Selected} editMode={true} title="Pilatis" setCategories={this.setCategories} />
                                    <CustomButton selected={this.state.selectedSportCategories[7].Selected} editMode={true} title="Strength" setCategories={this.setCategories} />
                                    <CustomButton selected={this.state.selectedSportCategories[8].Selected} editMode={true} title="TRX" setCategories={this.setCategories} />

                                </View>

                            </View>
                        </View>

                        <Button
                            containerStyle={{ marginVertical: 20 }}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                //marginBottom: 10,
                                marginTop: -10
                            }}
                            buttonStyle={{
                                height: 60,
                                width: 140,
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
                                this.checkForCloseTrainings();
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
        height: SCREEN_HEIGHT - 370,
        backgroundColor: 'rgba(255,255,255,0.9)',
        position: 'absolute',
        borderRadius: 40,
        top: 200,
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
    sliderRangeText: {
        flex: 1,
        color: '#f34573',
        marginTop: 37,
        textAlign: 'center',
        fontFamily: 'bold'
    },

    sliderStyle: {
        width: 200,
        marginTop: 35,
    },


    sliderContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: -18
    },


})
