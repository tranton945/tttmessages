import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'

import Icon from 'react-native-vector-icons/FontAwesome5'
import styles from './style'
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
} from '../firebase/firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { async } from '@firebase/util'
const UIHeader = (props) => {
    const {
        title,
        leftIconName = '',
        rightIconName = '',
        onPressLeftIconName,
        onPressRightIconName,
        searchHandler = false,
        setData, } = props
    const [searchTxt, setSearchTxt] = useState('')
    const [userList, setUserList] = useState([])

    useEffect(() => {
        if (searchHandler == false) {
            setSearchTxt('')
            return
        }
        firebaseOnValue(firebaseRef(firebaseDatabase, 'users'), async (snapshot) => {
            if (snapshot.exists) {
                const data = snapshot.val();
                const userTypeString = await AsyncStorage.getItem("user")
                const myUID = JSON.parse(userTypeString).uid

                const userFriendListTxt = await AsyncStorage.getItem("userData")
                const userFriendList = JSON.parse(userFriendListTxt).friendList

                setUserList(
                    Object.keys(data)
                        // filter to get all user includes userFriendList
                        .filter(key => key != myUID)
                        .map(eachKey => {
                            const user = data[eachKey].info;
                            // if (userFriendList === undefined || userFriendList.includes(eachKey) === false){
                            //     return false;
                            // }else{
                            //     return true
                            // }
                            //  |
                            //  |
                            //  V
                            const isFriend = userFriendList === undefined
                                || userFriendList.includes(eachKey) === false ? false : true

                            return {
                                url: user.photoURL,
                                name: user.displayName,
                                email: user.email,
                                accessToken: user.accessToken,
                                unReadMessage: 0,
                                message: 'fake message',
                                userId: eachKey,
                                isFriend: isFriend,
                            };
                        }),
                );
            } else {
                console.log('no data')
            }
        })
    }, [searchHandler])

    const search = () => {
        if (searchTxt) {
            const newData = userList.filter(item => {
                const name = item.name.toUpperCase()
                const nameSearch = searchTxt.toUpperCase()
                // if user name include searchTxt
                // => name > -1
                // there for, app just return name the same searchTxt
                return name.indexOf(nameSearch) > -1
            })
            setData(newData)
        } else {
            setData(userList)
        }
    }

    return (
        searchHandler === false ?
            //if (searchHandler === false)
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnBox} onPress={onPressLeftIconName}>
                    <Icon name={leftIconName} size={24} color={'white'} />
                </TouchableOpacity>
                <Text style={styles.text}>
                    {title}
                </Text>
                <TouchableOpacity
                    style={styles.btnBox}
                    onPress={onPressRightIconName}>
                    <Icon name={rightIconName} size={24} color={'white'} />
                </TouchableOpacity>
            </View>
            :
            //else
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnBox}
                    onPress={onPressLeftIconName}
                >
                    <Icon name={leftIconName} size={24} color={'white'} />
                </TouchableOpacity>
                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='search'
                        placeholderTextColor="#BEBEBE"
                        value={searchTxt}
                        onChangeText={(txt) => { setSearchTxt(txt) }} >
                            {/* {searchTxt} */}
                        </TextInput>
                </View>
                <TouchableOpacity style={styles.btnBox} onPress={search}>
                    <Icon name={rightIconName} size={24} color={'white'} onPress={onPressRightIconName} />
                </TouchableOpacity>
            </View>
    )
}


export default UIHeader

