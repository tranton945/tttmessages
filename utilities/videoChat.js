import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator  } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Video from 'react-native-video';

const window = Dimensions.get('window');

const VideoChat = props => {
  //get data from chatScreen base on list of users get from firebase
  const { 
    photoUrl, 
    UID, 
    timestamp, 
    message, 
    isSender, 
    type, 
    imgMessage} = props;

    const [isLoading, setIsLoading] = useState(true);

  
  return (
    <View style={{ flex: 1 }}>
      {isLoading && (
        <ActivityIndicator
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          size="large"
          color="#0000ff"
        />
      )}
       <Video
        source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }} // đường dẫn đến file video
        style={{ flex: 1 }} // định dạng kích thước và vị trí của video
        resizeMode="contain" // định dạng tỷ lệ khung hình của video
        controls // hiển thị thanh điều khiển video
        onError={(error) => console.log(error)}
        onLoad={() => setIsLoading(false)}
        />
    </View>
  );
};

export default VideoChat
