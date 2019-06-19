import React, { Component } from 'react';
import { View, StyleSheet, } from 'react-native';
import TimePicker from "react-native-24h-timepicker";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';


// var hour_now = '10';
// var minute_now = '00';
let hour_now = new Date().getHours();
let minute_now = new Date().getMinutes();

export default class TimePickerNew extends Component {
    constructor(props) {

        super(props);

        this.state = {
            displayedTime: hour_now.toString() + ':' + minute_now.toString(),
        }

    }

    setTitle(hour, minute){
        if(hour<10) hour = '0'+hour;
        this.setState({displayedTime: hour+':'+minute })
        this.props.setTime(hour, minute);
        this.TimePicker.close();
    }

    componentWillMount()
    {
        temph=hour_now;
        tempm=minute_now;
        if(hour_now<10) temph = '0'+hour_now;
        if(minute_now<10) tempm ='0'+minute_now;
        this.setState({displayedTime: temph+':'+tempm })
    }
  
    onCancel() {
    this.TimePicker.close();
  }

    render() {
        return (
            <View style={styles.timePickerContainer}>

                <Button
                disabled={this.props.disabled}
                    buttonStyle={{
                        backgroundColor: 'transparent'
                    }}
                    titleStyle={{
                        color: 'gray',
                        fontFamily: 'regular'
                    }}
                    backgroundColor='transparent'
                    onPress={() => this.TimePicker.open()}
                    title={this.props.title + this.state.displayedTime}
                >
                </Button>

                <TimePicker
                    minHour={5}
                    minuteInterval={1}
                    selectedHour={hour_now.toString()}
                    selectedMinute={minute_now.toString()}
                    ref={ref => {
                        this.TimePicker = ref;
                    }}
                    onCancel={() => this.onCancel()}
                    onConfirm={(hour, minute) => this.setTitle(hour, minute)}
                />

            </View>
        )
    }
}



    const styles = StyleSheet.create({
        timePickerContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: "center",
            paddingTop: 0,
            top:-17
        },

    })