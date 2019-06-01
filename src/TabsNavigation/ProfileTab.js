import React from 'react';
import { StackNavigator } from 'react-navigation';
import TraineeProfile from '../Pages/TraineeProfile';

const ProfileTabView = ({ navigation }) => (
  <TraineeProfile navigation={navigation} />
);


const ProfileTab = StackNavigator({
  Profile: {
    screen: ProfileTabView,
    path: '/Profile',
  },

},

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

export default ProfileTab;
