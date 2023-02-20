import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, Alert } from 'react-native'
import React, { useState } from 'react'

import Icon from 'react-native-vector-icons/FontAwesome5'
import styles from './style'
import { ValidateEmail, ValidatePassword } from '../../utilities/validate';

import { StackActions } from '@react-navigation/native';

import {
  firebaseAut, 
  firebaseDatabase,
  createUserWithEmailAndPassword,
  firebaseGet,
  firebaseSet,
  firebaseRef,
  firebaseOnValue,
  sendEmailVerification,
} from '../../firebase/firebase'

const RegisterScreen = (props) => {
  const [email, setEmail] = useState('abs123@gmail.com');
  const [password, setPassword] = useState('Aa12345678@123');
  const [re_password, setRe_password] = useState('Aa12345678@123');  

  const clickRegister = () => {
    // check email and password if they validate
    // use createUserWithEmailAndPassword to create a new user in firebase
    checkValidate() == true ?
      createUserWithEmailAndPassword(firebaseAut, email, password)
        .then((createUser) => {
          const user = createUser.user
          firebaseSet(firebaseRef(firebaseDatabase, `users/${user.uid}`),{
            info:{
              email: user.email,
              emailVerified: user.emailVerified,
              displayName: user.email,
              photoURL: 'https://i.pinimg.com/280x280_RS/2e/45/66/2e4566fd829bcf9eb11ccdb5f252b02f.jpg',
              phoneNumber: '',
            },
            friendRequest: {
              '0': user.uid
            },
            friendList: {
              '0': user.uid
            }        
          }).then(()=>{console.log('Register successful')})
        }).catch(err => {
          console.log(err.message)
        }) : alert('fail')
    alert('create account successful \nNow go to TTT Messages')
    // drop all the screen and back to loginScreen    
    props.navigation.dispatch(StackActions.popToTop())
  }


  const checkValidate = () =>
    (email.length > 0 &&
      password.length > 0 &&
      re_password.length > 0 &&
      password == re_password &&
      ValidateEmail(email) === true &&
      ValidatePassword(password) === true) == true;  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      //   keyboardVerticalOffset = {10}
      style={styles.registerScreen}>

      <View style={styles.registerTitle}>
        <View style={styles.registerTitleBox}>  
          <Text style={styles.registerTitleText}>Create new account</Text>
        </View>
      </View>

      <View style={styles.modRegister}>
        <View style={styles.registerBox}>
          <View style={styles.registerBoxText}>
            <Text style={styles.registerText}>Email:</Text>
            <TextInput 
            style={styles.registerTextInput} 
            keyboardType='email'
            value={email}
            onChangeText={txt => setEmail(txt)}
            />
          </View>
          <View style={styles.registerBoxText}>
            <Text style={styles.registerText}>Password:</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.registerTextInput}
              value={password}
              onChangeText={txt => setPassword(txt)}
            />
          </View>
          <View style={styles.registerBoxText}>
            <Text style={styles.registerText}>Re-Password:</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.registerTextInput}
              value={re_password}
              onChangeText={txt => setRe_password(txt)}
            />
          </View>

          {/* btn register */}
          <TouchableOpacity
            style={styles.registerButton}            
            onPress={() => {clickRegister()}}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.BackToLogin}
            onPress={() => { props.navigation.navigate('LoginScreen') }}>
            <Text style={styles.BackToLoginTxt}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.registerOther}>
        <Text style={styles.registerOtherText}>Use other methods?</Text>
        <View style={styles.iconRegisterOther}>
          <TouchableOpacity>
            <Icon name='facebook' size={38} style={styles.iconFacebook} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name='google' size={38} style={styles.iconGoogle} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen