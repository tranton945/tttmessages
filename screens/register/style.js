import { StyleSheet} from 'react-native'
import color from './../../contains/color'
import fontSize from '../../contains/fontSize'

const styles = StyleSheet.create({

    registerScreen :{
        backgroundColor : color.white,
        paddingTop : 25,
        height: '100%',
        paddingHorizontal : 5,
        justifyContent : 'flex-start',
        alignItems : 'center',
    },
//
    registerTitle : {
        justifyContent : 'center',
        alignItems : 'center',
        paddingVertical : 15,
        width : '100%',
        
    },
    registerTitleBox:{
        backgroundColor : color.box,
        width : '90%',
        height : 120,
        justifyContent : 'center',
        alignItems : 'center',   
        borderRadius: 20,     
        
    },
    registerTitleText :{
        fontWeight : 'bold',
        fontSize : fontSize.h1,
        color : color.white,
    },

// 
    modRegister : {
        // backgroundColor : color.black,
        justifyContent : 'center',
        width : '100%',     
        
        
    },
    registerBox : {
        backgroundColor: color.background,          
        justifyContent : 'center',
        borderRadius : 20,  
        
    },
    registerBoxText:{
        marginHorizontal: 10,
        marginVertical: 5,        
    },
    registerText: {
        fontWeight : 'bold',
        fontSize : fontSize.h3,
        color: color.black,
    },
    registerTextInput:{
        // backgroundColor: color.black,
        borderBottomWidth: 1,
        color: color.black,
    },
    //
    registerButton :{
        backgroundColor : color.buttonRed,
        height : 45,
        alignItems : 'center',
        justifyContent : 'center',
        borderRadius: 5,
    },
    registerButtonText:{
        color : color.white,
        fontWeight : 'bold',
        fontSize : fontSize.h3, 
    },
//
    BackToLogin  : {
        paddingStart : 10,
        paddingVertical : 10,
        marginBottom: 5,
    },
    BackToLoginTxt:{
        fontWeight: 'bold',
        color: color.black,
    },
    
//////////////////
    registerOther : {
        alignItems : 'center',
        marginTop : 10,
        borderTopWidth: 2,
        borderTopColor: color.black,
        width: "80%",
    },

    registerOtherText:{
        fontSize: fontSize.h4,
        fontWeight : 'bold',   
        color: color.black,     
    },
//
    iconRegisterOther : {
        flexDirection: 'row',
        paddingTop: 10,
    },
    //
    iconFacebook: {
        color : color.facebook,
        paddingHorizontal: 10,
    },
    iconGoogle :{
        color : color.google,
        paddingHorizontal: 10,
    },
})

export default styles
