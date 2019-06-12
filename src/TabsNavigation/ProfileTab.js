import React from 'react';
import { StackNavigator } from 'react-navigation';
import TraineeProfile from '../Pages/TraineeProfile';
import Login from '../Pages/Login';
import HomeTrainee from '../Pages/HomeTrainee';

const ProfileTabView = ({ navigation }) => (
  <TraineeProfile navigation={navigation} />
);



const ProfileTab = StackNavigator({
  Profile: {
    screen: ProfileTabView,
    path: '/Profile',
  },

  // Login: {
  //   screen: Login,
  //   path: '/Login',
  //   navigationOptions:{
  //     tabBarVisible:false,
  //     drawerNavigationVisible:false,
      
  //   }
  // },


},

  {
    initialRouteName:'Profile',
    
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

export default ProfileTab;
