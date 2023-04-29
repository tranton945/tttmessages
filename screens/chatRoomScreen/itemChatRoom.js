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

const ItemChatRoom = props => {
  //get data from chatScreen base on list of users get from firebase
  const {url, roomID, name} = props;

  const [message, setMessage] = useState("no message") 
  const [listMessage, setListMessage] = useState([]) 
  useEffect(() => {
    firebaseOnValue(firebaseRef(firebaseDatabase, 'chatRoomMessages/'), async (snapshot) => {
      const data = snapshot.val();


      setListMessage(Object.keys(data)
      // filter to get all rom includes userID in list of members
      .filter(key => data[key].roomID.includes(roomID))
      .map(eachKey => {
        const roomMessage = data[eachKey];
        return {
          photoUrl: roomMessage.photoUrl,
          name: roomMessage.displayName,                
          message: roomMessage.message,  
          timestamp: roomMessage.timestamp,
          type: roomMessage.type,
          imgMessage: roomMessage.imgMessage,
        }  
      }).sort((item1, item2) =>item2.timestamp - item1.timestamp))

    })

  }, [])

  useEffect(()=>{
    console.log(listMessage[0] === undefined)
    // console.log(listMessage[0].type)
    if(listMessage[0] === undefined) return    
    if(listMessage[0].type == 'text'){
      setMessage(listMessage[0].message)
    }
    if(listMessage[0].type == 'photo'){
      setMessage('you received a photo')
    }    
  },[listMessage])

  return (
    <View key={props.roomId}>
      <View style={styles.roomItem}>
        <View style={styles.boxImg}>
          <Image
            style={styles.img}
            source={{
              uri: props.url,
            }}
          />
        </View>
        <View style={styles.boxText}>
          <Text style={styles.roomName}>{props.name}</Text>
          {/* <Text style={styles.message}>{props.message}</Text> */}
          <Text style={styles.lastMessage}>
            {/* {message} */}
            {message.length > 30 ? message.substring(0, 30) + "..." : message}
          </Text>
        </View>
      </View>
    </View>
  );
};;

export default ItemChatRoom
