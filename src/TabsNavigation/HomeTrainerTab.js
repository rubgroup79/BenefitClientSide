import React from 'react';
import { StackNavigator } from 'react-navigation';
import UserProfile from '../Pages/UserProfile';
import HomeTrainer from '../Pages/HomeTrainer';
import GroupProfile from  '../Pages/GroupProfile';
import Chat from '../Pages/Chat';

const HomeTrainerTabView = ({ navigation }) => (
  <HomeTrainer navigation={navigation} />
);

const HomeTrainerTab = StackNavigator({
  HomeTrainer: {
    screen: HomeTrainerTabView,
    path: '/HomeTrainer',
  },

  UserProfile: {
    screen: UserProfile,
    path: '/UserProfile',
    navigationOptions:{
      tabBarVisible:false,
      
      drawerNavigationVisible:false
    }
  },
  GroupProfile: {
    screen: GroupProfile,
    path: '/GroupProfile',
    navigationOptions:{
      tabBarVisible:false,
      
      drawerNavigationVisible:false
    }
  },

  Chat: {
    screen: Chat,
    path: '/Chat',
    navigationOptions:{
      tabBarVisible:false,
      
      drawerNavigationVisible:false
    }
  },
},

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

export default HomeTrainerTab;
