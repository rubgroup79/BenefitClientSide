import React from 'react';
import { StackNavigator } from 'react-navigation';
import UserProfile from '../Pages/UserProfile';
import HomeTrainee from '../Pages/HomeTrainee';

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
},

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

export default HomeTraineeTab;
