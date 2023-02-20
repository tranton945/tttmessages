import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import React, { useState } from 'react'

import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';

import { storage } from '../firebase/firebase';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL } from "firebase/storage";




const HandleImg = props => {
  const [filePath, setFilePath] = useState({});

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };
  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  // take ing or vid by camera
  // type is 'photo' or 'video' 
  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 2560,
      maxHeight: 1440,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };

    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        const data = response.assets[0]
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        console.log('base64 -> ', data.base64);
        console.log('uri -> ', data.uri);
        console.log('width -> ', data.width);
        console.log('height -> ', data.height);
        console.log('fileSize -> ', data.fileSize);
        console.log('type -> ', data.type);
        console.log('fileName -> ', data.fileName);
        setFilePath(data);
      });
    }
  };

  // select ing or vid
  // type is 'photo' or 'video' 
  const chooseFile = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 2560,
      maxHeight: 1440,
      quality: 1,
    };
    await launchImageLibrary(options, async (response) => {
      const data = response.assets[0]

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      // console.log('base64 -> ', data.base64);
      // console.log('uri -> ', data.uri);
      // console.log('width -> ', data.width);
      // console.log('height -> ', data.height);
      // console.log('fileSize -> ', data.fileSize);
      // console.log('type -> ', data.type);
      // console.log('fileName -> ', data.fileName);    

      // setFilePath(data);

      const res = await fetch(data.uri)
      const blod = await res.blob();
      const fileName = data.uri.substring(data.uri.lastIndexOf('/') + 1)
      // console.log('blod')
      // console.log(blod)
      // console.log('res')
      // console.log(res)
      // console.log('fileName')
      // console.log(fileName)

      // uploadPhoto(fileName, blod)

      // console.log('da')
      // console.log(uploadPhoto(fileName, blod))
    });
  };

  const uploadPhoto = (refTo, file) => {

    // upload ing to storage in firebase
    const storageRef = ref(storage, `test/${refTo}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Register three observers:
    uploadTask.on('state_changed',
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }},
      (error) => {
        // Handle unsuccessful uploads
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  }

  const name = 'rn_image_picker_lib_temp_af8dc4a6-98a2-4dd8-bef9-d825f6176496.jpg'
  const downloadImg = () => {
    getDownloadURL(ref(storage, `test/${name}`))
    .then((url) => {
      console.log('downloadImg')
      console.log(url)
    })
  }
    
    
    return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Example of Image Picker in React Native
      </Text>
      <View style={styles.container}>
        {/* <Image
          source={{
            uri: 'data:image/jpeg;base64,' + filePath.data,
          }}
          style={styles.imageStyle}
        /> */}
        <Image
          source={{uri: filePath.uri}}
          style={styles.imageStyle}
        />
          {/* <Image
            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/tttmessages-df7f3.appspot.com/o/test%2Frn_image_picker_lib_temp_af8dc4a6-98a2-4dd8-bef9-d825f6176496.jpg?alt=media&token=88e60cd1-33cd-4235-affb-a531e53a8310' }}
            style={styles.imageStyle}
          /> */}
        {/* <Input type="file"/> */}
        <Text style={styles.textStyle}>{filePath.uri}</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('photo')}>
          <Text style={styles.textStyle}>
            Launch Camera for Image
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('video')}>
          <Text style={styles.textStyle}>
            Launch Camera for Video
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => 
            chooseFile('photo')
          }>
          <Text style={styles.textStyle}>Choose Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('video')}>
          <Text style={styles.textStyle}>Choose Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => downloadImg()}>
          <Text style={styles.textStyle}>downloadImg</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


export default HandleImg;

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else return true;
};
const requestExternalWritePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
        },
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      alert('Write permission err', err);
    }
    return false;
  } else return true;
};
const uploadPhoto = (refTo, file) => {
  // upload ing to storage in firebase
  const storageRef = ref(storage, `test/${refTo}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  // Register three observers:
  uploadTask.on('state_changed',
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
        case 'running':
          console.log('Upload is running');
          break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error)
      },
      () => {     
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        return downloadURL
      });
  }
  );
}
export const pickImageAndUpLoadToDatabase = async (type) => {
  // select ing or vid
  // type is 'photo' or 'video' 
  // const chooseFile = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 2560,
      maxHeight: 1440,
      quality: 1,
    };
    await launchImageLibrary(options, async (response) => {
      const dataImg = response
      const data = response.assets[0]
      
      // console.log('Response = ', Object.keys(response))
      // console.log('=====================launchImageLibrary===================')
      // console.log('Response = ',response.assets[0].uri)

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      console.log('base64 -> ', data.base64);
      console.log('uri -> ', data.uri);
      console.log('width -> ', data.width);
      console.log('height -> ', data.height);
      console.log('fileSize -> ', data.fileSize);
      console.log('type -> ', data.type);
      console.log('fileName -> ', data.fileName);    

      setFilePath(data);

      const res = await fetch(data.uri)
      const blod = await res.blob();
      const fileName = data.uri.substring(data.uri.lastIndexOf('/') + 1)
      console.log('blod')
      console.log(blod)
      console.log('res')
      console.log(res)
      console.log('fileName')
      console.log(fileName)

      uploadPhoto(fileName, blod)
    });
  // };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
});