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
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './style';
import { UIHeader } from '../../components';
import ItemMessageChatRoom from './itemMessageChatRoom';
import Dialog from "react-native-dialog";

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
import { async } from '@firebase/util';

import UserChat from '../chatScreen/userChat'


const ChatRoomMessages = props => {
  const [txt, setTxt] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [myUid, setMyUid] = useState('');

  // save photo or video here 
  const [filePath, setFilePath] = useState({});

  // get data from chatRoom
  const { name, roomID} = props.route.params.roomList;

  const messagesRef = useRef(null);
  const renderMessages = ({ item }) => {
    // console.log(myUid)
    return (
      <ItemMessageChatRoom
        photoUrl={item.photoUrl}
        UID={item.UID}
        timestamp={item.timestamp}
        message={item.message}
        isSender={item.isSender}
        name={item.name}
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

    // get userData
    const userDataTypeString = await AsyncStorage.getItem("userData")
    const userData = JSON.parse(userDataTypeString)

    // create messages object
    const sendMessage = await {
      roomID: roomID,
      UID: myUid,
      displayName: userData.info.displayName,
      photoUrl: userData.info.photoURL,
      message: txt,
      type: typeMess,
      imgMessage: imgUrl,
      timestamp: (new Date()).getTime(),
    }
    firebasePush(firebaseRef(firebaseDatabase, `chatRoomMessages/`), sendMessage)
      .then(() => {
        setTxt('')
        console.log('send message successfully')
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
    setSearchHandler(true)
    setVisible(false)  
  };

  //---------------------the problem: calling to firebase 2 times -> set chatHistory 2 times  ----//
  // get messages function
  useEffect(() => {
    console.log('=================chatRoomMessages================')
    console.log('Room id: ' + roomID)
    // get data from firebase
    firebaseOnValue(firebaseRef(firebaseDatabase, 'chatRoomMessages/'), async (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        const userTypeString = await AsyncStorage.getItem("user")
        const myUID = JSON.parse(userTypeString).uid
        setMyUid(myUID)

        setChatHistory(Object.keys(data)
        // filter to get all rom includes userID in list of members
        .filter(key => data[key].roomID.includes(roomID))
        .map(eachKey => {
          const roomMessage = data[eachKey];
          // console.log("roomMessage")
          // console.log(roomMessage)
          // c???n ??i???u ch???nh l???i ph???n name
          // l??c ????ng k?? t???o ra display name lu??n
          return {
            photoUrl: roomMessage.photoUrl,
            name: roomMessage.displayName,                
            message: roomMessage.message,  
            timestamp: roomMessage.timestamp,
            isSender: roomMessage.UID === myUID,
            type: roomMessage.type,
            imgMessage: roomMessage.imgMessage,
          }  
        })
        .sort((item1, item2) =>item1.timestamp - item2.timestamp))
      } else {
        console.log('No data')
      }
    })
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
      const storageRef = ref(storage, `chatRoomMessagesImages/${fileName}`);
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

  const addNewMember = (uid) => {
    // alert(uid)
    // return
    const dbRef = firebaseRef(firebaseDatabase);
    firebaseGet(firebaseChild(dbRef, `ChatRoom/${roomID}`)).then((snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val()
        const IdMember = data.member.concat(uid)        
        firebaseSet(firebaseRef(firebaseDatabase, `ChatRoom/${roomID}/member`), IdMember)
      } else {
        console.log('no data')
      }
    })
  }

  const [searchHandler, setSearchHandler] = useState(false)
  // list of items we have when click search
  const [dataList, setDataList] = useState([]);
  const setData = (data) =>{
    setDataList(data)
  }
  const addMember = (item) =>{
    Alert.alert("Add user", "Do you want to add this user to the room",[
      {
        text: 'Cancel',
      },
      {
        text: 'Accept',
        onPress: () => {
          addNewMember(item.userId)
        }
      }
    ])
    
  }

  return (
    searchHandler === false ?
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
          // click()          
        }}
        searchHandler={searchHandler}
        // setData use for get list of data when search
        setData={setData}
      />
      {/* threeDotMenu */}
      <Dialog.Container visible={visible}>
        <Dialog.Title>Choose option</Dialog.Title>
        <TouchableOpacity onPress={() => { handleChooseOption() }}>
          <Dialog.Description style={styles.threeDotMenuOptions}>
            Add new member
          </Dialog.Description>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { console.log('asd') }}>
          <Dialog.Description style={styles.threeDotMenuOptions}>
            Group Call
          </Dialog.Description>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { console.log('asd') }}>
          <Dialog.Description style={styles.threeDotMenuOptions}>
            Delete Room
          </Dialog.Description>
        </TouchableOpacity>
        <Dialog.Button
          label="Cancel"
          color="#ffffff"
          onPress={handleCancel} />
      </Dialog.Container>

      <View style={styles.SendMessBody}>
        <View style={styles.ListMessages}>
          {/* <FlatList data={chatHistory} renderItem={renderMessages} /> */}
          <FlatList
                // key={item.id}
                ref={messagesRef}
                data={chatHistory}
                renderItem={renderMessages}
                keyExtractor={item => item.timestamp}
                // auto scroll to bottom when user open the screen
                inverted={true}
              />
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
              onPress={() => { clickSendMessages('text') }}
            >
              <Icon name="paper-plane" size={26} style={styles.iconSendMess} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
    :
    <View>      
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
                onPress={() => {addMember(item)}}
              >
                <UserChat
                  name={item.name}
                  url={item.url}
                  email={item.email}
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

export default ChatRoomMessages;
