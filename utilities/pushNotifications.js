import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import {
  firebaseAut,
  firebaseChild,
  firebaseDatabase,
  firebaseGet,
  firebaseRef,
  firebaseSet,
  firebasePush,
  firebaseOnValue,
} from '../firebase/firebase'
import {getDatabase} from 'firebase/database'
const db = getDatabase()

// request Permission
async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

// select fcm token 
export const getFCMToken = async () => {
    requestUserPermission
    const userTxt = await AsyncStorage.getItem('user')
    const user = JSON.parse(userTxt)

    const userDataTxt = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataTxt)
    const fcmToken = userData.fcmToken

    firebaseOnValue(firebaseRef(firebaseDatabase, `users/${firebaseAut.currentUser.uid}/info`), async (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();

        if (!fcmToken) {
            try {          
                // get new fcm token
                const takeFCMToke = await messaging().getToken()
                firebaseSet(firebaseRef(db, `/users/${user.uid}/info`), {
                  email: data.email,
                  emailVerified: data.emailVerified,
                  displayName: data.displayName,
                  photoURL: data.photoURL,
                  phoneNumber: data.phoneNumber,
                  fcmToken: takeFCMToke,
                })
            }
            catch (err) {
                console.log(err)
            }
        }

      } else {
        console.log('no data')
      }
    })

    // if can not get FCM token -> get new token and update 
  // Listen to the event when the device receives a new token
  messaging().onTokenRefresh(token => {
    // const dbRef = firebaseRef(db);
    firebaseSet(firebaseRef(db, `/users/${user.uid}/info`), {
      email: data.email,
      emailVerified: data.emailVerified,
      displayName: data.email,
      photoURL: data.photoURL,
      phoneNumber: data.phoneNumber,
      fcmToken: token,
    })
  });     
}


// listen for incoming notifications
export const notificationListener = () => {
  requestUserPermission
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  // messaging().
  //   onMessage(async remoteMessage => {
  //     console.log('remoteMessage', remoteMessage)
  //   })
}

//---------------------send notification --------------------
export const onNewMessage = (friendUid, myUID, data, messages) => {
  // data is input data to open chat screen (refer to UserChat input data)
   // messages is the message when the user sends to a friend
  if(myUID === firebaseAut.currentUser.uid){
    const dbRef = firebaseRef(firebaseDatabase);
    firebaseGet(firebaseChild(dbRef, `users/${friendUid}/info/fcmToken`))
    .then((snapshot) => {
      if (snapshot.exists) {
        const deviceToken = snapshot.val();
        if (deviceToken) {
          sendNotification(deviceToken, data, messages);
        }
      } else {
        console.log('no data')
      }
    }).catch((error) => {
      console.error(error);
    });
  }
};

import { KEYSERVICE } from './config';
let keyService = KEYSERVICE
const sendNotification = async (deviceToken, data, messages) => {
  const thisMessage = messages.type === 'text' ? messages.message : 'You have a new message'
  const message = {
    to: deviceToken,
    notification: {
      title: data.name,
      body: thisMessage
    },
    android: {
      priority: 'high'
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1
        }
      }
    },
    data: {
      screen: 'Messages',
      userList: {
        name: data.name,
        url: data.url,
        message:data.message,
        email: data.email,
        unReadMessage: data.unReadMessage,
        userId: data.userId,
        isFriend:data.isFriend,
      },
    },
  };

  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${keyService}`
    },
    body: JSON.stringify(message)
  });

  const result = await response.json();

  if (result.failure > 0) {
    console.log('Failed to send push notification');
  }
};

// setup background (active when click push notifications)
export const background = (props) => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    const userList = JSON.parse(remoteMessage.data.userList);
      props.navigation.navigate(
        remoteMessage.data.screen, 
        { userList: userList })
  });  
}
//----------------


