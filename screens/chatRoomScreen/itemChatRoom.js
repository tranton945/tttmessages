import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {UIHeader} from '../../components';
import styles from './style';

const ItemChatRoom = props => {
  //get data from chatScreen base on list of users get from firebase
  const {url, roomId, name, message} = props;
  return (
    <View key={props.roomId}>
      <View style={styles.roomItem}>
        <View style={styles.boxImg}>
          <Image
            style={styles.img}
            source={{
              uri: props.url,
            }}
          />
        </View>
        <View style={styles.boxText}>
          <Text style={styles.roomName}>{props.name}</Text>
          <Text style={styles.message}>{props.message}</Text>
        </View>
      </View>
    </View>
  );
};;

export default ItemChatRoom
