import React from 'react';
import { registerRootComponent, AppLoading, Asset, Font } from 'expo';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { View, Image, Dimensions, I18nManager } from 'react-native';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import Login from './src/Pages/Login';
import SigninGeneral from "./src/Pages/SignInGeneral";
import Components from './src/drawer/components';
import Ratings from './src/drawer/ratings';
import Pricing from './src/drawer/pricing';
import SigninTrainee from './src/Pages/SignInTrainee';
import SigninTrainer from './src/Pages/SignInTrainer';
import Lists from './src/drawer/lists';
import HomeTraineeTab from './src/TabsNavigation/HomeTraineeTab';
import HomeTrainerTab from './src/TabsNavigation/HomeTrainerTab';

import BottomNavigation from './src/Navigation/BottomNavigation';
import BottomNavigationTrainer from './src/Navigation/BottomNavigationTrainer';
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);
const SCREEN_WIDTH = Dimensions.get('window').width;

const CustomDrawerContentComponent = props => (
  <View style={{ flex: 1, backgroundColor: '#43484d' }}>
    <View
      style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center' }}
    >
      <Image
        source={require('./src/images/logo.png')}
        style={{ width: SCREEN_WIDTH * 0.57 }}
        resizeMode="contain"
      />
    </View>
    <View style={{ marginLeft: 10 }}>
      <DrawerItems {...props} />
    </View>
  </View>
);


const MainRoot = DrawerNavigator(
  {

    // HomeTrainee: {
    //   path: '/homeTrainee',
    //   screen: HomeTrainee,
    //   // navigationOptions: {
    //   //   drawerLabel:()=>null
    //   // }
    // },
    // HomeTrainer: {
    //   path: '/homeTrainer',
    //   screen: HomeTrainer,
    //   // navigationOptions: {
    //   //   drawerLabel:()=>null
    //   // }
    // },
    // TraineeProfile: {
    //   path: '/traineeProfile',
    //   screen: TraineeProfile,
    // },
    // CreateGroup: {
    //   path: '/createGroup',
    //   screen: CreateGroup,
    //   // navigationOptions: {
    //   //   drawerLabel:()=>null
    //   // }
    // },
    SigninGeneral: {
      path: '/signinGeneral',
      screen: SigninGeneral,
      // navigationOptions: {
      //   drawerLabel:()=>null
      // }
    },
    SigninTrainee: {
      path: '/signinTrainee',
      screen: SigninTrainee,
      // navigationOptions: {
      //   drawerLabel:()=>null
      // }
    },
    SigninTrainer: {
      path: '/signinTrainer',
      screen: SigninTrainer,
      // navigationOptions: {
      //   drawerLabel:()=>null
      // }
    },
    // Chat: {
    //   path: '/chat',
    //   screen: Chat,
    //   navigationOptions: {
    //     drawerLabel: () => null
    //   }
    // },
    Login: {
      path: '/login',
      screen: Login,
    },
    // Profile: {
    //   path: '/profile',
    //   screen: Profile,
    // },
    Lists: {
      path: '/lists',
      screen: Lists,
    },

    Components: {
      path: '/components',
      screen: Components,
    },
    BottomNavigationTrainer: {
      path: '/bottomNavigationTrainer',
      screen: BottomNavigationTrainer,
    },

    BottomNavigation: {
      path: '/bottomNavigation',
      screen: BottomNavigation,
    },
    
    HomeTrainerTab: {
      path: '/homeTrainerTab',
      screen: HomeTrainerTab,
    },

    HomeTraineeTab: {
      path: '/HomeTraineeTab',
      screen: HomeTraineeTab,
    },

    Ratings: {
      path: '/ratings',
      screen: Ratings,
    },
    Pricing: {
      path: '/pricing',
      screen: Pricing,
    },
    // Settings: {
    //   path: '/settings',
    //   screen: Settings,
    // },
  },
  {
    initialRouteName: 'Login',
    contentOptions: {
      activeTintColor: '#548ff7',
      activeBackgroundColor: 'transparent',
      inactiveTintColor: '#ffffff',
      inactiveBackgroundColor: 'transparent',
      labelStyle: {
        fontSize: 15,
        marginLeft: 0,
      },
    },
    drawerWidth: SCREEN_WIDTH * 0.8,
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
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
console.disableYellowBox = true;



