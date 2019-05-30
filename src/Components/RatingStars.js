import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import Star from './Star'

export default class RatingStars extends Component {
  static defaultProps = {
    defaultRating: 5,
    reviews: ["Terrible", "Bad", "Okay", "Good", "Great"],
    count: 5,
    onFinishRating: () => console.log('Rating selected. Attach a function here.'),
    showRating: true
  };

  constructor() {
    super()

    this.state = {
      position: 3,
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
    const { defaultRating } = this.props

    this.setState({ position: defaultRating })
  }

  renderStars(rating_array) {
    return _.map(rating_array, (star, index) => {
      return star
    })
  }

  starSelectedInPosition(position) {
    const { onFinishRating } = this.props

    onFinishRating(position);

    this.setState({ position: position })

    this.props.setParameterRate(position);
  }

  render() {
    const { position } = this.state
    const { count, reviews, showRating } = this.props
    const rating_array = []

    _.times(count, index => {
      rating_array.push(
        <Star
          key={index}
          position={index + 1}
          starSelectedInPosition={this.starSelectedInPosition.bind(this)}
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
        { showRating && 
          <Text style={styles.reviewText}>
            {reviews[position - 1]}
          </Text>
        }
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
  reviewText: {
    fontSize: 8,
    fontFamily: 'bold',
    margin: 10,
    color: 'gray'
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
