import { StyleSheet} from 'react-native'
import fontSize from '../../contains/fontSize'
import color from './../../contains/color'

const styles = StyleSheet.create({
    settingScreen : {
        backgroundColor : color.white,
        justifyContent : 'flex-start',
        height: '100%',
    },
    body:{
        // backgroundColor: color.gray,
        // flexDirection: 'column',
        // flex: 100,
    },
    Account:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,
        paddingVertical: 2,
    },
    titleTxt:{
        fontSize: fontSize.h4,
        fontWeight: 'bold',
        color: color.black,
    },
    accountBody:{
        backgroundColor: color.white,
        padding: 5,
        
    },
    imageBox:{
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 50,    
      },
    Txt:{
        color   : color.black,
        fontSize: fontSize.h5,
        paddingHorizontal: 10,
    },
    imageBoxOther:{
        // backgroundColor: color.black,
        paddingVertical: 5,
        borderBottomWidth: 1,
    },
    emailAndPhone: {
        flexDirection: 'row',
    },
    CommonBody:{
        backgroundColor: color.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        
    },
    CommonLanguage:{
        flexDirection: 'row',
    },
    OtherBody:{
        paddingVertical: 5,
        backgroundColor: color.white,
    },
    OtherItem:{
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
    },
    SignOutBox:{
        // backgroundColor: color.white, 
        width: '100%',
        alignItems: 'center',        
        paddingTop: 10,
        paddingBottom: 20,
        marginTop: 10,
        
    },
    btnSaveBox:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
    },
    btnSave:{
        backgroundColor: color.facebook,       
        width: '40%',
        alignItems: 'center',
        borderRadius: 25,
    },
    btnSaveTxt:{
        paddingVertical: 5,
        fontWeight: 'bold',
        fontSize: fontSize.h5,
    },
    btnSignOut: {
        backgroundColor: color.buttonRed,       
        width: '70%',
        alignItems: 'center',
        borderRadius: 25,
    },
    txtSignOut:{
        fontSize: fontSize.h3,
        fontWeight: 'bold',
        paddingVertical: 8,
    },
})

export default styles
