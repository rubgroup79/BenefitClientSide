import React from 'react';
import { TabNavigator, StackNavigator,  } from 'react-navigation';
import { Icon, Image } from 'react-native-elements';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import ButtonsTab from '../tabs/buttons';
import ListsTab from '../tabs/lists';
import InputTab from '../tabs/input';
import FontsTab from '../tabs/fonts';
import HomeTrainee from '../Pages/HomeTrainee';
//import Chats from '../Pages/Chats';
import ChatsTab from '../TabsNavigation/ChatsTab';
import TrainingsTab from '../TabsNavigation/TrainingsTab';
import TraineeProfile from '../Pages/TraineeProfile';
import Chat from '../Pages/Chat';


const Components = TabNavigator(
  {
    // ButtonsTab: {
    //   screen: ButtonsTab,
    //   path: '/buttons',
    //   navigationOptions: {
    //     tabBarLabel: 'Buttons',
    //     tabBarIcon: ({ tintColor, focused }) => (
    //       <Icon
    //         name={focused ? 'emoticon-cool' : 'emoticon-neutral'}
    //         size={30}
    //         type="material-community"
    //         color={tintColor}
    //       />
    //     ),
    //   },
    // },


    ListsTab: {
      screen: ListsTab,
      path: '/lists',
      navigationOptions: {
        tabBarLabel: 'Rates',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon1 name="staro" size={28} color={tintColor} />
        ),
      },
    },
    ChatsTab: {
      screen: ChatsTab,
      path: '/chatsTab',
      navigationOptions: {
        tabBarLabel: 'Chats',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon1
            name="message1"
            size={28}
            color={tintColor}
          />
          
        ),
      },
    },
  
    HomeTrainee: {
      screen: HomeTrainee,
      path: '/homeTrainee',
      tabBarOptions:{
        showLable:false
      },
      navigationOptions: {
        tabBarLabel: ' ',
        tabBarIcon: ({ tintColor, focused }) => (
          <Image
          source={require('../../Images/LogoOnly.png')}
          style={{width:57, height:38, top:5}}
          ></Image>
        ),
      },
    },

    TrainingsTab: {
      screen: TrainingsTab,
      path: '/trainingsTab',
      navigationOptions: {
        tabBarLabel: 'Trainings',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon2
            name={focused ? 'calendar' : 'calendar'}
            size={28}
            type="SimpleLineIcons"
            color={tintColor}
          />
        ),
      },
    },
    TraineeProfile: {
      screen: TraineeProfile,
      
      path: '/fonts',
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon1
            name={focused ? 'user' : 'user'}
            size={28}
            type="AntDesign"
            color={tintColor}
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'HomeTrainee',
    animationEnabled: false,
    swipeEnabled: false,
    // Android's default option displays tabBars on top, but iOS is bottom
   
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeBackgroundColor : 'white',
      activeTintColor:'#f34573',
      inactiveBackground:'gray',
      
      // Android's default showing of icons is false whereas iOS is true
      showIcon: true,
      
    },
  }
);

Components.navigationOptions = {
  drawerLabel: 'Home',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="settings"
      size={30}
      iconStyle={{
        width: 30,
        height: 30,
      }}
      type="material"
      color={tintColor}
    />
  ),
};

// Workaround to avoid crashing when you come back on Components screen
// and you were not on the Buttons tab
export default StackNavigator(
  {
    HomeTrainee: { screen: Components },
  },
  {
    headerMode: 'none',
  }
);
