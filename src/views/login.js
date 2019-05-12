import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

// :fire: this is v good, @xavier-villelegier
import Login from './login/login';

// @monte9
import LoginScreen1 from './login/screen1';

// TODO
import SignIn1 from './login/signIn1';
import LoginScreen4 from './login/screen4';

export default class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView horizontal pagingEnabled decelerationRate={0.993}>
          <Login />
          <LoginScreen1 />
          <SignIn1 />
          <LoginScreen4 />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
