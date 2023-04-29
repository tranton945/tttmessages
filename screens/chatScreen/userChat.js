import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import {UIHeader} from '../../components';
import styles from './style';

import {
  firebaseAut,
  firebaseChild,
  firebaseDatabase,
  firebaseGet,
  firebaseRef,
  firebaseSet,
  firebasePush,
  firebaseOnValue,
  firebaseOnChildAdded,
  firebaseQuery,
  limitToLast,
  limitToFirst,
} from '../../firebase/firebase'

import AsyncStorage from '@react-native-async-storage/async-storage';


const UserChat = props => {
  //get data from chatScreen base on list of users get from firebase
  const {
    url, 
    userId, 
    name, 
    email, 
    isFriend} = props;

  const [message, setMessage] = useState("no message") 
  useEffect(() => {
    firebaseOnValue(firebaseRef(firebaseDatabase, 'chats/'), async (snapshot) => {
      const data = snapshot.val();
      const userTypeString = await AsyncStorage.getItem("user")
      const myUID = JSON.parse(userTypeString).uid
      const friendUID = userId;

      const TempKey = Object.keys(data).filter(key => key.includes(myUID) && key.includes(friendUID))

      //TempKey[0], TempKey is array
      firebaseOnValue(firebaseQuery(firebaseRef(firebaseDatabase, `chats/${TempKey[0]}`), limitToLast(1)), async (snapshot) => {        
        const MessageFirebase = snapshot.val()        
        if (MessageFirebase === null || MessageFirebase === undefined) {
          return
        }
        const data = Object.values(MessageFirebase)

        if(data[0].type == 'text'){
          setMessage(data[0].message)
        }
        if(data[0].type == 'photo'){
          setMessage('you received a photo')
        }
        if(data[0].type == 'video-call'){
          setMessage('Video call')
        }

        
      })
    })

  }, [])


  return (
    <View key={props.userId}>
      <View style={styles.userChat}>
        <View style={styles.boxUserChat}>
          <Image
            style={styles.imageUserChat}
            source={{
              uri: props.url,
            }}
          />
        </View>
        <View style={styles.boxText}>
          {
            isFriend=== true?
            <Text style={styles.userChatName}>{props.name}</Text>
            :
            <Text style={styles.userChatName}>{props.name} [stranger]</Text>
          }          
          {/* substring if the message more 30 character*/}
          <Text style={styles.userChatMessage}>
            {/* {message} */}
            {message.length > 30 ? message.substring(0, 30) + "..." : message}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserChat
