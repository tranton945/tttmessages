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
  // latestMessages used to update the latest value of the message
  // onvalue (event listeners) when rendering the screen it doesn't automatically update the value of chatHistory
  // -> it causes the onvalue function to be called then the values of chatHistory when user send is lost
  // - value of chatHistory when initializing screen:
  // [{2},{1}]
  // - when doing setChatHistory(newMessage) and using a useEffect to check the value of chatHistory:
  // [{3},{2},{1}]
  // - when the OnValue function fires and logs the value of chatHistory:
  // [{2},{1}]
  // should use an intermediate variable  
  const [latestMessages, setLatestMessages] = useState([]);
  const [keyFriendAndMe, setKeyFriendAndMe] = useState('')
  const [myUid, setMyUid] = useState(firebaseAut.currentUser.uid);
  const [btnAddFriend, setBtnAddFriend] = useState('');
  const [checkFriend, setCheckFriend] = useState(false);
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

  useEffect(() => {
    setCheckFriend(isFriend)
  })

  useEffect(()=>{
    if(latestMessages.length == 0) return
    console.log(latestMessages)
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
    // user is data for push notification so have url
    // sendMessage has no url because url is processed locally
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
    // use firebasePush to send message
    if (keyFriendAndMe.length !== 0) {
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
  // display 'Accept' if user in friendRequest list or '+ Add Friend'
  useEffect(() => {
    if(checkFriend === true){
      return
    } 
    AsyncStorage.getItem('user')
    .then(data =>{
      // get uid
      const myUID = JSON.parse(data).uid
      const dbRef = firebaseRef(firebaseDatabase);
      // check item user are in friendRequest list?
      firebaseGet(firebaseChild(dbRef, `users/${myUID}`)).then((snapshot) => {
        if (snapshot.exists) {
          const data = snapshot.val();
          if(!data.friendRequest){
            setBtnAddFriend('+ Add Friend')
            return
          }
          const friendId = userId
          //if()
          data.friendRequest.includes(friendId) === false 
          ? setBtnAddFriend('+ Add Friend') : setBtnAddFriend('Accept')  
        } else {
          console.log('no data')
        }
      }).catch((error) => {
        console.error(error);
      });
    })
  },[])

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
      console.log(friendId)
      console.log('firebaseAut.currentUser.uid')
      console.log(firebaseAut.currentUser.uid)
      // return
      const dbRef = firebaseRef(firebaseDatabase);
      firebaseGet(firebaseChild(dbRef, `users/`)).then((snapshot) => {
        if (snapshot.exists) {
          const data = snapshot.val();
          if (data[friendId].friendRequest.includes(firebaseAut.currentUser.uid)) {
            alert('The request has been sent, wait for the other person to accept')
            return
          }
          const uidRequest = data[friendId].friendRequest.concat(firebaseAut.currentUser.uid)
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

        if (data[firebaseAut.currentUser.uid].friendList.includes(friendId) === true) {
          return
        } else {
          // delete friendId from friendRequest list
          const newFriendRequestListForMe = data[firebaseAut.currentUser.uid].friendRequest
            .filter(key => key !== friendId)

          // add friendId to friendList
          // use 'concat' to add new data for friend list (newFriendList.concat(friendId))
          const newFriendListForMe = data[firebaseAut.currentUser.uid].friendList.concat(friendId)

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
    if(keyFriendAndMe === ''){
      firebaseOnValue(firebaseRef(firebaseDatabase, 'chats/'), async (snapshot) => {
        const data = snapshot.val();
        const userTypeString = await AsyncStorage.getItem("user")
        const myUID = JSON.parse(userTypeString).uid
        const userDataTypeString = await AsyncStorage.getItem("userData")
        const userData = JSON.parse(userDataTypeString)
        const friendUID = userId;
        setMyUid(myUID)
        // To filter out the key containing your data and friends, use
        // filter(key => key.includes(myUID) && key.includes(friendUID))
        // before using filter(key => key.includes(myUID && friendUID)) -> this is affected by order
        // in the && => operator should not be used
        const TempKey = Object.keys(data).filter(key => key.includes(myUID) && key.includes(friendUID))
        setKeyFriendAndMe(TempKey)
      })
    }else{
      console.log('key already')
      console.log(keyFriendAndMe)
    }
  },[])
 
  // get 20 messages 1 times
  const [numberOfMessages, setNumberOfMessages] = useState(20)
  useEffect(() => {
    if (!dataLoaded) {
      if(keyFriendAndMe === '' || keyFriendAndMe.length === 0 || keyFriendAndMe ===undefined){
        return
      }else{
        setDataLoaded(true);
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
        // use count to trigger event listeners (update chat History when friend sends a message)
        setCount(count+1)
        // console.log(count)
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

  // video call 
  const handleVideoCall = async () => {
    const sendMessage = await {
      UID: myUid,
      type: 'video-call',
      timestamp: (new Date()).getTime(),
    }

    const friendUID = myUid
    if (keyFriendAndMe.length !== 0) {
      firebasePush(firebaseRef(firebaseDatabase, `chats/${keyFriendAndMe}/`), sendMessage)
        .then(() => {
          console.log('send message successfully')
        })
    } else {
      firebasePush(firebaseRef(firebaseDatabase, `chats/${myUid}-${friendUID}/`), sendMessage)
        .then(() => {
          console.log('send message successfully')
        })
    }    
    // call to videoCall.js
    props.navigation.navigate("VideoCall", props.route.params.userList)
    setVisible(false);
  }

  const [loadMoreMessagesList, setLoadMoreMessagesList] = useState([])
  // load more messages when user roll up
  const loadMoreMessages = () => {
    const messageRef = firebaseChild(dbRef, `chats/${keyFriendAndMe}`);
    //function limitToLast get the last message
    const queryRef = firebaseQuery(messageRef, limitToLast(chatHistory.length + 10));
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
            // if (checkFriend === false)
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
                  handleVideoCall()
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
