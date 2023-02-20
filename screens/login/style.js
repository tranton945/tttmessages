import { StyleSheet} from 'react-native'
import color from './../../contains/color'
import fontSize from '../../contains/fontSize'


const styles = StyleSheet.create({

    loginScreen :{
        backgroundColor : color.white,
        paddingTop : 25,
        height: '100%',
        paddingHorizontal : 5,
        justifyContent : 'flex-start',
        alignItems : 'center',
    },
//
    loginTitle : {
        justifyContent : 'center',
        alignItems : 'center',
        paddingVertical : 15,
        width : '100%',
        
    },
    loginTitleBox:{
        backgroundColor : color.box,
        width : '90%',
        height : 120,
        justifyContent : 'center',
        alignItems : 'center',   
        borderRadius: 20,     
    },
    loginTitleText :{
        fontWeight : 'bold',
        fontSize : fontSize.h1,
        color : color.white,
    },

// 
    modLogin : {
        justifyContent : 'center',
        width : '100%',     
        
    },
    loginBox : {
        backgroundColor: color.background,          
        justifyContent : 'center',
        borderRadius : 20, 
    },
    loginBoxText:{
        marginHorizontal: 10,
        marginVertical: 10,        
    },
    loginText: {
        fontWeight : 'bold',
        fontSize : fontSize.h4,
        color: color.black,
    },
    InputBox:{
        borderBottomWidth: 1,
        borderBottomColor: color.black,
        color: color.black,
    },
    // //
    loginButton :{
        backgroundColor : color.buttonRed,
        height : 45,
        alignItems : 'center',
        justifyContent : 'center',
        borderRadius: 5,
    },
    loginButtonText:{
        color : color.white,
        fontWeight : 'bold',
        fontSize : fontSize.h3,
    },
    
    loginOption : {
        paddingStart : 10,   
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 5,
        
    },
    loginOptionTxt: {
        color : color.black,
        fontWeight: 'bold',
    },

    
//
    loginOther : {
        flex: 1,
        alignItems : 'center',
        marginTop : 10,
        borderTopWidth: 2,
        borderTopColor: color.black,
        width: "80%",
    },
    
    loginOtherText:{
        fontSize: fontSize.h3,
        fontWeight : 'bold',      
        color: color.black,  
    },
    //
    iconLoginOther : {
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
