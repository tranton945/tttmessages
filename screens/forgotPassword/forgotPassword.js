import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
import React from 'react'

import Icon from 'react-native-vector-icons/FontAwesome5'
import styles from './style'

const ForgotPasswordScreen = (props) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset = {10}
      style={styles.rePasswordScreen}>

      <View style={styles.rePasswordTitle}>
        <View style={styles.rePasswordTitleBox}>
          <Text style={styles.rePasswordTitleText}>Reset your password</Text>
        </View>
      </View>

      <View style={styles.modRePassword}>
        <View style={styles.rePasswordBox}>

          <View style={styles.rePasswordBoxText}>
            <Text style={styles.rePasswordText}>Email:</Text>
            <TextInput style={styles.rePasswordInput} />
          </View>
          <View style={styles.rePasswordBoxText}>
            <Text style={styles.rePasswordText}>Password:</Text>
            <TextInput 
            secureTextEntry={true} 
            style={styles.rePasswordInput}
            />
          </View>
          <View style={styles.rePasswordBoxText}>
            <Text style={styles.rePasswordText}>Re-Password:</Text>
            <TextInput 
            secureTextEntry={true} 
            style={styles.rePasswordInput} />
          </View>

          <View style={styles.getCodeBlock}>
            <View style={styles.rePasswordTextBlock}>
              <Text style={styles.rePasswordText}>Email code:</Text>
              <TextInput style={styles.rePasswordInput} />
            </View>

            
            <TouchableOpacity
              style={styles.getCodeButton}
              onPress={() => { alert('Check your email address') }}>
              <Text style={styles.getCodeButtonText}>Get code</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.rePasswordButton}
            onPress={() => { alert('Reset Password') }}>
            <Text style={styles.rePasswordButtonText}>Reset password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { props.navigation.navigate('LoginScreen') }}>
            <View style={styles.BackToLogin}>
              <Text style={styles.BackToLoginTxt}>Back to login</Text>
            </View>
          </TouchableOpacity>




        </View>
      </View>


      {/* <View style={styles.rePasswordOther}>
        <Text style={styles.rePasswordOtherText}>Use other methods?</Text>
        <View style={styles.iconLoginOther}>
          <Icon name = 'facebook'size={38} style={styles.iconFacebook}/>
          <Icon name = 'google' size={38} style={styles.iconGoogle}/>
        </View>
      </View> */}
    </KeyboardAvoidingView>
  )
}

export default ForgotPasswordScreen