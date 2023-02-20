import { View, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
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

import { StackActions } from '@react-navigation/native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'

const SettingScreen = (props) => {
  const [userInfo, setUserInfo] = useState([]);


  const renderScreen = ({ item }) => {
    return (
      <ScrollView>
        <TouchableOpacity>
          <View>
            <View>
              <Text style={styles.titleTxt}>Account</Text>
              <View style={styles.accountBody}>
                <View style={styles.imageBox}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: item.url,
                    }}
                  />
                  <Text style={styles.Txt}>{item.name}</Text>
                </View>
                <View style={styles.imageBoxOther}>
                  <View style={styles.emailAndPhone}>
                    <Icon name='envelope' size={18} color={'black'} />
                    <Text style={styles.Txt}>{item.email}</Text>
                  </View>
                </View>
                <View style={styles.imageBoxOther}>
                  <View style={styles.emailAndPhone}>
                    <Icon name='phone' size={18} color={'black'} />
                    <Text style={styles.Txt}>{item.phone}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View>
              <Text style={styles.titleTxt}>Common</Text>
              <View style={styles.CommonBody}>
                <View style={styles.CommonLanguage}>
                  <Icon name='language' size={18} color={'black'} />
                  <Text style={styles.Txt}>Language</Text>
                </View>
                <View style={styles.CommonLanguage}>
                  <Text style={styles.Txt}>English</Text>
                  <Icon name='chevron-right' size={18} color={'black'} />
                </View>
              </View>
            </View>

            <View>
              <Text style={styles.titleTxt}>Other</Text>
              <View style={styles.OtherBody}>
                <View style={styles.OtherItem}>
                  <Icon name='qrcode' size={18} color={'black'} />
                  <Text style={styles.Txt}>My QR code</Text>
                </View>
                <View style={styles.OtherItem}>
                  <Icon name='file-signature' size={18} color={'black'} />
                  <Text style={styles.Txt}>Setting</Text>
                </View>
              </View>
            </View>    
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }

  useEffect(() => {
    firebaseOnValue(firebaseRef(firebaseDatabase, 'users'), async (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        const userTypeString = await AsyncStorage.getItem("user")
        const myUID = JSON.parse(userTypeString).uid

        setUserInfo(Object.keys(data)
          // filter to get all user != my user
          .filter(key => key == myUID)
          .map(key => {
            const user = data[key];
            // console.log(user)
            return {
              url: user.photoURL,
              name: user.email,
              email: user.email,
              userId: key,
              phone: user.phoneNumber,
            }
          }))
      } else {
        console.log('no data')
      }
      console.log(Object.values(userInfo).email)
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