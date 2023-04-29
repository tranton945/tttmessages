// npm install @react-navigation/native
// npm install @react-navigation/native-stack
// npm i react-native-screens
// npm install react-native-safe-area-context
// yarn add react-navigation
// yarn add @react-navigation/bottom-tabs
// yarn add @react-navigation/drawer
// yarn add react-native-gesture-handler
// yarn add react-native-reanimated
// npm install --save react-native-vector-icons
// npm i firebase
// npm install @react-native-async-storage/async-storage
// yarn add react-native-dialog
// yarn add react-native-image-picker
// npm install moment --save
// yarn add @react-native-firebase/app
// yarn add @react-native-firebase/messaging
// npm install react-native-video
// yarn add @zegocloud/zego-uikit-prebuilt-call-rn@3.0.0-beta.1
// yarn add @zegocloud/zego-uikit-rn react-delegate-component zego-express-engine-reactnative@3.2.0 react-native-sound @notifee/react-native
// npm i react-native-sound

import {View, Text} from 'react-native';
import React from 'react';

import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  SettingScreen,
  ChatScreen,
  UserChat,
  Messages,
  ChatRoomMessages,
  ChatRoom,
} from './screens';
import VideoCall from './utilities/videoCall';
import Calling from './utilities/calling';

import {UIHeader} from './components';
import UITab from './navigation/UITab.js';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer >
        <Stack.Navigator initialRouteName="LoginScreen"  >
          <Stack.Screen options={{ headerShown: false }} name={"LoginScreen"} component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name={"RegisterScreen"} component={RegisterScreen} />
          <Stack.Screen options={{ headerShown: false }} name={"ForgotPasswordScreen"} component={ForgotPasswordScreen} />
          <Stack.Screen 
            options={{ headerShown: false }} 
            name={"UITab"} component={UITab} />
          <Stack.Screen options={{ headerShown: false }} name={"Messages"} component={Messages} />
          <Stack.Screen options={{ headerShown: false }} name={"ChatRoomMessages"} component={ChatRoomMessages} />
          <Stack.Screen options={{ headerShown: false }} name={"ChatRoom"} component={ChatRoom} />
          <Stack.Screen options={{ headerShown: false }} name={"VideoCall"} component={VideoCall} />          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>

  );
}
