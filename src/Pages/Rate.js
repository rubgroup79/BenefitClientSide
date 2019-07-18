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

parametersRate = [3, 3, 3, 3, 3]

class Rate extends Component {
    constructor() {
        super();
        this.state = {
            fontLoaded: false,
            ratingExists: false,
            oldRate: 0,
            oldRateCode: 0,
            rateParameters:[],
            status:0

        };
        this.setParameterRate1 = this.setParameterRate1.bind(this);
        this.setParameterRate2 = this.setParameterRate2.bind(this);
        this.setParameterRate3 = this.setParameterRate3.bind(this);
        this.setParameterRate4 = this.setParameterRate4.bind(this);
        this.setParameterRate5 = this.setParameterRate5.bind(this);
        this.getRateParameters=this.getRateParameters.bind(this);
        this.checkIfRateExists=this.checkIfRateExists.bind(this);


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
        this.getRateParameters();
        this.checkIfRateExists();
    }

    getRateParameters()
    {
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/GetParametersDescription', {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                    this.setState({ rateParameters:response, status:1});
            })
            .catch(error => console.warn('Error:', error.message));
    }

    checkIfRateExists(){
     
        fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckIfRateExists?UserCode=' + this.props.navigation.getParam('UserCode', null) + '&RatedUserCode=' + this.props.navigation.getParam('RatedUserCode', null), {
            method: 'GET',
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
            .then(res => res.json())
            .then(response => {
                if (response.AvgTotalRate != 0) {
                 
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
        alert('Your rate was saved!');
        const { goBack } = this.props.navigation;
       // this.props.navigation.navigate('Trainings');
       goBack();
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
        const { goBack } = this.props.navigation;
        return (
            <View>

                {this.state.fontLoaded && this.state.status==1?

                    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute' }}>

                        <View
                            style={[
                                styles.headerContainer,
                                { marginTop: 20, zIndex: 1, },
                            ]}
                        >
                            <View style={{ flex: 1, }}>
                                <Button
                                    icon={() =>
                                        <Icon name='left' size={20} />}
                                    style={{
                                        justifyContent: 'center',
                                       
                                       
                                    }}
                                    buttonStyle={{
                                        height: 45,
                                        width: 45,
                                        borderRadius: 30,
                                        backgroundColor: 'transparent',

                                    }}
                                    onPress={() => goBack()}
                                    activeOpacity={0.5}
                                />
                            </View>
                            <View style={{ flex: 7, flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-start', }}>

                                <Text style={styles.heading}>{"Rate " + this.props.navigation.getParam('FullName', null)}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginBottom: 10, marginTop:20 }}>
                                <Image style={{ width: 80, height: 80, borderRadius: 40 }} source={{ uri: this.props.navigation.getParam('Picture', null) }} />
                                {this.state.ratingExists ? <Text style={{ fontFamily: 'regular', fontSize: 13, marginTop:5 }}>{'You rated '+this.props.navigation.getParam('FullName', null)+ ' ' + this.state.oldRate + ' stars'}</Text> : null}
                            </View>
                            <View style={{ flex: 6 }}>

                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    <Text style={{ fontFamily: 'regular', color: '#f34573', textAlign: 'center' }}>{this.state.rateParameters[0].Description}</Text>
                                    <RatingStars setParameterRate={this.setParameterRate1}></RatingStars>
                                </View>

                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    <Text style={{ fontFamily: 'regular', color: '#f34573', textAlign: 'center' }}>{this.state.rateParameters[1].Description}</Text>
                                    <RatingStars setParameterRate={this.setParameterRate2}></RatingStars>
                                </View>

                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    <Text style={{ fontFamily: 'regular', color: '#f34573', textAlign: 'center' }}>{this.state.rateParameters[2].Description}</Text>
                                    <RatingStars setParameterRate={this.setParameterRate3}></RatingStars>
                                </View>

                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    <Text style={{ fontFamily: 'regular', color: '#f34573', textAlign: 'center' }}>{this.state.rateParameters[3].Description}</Text>
                                    <RatingStars setParameterRate={this.setParameterRate4}></RatingStars>
                                </View>

                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    <Text style={{ fontFamily: 'regular', color: '#f34573', textAlign: 'center' }}>{this.state.rateParameters[4].Description}</Text>
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
        backgroundColor: '#f5f5f5',
        height: 80,
        //paddingBottom:10
    },

    heading: {
        color: '#f34573',
        //marginTop: 10,
        fontSize: 20,
        flex: 1,
        //textAlign: 'center',
        fontFamily: 'regular',
        //marginLeft: -110,
        justifyContent:'center'
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
