import React from 'react';
import { StackNavigator } from 'react-navigation';
import TrainerProfile from '../Pages/TrainerProfile';

const ProfileTrainerTabView = ({ navigation }) => (
  <TrainerProfile navigation={navigation} />
);



const ProfileTrainerTab = StackNavigator({
  Profile: {
    screen: ProfileTrainerTabView,
    path: '/Profile',
  },

},

  {
    initialRouteName:'Profile',
    
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

export default ProfileTrainerTab;
