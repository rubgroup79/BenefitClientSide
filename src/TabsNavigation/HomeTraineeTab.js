import React from 'react';
import { StackNavigator } from 'react-navigation';
import UserProfile from '../Pages/UserProfile';
import HomeTrainee from '../Pages/HomeTrainee';
import GroupProfile from  '../Pages/GroupProfile';
import Chat from '../Pages/Chat';

const HomeTraineeTabView = ({ navigation }) => (
  <HomeTrainee navigation={navigation} />
);

const HomeTraineeTab = StackNavigator({
  HomeTrainee: {
    screen: HomeTraineeTabView,
    path: '/HomeTrainee',
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

export default HomeTraineeTab;
