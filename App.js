// npm install -g react-native-cli
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

// firebase web
// const firebaseConfig = {
//   apiKey: "AIzaSyAhdeCpd7Ub9VXJk456-qzjmYMYQKtIIWQ",
//   authDomain: "tttmessages-df7f3.firebaseapp.com",
//   databaseURL: "https://tttmessages-df7f3-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "tttmessages-df7f3",
//   storageBucket: "tttmessages-df7f3.appspot.com",
//   messagingSenderId: "977662063355",
//   appId: "1:977662063355:web:ae96ef8bcf6be9c67f765e",
//   measurementId: "G-V99901FCNH"
// };

// https://www.youtube.com/watch?v=YZhNUU4_Pjw&list=PLqvQreCiz0zg6KNUiksmuKZRKPAEJANSj&index=10&t=1239s
// time: 1h
// time: 1h15p -> create chat room
// time 1h40p -> search

// https://www.youtube.com/watch?v=k4mjF4sPITE&t=1s
// time 55p -> upload img

// notifications
// https://www.youtube.com/watch?v=zOiu8OkTfBk&t=1480s
// 21p


import {View, Text} from 'react-native';
import React from 'react';
import HandleImg from './utilities/HandleImg'

import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  SettingScreen,
  ChatScreen,
  UserChat,
  Messages,
  ChatRoomMessages,
} from './screens';

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
        </Stack.Navigator>
      </NavigationContainer>
      {/* <HandleImg></HandleImg> */}
    </SafeAreaProvider>
    // <View style={{backgroundColor: 'black'}}>
    //   <Text>asdasdasdas</Text>
    // </View>
  );
}
