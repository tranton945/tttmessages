import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'


import { 
    LoginScreen, 
    RegisterScreen, 
    ForgotPasswordScreen, 
    SettingScreen, 
    ChatScreen, 
    ChatRoom, 
    Messages} from '.././screens';
import VideoChat from '../utilities/videoChat';

import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { getFCMToken, notificationListener, background} from '../utilities/pushNotifications';

const Tab = createBottomTabNavigator();


const UITab = (props) => {
    // const {url, userId, name, email} = props.route.params.theUser;
    useEffect(()=>{
        getFCMToken()
        notificationListener()
        background(props)
        // console.log(props)
      })

    return(
        <Tab.Navigator >
            <Tab.Screen options={{
                headerShown: false,
                tabBarIcon: () => <Icon name='comments' size={24} color={'black'} />
            }}
                name="ChatScreen"
                component={ChatScreen} />
            <Tab.Screen options={{
                headerShown: false,
                tabBarIcon: () => <Icon name='users' size={24} color={'black'} />
            }}
                name="ChatRoom"
                component={ChatRoom} />
            <Tab.Screen options={{
                headerShown: false,
                tabBarIcon: () => <Icon name='user' size={24} color={'black'} />
            }}
                name="SettingScreen"
                component={SettingScreen} />
            {/* <Tab.Screen options={{
                headerShown: false,
                tabBarIcon: () => <Icon name='comments' size={24} color={'black'} />
            }}
                name="VideoCall"
                component={VideoCall} /> */}

        </Tab.Navigator>
        
        
    )
}
export default UITab