import React, { Component } from 'react';
import {
    LayoutAnimation,
    Dimensions,
    UIManager,
    StyleSheet,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { Font } from 'expo';
import { Input, Button, withTheme } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import NumericInput from 'react-native-numeric-input';
import moment from 'moment';


// Enable LayoutAnimation on Android
import TimePickerNew from '../Components/TimePicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ActionButton from 'react-native-action-button';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var MaxDate = "01-01-" + (new Date().getFullYear() - 18);

var Categories = [
    {
        CategoryCode: 1,
        Description: 'Short Run',
        Selected: false
    },
    {
        CategoryCode: 2,
        Description: 'Yoga',
        Selected: false
    },
    {
        CategoryCode: 3,
        Description: 'Jogging',
        Selected: false
    },
    {
        CategoryCode: 4,
        Description: 'Long Run',
        Selected: false
    },
    {
        CategoryCode: 5,
        Description: 'Walking',
        Selected: false
    },
    {
        CategoryCode: 6,
        Description: 'Functional',
        Selected: false
    },
    {
        CategoryCode: 7,
        Description: 'Pilatis',
        Selected: false
    },
    {
        CategoryCode: 8,
        Description: 'Strength',
        Selected: false
    },
    {
        CategoryCode: 9,
        Description: 'TRX',
        Selected: false
    },
]

UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

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
                onPress={() => {
                    this.setState({ selected: !selected });
                    this.props.setCategories(title);
                }}
            />
        );
    }
}

export default class CreateGroup extends Component {
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
            price:0
        };

        this.validateCategories = this.validateCategories.bind(this);

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

    CreateGroup() {
        const isCategoriesValid = this.validateCategories();
        const isLocationValid = this.validateLocation();
        var Group = null;
        if (
            isCategoriesValid &&
            isLocationValid
        ) {

            this.setState({ isLoading: true });

            setTimeout(() => {
                LayoutAnimation.easeInEaseOut();
                this.setState({
                    isLoading: false,
                });

                Group = {
                    CreatorCode: this.props.navigation.getParam('creatorCode', '0'),
                    Latitude: this.state.latitude,
                    Longitude: this.state.longitude,
                    TrainingTime: this.state.groupTime,
                    MinParticipants: this.state.minParticipants,
                    MaxParticipants: this.state.maxParticipants,
                    WithTrainer: this.props.navigation.getParam('isTrainer'),
                    SportCategoryCode: this.state.sportCategory,
                    StatusCode: 1,
                    CurrentParticipants: 1,
                    Price: this.state.price
                }
                console.warn(Group);
                fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/InsertGroupTraining', {
                    method: 'POST',
                    headers: { "Content-type": "application/json; charset=UTF-8" },
                    body: JSON.stringify(Group),
                })
                    .then(res => res.json())
                    .then(response => { alert('success') })
                    .catch(error => console.warn('Error:', error.message));

            }, 1500);
        }
    }


    setCategories(category) {
        Categories.map(function (x) {
            if (x.Description == category) {
                x.selected = !x.selected;
            }
        });
    }

    validateLocation() {
        if (this.state.latitude == 0 && this.state.longitude == 0) {
            alert('Please choose location for the group training');
            return false;
        }
        return true;
    }

    validateCategories() {
        var counter = 0;
        var temp = 0;
        Categories.map(function (x) {
            if (x.selected) {
                counter++;
            }

        })
        if (counter > 1) {
            alert("Please select only one category");
            return false;
        }
        else {
            Categories.map(function (x) {
                if (x.selected) {
                    {
                        temp = x.CategoryCode;
                    }

                }

            })
            this.setState({ sportCategory: temp });
            return true;
        }
    }

    render() {
        const {
            isLoading,
            fontLoaded,
        } = this.state;

        return !this.state.fontLoaded ? (
            <Text> Loading... </Text>

        ) : (
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.container}
                >

                    <ScrollView style={{
                        flex: 1,
                        paddingBottom: 20,
                        paddingTop: 30,
                        backgroundColor: '#293046',
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT,
                        textAlign: 'center',
                        alignContent: "center"
                    }}>

                        <View style={{ flex: 2, alignContent: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: 40 }}>

                            <Text style={styles.signUpText}>Create new BeneFIT group</Text>

                            <Text style={styles.whoAreYouText}>Your group</Text>

                        </View>

                        <View style={{ flex: 3, width: SCREEN_WIDTH, marginBottom: 30 }}>

                            <GooglePlacesAutocomplete style={{ flex: 1, }}

                                //MODE_OVERLAY={true}
                                placeholder="Choose location for the group training"
                                minLength={1} // minimum length of text to search
                                autoFocus={false}
                                returnKeyType={'search'}
                                listViewDisplayed="false"
                                styles={{
                                    listViewDisplayed: { backgroundColor: 'blue' }

                                }
                                }
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
                                        fontWeight: 'bold',
                                        color: 'white'
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#1faadb',
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
                            />

                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 15 }}>
                            <Icon1
                                size={40}
                                color='rgba(216, 121, 112, 1)'
                                name='clock-o'
                            ></Icon1>

                            <View style={{ flex: 1, flexDirection: 'row', left: 0 }}>

                                <TimePickerNew setTime={this.onConfirmStartTime} title={'When? '}></TimePickerNew>

                            </View>

                        </View >

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: "center", marginTop: 20 }}>

                            <Text style={style = styles.partnersAgeHeadline}>
                                Age
                            </Text>

                            <View style={{ flex: 5, justifyContent: 'center', flexDirection: 'row', marginRight: 25 }}>

                                <NumericInput
                                    style={styles.numericInput}
                                    value={this.state.minParticipants}
                                    onChange={value => this.setState({ minParticipants: value })}
                                    type='up-down'
                                    initValue={this.state.minParticipants}
                                    totalWidth={100}
                                    textColor='white'
                                    minValue={3}
                                    maxValue={this.state.maxParticipants}
                                    rounded
                                />

                                <Text style={{ flex: 1, color: 'white', textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>to</Text>

                                <NumericInput
                                    style={styles.numericInput}
                                    value={this.state.maxParticipants}
                                    onChange={value => this.setState({ maxParticipants: value })}
                                    type='up-down'
                                    initValue={this.state.maxParticipants}
                                    totalWidth={100}
                                    textColor='white'
                                    minValue={this.state.minParticipants}
                                    maxValue={20}
                                    rounded
                                />
                            </View>

                        </View>


{(this.props.navigation.getParam('isTrainer', '0')==1) ?
<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignContent: "center", marginTop: 20 }}>

<Text style={style = styles.partnersAgeHeadline}>
    Price
</Text>

<View style={{ flex: 5, justifyContent: 'center', flexDirection: 'row', marginRight: 25 }}>

    <Text style={{ flex: 1, color: 'white', textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>$</Text>

    <NumericInput
        style={styles.numericInput}
        value={this.state.maxParticipants}
        onChange={value => this.setState({ maxParticipants: value })}
        type='up-down'
        initValue={this.state.maxParticipants}
        totalWidth={100}
        textColor='white'
        minValue={this.state.minParticipants}
        maxValue={20}
        rounded
    />
</View>

</View>
 : null


}
                       

                        <View style={{ flex: 1 }}>

                            <Text
                                style={styles.textHeadlines}
                            >
                                Choose one sport type for the group
                            </Text>

                            <View style={{ flex: 1, width: SCREEN_WIDTH, marginTop: 20, }}>

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

                                            <CustomButton title="Short Run" setCategories={this.setCategories} />
                                            <CustomButton title="Yoga" setCategories={this.setCategories} />
                                            <CustomButton title="Jogging" setCategories={this.setCategories} />

                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row' }}>

                                            <CustomButton title="Long Run" setCategories={this.setCategories} />
                                            <CustomButton title="Walking" setCategories={this.setCategories} />
                                            <CustomButton title="Functional" setCategories={this.setCategories} />

                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>

                                            <CustomButton title="Pilatis" setCategories={this.setCategories} />
                                            <CustomButton title="Strength" setCategories={this.setCategories} />
                                            <CustomButton title="TRX" setCategories={this.setCategories} />

                                        </View>

                                    </View>

                                </ScrollView>

                            </View>

                        </View>

                        <Button
                            containerStyle={{ marginVertical: 20 }}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 10
                            }}
                            buttonStyle={{
                                height: 55,
                                width: SCREEN_WIDTH - 250,
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            linearGradientProps={{
                                colors: ['rgba(216, 121, 112, 1)', 'rgba(216, 121, 112, 1)'],
                                start: [1, 0],
                                end: [0.2, 0],
                            }}
                            title="Ok"
                            titleStyle={{
                                fontFamily: 'regular',
                                fontSize: 20,
                                color: 'white',
                                textAlign: 'center',
                            }}
                            onPress={() => this.CreateGroup()}
                            activeOpacity={0.5}
                        />

                    </ScrollView>


                </ScrollView>

            );
    }
}

export const FormInput = props => {
    const { icon, refInput, ...otherProps } = props;
    return (
        <Input
            {...otherProps}
            ref={refInput}
            inputContainerStyle={styles.inputContainer}
            leftIcon={<Icon name={icon} color="#7384B4" size={18} />}
            inputStyle={styles.inputStyle}
            autoFocus={false}
            autoCapitalize="none"
            keyboardAppearance="dark"
            errorStyle={styles.errorInputStyle}
            autoCorrect={false}
            blurOnSubmit={false}
            placeholderTextColor="#7384B4"
        />
    );
};



const styles = StyleSheet.create({

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

});