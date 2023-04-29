import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import styles from './style';
import { ValidateEmail, ValidatePassword } from '../../utilities/validate';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  firebaseAut,
  onAuthStateChanged,
  firebaseDatabase,
  firebaseGet,
  firebaseSet,
  firebaseRef,
  firebaseOnValue,
  signInWithEmailAndPassword,
} from '../../firebase/firebase'

const LoginScreen = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const checkValidate = () =>
    (email.length > 0 &&
      password.length > 0 &&
      ValidateEmail(email) === true &&
      ValidatePassword(password) === true) == true;

  //navigation
  const { navigation, router } = props;
  //function of navigate to/back
  const { navigate, goBack } = navigation;

  // check if user is logged in => UITab screens
  useEffect(()=>{
    onAuthStateChanged(firebaseAut, async (user) =>{
      if (user){        
        // convert user to string for save user with AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(user));
        
        await firebaseOnValue(firebaseRef(firebaseDatabase, `users/${user.uid}`), async (snapshot)=> {
          if(snapshot.exists){
            const data = snapshot.val();
            // console.log('=============LoginScreen==============')
            console.log(data.info.email)
            
            await AsyncStorage.setItem("userData", JSON.stringify(data));

          }else{
            console.log('no data')
          }
        })

        props.navigation.navigate('UITab')

        console.log("onAuthStateChanged: " + user.uid)

      }
    })
  },[])

  clickLogin = () => {
    checkValidate() == true ?
      signInWithEmailAndPassword(firebaseAut, email, password)
        .then((myUser) => {
          const user = myUser.user
          console.log("clickLogin: " + user.uid)
        }).catch(err => {
          console.log(err.message)
        }) : alert('error email or password')
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset = {10}
      style={styles.loginScreen}>
      <View style={styles.loginTitle}>
        <View style={styles.loginTitleBox}>
          <Text style={styles.loginTitleText}>TTTMessages</Text>
        </View>
      </View>

      <View style={styles.modLogin}>
        <View style={styles.loginBox}>
          <View style={styles.loginBoxText}>
            <Text style={styles.loginText}>Email:</Text>
            <TextInput
              keyboardType='email'
              style={styles.InputBox}
              value={email}
              onChangeText={text => {                
                setEmail(text);
              }}
            />
          </View>
          <View style={styles.loginBoxText}>
            <Text style={styles.loginText}>Password:</Text>
            <TextInput
              style={styles.InputBox}
              value={password}
              secureTextEntry={true} // ẩn password
              onChangeText={text => {
                // setErrorPassword(ValidatePassword(text) == true ? '' : 'error form password')
                setPassword(text);
              }}
            />
            {/* <Text style={{color: 'red'}}>{errorPassword}</Text> */}

            <Text style={{ color: 'gray' }}>
              password with at least 8 characters including a-z, A-Z, 0-9 and
              !@#$%^&*
            </Text>
          </View>

          <TouchableOpacity
            style={styles.loginButton}            
            onPress={() => {clickLogin()}}>
            <Text style={styles.loginButtonText}>login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginOption}
            onPress={() => {
              navigate('ForgotPasswordScreen');
            }}>
            {/* onPress={() => props.navigation.navigate('Screen1') có thể dùng như này cho lẹ */}
            <View>
              <Text style={styles.loginOptionTxt}>Forgot password</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginOption}
            onPress={() => {
              navigate('RegisterScreen');
            }}>
            <View>
              <Text style={styles.loginOptionTxt}>New user? Register now</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.loginOther}>
        <Text style={styles.loginOtherText}>Use other methods?</Text>
        <View style={styles.iconLoginOther}>
          <TouchableOpacity
            onPress={() => {
              alert('use Facebook Login');
            }}>
            <Icon name="facebook" size={38} style={styles.iconFacebook} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              alert('use Google Login');
            }}>
            <Icon name="google" size={38} style={styles.iconGoogle} />
          </TouchableOpacity>

          
        </View>

        
        
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
