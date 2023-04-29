import { View, Text, Button, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './style';
import { UIHeader } from '../../components';
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemChatRoom from './itemChatRoom';
import {
  firebaseAut,
  firebaseChild,
  firebaseDatabase,
  firebaseGet,
  firebaseRef,
  firebaseSet,
  firebasePush,
  firebaseOnValue,
} from '../../firebase/firebase'



const ChatRoom = (props) => {
  const [roomList, setRoomList] = useState([])

  const [myUid, setMyUid] = useState('');
  const [nameRoom, setNameRoom] = useState('');

  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    console.log(roomList)
  };

  const handleCreate = async () => {
    if (nameRoom.trim().length === 0) {
      return
    }
    const createChatRoom = await {
      roomName: nameRoom,
      url: 'https://w7.pngwing.com/pngs/151/548/png-transparent-chat-room-computer-icons-online-chat-livechat-discussion-group-others-class-monochrome-online-chat.png',
      timestamp: (new Date()).getTime(),
      member: [
        myUid
      ]
    }

    firebasePush(firebaseRef(firebaseDatabase, `ChatRoom/`), createChatRoom)
      .then(() => {
        console.log('create room successfully')
      })
    setNameRoom('')
    setVisible(false);

  };


  useEffect(() => {
    console.log('==================ChatRoom==================')
    firebaseOnValue(firebaseRef(firebaseDatabase, 'ChatRoom'), async (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        // console.log(data)
        const userTypeString = await AsyncStorage.getItem("user")
        const myUID = JSON.parse(userTypeString).uid
        setMyUid(myUID)

        setRoomList(Object.keys(data)
          // filter to get all rom includes userID in list of members
          .filter(key => data[key].member.includes(myUID))
          .map(eachKey => {
            const room = data[eachKey];
            return {
              url: room.url,
              name: room.roomName,
              message: 'fake message',
              roomID: eachKey,
            }
          }))
      } else {
        console.log('no data')
      }
    })    

  }, [])

  return (roomList.length === 0 ?
    <View style={styles.ChatRoomScreen}>
      <UIHeader
        title={'chat room'}
        leftIconName="chevron-left"
        rightIconName="ellipsis-v"
        onPressLeftIconName={() => {
          props.navigation.goBack();
        }}
        onPressRightIconName={() => {
          alert('rightIconName');
        }}
      />

      <View style={styles.noRoom}>
        <TouchableOpacity
          style={styles.btnNoRoom}
          onPress={() => { showDialog() }}
        >
          <Text style={styles.TxtBtnNoRoom}>+</Text>
        </TouchableOpacity>

        <Dialog.Container visible={visible}>
          <Dialog.Title>Enter room name</Dialog.Title>
          <Dialog.Input
            color="#ffffff"
            onChangeText={(txt) => { setNameRoom(txt) }}
          />
          <Dialog.Button
            label="Cancel"
            color="#ffffff"
            onPress={handleCancel} />
          <Dialog.Button
            label="Create"
            color="#ffffff"
            onPress={handleCreate} />
        </Dialog.Container>
      </View>

    </View>
    :
    <View style={styles.ChatRoomScreen}>
      <UIHeader
        title={'Chat Room'}
        leftIconName="chevron-left"
        rightIconName="plus"
        onPressLeftIconName={() => {
          props.navigation.goBack();
        }}
        onPressRightIconName={() => {
          showDialog()
        }}
      />
      <Dialog.Container visible={visible}>
        <Dialog.Title>Enter room name</Dialog.Title>
        <Dialog.Input
          color="#ffffff"
          onChangeText={(txt) => { setNameRoom(txt) }}
        />
        <Dialog.Button
          label="Cancel"
          color="#ffffff"
          onPress={handleCancel} />
        <Dialog.Button
          label="Create"
          color="#ffffff"
          onPress={handleCreate} />
      </Dialog.Container>

      <View style={styles.container}>
        <ScrollView>
          {
            roomList.map((item, index) => {
              return (
                // item click
                <TouchableOpacity
                  key={item.roomID}
                  style={styles.itemChatRoom}
                  onPress={() => props.navigation.navigate('ChatRoomMessages', { roomList: item })}

                >
                  <ItemChatRoom
                    name={item.name}
                    url={item.url}
                    message={item.message}
                    roomID={item.roomID}
                  />
                </TouchableOpacity>
              )
            })}
        </ScrollView>
      </View>
    </View>
  )
}

export default ChatRoom;