import React, { useEffect, useState } from 'react'

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

const [filePath, setFilePath] = useState({});
const [aaw, setAaw] = useState();
const a = async (type) =>{
    let options = {
        mediaType: type,
        maxWidth: 2560,
        maxHeight: 1440,
        quality: 1,
    };
    await launchImageLibrary(options, async (response) => {
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
        // console.log('base64 -> ', data.base64);
        // console.log('uri -> ', data.uri);
        // console.log('width -> ', data.width);
        // console.log('height -> ', data.height);
        // console.log('fileSize -> ', data.fileSize);
        // console.log('type -> ', data.type);
        // console.log('fileName -> ', data.fileName);    

        setFilePath(data);

        // const res = await fetch(data.uri)
        // const blod = await res.blob();
        // const fileName = data.uri.substring(data.uri.lastIndexOf('/') + 1)
        // console.log('blod')
        // console.log(blod)
        // console.log('res')
        // console.log(res)
        // console.log('fileName')
        // console.log(fileName)

        // const da = await uploadPhoto(fileName, blod)
        // console.log('da')
        // console.log(uploadPhoto(fileName, blod))
        
    });
}
const selectPhoto = () => {

    setAaw('asdw2')


    return aaw
};

export default selectPhoto;