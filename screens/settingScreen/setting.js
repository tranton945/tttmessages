import { View, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Keyboard, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'

import Icon from 'react-native-vector-icons/FontAwesome5'
import styles from './style'
import { UIHeader } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage';

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

import color from '../../contains/color'
import { StackActions } from '@react-navigation/native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { ValidatePhoneNumber } from '../../utilities/validate'
import { choosePhoto } from '../../utilities/HandlePhoto'

const SettingScreen = (props) => {
  const [userInfo, setUserInfo] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [photoURL, setPhotoURL] = useState();
  const saveInfo = () => {
    if(displayName === undefined || displayName.length == 0 || displayName === null){
      alert('Please select a display name')
    }
    const ChangeDisplayName = displayName === userInfo[0].displayName ? userInfo[0].displayName : displayName
    const ChangePhoneNumber = phoneNumber === undefined ? userInfo[0].phoneNumber : phoneNumber

    // console.log(userInfo[0])
    // return
    checkValidate() == true ? (
      firebaseSet(firebaseRef(firebaseDatabase, `users/${firebaseAut.currentUser.uid}/info`),{
        email: userInfo[0].email,
        emailVerified: userInfo[0].emailVerified,
        displayName: ChangeDisplayName,
        photoURL: userInfo[0].photoURL,
        phoneNumber: ChangePhoneNumber,
        fcmToken: userInfo[0].fcmToken,
      }).then(()=>{alert(`Update info successful`)}) 
      ) 
      : 
      alert('Phone number invalid')    
  }

  const checkValidate = () =>
  (ValidatePhoneNumber(phoneNumber) === true ) == true;

  const changePhoto = () => {
    Alert.alert("Do you want to change your photo","",[
      {
        text: 'Cancel',
      },
      {
        text: 'take photo',
        onPress: () => { 
          choosePhoto('photo').then((downloadURL) =>{
            setPhotoURL(downloadURL)
            firebaseSet(firebaseRef(firebaseDatabase, `users/${firebaseAut.currentUser.uid}/info`),{
              email: userInfo[0].email,
              emailVerified: userInfo[0].emailVerified,
              displayName: userInfo[0].displayName,
              photoURL: downloadURL,
              phoneNumber: userInfo[0].phoneNumber,
              fcmToken: userInfo[0].fcmToken,
            }).then(()=>{alert(`Update info successful`)}) 
          })
        }
      },
    ])

    
  }

  // renderItem in FlatList
  const renderScreen = ({ item }) => {
    return (
      <ScrollView>
        <View>
          <View>
            <View style={styles.Account}>
              <Text style={styles.titleTxt}>Account</Text>
              <TouchableOpacity
                onPress={() => setEditMode(true)}
              >
                <Icon style={{ color: color.buttonBlue }} name='edit' size={18} color={'black'} />
              </TouchableOpacity>
            </View>

            <View style={styles.accountBody}>
              {
                editMode === false ?
                  <View>
                    <View style={styles.imageBox}>
                      <TouchableOpacity
                        onPress={() => { changePhoto() }}
                      >
                        <Image
                          style={styles.image}
                          source={{
                            uri: photoURL,
                          }}
                        />
                      </TouchableOpacity>
                      <Text style={styles.Txt}>{item.displayName}</Text>
                    </View>
                    <View style={styles.imageBoxOther}>
                      <View style={styles.emailAndPhone}>
                        <Icon style={{ color: color.buttonBlue }} name='envelope' size={18} color={'black'} />
                        <Text style={styles.Txt}>{item.email}</Text>
                      </View>
                    </View>
                    <View style={styles.imageBoxOther}>
                      <View style={styles.emailAndPhone}>
                        <Icon style={{ color: color.buttonBlue }} name='phone' size={18} color={'black'} />
                        <Text style={styles.Txt}>{item.phoneNumber}</Text>
                      </View>
                    </View>
                  </View>
                  :
                  <View>
                    <View style={styles.imageBox}>
                      <Image
                        style={styles.image}
                        source={{
                          uri: photoURL,
                        }}
                      />
                      <TextInput 
                        style={[styles.Txt, {backgroundColor: color.lightGray, width:"90%", borderRadius:25}]}
                        value={displayName}
                        onChangeText={txt =>{setDisplayName(txt)}}>
                          {/* {item.displayName} */}
                        </TextInput>
                    </View>
                    <View style={styles.imageBoxOther}>
                      <View style={styles.emailAndPhone}>
                        <Icon style={{ color: color.buttonBlue }} name='envelope' size={18} color={'black'} />
                        <Text style={styles.Txt}>{item.email}</Text>
                      </View>
                    </View>
                    <View style={styles.imageBoxOther}>
                      <View style={styles.emailAndPhone}>
                        <Icon style={{ color: color.buttonBlue }} name='phone' size={18} color={'black'} />
                        <TextInput 
                          style={[styles.Txt, {backgroundColor: color.lightGray, width:"90%", borderRadius:25}]} 
                          keyboardType={'numeric'}
                          value={phoneNumber}
                          onChangeText={txt =>{setPhoneNumber(txt)}}>
                            {/* {item.phoneNumber} */}
                          </TextInput>
                      </View>
                    </View>
                    <View style={styles.btnSaveBox}>
                      <TouchableOpacity
                        style={styles.btnSave}
                        onPress={() => {
                          setEditMode(false)
                          saveInfo()
                        }}
                      >
                        <Text 
                          style={styles.btnSaveTxt}
                        >Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

              }
            </View>
          </View>

          <View style={{ backgroundColor: color.lightGray, padding: 5 }}></View>
          <View>
            <Text style={styles.titleTxt}>Common</Text>
            <View style={styles.CommonBody}>
              <View style={styles.CommonLanguage}>
                <Icon style={{ color: color.buttonBlue }} name='language' size={18} color={'black'} />
                <Text style={styles.Txt}>Language</Text>
              </View>
              <TouchableOpacity>
                <View style={styles.CommonLanguage}>
                  <Text style={styles.Txt}>English</Text>
                  <Icon style={{ color: color.buttonBlue }} name='chevron-right' size={18} color={'black'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ backgroundColor: color.lightGray, padding: 5 }}></View>
          <View>
            <Text style={styles.titleTxt}>Other</Text>
            <View style={styles.OtherBody}>
              <View style={styles.OtherItem}>
                <Icon style={{ color: color.buttonBlue }} name='qrcode' size={18} color={'black'} />
                <Text style={styles.Txt}>My QR code</Text>
              </View>
              <View style={styles.OtherItem}>
                <Icon style={{ color: color.buttonBlue }} name='file-signature' size={18} color={'black'} />
                <Text style={styles.Txt}>Setting</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }


  useEffect(() => {
    firebaseOnValue(firebaseRef(firebaseDatabase, 'users'), async (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        const userTypeString = await AsyncStorage.getItem("user")
        const myUID = JSON.parse(userTypeString).uid
        if (userInfo.length == 0) {
          setUserInfo(userInfo.concat(data[myUID].info))          
          setPhotoURL(userInfo.concat(data[myUID].info)[0].photoURL)
          setDisplayName(userInfo.concat(data[myUID].info)[0].displayName)
          setPhoneNumber(userInfo.concat(data[myUID].info)[0].phoneNumber)
        }
      } else {
        console.log('no data')
      }
    })
  }, [])

  return (
    <View style={styles.settingScreen}>
      <UIHeader
        title="User"
        leftIconName="chevron-left"
        rightIconName="ellipsis-v"
        onPressLeftIconName={() => {
          alert('leftIconName');
        }}
        onPressRightIconName={() => {
          alert('rightIconName');
        }}
      />

      <View style={styles.body}>
        <View style={styles.ListMessages}>
          <FlatList data={userInfo} renderItem={renderScreen} />
        </View>
        <View style={{ backgroundColor: color.lightGray, padding: 5 }}></View>
        <View style={styles.SignOutBox}>
          <TouchableOpacity
            style={styles.btnSignOut}
            onPress={() => {
              firebaseAut.signOut()
              // drop all screen => back to login screen
              // the top screen base on initialRouteName in app screen 
              props.navigation.dispatch(StackActions.popToTop())
            }}
          >
            <Text style={styles.txtSignOut}>Sign out</Text>
          </TouchableOpacity>
        </View>

      </View>


    </View>
  )
}

export default SettingScreen