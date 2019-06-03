import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import UserProfile from '../Pages/UserProfile';
import GroupProfile from '../Pages/GroupProfile';

import Trainings from '../Pages/Trainings';
import Rate from '../Pages/Rate';
const TrainingsTabView = ({ navigation }) => (
  <Trainings navigation={navigation} />
);


const TrainingsTab = StackNavigator({
  Trainings: {
    screen: TrainingsTabView,
    path: '/Trainings',
  },
  Rate: {
    screen: Rate,
    path: '/Rate',
    navigationOptions:{
      tabBarVisible:false,
      
      drawerNavigationVisible:false
    }
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
},

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

export default TrainingsTab;
