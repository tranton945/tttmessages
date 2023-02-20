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
// image picker
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';

import { storage } from '../../firebase/firebase';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL } from "firebase/storage";

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
import { FlatList, Switch } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Messages = props => {
  const [txt, setTxt] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [keyFriendAndMe, setKeyFriendAndMe] = useState()
  const [myUid, setMyUid] = useState('');
  const [btnAddFriend, setBtnAddFriend] = useState('');  
  const [checkFriend, setCheckFriend] = useState(isFriend);
  // save photo or video here 
  const [filePath, setFilePath] = useState({});

  // get data from userChat when choose user
  const { 
    url, 
    userId, 
    name, 
    message, 
    unReadMessage,
    isFriend  } = props.route.params.userList;
   

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

  // send message function
  const clickSendMessages = async (typeMess, photoMessageURL) => {
    if (txt.trim().length === 0) {
      console.log("no txt")
      if(photoMessageURL === undefined){        
        console.log("no url")
        return      
      }
    }
    const imgUrl = photoMessageURL === undefined ? '': photoMessageURL

    // get friendUID with props
    const friendUID = userId;    
    // create messages object
    const sendMessage = await {
      UID: myUid,
      photoUrl: url,
      message: txt,
      type: typeMess,
      imgMessage: imgUrl,
      timestamp: (new Date()).getTime(),
    }
    // send message to firebase wiht id = myUID-friendUID 
    // user firebasePush to send message
    if (keyFriendAndMe === null || keyFriendAndMe === undefined) {
      firebasePush(firebaseRef(firebaseDatabase, `chats/${myUid}-${friendUID}/`), sendMessage)
        .then(() => {
          setTxt('')
          console.log('send message successfully')
          handleNewMessage
        })
    } else {
      firebasePush(firebaseRef(firebaseDatabase, `chats/${keyFriendAndMe}/`), sendMessage)
        .then(() => {
          setTxt('')
          console.log('send message successfully')
          handleNewMessage
        })
    }
  }

  //create key type myUID-friendUID or friendUID-myUID
  const checkKeysFirebase = (TempKey, myUID, friendUID) => {
    for (let i = 0; i < TempKey.length; i++) {
      let tempKey1 = TempKey[i].split('-')[0]
      let tempKey2 = TempKey[i].split('-')[1]
      switch (myUID) {
        case tempKey1: {
          if (tempKey2 === friendUID) {
            return `${myUID}-${friendUID}`
          }
        }
        case tempKey2: {
          if (tempKey1 === friendUID) {
            return `${friendUID}-${myUID}`
          }
        }
      }
    }
  }
  const clickAddFriend = () =>{
    if(btnAddFriend === 'Accept'){
      Alert.alert("Add Friend", "",[
        {
          text: 'Cancel',
        },
        {
          text: 'Reject',
          onPress: () => {alert('reject')}
        },
        {
          text: 'Accept',
          onPress: () => {
            acceptAddFriend()
          }
        }
      ])
    }else{
      const friendId = userId
      const dbRef = firebaseRef(firebaseDatabase);
      firebaseGet(firebaseChild(dbRef, `users/`)).then((snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        if(data[friendId].friendRequest.includes(myUid)){
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
    })}
  }
  const acceptAddFriend = () => {
    const dbRef = firebaseRef(firebaseDatabase);
    firebaseGet(firebaseChild(dbRef, `users/`)).then((snapshot) => {
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
        
        if(data[friendId].friendList.includes(myUid) === true){
          return
        }else{
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
  
  useEffect(() => {
    console.log('==================message==================')

    // display 'Accept' if user in friendRequest list or '+ Add Friend'
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

    // get messages 
    // get messages list from firebase
    const unSub = firebaseOnValue(firebaseRef(firebaseDatabase, 'chats/'), async (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        const userTypeString = await AsyncStorage.getItem("user")
        const myUID = JSON.parse(userTypeString).uid
        // userId is friend id received from 
        const friendUID = userId;     
        setMyUid(myUID)   
        if (data === null) {
          return
        }

        // filter all chat with myUID and friendUID
        // const TempKey = await Object.values(Object.keys(data).filter(key => key.includes(myUID)))
        const TempKey = await Object.keys(data).filter(key => key.includes(myUID))

        // 'check' if undefined -> stop else setKeyFriendAndMe(check)
        // to send message
        const check = checkKeysFirebase(TempKey, myUID, friendUID)
        if (check == null) {
          return
        }
        setKeyFriendAndMe(check)

        // get all chat fom firebase with link by TempKey
        firebaseOnValue(firebaseRef(firebaseDatabase, `chats/${check}`), async (TempSnapshot) => {
          if(TempSnapshot.exists){
            const MessageFirebase = TempSnapshot.val();
            const getMessageFromFirebase = await Object.keys(MessageFirebase)            
            .map(eachKey =>{
              const TheMessage = MessageFirebase[eachKey]
                return {
                  photoUrl: TheMessage.photoUrl,
                  UID: TheMessage.UID,
                  message: TheMessage.message,
                  timestamp: TheMessage.timestamp,
                  isSender: TheMessage.UID === myUID,
                  type: TheMessage.type,
                  imgMessage: TheMessage.imgMessage,
                }                            
            })
            .sort((item1, item2) =>item2.timestamp - item1.timestamp)

            setChatHistory(getMessageFromFirebase)
            
          }else{
            console.log('No data')
          }
        })        
      } else {
        console.log('No data')
      }
    })

    return unSub
  }, [])


  // select photo
  const choosePhoto = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 2560,
      maxHeight: 1440,
      quality: 1,
    };
    await launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      const data = response.assets[0]
      setFilePath(data);

      const res = await fetch(data.uri)
      const blod = await res.blob();
      const fileName = data.uri.substring(data.uri.lastIndexOf('/') + 1)

      uploadPhoto(fileName, blod)
    });
  }
  // upload ing to storage in firebase
  const uploadPhoto = (fileName, file) => {
    const storageRef = ref(storage, `chatImages/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);    
   
    uploadTask.on('state_changed',
    (snapshot) => {
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }},
      (error) => {      
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          clickSendMessages('photo', downloadURL)
        });


      }
    );
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
  ///////////////////////////

  //======================================================
  const handleNewMessage = () => {
    messagesRef.current.scrollToEnd({ animated: true });
  };
  //======================================================


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
                <TouchableOpacity onPress={() => { console.log('asd') }}>
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
              :
              //else
              // <FlatList data={chatHistory} renderItem={renderMessages} />

              <FlatList
                // key={item.id}
                ref={messagesRef}
                data={chatHistory}
                renderItem={renderMessages}
                keyExtractor={item => item.timestamp}
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
            onPress={() => { camera() }}
          >
            <Icon name="camera" size={26} style={styles.iconSendMess} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { choosePhoto('photo') }}
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
