import { StyleSheet} from 'react-native'
import color from './../../contains/color'
import fontSize from '../../contains/fontSize'

const styles = StyleSheet.create({

    noRoom :{
        backgroundColor : color.white,
        height: '100%',
        width: '100%',
        justifyContent : 'center',
        alignItems : 'center',
    },
    btnNoRoom:{
        backgroundColor : color.buttonBlue,
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent : 'center',
        alignItems : 'center',
    },
    TxtBtnNoRoom: {
        color: color.white,
        fontSize: 60,
        fontWeight: 'bold',
    },

    //==========================ChatRoom========================
    container:{
        width:'100%',
        height:'100%',
      },
      itemChatRoom:{
        backgroundColor: color.teal_200,
      },
    //==========================itemChatRoom========================
    roomItem: {
        paddingHorizontal: 5,
        backgroundColor: color.background,
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        marginBottom: 1.5,
      },
      boxImg: {
        // backgroundColor : 'red',
        paddingHorizontal: 5,
        paddingVertical: 5,
        // flex: 1,
      },
    
      img: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
      },
      boxText: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        paddingEnd: 10,
        alignItems: 'flex-start',
        flex: 1,
        // backgroundColor: "green",
      },
      roomName: {
        fontWeight: 'bold',
        fontSize: fontSize.h4,
        color: color.black,
        // backgroundColor: "white",
      },
      message: {
        color: color.gray,
        width: '100%',
        height: 20,
        // vấn đề là text dài quá bị xuống hàng, xử lý tạm giới hạn vùng hiển thị
        // flex: 1,
        // backgroundColor: "red",
        // dùng maxWidth để sử lý vấn đề tràn text (chưa làm vì tới h nghĩ) 
      },

      //=========================================
      container:{
        width:'100%',
        height:'100%',
      },
      itemUser:{
        backgroundColor: color.teal_200,
      },
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
      //``````````````````````````````````````````````````````````````````````````
      // containerItemMessages:{
      //   width:"100%",
      //   height:"100%",
      //   // flex: 1,
      //   backgroundColor: color.backgroundMessages,
      //   // flexDirection: "row",
      // },
    
      itemMessageBox : {
        flexDirection: 'row',
        marginBottom: 5,
        // backgroundColor: color.gray,
        flex: 100,
        // maxWidth: '75%'
      },
    
      ///////////////////
      message:{
        // backgroundColor: color.buttonRed,
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
        backgroundColor: 'yellow',
    
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
      itemMessageNameTxt:{
        color: color.gray,
        fontSize: fontSize.h6,
      },
      typeIsPhoto:{
        backgroundColor: color.lightGray,
      },
      //````````````````````````````````````````````````````````````````````````````
  //=============================ThreeDotMenu============================================================
  threeDotMenuOptions: {
    color: color.white,
  },

})

export default styles
