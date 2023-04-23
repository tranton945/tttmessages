import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { UIHeader } from '../../components';
import styles from './style';
import moment from 'moment';

const window = Dimensions.get('window');



const ItemMessage = props => {
  //get data from chatScreen base on list of users get from firebase
  const { 
    photoUrl, 
    UID, 
    timestamp, 
    message, 
    isSender, 
    type, 
    imgMessage} = props;

  // if(isSender == true) style by isSender
  // if(isSender == false) style by isReceiver
  // see the style at file style.js in folder chat room "itemMessages"
  const checkSender = isSender === true ? styles.isSender : styles.isReceiver;
  const convertTimestemp  = () => {
    const date = moment(timestamp).format('HH:mm DD-MMM');
    // console.log(date);
    return date
  }
  // useEffect(() => {
  //   console.log(message)
  //   console.log(timestamp)
  //   console.log(isSender)
  //   console.log(type)
  //   console.log(imgMessage)

  // })
  const checkSenderMessages = isSender === true ? styles.isSenderMessages : styles.isReceiverMessages;
  return (
    <View
      key={timestamp}>
      {//if(isSender == false)
        isSender == false ?
          <View style={styles.itemMessageBox}>
            <View style={styles.avatar}>
              <Image
                style={styles.imageAvatar}
                source={{
                  uri: photoUrl,
                }}
              />
            </View>
            <View style={[styles.message, checkSender]}>
              <TouchableOpacity style={[styles.itemMessageMessageBox, checkSenderMessages]}>
                {
                  //if(type === 'text')
                  type === 'text' ?
                    <View style={styles.typeIsText}>
                      <Text style={styles.itemMessageMessageTxt}>{message}</Text>
                      <Text style={styles.itemMessageTimestampTxt}>{convertTimestemp()}</Text>
                    </View>
                    : //else if(type === 'photo')
                    type === 'photo' ?  
                      <View style={styles.typeIsPhoto}>
                      <Image
                        style={{
                          width: window.width / 1.5,
                          height: window.height / 2 / 1.5,
                          resizeMode: 'contain',
                          margin: 1
                        }}
                        source={{ uri: imgMessage }}
                      />
                      <Text style={styles.itemMessageTimestampTxt}>{convertTimestemp()}</Text>
                    </View>
                      : //else
                      <View style={styles.typeIsText}>
                        <Text style={styles.itemMessageMessageTxt}>Video Call</Text>
                        <Text style={styles.itemMessageTimestampTxt}>{convertTimestemp()}</Text>
                      </View>
                      // type === 'video-call' ?
                      // <View style={styles.typeIsText}>
                      //   <Text style={styles.itemMessageMessageTxt}>Video Call</Text>
                      //   <Text style={styles.itemMessageTimestampTxt}>{convertTimestemp()}</Text>
                      // </View>
                      // : console.log()
                }
              </TouchableOpacity>
            </View>
          </View>
          //else
          :
          <View style={styles.itemMessageBox}>
            <View style={[styles.message, checkSender]}>
              <TouchableOpacity style={[styles.itemMessageMessageBox, checkSenderMessages]}>
                {
                  type === 'text' ?
                    <View style={styles.typeIsText}>
                      <Text style={styles.itemMessageMessageTxt}>{message}</Text>
                      <Text style={styles.itemMessageTimestampTxt}>{convertTimestemp()}</Text>
                    </View>
                    :
                    type === 'photo' ?
                    <View style={styles.typeIsPhoto}>
                      <Image
                        style={{
                          width: window.width / 1.5,
                          height: window.height / 2 / 1.5,
                          resizeMode: 'contain',
                          margin: 1
                        }}
                        source={{ uri: imgMessage }}
                      />
                      <Text style={styles.itemMessageTimestampTxt}>{convertTimestemp()}</Text>  
                    </View>
                    :
                      <View style={styles.typeIsText}>
                        <Text style={styles.itemMessageMessageTxt}>Video Call</Text>
                        <Text style={styles.itemMessageTimestampTxt}>{convertTimestemp()}</Text>
                      </View>                    
                }
              </TouchableOpacity>
            </View>

            <View style={styles.avatar}>
              <Image
                style={styles.imageAvatar}
                source={{
                  uri: photoUrl,
                }}
              />
            </View>
          </View>
      }
    </View>

    // <View style={styles.testContainer}>
    //   {
    //     isSender == false ?
    //       <View>
    //         <View>
    //           <Image
    //               style={styles.imageAvatar}
    //               source={{
    //                 uri: props.photoUrl,
    //               }}
    //             />
    //         </View>
    //         <View>
    //           <Text>{UID}</Text>
    //           <Text>{timestamp}</Text>
    //           <Text>{message}</Text>
    //           <Text>{isSender}</Text>
    //           <Text>{photoUrl}</Text>
    //         </View>
    //       </View>
    //     :
    //     <View>
    //       <Text>adasdadasd</Text>
    //     </View>
    //   }
    //   <View>
    //     <Text>==========================</Text>
    //   </View>
    // </View>
  );
};

export default ItemMessage
