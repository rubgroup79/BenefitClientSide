import React from 'react';
import {
  StyleSheet, Text, View, Image, Animated, Easing, TouchableOpacity
} from 'react-native';

const STAR_IMAGE = require('../../Images/Star.png');
const STAR_SELECTED_IMAGE = require('../../Images/SelectedStar.png');

const STAR_SIZE = 30

export default class Star extends React.Component {
  constructor() {
    super()
    this.springValue = new Animated.Value(1)

    this.state = {
      selected: false
    }
  }

  spring() {
    const { position, starSelectedInPosition } = this.props
    this.springValue.setValue(1.2)

    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 2,
        tension: 1
      }
    ).start()

    this.setState({ selected: !this.state.selected })
    starSelectedInPosition(position)
  }

  render() {
    const { selected } = this.state
    const { fill, size } = this.props

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.spring.bind(this)}
      >
        <Animated.Image
          source={fill ? STAR_SELECTED_IMAGE : STAR_IMAGE}
          style={[
            styles.starStyle,
            {
              width: size || STAR_SIZE,
              height: size || STAR_SIZE,
              transform: [{ scale: this.springValue }]
            }
          ]}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  starStyle: {
    margin: 3
  }
});
