import React, { useRef, useState, useEffect } from "react";
import { Animated, StyleSheet,View, Text, Dimensions, Pressable, Alert,Modal, ActivityIndicator } from "react-native";


import ThemesColorsAppList, {themesApp} from "../styles/ColorsApp";

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TextAnimate from "./TextAnimate";
import Constants from "expo-constants";

const ColorSplash = ({
    splashVisible,
    setSplashVisible,
    splashOut,
    theme
    

}) => {

    const animate_state = {start: 0, end: 100}
    const inputRange = [animate_state.start, animate_state.end]

    const [statusAnimated, setStatusAnimated] = useState(true)
    const value = useRef(new Animated.Value(animate_state.start)).current
    const opacityValue = useRef(new Animated.Value(0)).current

    const [textAnimateVisible, setTextAnimateVisible] = useState(false);
    /*
    const startAnimate = () => {
        setStatusAnimated(false);
        Animated.timing(value, { toValue: animate_state.end, useNativeDriver: true, duration: 2000 }).start(() => {
            setSplashVisible(false);
            splashOut(theme);
            Animated.timing(value, { toValue: animate_state.start, useNativeDriver: true, duration: 10 }).start()
            setStatusAnimated(true);
        });
    }
    */

    useEffect(()=>{
        if(splashVisible){

            setTimeout(()=>{setTextAnimateVisible(true)},300)

            Animated.timing(opacityValue, { toValue: 1, useNativeDriver: true, duration: 300 }).start()

            Animated.timing(value, { toValue: animate_state.end, useNativeDriver: true, duration: 2000 }).start(() => {
                setSplashVisible(false);
                splashOut(theme);
                setTextAnimateVisible(false);
                Animated.timing(value, { toValue: animate_state.start, useNativeDriver: true, duration: 10 }).start()
                //setStatusAnimated(true);
            });

            
        };
    },[splashVisible])

    let deviceHeight = Dimensions.get('window').height + Constants.statusBarHeight;
    let deviceWidth = Dimensions.get('window').width;
    let deviceDiagonals = (deviceHeight**2 + deviceWidth**2)**0.5
    let maxScaleValue = Math.round(deviceDiagonals/5 + 1)

    const scale = value.interpolate({ inputRange, outputRange: [1, maxScaleValue]}) 

    //const scaleX = value.interpolate({ inputRange, outputRange: [1, deviceWidth/10]}) 
    //const scaleY = value.interpolate({ inputRange, outputRange: [1, deviceHeight/10]}) 

    //const rotation = value.interpolate({ inputRange, outputRange: [0, 9]}) 
    const opacityText = value.interpolate({ inputRange, outputRange: [-1 , 1 ] })
    const opacityCircl = value.interpolate({ inputRange, outputRange: [0.65 , 1 ] })

    //if (splashVisible && statusAnimated) {startAnimate(animate_state.start);}style = {[StyleSheet.absoluteFill,

    return (
        
            <Modal 
                animationType = "fade"
                transparent = {true}
                visible = {splashVisible}
                statusBarTranslucent = {true}
                //onRequestClose = {}
            >
                <Animated.View 
                    style = {{
                        flex: 1,
                        //position: 'absolute',
                        //height: Dimensions.get('window').height,
                        //width: Dimensions.get('window').width,
                        alignItems: 'center',
                        justifyContent: 'center',
                        //backgroundColor: 'black',
                        opacity: opacityValue
                    }}
                >
                    <View style = {{flex: 1, }}> 
                    <Animated.View 
                        style = {[{
                            position: 'absolute',
                            //backgroundColor: 'red',
                            height: 10,
                            width: 10,
                            top: 0,
                            left: deviceWidth/2+10,
                            borderRadius: 50,
                            opacity: opacityCircl,
                            transform: [{scale: scale}]} 
                            ]}
                        >
                        <LinearGradient 
                            colors={[ThemesColorsAppList[theme].skyUpUpUp, ThemesColorsAppList[theme].skyUpUp, ThemesColorsAppList[theme].skyUp, ThemesColorsAppList[theme].sky]}
                            style={{
                                position: 'absolute',
                                borderRadius: 50,
                                left: 0,
                                right: 0,
                                top: 0,
                                height: 10,
                                width: 10
                            }}
                        />
                    </Animated.View>
                    
                    <Animated.View 
                        style = {[{
                            position: 'absolute',
                            //backgroundColor: 'red',
                            height: 10,
                            width: 10,
                            top: 0,
                            right: deviceWidth/2+10,
                            borderRadius: 50,
                            opacity: opacityCircl,
                            transform: [{scale: scale}]} 
                            ]}
                        >
                        <LinearGradient 
                            colors={[ThemesColorsAppList[theme].skyUpUpUp, ThemesColorsAppList[theme].skyUpUp, ThemesColorsAppList[theme].skyUp, ThemesColorsAppList[theme].sky]}
                            style={{
                                position: 'absolute',
                                borderRadius: 50,
                                left: 0,
                                right: 0,
                                top: 0,
                                height: 10,
                                width: 10
                            }}
                        />
                    </Animated.View>

                    <Animated.View 
                        style = {[{
                            position: 'absolute',
                            //backgroundColor: 'red',
                            height: 10,
                            width: 10,
                            //top: deviceHeight,
                            bottom: 0,
                            right: deviceWidth/2+10,
                            borderRadius: 50,
                            opacity: opacityCircl,
                            transform: [{scale: scale}]} 
                            ]}
                        >
                        <LinearGradient 
                            colors={[ThemesColorsAppList[theme].sky, ThemesColorsAppList[theme].skyUp, ThemesColorsAppList[theme].skyUpUp, ThemesColorsAppList[theme].skyUpUpUp]}
                            style={{
                                position: 'absolute',
                                borderRadius: 50,
                                left: 0,
                                right: 0,
                                top: 0,
                                height: 10,
                                width: 10
                            }}
                        />
                    </Animated.View>

                    <Animated.View 
                        style = {[{
                            position: 'absolute',
                            //backgroundColor: 'red',
                            height: 10,
                            width: 10,
                            bottom: 0,
                            left: deviceWidth/2+10,
                            borderRadius: 50,
                            opacity: opacityCircl,
                            transform: [{scale: scale}]} 
                            ]}
                        >
                        <LinearGradient 
                            colors={[ThemesColorsAppList[theme].sky, ThemesColorsAppList[theme].skyUp, ThemesColorsAppList[theme].skyUpUp, ThemesColorsAppList[theme].skyUpUpUp]}
                            style={{
                                position: 'absolute',
                                borderRadius: 50,
                                left: 0,
                                right: 0,
                                top: 0,
                                height: 10,
                                width: 10
                            }}
                        />
                    </Animated.View>
                    </View>
                    {textAnimateVisible &&
                    <View style = {{position: 'absolute', flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 1 }}>
                        <TextAnimate 
                        text = {themesApp[theme]} 
                        duration = {1650} 
                        textStyle = {{
                            fontSize: 40,
                            color: 'white', 
                            fontWeight: 'bold', 
                            fontVariant: ['small-caps']
                            }}
                        />
                    </View>}

                </Animated.View>
            </Modal>

        
    )
}
export default ColorSplash;


const styles = StyleSheet.create({
    
});
