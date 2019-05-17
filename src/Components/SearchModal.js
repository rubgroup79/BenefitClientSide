import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, LayoutAnimation, ScrollView} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button, } from 'react-native-elements';
import GenderButton from './genderButton';
import { Font } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/Entypo';
import TimePickerNew from './TimePicker';
import moment from 'moment';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MALE_AVATAR = require('../../Images/MaleAvatar.png');
const FEMALE_AVATAR = require('../../Images/FemaleAvatar.png');
const TRAINER_AVATAR = require('../../Images/TrainerAvatar.png');
const TRAINEE_AVATAR = require('../../Images/TraineeAvatar.png');

var hours_now = new Date().getHours();
var minutes_now = new Date().getMinutes();
var timeNow = hours_now + ":" + minutes_now;

export default class SearchModal extends Component {
    constructor(props) {

        super(props);

        this.state = {
            fontLoaded: false,
            latitude: 0,
            longitude: 0,
            withTrainer: false,
            withPartner: false,
            groupWithTrainer: false,
            groupWithPartners: false,
            startTime: (moment(new Date()).format('YYYY-MM-DD HH:mm:ss')),
            endTime: (moment(new Date()).format('YYYY-MM-DD HH:mm:ss')),
            coupleResults: [],
            groupResults: [],
        };
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

    boolToInt(b) {
        if (b == true)
            return 1;
        else return 0;
    }

    setPartnerTraining = () =>
        LayoutAnimation.easeInEaseOut() || this.setState({ withPartner: !this.state.withPartner });

    setTrainerTraining = () =>
        LayoutAnimation.easeInEaseOut() || this.setState({ withTrainer: !this.state.withTrainer });

    setPartnersGroupTraining = () =>
        LayoutAnimation.easeInEaseOut() || this.setState({ groupWithPartners: !this.state.groupWithPartners });

    setTrainerGroupTraining = () =>
        LayoutAnimation.easeInEaseOut() || this.setState({ groupWithTrainer: !this.state.groupWithTrainer });

    onConfirmStartTime = (hour, minute) => {
        start = hour + ":" + minute;
        this.setState({ startTime: moment(new Date()).format('YYYY-MM-DD') + " " + start + ":00.000" });
    }

    onConfirmEndTime = (hour, minute) => {
        end = hour + ":" + minute;
        this.setState({ endTime: moment(new Date()).format('YYYY-MM-DD') + " " + end + ":00.000" });
    }

    search() {
        if (!this.state.withPartner && !this.state.withTrainer && !this.state.groupWithPartners && !this.state.groupWithTrainer)
            alert("Please choose who to want to train with");
        else {
            if (this.state.startTime < this.state.endTime)
                alert("Start time cannot be before end time");
            else {
                if (this.state.latitude == 0 && this.state.longitude == 0) {
                    var OnlineDetails = {
                        UserCode: this.props.userCode,
                        Latitude: this.state.latitude,
                        Longitude: this.state.longitude,
                        StartTime: this.state.startTime,
                        EndTime: this.state.endTime,
                        WithTrainer: this.boolToInt(this.state.withTrainer),
                        WithPartner: this.boolToInt(this.state.withPartner),
                        GroupWithTrainer: this.boolToInt(this.state.groupWithTrainer),
                        GroupWithPartners: this.boolToInt(this.state.groupWithPartners),
                    };

                    this.props.setSearchLocation(this.state.latitude, this.state.longitude);
                    this.props.searchModalVisible();
                    this.props.setSearchMode(true);

                    //נכנס רק אם משתמש חיפש אימון זוגי עם מאמן או מתאמן

                    if (OnlineDetails.WithPartner == 1 || OnlineDetails.WithTrainer == 1) {

                        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/InsertOnlineTrainee', {
                            method: 'POST',
                            headers: { "Content-type": "application/json; charset=UTF-8" },
                            body: JSON.stringify(OnlineDetails),
                        })
                            .then(res => res.json())
                            .then(response => {
                                if (response.length == 0) alert('No Couple Training Results');
                                else {
                                    this.props.getCoupleResults(response);
                                }
                            })

                            .catch(error => console.warn('Error:', error.message));
                    }

                    //נכנס רק אם משתמש חיפש אימון קבוצתי עם מאמן או בלי מאמן

                    if (this.state.groupWithTrainer || this.state.groupWithPartners) {

                        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/SearchGroups', {

                            method: 'POST',
                            headers: { "Content-type": "application/json; charset=UTF-8" },
                            body: JSON.stringify(OnlineDetails),
                        })
                            .then(res => res.json())
                            .then(response => {
                                if (response.length == 0) alert('No Group Results');
                                else {
                                    this.props.getGroupResults(response);
                                }

                            })

                            .catch(error => console.warn('Error:', error.message));
                    }
                    
                }
                else alert("Please select location");
            }
        }
    }


    render() {
        return (

            <ScrollView style={styles.mainContainer}>

                <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => this.props.searchModalVisible()}></Icon>

                {this.state.fontLoaded ?

                    <View style={styles.searchContainer}>

                        <Text style={styles.headline}>Find Your BeneFIT</Text>

                            <View style={styles.trainWithContainer} >

                                <GenderButton 
                                    label={"Partner"} 
                                    labelColor={'gray'} 
                                    style={styles.trainWith}
                                    image={TRAINEE_AVATAR}
                                    onPress={ () => {this.setPartnerTraining();}}
                                    selected={this.state.withPartner == true}
                                />
 
                                <GenderButton 
                                    label={"Trainer"} 
                                    labelColor={'gray'}  
                                    style={styles.trainWith}
                                    image={TRAINER_AVATAR}
                                    onPress={ () => {this.setTrainerTraining();}}
                                    selected={this.state.withTrainer == true}
                                />

                                <GenderButton 
                                    label={"Partners"} 
                                    labelColor={'gray'}  
                                    style={styles.trainWith}
                                    image={MALE_AVATAR}
                                    onPress={ () => {this.setPartnersGroupTraining();}}
                                    selected={this.state.groupWithPartners == true}
                                />

                                <GenderButton 
                                    label={"Partners & Trainer"} 
                                    labelColor={'gray'}  
                                    style={styles.trainWith}
                                    image={FEMALE_AVATAR}
                                    onPress={() => {this.setTrainerGroupTraining();}}
                                    selected={this.state.groupWithTrainer == true}
                                />

                            </View>

                                <View style={styles.timePickerContainer  }>

                                    <TimePickerNew setTime={this.onConfirmStartTime} title={'From: '}></TimePickerNew>

                                    <TimePickerNew setTime={this.onConfirmEndTime} title={'To: '}></TimePickerNew>

                                </View>

                        <View style={styles.locationContainer }>

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
                                        color: '#1faadb',
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
                                        backgroundColor: 'white',
                                        borderBottomColor: 'white',
                                        borderTopColor: 'white',
                                        borderColor: 'white'
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

                            <Button
                                containerStyle={{ marginVertical: 20 }}
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 10,
                                }}
                                buttonStyle={{
                                    height: 40,
                                    width: 65,
                                    borderRadius: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor:'rgba(216, 121, 112, 1)'
                                }}
                                title="Go"
                                titleStyle={{
                                    fontFamily: 'regular',
                                    fontSize: 15,
                                    color: 'white',
                                    textAlign: 'center',
                                }}
                                onPress={() => {
                                    this.search();
                                }}
                                activeOpacity={0.5}
                            />

                        </View>

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

    closeIcon:{
        top: 20,
        left: 20
    },

    searchContainer:{ 
        flex: 1, 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: 15, 
        marginTop: 30 
    },

    headline: {
        flex: 1,
        fontSize: 23,
        color: 'rgba(216, 121, 112, 1)',
        fontFamily: 'regular',
    },

    trainWithContainer: {
        flex: 3,
        flexDirection: 'row',
    },

    trainWith:{
        margin: 10 
    },
    
    timePickerContainer:{
        flex: 1, 
        flexDirection: 'row', 
        marginTop: 10
    },
    
    locationContainer:{
        flex: 2, 
        width: SCREEN_WIDTH - 100, 
        marginTop: 10 
    },

    locationIcon:{
        top: 5,
        left: 5, 
        color: 'gray' 
    }

})
