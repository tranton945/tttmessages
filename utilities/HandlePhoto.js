import {
    Platform,
    PermissionsAndroid,
  } from 'react-native';
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';

import { storage } from '../firebase/firebase';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";
import { async } from '@firebase/util';

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
export const capturePhoto = (type) => {
    return new Promise(async (resolve, reject) => {
    let options = {
        mediaType: type,
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 1,
        videoQuality: 'low',
        durationLimit: 45, //Video max duration in seconds
        saveToPhotos: true,
    };

    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
        await launchCamera(options, async (response) => {
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
            const res = await fetch(data.uri)
            const blod = await res.blob();
            const fileName = data.uri.substring(data.uri.lastIndexOf('/') + 1)

            uploadPhoto(fileName, blod).then(downloadURL => {
                resolve(downloadURL);
            }).catch((error) => {
                console.log('uploadPhoto function' + error);
            })
        });
    }
})
};

  // select ing or vid
  // type is 'photo' or 'video' 
export const choosePhoto = (type) => {
    return new Promise(async (resolve, reject) => {
        let options = {
            mediaType: type,
            maxWidth: 1920,
            maxHeight: 1080,
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
            // setFilePath(data);

            const res = await fetch(data.uri)
            const blod = await res.blob();
            const fileName = data.uri.substring(data.uri.lastIndexOf('/') + 1)

            uploadPhoto(fileName, blod).then(downloadURL => {
                resolve(downloadURL);
            }).catch((error) => {
                console.log('uploadPhoto function' + error);
            })
        });
    })
};

const uploadPhoto = (fileName, file) => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `chatImages/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
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
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}