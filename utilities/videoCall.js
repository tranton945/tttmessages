import React, { Component, useEffect } from 'react';
import {ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG, GROUP_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    ScrollView,
    Image,
    Alert,
  } from 'react-native';

import { APPID_ZEGOCLOUD, APPSIGN_ZEGOCLOUD } from './config';

const VideoCall = (props) =>{
    const {email, name, url, userId}=props.route.params

    return (
        <View style={styles.container}>
            <ZegoUIKitPrebuiltCall
                appID={APPID_ZEGOCLOUD}
                appSign={APPSIGN_ZEGOCLOUD}
                userID={userId} // userID can be something like a phone number or the user id on your own user system. 
                userName={name}
                callID={"callID"} // callID can be any unique string. 

                config={{
                    // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    // ...GROUP_VIDEO_CALL_CONFIG,
                    onOnlySelfInRoom: () => { props.navigation.navigate('Messages', { userList:props.route.params}) },
                    onHangUp: () => { props.navigation.navigate('Messages', { userList:props.route.params}) },
                }}
            />
        </View>
    );
}
export default VideoCall;

const styles = {
    container:{
        flex: 1,
    },
}