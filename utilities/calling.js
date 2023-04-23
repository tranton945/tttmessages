import { View, Text, Image, TouchableOpacity, Animated  } from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Video from 'react-native-video';

const Calling = props => {
    const [opacity] = useState(new Animated.Value(1));
  
    const fadeInOut = () =>
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    const loop = () => {
        Animated.loop(fadeInOut()).start();
    };

    useEffect(() => {
        loop();
        console.log(props.route.params)
      }, []);

  return (
    <View style={{ 
        flex: 1, 
        backgroundColor: 'black', 
        justifyContent: 'center', 
        alignItems: 'center' }}>

        <Animated.Text style={[{
            fontSize: 36,
            fontWeight: 'bold',
            color: 'white',
            },{opacity}]}>

            Calling...
            
        </Animated.Text>
    </View>
  );
};

export default Calling
