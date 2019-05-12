import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'

var MaxDate = "01-01-"+ (new Date().getFullYear() - 18);

export default class MyDatePicker extends Component {
  constructor(props){
    super(props)
    this.state = {
        date:MaxDate
    }
   
  }
changeDate(date){
  this.props.setDate(date);
}
  render(){
    return (
      <DatePicker
      
        style={{width: 200}}
        date={this.state.date}
        mode="date"
        placeholder="select date"
       
        format="DD-MM-YYYY"
        minDate="01-01-1900"
        maxDate= {MaxDate}
        confirmBtnText="It's my Bday"
        cancelBtnText="Cancel"
        showIcon={false}
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0,
          },
            dateText:{
                color: 'white',
                justifyContent: 'flex-start'
              },
              placeholderText: {
                fontSize: 18,
                color: '#7384B4'
            },
          dateInput: {
            marginLeft: 36,
             borderWidth: 0
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={
          (date) => {
            this.setState({date: date});
            this.changeDate(date);
          }}
      />
    )
  }
}