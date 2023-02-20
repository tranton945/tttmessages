import { StyleSheet} from 'react-native'
import color from './../../contains/color'
import fontSize from '../../contains/fontSize'

const styles = StyleSheet.create({

    rePasswordScreen :{
        backgroundColor : color.white,
        paddingTop : 25,
        height: '100%',
        paddingHorizontal : 5,
        justifyContent : 'flex-start',
        alignItems : 'center',
    },
//
    rePasswordTitle : {
        justifyContent : 'center',
        alignItems : 'center',
        paddingVertical : 15,
        width : '100%',
        
    },
    rePasswordTitleBox:{
        backgroundColor : color.box,
        width : '90%',
        height : 120,
        justifyContent : 'center',
        alignItems : 'center',   
        borderRadius: 20,     
    },
    rePasswordTitleText :{
        fontWeight : 'bold',
        fontSize : fontSize.h1,
        color : color.white,
    },

// 
    modRePassword : {
        justifyContent : 'center',
        width : '100%',     
          
        
    },
    rePasswordBox : {
        backgroundColor: color.background,
        borderRadius : 20, 
        justifyContent : 'center',
        
    },
    rePasswordBoxText:{
        marginHorizontal: 10,
        marginVertical: 10,        
    },
    rePasswordText: {
        fontWeight : 'bold',
        fontSize : fontSize.h3,
        color: color.black,
    },
    rePasswordInput: {
        // backgroundColor: color.black,
        color: color.black,
        borderBottomWidth: 1,
        borderBottomColor: color.black,
    },
    // //
    rePasswordButton :{
        backgroundColor : color.buttonRed,
        height : 45,
        alignItems : 'center',
        justifyContent : 'center',
        borderRadius: 5,
    },
    rePasswordButtonText:{
        color : color.white,
        fontWeight : 'bold',
        fontSize : fontSize.h3,
    },

//
    getCodeBlock :{
        flexDirection : 'row',
        justifyContent : 'space-between',
        paddingHorizontal : 10,
        paddingVertical : 10,
        alignItems : 'center',
    },
    //
    rePasswordTextBlock:{
        flex: 1,
        marginEnd: 10,
    },
    //
    getCodeButton : {
        backgroundColor : color.buttonRed,
        height : 45,
        alignItems : 'center',
        justifyContent : 'center',
        borderRadius: 5,
        width : '25%',
    },
    //
    getCodeButtonText : {
        color : color.white,
        fontWeight : 'bold',
        fontSize : fontSize.h4,
    },
//
    rePasswordOther : {
        flex: 1,
        alignItems : 'center',
        marginTop : 10,
    },
    
    rePasswordOtherText:{
        fontSize: fontSize.h4,
        fontWeight : 'bold',        
    },

    BackToLogin  : {
        paddingStart : 10,
        paddingVertical : 10,
        marginBottom: 5,
    },
    BackToLoginTxt:{
        color: color.black,
        fontWeight: 'bold',
    },
})

export default styles
