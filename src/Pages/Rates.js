import React, { Component, } from 'react';
import { View, ScrollView, StyleSheet, Image, ListView, Dimensions, KeyboardAvoidingView, TextInput, AsyncStorage } from 'react-native';
import { Font } from 'expo';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import CreateNewTrainingModal from '../Components/CreateNewTrainingModal';
import RatingStarsShowOnly from '../Components/RatingStarsShowOnly';
import Star from '../Components/Star';
import {
    Text,
    Card,
    Tile,
    ListItem,
    Avatar,

    Button
} from 'react-native-elements';
import colors from '../config/colors';
import _ from 'lodash';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

parametersRate = [5, 5, 5, 5, 5]

class Rates extends Component {
    constructor() {
        super();
        this.state = {
            fontLoaded: false,
            userCode: 0,
            isTrainer: 0,
            averageRates: [
                {
                    Parameter: {
                        ParameterCode: 1,
                        Description: 'Parameter 1'
                    },
                    AverageRate: 2.5
                },
                {
                    Parameter: {
                        ParameterCode: 2,
                        Description: 'Parameter 2'
                    },
                    AverageRate: 4.8
                },
                {
                    Parameter: {
                        ParameterCode: 1,
                        Description: 'Parameter 1'
                    },
                    AverageRate: 2.5
                },
                {
                    Parameter: {
                        ParameterCode: 2,
                        Description: 'Parameter 2'
                    },
                    AverageRate: 4.8
                },
                {
                    Parameter: {
                        ParameterCode: 1,
                        Description: 'Parameter 1'
                    },
                    AverageRate: 2.5
                }
            ]


        };
        this.getLocalStorage = this.getLocalStorage.bind(this);
        this.getRates = this.getRates.bind(this);
        this.renderRates = this.renderRates.bind(this);

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

    async UNSAFE_componentWillMount() {
        this.getLocalStorage();

    }

    getLocalStorage = async () => {
        await AsyncStorage.getItem('UserCode', (err, result) => {
            if (result != null) {
                this.setState({ userCode: result }, this.getRates);
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

    getRates() {
        // fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetAvarageParametersRate?UserCode=' + this.state.userCode, {

        //     method: 'GET',
        //     headers: { "Content-type": "application/json; charset=UTF-8" },
        // })
        //     .then(res => res.json())
        //     .then(response => {
        //         this.setState({ averageRates: response });
        //     })
        //     .catch(error => console.warn('Error:', error.message));
    }

    renderRates() {
        return (
            this.state.averageRates.map((rate) => {
                return (
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'bold', color: '#f34573', textAlign: 'center' }}>{rate.Parameter.Description}</Text>
                        <RatingStarsShowOnly Position={rate.AverageRate} ></RatingStarsShowOnly>
                    </View>)
            })
        )
    }

    render() {

        return (
            <View>
                {/* && this.state.averageRates.length!=0 */}
                {this.state.fontLoaded ?
                    <View>
                        <View
                            style={[
                                styles.headerContainer,
                                { backgroundColor: '#f5f5f5', marginTop: 20 },
                            ]}
                        >
                            <Image style={{ width: 57, height: 38, marginLeft: 18 }} source={require('../../Images/LogoOnly.png')} />
                            <Text style={styles.heading}>Rates</Text>
                        </View>
                        <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT-140, alignItems: 'center', marginTop: 20 }}>

                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Image style={{ width: 60, height: 60, alignItems: 'center' }} source={require('../../Images/SelectedStar.png')}></Image>
                                    <Text style={{ alignItems: 'center', flex: 1, padding: 0, marginLeft: 20, fontSize: 15, fontFamily: 'bold', color: '#7384B4' }}>1.5</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    {this.renderRates()}
                                </View>
                            </View>

                        </View>
                    </View> : null}
            </View>
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
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        backgroundColor: '#d0d4db',
        height: 80,
        //paddingBottom:10
    },

    heading: {
        color: 'black',
        marginTop: 10,
        fontSize: 30,
        flex: 1,
        textAlign: 'center',
        fontFamily: 'bold',
        //marginLeft: -110
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
    newInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        padding: 10,
        height: 50,
        flex: 1,
        position: 'absolute',
    },
});

export default Rates;
