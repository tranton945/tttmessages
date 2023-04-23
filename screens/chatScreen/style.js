import {StyleSheet} from 'react-native';
import color from './../../contains/color';
import fontSize from '../../contains/fontSize';

const styles = StyleSheet.create({
  //========================== chatScreen =======================//
  container:{
    width:'100%',
    height:'100%',
  },
  itemUser:{
    backgroundColor: color.teal_200,
  },
    //////////////////////////////////
    friendRequest:{
      backgroundColor: color.lightGray,
      alignItems: 'center',
    },
    friendRequestTxt:{
      color: color.black,
      fontSize: fontSize.h5,
    },
  
    /////////////////////////////////////
  //========================== userChat =======================//

  userChat: {
    paddingHorizontal: 5,
    backgroundColor: color.background,
    flexDirection: 'row',
    marginBottom: 1.5,
  },
  boxUserChat: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  imageUserChat: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
  },
  boxText: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    paddingEnd: 10,
    alignItems: 'flex-start',
    flex: 1,
  },
  userChatName: {
    fontWeight: 'bold',
    fontSize: fontSize.h4,
    color: color.black,
  },
  userChatMessage: {
    color: color.gray,
    width: '100%',
    height: 20,
    // vấn đề là text dài quá bị xuống hàng, xử lý tạm giới hạn vùng hiển thị
    // flex: 1,
    // backgroundColor: "red",
  },

  //========================== messages =======================//
  SendMessScreen:{
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",    
  },
  SendMessBody: {
    height: "100%",
    width: "100%",
    flex: 100,
  },
  ListMessages:{
    flex: 90,
    backgroundColor: color.backgroundMessages,
  },
  SendMessBox:{
    borderTopWidth: 1,
    flex: 10, 
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: color.backgroundMessages,
  },
  SendMessInput:{
    flex: 1,
    color: color.black,
  },
  iconSendMess:{
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    color: color.black,
  },
  chooseOptionSendMess:{
    flexDirection: "row",
    paddingRight: 10,
  },


  //========================== itemMessages =======================//
  itemMessageBox : {
    flexDirection: 'row',
    marginBottom: 5,
    width: '100%',
    flex: 100,
  },

  ///////////////////
  message:{
    width: '100%',
    height: '100%',
    flex: 90,
  },
  isSender: {
    alignItems: 'flex-end',
  },
  isReceiver: {
    alignItems: 'flex-start',
  },

  itemMessageMessageBox: {
    flexDirection: 'column',
    marginVertical: 2,
    borderRadius: 8,
    maxWidth: '75%',

    shadowColor: color.shadowColor,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  isSenderMessages: {
    backgroundColor: color.isSender,
  },
  isReceiverMessages: {
    backgroundColor: color.white,
  },
  typeIsText:{
    padding: 10
  },
  avatar : {
    borderRadius: 50,
    flex: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageAvatar: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 50,    
  },

  ////////////////////////////////////
  itemMessageMessageTxt:{
    color: color.black,
    fontSize: fontSize.h5,
  },
  itemMessageTimestampTxt:{
    color: color.gray
  },

  typeIsPhoto:{
    backgroundColor: color.lightGray,
  },

  //=============================ThreeDotMenu============================================================
  threeDotMenuOptions: {
    color: color.white,
  },
});

export default styles;
