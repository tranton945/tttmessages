import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Modal,
} from 'react-native';
import { useState, React, useEffect } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome5';;
import styles from './style';
import { UIHeader } from '../../components';
import UserChat from './userChat';

import {
  firebaseAut,
  firebaseDatabase,
  createUserWithEmailAndPassword,
  firebaseGet,
  firebaseSet,
  firebaseRef,
  firebaseChild,
  firebaseOnValue,
  sendEmailVerification,
} from '../../firebase/firebase'
import { async } from '@firebase/util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { getFCMToken, notificationListener, background } from '../../utilities/pushNotifications';

const ChatScreen = props => {
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    console.log('==================ChatScreen==================')
    firebaseOnValue(firebaseRef(firebaseDatabase, 'users'), async (snapshot) => {
      if (snapshot.exists) {
        const dataUsers = snapshot.val();
        const userTypeString = await AsyncStorage.getItem("user")
        const myUID = JSON.parse(userTypeString).uid

        const userListTxt = await AsyncStorage.getItem("userData")
        const userFriendList = JSON.parse(userListTxt).friendList        

        const userFriendRequestList = JSON.parse(userListTxt).friendRequest
        // console.log(dataUsers)

        if(userFriendList === undefined && userFriendRequestList === undefined){
          return 
        } 

        console.log(userFriendRequestList)

        setFriendList(Object.keys(dataUsers)
          // filter to get all user in userFriendList 
          .filter(key => key != myUID &&
            (userFriendRequestList.includes(key) ||
            userFriendList.includes(key)) 
          )
          .map(eachKey => {
            
            const user = dataUsers[eachKey].info;
            const isFriend = userFriendList.includes(eachKey)
            // console.log(isFriend)
            // cần điều chỉnh phần render ở ScrollView để userChat có thể nhận data
            return {
              url: user.photoURL,
              name: user.displayName,
              email: user.email,
              unReadMessage: 0,
              message: 'fake message',   
              isFriend: isFriend,
              userId: eachKey,
            }

          }))
      } else {
        console.log('no data')
      }
    })
  }, [])
  
  const [searchHandler, setSearchHandler] = useState(false)
  // list of items to search
  const [dataList, setDataList] = useState([]);
  const setData = (data) =>{
    setDataList(data)
  }
  return (
    searchHandler === false ?
    <View >      
      <UIHeader
        title="Home"
        leftIconName="ellipsis-v"
        rightIconName="search"
        onPressLeftIconName={() => {
          alert('leftIconName')
          // getFCMToken()
        }}
        // click search btn change searchHandler => true
        // UIHeader will be display search box
        onPressRightIconName={() => {
          setSearchHandler(true)
        }}
        searchHandler={searchHandler}
        // setData use for get list of data when search
        setData={setData}
      />
      <View style={styles.container}>
        <ScrollView>
          {
            friendList.map((item, index) => {
              return (
                // item click
                <TouchableOpacity
                  key={item.userId}
                  style={styles.itemUser}
                  // onPress={() => alert(JSON.stringify(userList))} 
                  //{userList : item} là để lấy từng user {userList}, như này thì nó lấy all user dùng alert(JSON.stringify(userList)) để xem
                  // set cả thẻ <UserChat/> để có thể lấy dc data
                  onPress={() => props.navigation.navigate('Messages', { userList: item })}

                >
                  <UserChat
                    name={item.name}
                    url={item.url}
                    message={item.message}
                    email={item.email}
                    accessToken={item.accessToken}
                    unReadMessage={item.unReadMessage}
                    userId={item.userId}
                    isFriend={item.isFriend}
                  />
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
    </View>
    : 
    <View >      
      <UIHeader
        title="Home"
        leftIconName="chevron-left"
        rightIconName="search"
        onPressLeftIconName={() => {
          setSearchHandler(false)
        }}
        searchHandler={searchHandler}
        // setData use for get list of data when search
        setData={setData}
      />
      <View style={styles.container}>
        <ScrollView>
          {
            dataList.map((item, index) => {
              return (
                // item click
                <TouchableOpacity
                  key={item.userId}
                  style={styles.itemUser}
                  onPress={() => props.navigation.navigate('Messages', { userList: item })}
                >
                  <UserChat
                    name={item.name}
                    url={item.url}
                    message={item.message}
                    email={item.email}
                    accessToken={item.accessToken}
                    unReadMessage={item.unReadMessage}
                    userId={item.userId}
                    isFriend={item.isFriend}
                  />
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
};

export default ChatScreen
