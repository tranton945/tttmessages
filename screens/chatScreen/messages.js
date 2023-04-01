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
import { useState, React, useEffect, useRef, } from 'react';
import ItemMessage from './itemMessage'

import Dialog from "react-native-dialog";
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './style';
import { UIHeader } from '../../components';


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

import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";
const dbRef = firebaseRef(firebaseDatabase);

import { FlatList, Switch } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onNewMessage } from '../../utilities/pushNotifications';
import {
  // take ing or vid by storage
  // type is 'photo' or 'video' 
  // 'photo' already, "video" coding
  choosePhoto,
  // take ing or vid by camera
  // type is 'photo' or 'video' 
  // 'photo' already, "video" coding
  capturePhoto
} from '../../utilities/HandlePhoto.js';



const Messages = props => {
  const [txt, setTxt] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  // latestMessages sử dụng để cập nhật giá trị mới nhất của tin nhắn
  // thằng onvalue (event listeners) khi re-render screen nó k tự cập nhập lại giá trị của chatHistory
  // -> nó làm cho khi hàm onvalue đươc gọi thì những giá trị của chatHistory khi user send bị mất
  // - giá trị của chatHistory khi khởi tạo screen:
  // [{2},{1}]
  // - khi thực hiện setChatHistory(newMessage) và dùng một useEffect để kiểm tra giá trị của chatHistory:
  // [{3},{2},{1}]
  // - khi hàm OnValue kích hoạt và log giá trị của chatHistory:
  // [{2},{1}]
  // nên dùng một biến trung gian  
  const [latestMessages, setLatestMessages] = useState([]);
  const [keyFriendAndMe, setKeyFriendAndMe] = useState()
  const [myUid, setMyUid] = useState('');
  const [btnAddFriend, setBtnAddFriend] = useState('');
  const [checkFriend, setCheckFriend] = useState(isFriend);
  // save photo or video here 
  const [filePath, setFilePath] = useState({});
  // dataLoaded use for checking keyFriendAndMe, if keyFriendAndMe have data -> true
  const [dataLoaded, setDataLoaded] = useState(false)
  
  // get data from userChat when choose user
  const {
    url,
    userId,
    name,
    // message, 
    unReadMessage,
    isFriend } = props.route.params.userList;

  const messagesRef = useRef(null);
  const renderMessages = ({ item }) => {
    return (
      <ItemMessage
        photoUrl={item.photoUrl}
        UID={item.UID}
        timestamp={item.timestamp}
        message={item.message}
        isSender={item.isSender}
        type={item.type}
        imgMessage={item.imgMessage}
      // onPress = {alert(()=>{"Press"})}
      />
    )
  }

  useEffect(()=>{
    if(latestMessages.length == 0) return
    //update chatHistory when we have new messages
    const newChatHistory =[
      latestMessages,
      ...chatHistory
    ]
    setChatHistory(newChatHistory);    
  },[latestMessages])

  // send message function
  const clickSendMessages = async (typeMess, photoMessageURL) => {
    if (txt.trim().length === 0) {
      console.log("no txt")
      if (photoMessageURL === undefined) {
        console.log("no url")
        return
      }
    }

    const myDataTxt = await AsyncStorage.getItem("userData")
    const userData = JSON.parse(myDataTxt)
    // user là data cho push notification nên có url
    // sendMessage k có url là vì url dc sử lý ở local
    const user = {
      name: userData.info.displayName,
      url: userData.info.photoURL,
      message: "fake message",
      email: userData.info.email,
      unReadMessage: 0,
      userId: myUid,
      isFriend: isFriend,
    }

    const imgUrl = photoMessageURL === undefined ? '' : photoMessageURL

    // get friendUID with props
    const friendUID = userId;
    // create messages object
    const sendMessage = await {
      UID: myUid,
      message: txt,
      type: typeMess,
      imgMessage: imgUrl,
      timestamp: (new Date()).getTime(),
    }

    // when user send message, the message will be send to the database
    // and this message will be add in to the chatHistory
    // app will not re-render the message
    const addNewMessage = {
      UID: myUid,
      imgMessage: imgUrl,
      isSender: true,
      message: txt,
      photoUrl: userData.info.photoURL,
      timestamp: (new Date()).getTime(),
      type: typeMess
    }
    setLatestMessages(addNewMessage)
    setTxt('')

    // send message to firebase wiht id = myUID-friendUID 
    // user firebasePush to send message
    if (keyFriendAndMe !== null && keyFriendAndMe !== undefined) {
      firebasePush(firebaseRef(firebaseDatabase, `chats/${keyFriendAndMe}/`), sendMessage)
        .then(() => {
          onNewMessage(friendUID, myUid, user, sendMessage)
          console.log('send message successfully')
        })
    } else {
      firebasePush(firebaseRef(firebaseDatabase, `chats/${myUid}-${friendUID}/`), sendMessage)
        .then(() => {
          onNewMessage(friendUID, myUid, user, sendMessage)
          console.log('send message successfully')
        })
    }
  }
  const clickAddFriend = () => {
    if (btnAddFriend === 'Accept') {
      Alert.alert("Add Friend", "", [
        {
          text: 'Cancel',
        },
        {
          text: 'Reject',
          onPress: () => { alert('reject') }
        },
        {
          text: 'Accept',
          onPress: () => {
            acceptAddFriend()
          }
        }
      ])
    } else {
      const friendId = userId
      const dbRef = firebaseRef(firebaseDatabase);
      firebaseGet(firebaseChild(dbRef, `users/`)).then((snapshot) => {
        if (snapshot.exists) {
          const data = snapshot.val();
          if (data[friendId].friendRequest.includes(myUid)) {
            alert('The request has been sent, wait for the other person to accept')
            return
          }
          const uidRequest = data[friendId].friendRequest.concat(myUid)
          firebaseSet(firebaseRef(firebaseDatabase, `users/${friendId}/friendRequest`), uidRequest)
        } else {
          console.log('no data')
        }
      }).catch((error) => {
        console.error(error);
      })
    }
  }
  const acceptAddFriend = () => {
    const dbRef = firebaseRef(firebaseDatabase);
    firebaseGet(firebaseChild(dbRef, `users/`)).then(async (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        const friendId = userId

        if (data[myUid].friendList.includes(friendId) === true) {
          return
        } else {
          // delete friendId from friendRequest list
          const newFriendRequestListForMe = data[myUid].friendRequest
            .filter(key => key !== friendId)

          // add friendId to friendList
          // use 'concat' to add new data for friend list (newFriendList.concat(friendId))
          const newFriendListForMe = data[myUid].friendList.concat(friendId)

          firebaseSet(firebaseRef(firebaseDatabase, `users/${myUid}/friendList`), newFriendListForMe)
            .then(() => {
              firebaseSet(firebaseRef(firebaseDatabase, `users/${myUid}/friendRequest`), newFriendRequestListForMe)
            })
        }

        if (data[friendId].friendList.includes(myUid) === true) {
          return
        } else {
          const newFriendListForFriend = data[friendId].friendList.concat(myUid)
          firebaseSet(firebaseRef(firebaseDatabase, `users/${friendId}/friendList`), newFriendListForFriend)
        }
        setCheckFriend(true)

      } else {
        console.log('no data')
      }
    }).catch((error) => {
      console.error(error);
    });


  }

  // setKeyFriendAndMe when screen called
  useEffect(()=>{
    if(keyFriendAndMe === undefined){      
      firebaseOnValue(firebaseRef(firebaseDatabase, 'chats/'), async (snapshot) => {
        const data = snapshot.val();
        const userTypeString = await AsyncStorage.getItem("user")
        const myUID = JSON.parse(userTypeString).uid
        const userDataTypeString = await AsyncStorage.getItem("userData")
        const userData = JSON.parse(userDataTypeString)
        const friendUID = userId;
        setMyUid(myUID)
        // để lọc ra key chứa data của mình và friend thì dùng
        // filter(key => key.includes(myUID) && key.includes(friendUID))
        // lúc trước dùng filter(key => key.includes(myUID && friendUID)) -> cách này bị ảnh hưởng bởi thứ tự
        // trong toán tử && => k nên dùng
        const TempKey = Object.keys(data).filter(key => key.includes(myUID) && key.includes(friendUID))
        setKeyFriendAndMe(TempKey)
      })
    }else{
      console.log('key already')
      console.log(keyFriendAndMe)
    }
  },[])
 
  // get 20 messages 1 times
  const [numberOfMessages, setNumberOfMessages] = useState(10)
  useEffect(() => {
    if (!dataLoaded) {
      if(keyFriendAndMe !== undefined){
        setDataLoaded(true);
      }else{
        return
      }      
      const messageRef = firebaseChild(dbRef, `chats/${keyFriendAndMe}`);
      //function limitToLast get the last message
      const queryRef = firebaseQuery(messageRef, limitToLast(numberOfMessages));
      firebaseGet(queryRef).then(async (snapshot) => {
        setCheckFriend(isFriend)
        const userTypeString = await AsyncStorage.getItem("user")
        const myUID = JSON.parse(userTypeString).uid
        const userDataTypeString = await AsyncStorage.getItem("userData")
        const userData = JSON.parse(userDataTypeString)
        const friendUID = userId;
        const friendUrl = url;

        const MessageFirebase = snapshot.val()

        const getMessageFromFirebase = Object.keys(MessageFirebase)
          .map(eachKey => {
            const TheMessage = MessageFirebase[eachKey]
            const photoUrl = TheMessage.UID === myUID ? userData.info.photoURL : friendUrl
            return {
              photoUrl: photoUrl,
              UID: TheMessage.UID,
              message: TheMessage.message,
              timestamp: TheMessage.timestamp,
              isSender: TheMessage.UID === myUID,
              type: TheMessage.type,
              imgMessage: TheMessage.imgMessage,
            }
          })
          .sort((item1, item2) => item2.timestamp - item1.timestamp)

        setChatHistory(getMessageFromFirebase)
        // sử dụng count để kích hoạt event listeners (update chatHistory khi friend send mess)
        setCount(count+1)
        console.log(count)
      })
    }
  }, [keyFriendAndMe])

  // event listeners
  // listen from database when friend send new message
  const [count, setCount] = useState(0)
  useEffect(()=>{    
      if(chatHistory[0] === undefined){
        return
      }
      firebaseOnValue(firebaseQuery(firebaseRef(firebaseDatabase, `chats/${keyFriendAndMe}`), limitToLast(1)), async (snapshot) => {        
        const MessageFirebase = snapshot.val()        
        if (MessageFirebase === null || MessageFirebase === undefined) {
          return
        }
        const userTypeString = await AsyncStorage.getItem("user")
        const myUID = JSON.parse(userTypeString).uid
        const userDataTypeString = await AsyncStorage.getItem("userData")
        const userData = JSON.parse(userDataTypeString)
        const friendUID = userId;
        const friendUrl = url;  

        const data = Object.values(MessageFirebase)
        if(data[0].UID !== friendUID){
          return
        }
        if(data[0].timestamp == chatHistory[0].timestamp){
          return
        }
        const addNewMessage = {
          UID: data[0].UID,
          imgMessage: data[0].imgMessage,
          isSender: false,
          message: data[0].message,
          photoUrl: friendUrl,
          timestamp: data[0].timestamp,
          type: data[0].type
        }
        setLatestMessages(addNewMessage)
  
      })
  },[count])

  const [loadMoreMessagesList, setLoadMoreMessagesList] = useState([])
  // load more messages when user roll up
  const loadMoreMessages = () => {
    const messageRef = firebaseChild(dbRef, `chats/${keyFriendAndMe}`);
    //function limitToLast get the last message
    const queryRef = firebaseQuery(messageRef, limitToLast(chatHistory.length + 3));
    firebaseGet(queryRef).then(async (snapshot) => {      
      const userTypeString = await AsyncStorage.getItem("user")
      const myUID = JSON.parse(userTypeString).uid
      const userDataTypeString = await AsyncStorage.getItem("userData")
      const userData = JSON.parse(userDataTypeString)
      const friendUID = userId;
      const friendUrl = url;

      const MessageFirebase = snapshot.val()
      const getMessageFromFirebase = Object.keys(MessageFirebase)
        .map(eachKey => {
          const TheMessage = MessageFirebase[eachKey]
          const photoUrl = TheMessage.UID === myUID ? userData.info.photoURL : friendUrl
          return {
            photoUrl: photoUrl,
            UID: TheMessage.UID,
            message: TheMessage.message,
            timestamp: TheMessage.timestamp,
            isSender: TheMessage.UID === myUID,
            type: TheMessage.type,
            imgMessage: TheMessage.imgMessage,
          }
        })
        .sort((item1, item2) => item2.timestamp - item1.timestamp)
      
      const a = getMessageFromFirebase.slice(chatHistory.length)
      const loadMoreMess = chatHistory.concat(...a)
      setChatHistory(loadMoreMess)
    })
  }

  // threeDotMenu
  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const handleChooseOption = async (type) => {

    alert('handleChooseOption')
    setVisible(false);
  };


  

  return (
    <View style={styles.SendMessScreen}>
      <UIHeader
        title={name}
        leftIconName="chevron-left"
        rightIconName="ellipsis-v"
        onPressLeftIconName={() => {
          props.navigation.goBack();
        }}
        onPressRightIconName={() => {
          showDialog()
        }}
      />
      <View style={styles.SendMessBody}>
        {
          checkFriend === false ?
            // if (checkFriend === false ?)
            <View style={styles.friendRequest}>
              <TouchableOpacity onPress={() => { clickAddFriend() }}>
                <Text style={styles.friendRequestTxt}>{btnAddFriend}</Text>
              </TouchableOpacity>

              {/* threeDotMenu isFriend == false*/}
              <Dialog.Container visible={visible}>
                <Dialog.Title>Choose option</Dialog.Title>
                <TouchableOpacity onPress={() => { console.log('asd') }}>
                  <Dialog.Description style={styles.threeDotMenuOptions}>
                    Delete Chats
                  </Dialog.Description>
                </TouchableOpacity>
                <Dialog.Button
                  label="Cancel"
                  color="#ffffff"
                  onPress={handleCancel} />
              </Dialog.Container>
            </View>
            :
            //else
            <View>
              {/* threeDotMenu isFriend == true */}
              <Dialog.Container visible={visible}>
                <Dialog.Title>Choose option</Dialog.Title>
                <TouchableOpacity onPress={() => { console.log('asd') }}>
                  <Dialog.Description style={styles.threeDotMenuOptions}>
                    Call
                  </Dialog.Description>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  props.navigation.navigate("VideoCall", props.route.params.userList)
                  setVisible(false);
                 }}>
                  <Dialog.Description style={styles.threeDotMenuOptions}>
                    Video Call
                  </Dialog.Description>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { console.log('asd') }}>
                  <Dialog.Description style={styles.threeDotMenuOptions}>
                    Send File
                  </Dialog.Description>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { console.log('asd') }}>
                  <Dialog.Description style={styles.threeDotMenuOptions}>
                    Delete Chats
                  </Dialog.Description>
                </TouchableOpacity>
                <Dialog.Button
                  label="Cancel"
                  color="#ffffff"
                  onPress={handleCancel} />
              </Dialog.Container>
            </View>
        }
        <View style={styles.ListMessages}>
          {
            //if(chatHistory.length == 0)
            chatHistory.length == 0 ? console.log('No chat history')
            // list.length == 0 ? console.log('No chat history')
              :
              <FlatList
                ref={messagesRef}
                data={chatHistory}
                renderItem={renderMessages}
                keyExtractor={item => item.timestamp}
                onEndReached={loadMoreMessages}
                onEndReachedThreshold={0.1}
                // auto scroll to bottom when user open the screen
                inverted={true}
              />
          }
        </View>
      </View>

      <View style={styles.SendMessBox}>
        <TextInput
          placeholder='Enter your message here'
          placeholderTextColor="#BEBEBE"
          value={txt}
          onChangeText={(txt) => { setTxt(txt) }}
          style={styles.SendMessInput} />
        <View style={styles.chooseOptionSendMess}>
          <TouchableOpacity
            onPress={() => {
              capturePhoto('photo').then((downloadURL) => {
                clickSendMessages('photo', downloadURL)
              })
            }}
          >
            <Icon name="camera" size={26} style={styles.iconSendMess} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              choosePhoto('photo').then((downloadURL) => {
                clickSendMessages('photo', downloadURL)
              })
            }}
          >
            <Icon name="image" size={26} style={styles.iconSendMess} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // test()
              clickSendMessages('text')
            }}
          >
            <Icon name="paper-plane" size={26} style={styles.iconSendMess} />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

export default Messages;
