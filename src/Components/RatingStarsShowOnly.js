import _ from 'lodash';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import Star from './Star'

export default class RatingStarsShowOnly extends Component {
  static defaultProps = {
    count: 5,
    showRating: true
  };

  constructor() {
    super()

    this.state = {
      position: 0,
      fontLoaded:false
    }
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

  componentDidMount() {
    this.setState({ position: this.props.Position })
  }

  renderStars(rating_array) {
    return _.map(rating_array, (star, index) => {
      return star
    })
  }

//   starSelectedInPosition(position){
// console.warn(position)
//   }

  render() {
    const { position } = this.state
    const { count, reviews, showRating } = this.props
    const rating_array = []

    _.times(count, index => {
      rating_array.push(
        <Star
          key={index}
          starSelectedInPosition={()=>{}}
          position={index + 1}
          fill={position >= index + 1}
          {...this.props}
        />
      )
    })

    return (
      <View style={styles.ratingContainer}>
        
        <View style={styles.starContainer}>
          {this.renderStars(rating_array)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ratingContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
