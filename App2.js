import React from 'react';

import { registerRootComponent, AppLoading, Asset, Font } from 'expo';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { View, Dimensions } from 'react-native';
import { DrawerNavigator, DrawerItems, TabNavigator, StackNavigator } from 'react-navigation';

import Login from "./src/views/login/login";
import SignIn1 from "./src/views/login/signIn1";
import Components from './src/drawer/components';
import Ratings from './src/drawer/ratings';
import Pricing from './src/drawer/pricing';
import SigninTrainee from './src/views/login/signinTrainee';
import SigninTrainer from './src/views/login/signinTrainer';
import Profile from './src/drawer/profile';
import Lists from './src/drawer/lists';
import Settings from './src/drawer/settings';
import HomeTrainee from './src/Pages/HomeTrainee';
import HomeTrainer from './src/Pages/HomeTrainer';
import TraineeProfile from './src/Pages/TraineeProfile';
import BottomNavigation from './src/Navigation/BottomNavigation';
import Chat from './src/Pages/Chat';

import { Icon, Image } from 'react-native-elements';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import ButtonsTab from './src/tabs/buttons';
import ListsTab from './src//tabs/lists';
import InputTab from './src/tabs/input';
import FontsTab from './src/tabs/fonts';
import Chats from './src/Pages/Chats';

const SCREEN_WIDTH = Dimensions.get('window').width;

// const CustomDrawerContentComponent = props => (
//   <View style={{ flex: 1, backgroundColor: '#43484d' }}>
//     <View
//       style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center' }}
//     >
//       <Image
//         source={require('./src/images/logo.png')}
//         style={{ width: SCREEN_WIDTH * 0.57 }}
//         resizeMode="contain"
//       />
//     </View>
//     <View style={{ marginLeft: 10 }}>
//       <DrawerItems {...props} />
//     </View>
//   </View>
// );


const MainRoot = StackNavigator(
  {
    Home: BottomNavigation
  },
  {
    initialRouteName:'Home'
  }
);

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class AppContainer extends React.Component {
  state = {
    isReady: false,
  };


  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./assets/images/bg_screen1.jpg'),
      require('./assets/images/bg_screen2.jpg'),
      require('./assets/images/bg_screen3.jpg'),
      require('./assets/images/bg_screen4.jpg'),
      require('./assets/images/user-cool.png'),
      require('./assets/images/user-hp.png'),
      require('./assets/images/user-student.png'),
      require('./assets/images/avatar1.jpg'),
    ]);

  const fontAssets = cacheFonts([FontAwesome.font, Ionicons.font]);

    await Promise.all([...imageAssets, ...fontAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
        />


      );
    }

    return (
      <MainRoot />
    )

  }
}
registerRootComponent(AppContainer);