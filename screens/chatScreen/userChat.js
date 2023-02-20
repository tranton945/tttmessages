import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, { useEffect } from 'react';
import {UIHeader} from '../../components';
import styles from './style';

const UserChat = props => {
  //get data from chatScreen base on list of users get from firebase
  const {
    url, 
    userId, 
    name, 
    message, 
    unReadMessage, 
    email, 
    isFriend} = props;

  // useEffect(() => {
  //   console.log('====================UserChat================================')
  //   console.log('name: ' + name)
  //   console.log(isFriend)
  // })
  return (
    <View key={props.userId}>
      <View style={styles.userChat}>
        <View style={styles.boxUserChat}>
          <Image
            style={styles.imageUserChat}
            source={{
              uri: props.url,
            }}
          />
        </View>
        <View style={styles.boxText}>
          {
            isFriend=== true?
            <Text style={styles.userChatName}>{props.name}</Text>
            :
            <Text style={styles.userChatName}>{props.name} [người lạ]</Text>
          }          
          <Text style={styles.userChatMessage}>{props.message}</Text>
        </View>
      </View>
    </View>
  );
};

export default UserChat
