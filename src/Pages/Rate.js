import React, { Component, } from 'react';
import { View, ScrollView, StyleSheet, Image, ListView, Dimensions, KeyboardAvoidingView, TextInput, } from 'react-native';
import { Font } from 'expo';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import CreateNewTrainingModal from '../Components/CreateNewTrainingModal';
import RatingStars from '../Components/RatingStars';
import {
    Text,
    Card,
    Tile,
    ListItem,
    Avatar,

    Button
} from 'react-native-elements';
import colors from '../config/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

parametersRate = [5, 5, 5, 5, 5]

class Rate extends Component {
    constructor() {
        super();
        this.state = {
            fontLoaded: false,
            ratingExists: false,
            oldRate: 0,
            oldRateCode: 0

        };
        this.setParameterRate1 = this.setParameterRate1.bind(this);
        this.setParameterRate2 = this.setParameterRate2.bind(this);
        this.setParameterRate3 = this.setParameterRate3.bind(this);
        this.setParameterRate4 = this.setParameterRate4.bind(this);
        this.setParameterRate5 = this.setParameterRate5.bind(this);

        this.submitRate = this.submitRate.bind(this);
    }

    setParameterRate1(rate) {
        parametersRate[0] = rate;
    }

    setParameterRate2(rate) {
        parametersRate[1] = rate;
    }

    setParameterRate3(rate) {
        parametersRate[2] = rate;
    }

    setParameterRate4(rate) {
        parametersRate[3] = rate;
    }

    setParameterRate5(rate) {
        parametersRate[4] = rate;
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
       
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckIfRateExists?UserCode=' + this.props.navigation.getParam('UserCode', null) + '&RatedUserCode=' + this.props.navigation.getParam('RatedUserCode', null), {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                if (response.AvgTotalRate != 0) {
                    console.warn(response.RatingCode);
                    this.setState({ ratingExists: true, oldRate: response.AvgTotalRate, oldRateCode: response.RatingCode });
                }
            })
            .catch(error => console.warn('Error:', error.message));

    }

    submitRate() {
        TotalRate = 0;
        parametersRate.map((rate) => {
            TotalRate += rate;
        });
        AvgRate = TotalRate / parametersRate.length;

        if (this.state.ratingExists) {
            
            parametersRate.map((rate, index) => {
                ParameterRate = {
                    RatingCode: this.state.oldRateCode,
                    ParameterCode: index + 1,
                    Rate: rate
                }        
                
                fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/UpdateExistingParametersRate', {
                method: 'POST',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(ParameterRate)
            })
                .then(() => { })
                .catch(error => console.warn('Error:', error.message));
            })
                
                Rating = {
                    RatingCode:this.state.oldRateCode,
                    AvgTotalRate: AvgRate,
                    RatedCode: this.props.navigation.getParam('RatedUserCode', null)
                }

                fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/UpdateExistingAvarageRate', {
                method: 'POST',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(Rating)
            })
                .then(() => { })
                .catch(error => console.warn('Error:', error.message));
            }

            
        else {
            Rating = {
                TraineeCode: this.props.navigation.getParam('UserCode', null),
                RatedCode: this.props.navigation.getParam('RatedUserCode', null),
                AvgTotalRate: AvgRate
            }

            fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/InsertNewRating', {
                method: 'POST',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify(Rating)
            })
                .then(res => res.json())
                .then(response => {
                    parametersRate.map((rate, index) => {
                        ParameterRate = {
                            RatingCode: response,
                            ParameterCode: index + 1,
                            Rate: rate
                        }
                        this.insertParametersRate(ParameterRate);

                    })
                        .catch(error => console.warn('Error:', error.message));
                })

        }

        this.props.navigation.navigate('Trainings');
    }

    insertParametersRate(ParameterRate) {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/InsertParametersRate', {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(ParameterRate)
        })
            .then(() => { })
            .catch(error => console.warn('Error:', error.message));
    }


    render() {

        return (
            <View>

                {this.state.fontLoaded ?

                    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute' }}>

                        <View
                            style={[
                                styles.headerContainer,
                                { backgroundColor: '#f5f5f5', marginTop: 20, zIndex: 1, },
                            ]}
                        >
                            <View style={{ flex: 1, }}>
                                <Button
                                    icon={() =>
                                        <Icon name='left' size={20} />}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: 8,
                                        marginLeft: 10
                                    }}
                                    buttonStyle={{
                                        height: 45,
                                        width: 45,
                                        borderRadius: 30,
                                        backgroundColor: 'transparent',

                                    }}
                                    onPress={() => this.props.navigation.navigate('Trainings')}
                                    activeOpacity={0.5}
                                />
                            </View>
                            <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-end', }}>

                                <Text style={styles.heading}>{"Rate " + this.props.navigation.getParam('FullName', null)}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <Image style={{ width: 80, height: 80, borderRadius: 40 }} source={{ uri: this.props.navigation.getParam('Picture', null) }} />
                                {this.state.ratingExists ? <Text style={{ fontFamily: 'regular', fontSize: 8 }}>{'You already rated this user with total rate of ' + this.state.oldRate + ' stars. The new rate will delete this rate'}</Text> : null}
                            </View>
                            <View style={{ flex: 6 }}>

                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    <Text style={{ fontFamily: 'bold', color: '#f34573', textAlign: 'center' }}>Parameter 1</Text>
                                    <RatingStars setParameterRate={this.setParameterRate1}></RatingStars>
                                </View>

                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    <Text style={{ fontFamily: 'bold', color: '#f34573', textAlign: 'center' }}>Parameter 2</Text>
                                    <RatingStars setParameterRate={this.setParameterRate2}></RatingStars>
                                </View>

                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    <Text style={{ fontFamily: 'bold', color: '#f34573', textAlign: 'center' }}>Parameter 3</Text>
                                    <RatingStars setParameterRate={this.setParameterRate3}></RatingStars>
                                </View>

                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    <Text style={{ fontFamily: 'bold', color: '#f34573', textAlign: 'center' }}>Parameter 4</Text>
                                    <RatingStars setParameterRate={this.setParameterRate4}></RatingStars>
                                </View>

                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    <Text style={{ fontFamily: 'bold', color: '#f34573', textAlign: 'center' }}>Parameter 5</Text>
                                    <RatingStars setParameterRate={this.setParameterRate5}></RatingStars>
                                </View>

                                <View style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}>
                                    <Button
                                        title={'Submit'}
                                        titleStyle={{ fontFamily: 'regular' }}
                                        onPress={() => this.submitRate()}
                                        buttonStyle={{
                                            justifyContent: 'center',
                                            alignItems: 'center',

                                            width: 100,
                                            height: 45,
                                            backgroundColor: '#f34573',
                                            borderRadius: 30
                                        }}
                                    />
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
        height: 60,
        //paddingBottom:10
    },

    heading: {
        color: 'black',
        marginTop: 10,
        fontSize: 15,
        flex: 1,
        textAlign: 'center',
        fontFamily: 'bold',
        marginLeft: -110
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

export default Rate;
