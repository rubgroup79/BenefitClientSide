import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, LayoutAnimation, ScrollView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button, } from 'react-native-elements';
import AvatarImage from './AvatarImage';
import { Font } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/Entypo';
import TimePickerNew from './TimePicker';
import moment from 'moment';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const TRAINER = require('../../Images/Trainer.png');
const PARTNER = require('../../Images/Partner.png');
const GROUP_WITH_TRAINER = require('../../Images/GroupWithTrainer.png');
const GROUP_WITH_PARTNERS = require('../../Images/GroupWithPartners.png');

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

   
    validateSearchInput() {
        if (!this.state.withPartner && !this.state.withTrainer && !this.state.groupWithPartners && !this.state.groupWithTrainer)
            alert("Please choose who to want to train with");
        else {
            if (this.state.startTime > this.state.endTime)
                alert("Start time cannot be before end time");
            else {
                if (this.state.latitude != 0 && this.state.longitude != 0) {
                    //this.props.userCode
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
                    this.props.searchModalVisible();
                    this.props.changeSearchMode();
                    
                    this.props.insertOnlineTrainee(OnlineDetails);

                } 
                else alert("Please select location");
            } 
           
        }
    }



    render() {
        return (

            <ScrollView style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <Icon name='close' style={styles.closeIcon} size={20} color='gray' onPress={() => this.props.searchModalVisible()}></Icon>
                    <Text style={styles.headline}>Find Your BeneFIT</Text>
                </View>
                {this.state.fontLoaded ?

                    <View style={styles.searchContainer}>

                        <View style={styles.trainWithContainer} >

                            <AvatarImage
                                label={"Partner"}
                                lableFontSize={9}
                                labelColor={'#75cac3'}
                                image={PARTNER}
                                height={65}
                                width={65}
                                selectedHeight={70}
                                selectedWidth={70}
                                onPress={() => { this.setPartnerTraining(); }}
                                selected={this.state.withPartner == true}
                            />

                            <AvatarImage
                                label={"Trainer"}
                                lableFontSize={9}
                                labelColor={'#75cac3'}
                                image={TRAINER}
                                height={65}
                                width={65}
                                selectedHeight={70}
                                selectedWidth={70}
                                onPress={() => { this.setTrainerTraining(); }}
                                selected={this.state.withTrainer == true}
                            />

                            <AvatarImage
                                label={"Group"}
                                lableFontSize={9}
                                labelColor={'#75cac3'}
                                image={GROUP_WITH_PARTNERS}
                                height={65}
                                width={65}
                                selectedHeight={70}
                                selectedWidth={70}
                                onPress={() => { this.setPartnersGroupTraining(); }}
                                selected={this.state.groupWithPartners == true}
                            />

                            <AvatarImage
                                label={"Group&Trainer"}
                                lableFontSize={9}
                                labelColor={'#75cac3'}
                                image={GROUP_WITH_TRAINER}
                                height={65}
                                width={65}
                                selectedHeight={70}
                                selectedWidth={70}
                                onPress={() => { this.setTrainerGroupTraining(); }}
                                selected={this.state.groupWithTrainer == true}
                            />

                        </View>

                        <View style={styles.timePickerContainer}>

                            <TimePickerNew setTime={this.onConfirmStartTime} title={'From: '}></TimePickerNew>

                            <TimePickerNew setTime={this.onConfirmEndTime} title={'To: '}></TimePickerNew>

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
                                style={styles.buttonStyle1}
                                buttonStyle={styles.buttonStyle2}
                                title="Go"
                                titleStyle={styles.titleStyle}
                                onPress={() => {
                                    this.validateSearchInput();
                                    
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
headerContainer:
{ flex: 1, flexDirection: 'row', alignItems: 'center' },
buttonStyle1:
{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
},
buttonStyle2:
{
    height: 60,
    width: 140,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f34573'
},
titleStyle:
{
    fontFamily: 'bold',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
},
    closeIcon: {
        top: 20,
        left: 20,
        flex: 1
    },

    searchContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
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
        flex: 3,
        flexDirection: 'row',
    },


    timePickerContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10
    },

    locationContainer: {
        flex: 2,
        width: SCREEN_WIDTH - 100,
        marginTop: 10
    },

    locationIcon: {
        top: 5,
        left: 5,
        color: 'gray'
    }

})
