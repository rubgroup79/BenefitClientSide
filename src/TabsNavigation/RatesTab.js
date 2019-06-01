import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Rates from '../Pages/Rates';


const RatesTabView = ({ navigation }) => (
  <Rates navigation={navigation} />
);


const RatesTab = StackNavigator({
  Rates: {
    screen: RatesTabView,
    path: '/Rates',
  },
 
},

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }

);

export default RatesTab;
