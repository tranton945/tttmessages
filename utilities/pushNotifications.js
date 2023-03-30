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
    // console.log('-------------------push notification------------------------')
    // if can not get FCM token -> get new token and update 
    const data = userData.info
    if (!fcmToken) {
        try {          
            // get new fmc token
            const takeFMCToke = await messaging().getToken()
            firebaseSet(firebaseRef(db, `/users/${user.uid}/info`), {
              email: data.email,
              emailVerified: data.emailVerified,
              displayName: data.email,
              photoURL: data.photoURL,
              phoneNumber: data.phoneNumber,
              fmcToken: takeFMCToke,
            })
        }
        catch (err) {
            console.log(err)
        }
    }

  // Lắng nghe sự kiện thiết bị nhận được token mới
  messaging().onTokenRefresh(token => {
    // const dbRef = firebaseRef(db);
    firebaseSet(firebaseRef(db, `/users/${user.uid}/info`), {
      email: data.email,
      emailVerified: data.emailVerified,
      displayName: data.email,
      photoURL: data.photoURL,
      phoneNumber: data.phoneNumber,
      fmcToken: token,
    })
  });     
}


// lắng ghe khi có notifications đến
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
  // data là dự liệu nhận vào để mở chat screen (tham khảo data nhận vào của UserChat)
  // messages là tin nhắn khi user gửi tới friend
  if(myUID === firebaseAut.currentUser.uid){
    const dbRef = firebaseRef(firebaseDatabase);
    // check item user are in friendRequest list?
    firebaseGet(firebaseChild(dbRef, `users/${friendUid}/info/fmcToken`))
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
// const [keyService, setKeyService] = useState('AAAA46EzMvs:APA91bHqVera_UuRA4-NN4RGHbLeKMgfL0_-yAN4pfT-_k1r7QujXcG168C3nSeQc_j0cziQM1ncNTqFkPfdrPEnCnuS-JH9SnX-Wdu4cY9YqSRy2PBJMYBpyi5LUP3h7Cn8ijd0RYBm');
let keyService = "AAAA46EzMvs:APA91bHqVera_UuRA4-NN4RGHbLeKMgfL0_-yAN4pfT-_k1r7QujXcG168C3nSeQc_j0cziQM1ncNTqFkPfdrPEnCnuS-JH9SnX-Wdu4cY9YqSRy2PBJMYBpyi5LUP3h7Cn8ijd0RYBm"
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


