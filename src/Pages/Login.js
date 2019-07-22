import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Permissions, Notifications } from 'expo';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  AsyncStorage
} from 'react-native';
import { Font } from 'expo';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const BG_IMAGE = require('../../Images/LogoWithName.png');

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const TabSelector = ({ selected }) => {
  return (
    <View style={styles.selectorContainer}>
      <View style={selected && styles.selected} />
    </View>
  );
};

TabSelector.propTypes = {
  selected: PropTypes.bool.isRequired,
};

const navigateActionTrainee = NavigationActions.navigate({
  routeName: 'BottomNavigation',
  action: NavigationActions.navigate({routeName: 'HomeTraineeTab'})
})

const navigateActionTrainer = NavigationActions.navigate({
  routeName: 'BottomNavigationTrainer',
  action: NavigationActions.navigate({routeName: 'HomeTrainerTab'})
})

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      fontLoaded: false,
      selectedCategory: 0,
      isLoading: false,
      isEmailValid: true,
      isPasswordValid: true,
      isConfirmationValid: true,
      token: '',
      userCode: 0,
      isTrainer: false,
      userFirstName: []
    };

    this.selectCategory = this.selectCategory.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this._storeData = this._storeData.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
  }

  _storeData = async (firstName) => {
    try {
      await AsyncStorage.setItem('UserCode', JSON.stringify(this.state.userCode));
      await AsyncStorage.setItem('IsTrainer', JSON.stringify(this.state.isTrainer));
      await AsyncStorage.setItem('Details', JSON.stringify(firstName));

    } catch (error) {
      console.warn(error);
      // Error saving data
    }

  }

  UNSAFE_componentWillMount = async () => {
    await AsyncStorage.getItem('IsTrainer', (err, result) => {
      if (result != null && result == 1)
        this.props.navigation.dispatch(navigateActionTrainer);
      if (result != null && result == 0)
      this.props.navigation.dispatch(navigateActionTrainee);
    }
    )
  }





  async registerForPushNotifications() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync();
    this.subscription = Notifications.addListener(this.handleNotification);

    this.setState({
      token: token
    });

    this.updateToken(token);

  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require('../../assets/fonts/Georgia.ttf'),
      regular: require('../../assets/fonts/Montserrat-Regular.ttf'),
      light: require('../../assets/fonts/Montserrat-Light.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  selectCategory(selectedCategory) {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      selectedCategory,
      isLoading: false,
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }


  validatePassword(password) {
    if (password == this.state.passwordConfirmation)
      return true;
    else return false;

  }

  login() {
    const { email, password } = this.state;
    this.setState({ isLoading: true });
    // Simulate an API call
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        isLoading: false,
        isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
        isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
      });
    }, 1500);

    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckIfEmailExists?Email=' + this.state.email, {
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({}),

    })
      .then(res => res.json())
      .then(response => {
        if (response) {
          this.checkPassword();
        }
        else alert("The Email doesn't exist in the system!");
      })

      .catch(error => console.warn('Error:', error.message));
  }


  updateToken(token) {

    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/UpdateToken?Token=' + token + "&UserCode=" + this.state.userCode, {

      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({}),
    })
      .then(response => { })
      .catch(error => console.warn('Error:', error.message));

  }



  checkPassword() {
    const LoginDetails = {
      Email: this.state.email,
      Password: this.state.password
    }
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckIfPasswordMatches', {

      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(LoginDetails),
    })
      .then(res => res.json())
      .then(response => {
        if (response.UserCode != 0) {
          this.setState({ userCode: response.UserCode, isTrainer: response.IsTrainer });
          this.getUserDetails(response.UserCode)
          this.registerForPushNotifications();
          if (this.state.isTrainer == 0) // a trainee
            this.props.navigation.dispatch(navigateActionTrainee);
          else this.props.navigation.dispatch(navigateActionTrainer);
        }
        else
          alert("Incorrect password");
      })

      .catch(error => console.warn('Error:', error.message));
  }



  getUserDetails(userCode) {
    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/ShowProfile?UserCode=' + userCode, {

      method: 'GET',
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(res => res.json())
      .then(response => {
        this.setState({ userFirstName: response })

        this._storeData(response);
      })

      .catch(error => console.warn('Error:', error.message));
  }


  signUp() {
    const { email, password, passwordConfirmation } = this.state;
    this.setState({ isLoading: true });

    // Simulate an API call
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        isLoading: false,
        isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
        isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
        isConfirmationValid: this.validatePassword(password) || this.confirmationInput.shake(),
      });
    }, 0);


    fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar6/api/CheckIfEmailExists?Email=' + this.state.email, {
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({}),

    })
      .then(res => res.json())
      .then(response => {
        if (response) {
          alert('Email already exists!');
        }
        else if (this.state.isEmailValid && this.state.isConfirmationValid) this.props.navigation.navigate('SigninGeneral', { email: this.state.email, password: this.state.password });

      })

      .catch(error => console.warn('Error:', error.message));
  }

  render() {
    const {
      selectedCategory,
      isLoading,
      isEmailValid,
      isPasswordValid,
      isConfirmationValid,
      email,
      password,
      passwordConfirmation,
    } = this.state;
    const isLoginPage = selectedCategory === 0;
    const isSignUpPage = selectedCategory === 1;
    return (
      <View style={styles.container}>

        <ImageBackground source={BG_IMAGE} style={styles.bgImage}> 
          {this.state.fontLoaded ? (
            <View>
              <KeyboardAvoidingView
                contentContainerStyle={styles.loginContainer}
                behavior="position"
              >

                <View style={{ flexDirection: 'row' }}>
                  <Button
                    disabled={isLoading}
                    type="clear"
                    activeOpacity={0.7}
                    onPress={() => this.selectCategory(0)}
                    containerStyle={styles.flex}
                    titleStyle={[
                      styles.categoryText,
                      isLoginPage && styles.selectedCategoryText,
                    ]}
                    title={'Login'}
                  />
                  <Button
                    disabled={isLoading}
                    type="clear"
                    activeOpacity={0.7}
                    onPress={() => this.selectCategory(1)}
                    containerStyle={styles.flex}
                    titleStyle={[
                      styles.categoryText,
                      isSignUpPage && styles.selectedCategoryText,
                    ]}
                    title={'Sign up'}
                  />
                </View>
                <View style={styles.rowSelector}>
                  <TabSelector selected={isLoginPage} />
                  <TabSelector selected={isSignUpPage} />
                </View>
                <View style={styles.formContainer}>
                  <Input
                    leftIcon={
                      <Icon
                        name="envelope-o"
                        color="rgba(0, 0, 0, 0.38)"
                        size={25}
                        style={styles.simpleIcon}
                      />
                    }
                    value={email}
                    keyboardAppearance="light"
                    autoFocus={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    returnKeyType="next"
                    inputStyle={styles.inputStyle}
                    placeholder={'Email'}
                    containerStyle={{
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                    }}
                    ref={input => (this.emailInput = input)}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    onChangeText={email => this.setState({ email })}
                    errorMessage={
                      isEmailValid ? null : 'Please enter a valid email address'
                    }
                  />
                  <Input
                    leftIcon={
                      <SimpleIcon
                        name="lock"
                        color="rgba(0, 0, 0, 0.38)"
                        size={25}
                        style={styles.simpleIcon}
                      />
                    }
                    value={password}
                    keyboardAppearance="light"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    returnKeyType={isSignUpPage ? 'next' : 'done'}
                    blurOnSubmit={true}
                    containerStyle={{
                      marginTop: 16,
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                    }}
                    inputStyle={styles.inputStyle}
                    placeholder={'Password'}
                    ref={input => (this.passwordInput = input)}
                    onSubmitEditing={() =>
                      isSignUpPage
                        ? this.confirmationInput.focus()
                        : this.login()
                    }
                    onChangeText={password => this.setState({ password })}
                    errorMessage={
                      isPasswordValid
                        ? null
                        : 'Please enter at least 8 characters'
                    }
                  />
                  {isSignUpPage && (
                    <Input
                      icon={
                        <SimpleIcon
                          name="lock"
                          color="rgba(0, 0, 0, 0.38)"
                          size={25}
                          style={styles.simpleIcon}
                        />
                      }
                      value={passwordConfirmation}
                      secureTextEntry={true}
                      keyboardAppearance="light"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType={'done'}
                      blurOnSubmit={true}
                      containerStyle={{
                        marginTop: 16,
                        borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                      }}
                      inputStyle={styles.inputStyle}
                      placeholder={'Confirm password'}
                      ref={input => (this.confirmationInput = input)}
                      onSubmitEditing={this.signUp}
                      onChangeText={passwordConfirmation =>
                        this.setState({ passwordConfirmation })
                      }
                      errorMessage={
                        isConfirmationValid
                          ? null
                          : 'Please enter the same password'
                      }
                    />
                  )}
                  <Button
                    buttonStyle={styles.loginButton}
                    containerStyle={{ marginTop: 32, flex: 0 }}
                    activeOpacity={0.8}
                    title={isLoginPage ? 'LOGIN' : 'SIGN UP'}
                    onPress={isLoginPage ? this.login : this.signUp}
                    titleStyle={styles.loginTextButton}
                    loading={isLoading}
                    disabled={isLoading}
                  />
                </View>
              </KeyboardAvoidingView>

            </View>
          ) : (
              <Text>Loading...</Text>
            )}
         </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex:{
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor:'#e5e5e5'
  },
  rowSelector: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selected: {
    position: 'absolute',
    borderRadius: 50,
    height: 0,
    width: 0,
    top: -5,
    borderRightWidth: 70,
    borderBottomWidth: 70,
    borderColor: 'white',
    backgroundColor: 'white',
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:-100
  },
  loginTextButton: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#f34573',
    borderRadius: 10,
    height: 50,
    width: 200,
  },
  titleContainer: {
    height: 150,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH - 30,
    borderRadius: 10,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  bgImage: {
    flex: 1,
    top: 100,
    left: 0,
    width: 410,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    textAlign: 'center',
    color: '#75cac3',
    fontSize: 24,
    fontFamily: 'regular',
    backgroundColor: 'transparent',
    opacity: 0.54,
  },
  selectedCategoryText: {
    opacity: 1,
  },
  titleText: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'regular',
  },
  helpContainer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle:
  { marginLeft: 10 },
  simpleIcon:
  { backgroundColor: 'transparent' },
});
