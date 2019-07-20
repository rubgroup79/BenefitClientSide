import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Chats from '../Pages/Chats';
import Chat from '../Pages/Chat';
import ButtonsDetails from '../views/buttons_detail';

const ChatsTabView = ({ navigation }) => (
  <Chats navigation={navigation} />
);

const ChatsTab = StackNavigator({
  Chats: {
    screen: ChatsTabView,
    path: '/Chats',
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

export default ChatsTab;
