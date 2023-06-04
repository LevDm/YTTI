import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, View,  Dimensions } from 'react-native';
import Svg, { 
    Rect, 
    Defs,  
    Stop, 
    Line,
    LinearGradient,
} from "react-native-svg";
import Animated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay,
    withSequence, 
    useAnimatedScrollHandler,
    useAnimatedProps, 
    cancelAnimation,
    useAnimatedRef,
    useDerivedValue,
    scrollTo,
    runOnJS,
    interpolateColor,
    interpolate,
    Extrapolate,
    runOnUI,
    Easing 
} from 'react-native-reanimated';

export default ColorSchemeSwitch = ({
    scheme = 'auto',
    sizeIcon = 25,
    colorIcon = '#ffffff',
    invertColorIcon = '#000000',
    textStyle = {},
    text = false, //or string
    pressableStyle = {},
    switching
}) => {
    const schemes = ['auto', 'light', 'dark'] 

    const currentScheme = useDerivedValue(()=>scheme)

    const tingDuration = 300
    const entering = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(1, { duration: tingDuration }),
        };
        const initialValues = {
          opacity: 0,
        };
        return {
          initialValues,
          animations,
        };
    };
    const exiting = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(0, { duration: tingDuration }),
        };
        const initialValues = {
          opacity: 1,
        };
        return {
          initialValues,
          animations,
        };
    };

    const accent_auto = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(currentScheme.value == schemes[0]? 1 : 0, { duration: tingDuration })
        }
    })
    const accent_light = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(currentScheme.value == schemes[1]? 1 : 0, { duration: tingDuration })
        }
    })
    const accent_dark = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(currentScheme.value == schemes[2]? 1 : 0, { duration: tingDuration })
        }
    })
    

    const press = () => {
        let index = schemes.indexOf(currentScheme.value)
        if(currentScheme.value == 'auto'){
            index = (index+1) == schemes.length? 0 : index+1
        } else {
            index = (index == 1? 2 : 1)
        }
        const newScheme = schemes[index]
        currentScheme.value = newScheme
        console.log('SWITCH SCHEMA',newScheme)
        setTimeout(()=>{switching(newScheme)}, tingDuration)
    }

    return (
        <Pressable
            style = {[{
                flexDirection: 'row',
                //alignItems: 'center',
                //backgroundColor: 'red',
                padding: 2
            },pressableStyle]}
            onPress={press}
        >
            <View
                style = {{
                    //justifyContent: 'center',
                    //alignItems: 'center',
                    height: sizeIcon,
                    width: sizeIcon,
                    //backgroundColor: 'red'
                }}
            >
                
                <Animated.View
                    //entering={entering}{scheme == 'auto' &&
                    //exiting={exiting}
                    style={[accent_auto, {position: 'absolute'}]}
                >
                <Text style={[staticStyles.letter, {color: colorIcon}]}>A</Text>
                <Svg width={sizeIcon} height={sizeIcon} viewBox="0 0 36 43" fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Rect x="1.5" y="21.5" width="13" height="20" rx="1.5" fill="url(#paint0_linear_401_109)" stroke={colorIcon} strokeWidth="3"/>
                <Rect x="17" y="8" width="15" height="7" rx="2" stroke={colorIcon} strokeWidth="2"/>
                <Rect x="14.5" y="14.5" width="20" height="27" rx="1.5" fill="url(#paint1_linear_401_109)" stroke={colorIcon} strokeWidth="3"/>
                <Line x1="24.5" x2="24.5" y2="7" stroke={colorIcon} strokeWidth="3"/>
                <Line x1="15" y1="16.5" x2="34" y2="16.5" stroke={colorIcon}/>
                <Line x1="18.5" y1="14" x2="18.5" y2="9" stroke={colorIcon}/>
                <Line x1="30.5" y1="14" x2="30.5" y2="9" stroke={colorIcon}/>
                <Rect x="19.15" y="19.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Line x1="3" y1="42.5" x2="33" y2="42.5" stroke={colorIcon}/>
                <Rect x="26.15" y="19.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="6.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill={colorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="6.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="19.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill={colorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="26.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill={colorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="26.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill={colorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="19.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Defs>
                <LinearGradient id="paint0_linear_401_109" x1="17" y1="30.5" x2="7" y2="41" gradientUnits="userSpaceOnUse">
                <Stop offset="0.46875" stopColor={colorIcon} stopOpacity="0.25"/>
                <Stop offset="0.510417" stopColor={colorIcon} stopOpacity="0"/>
                </LinearGradient>
                <LinearGradient id="paint1_linear_401_109" x1="32" y1="30" x2="22.5" y2="20.5" gradientUnits="userSpaceOnUse">
                <Stop offset="0.473958" stopColor={colorIcon} stopOpacity="0"/>
                <Stop offset="0.510417" stopColor={colorIcon} stopOpacity="0.25"/>
                </LinearGradient>
                </Defs>
                </Svg>
                </Animated.View>
                
                <Animated.View
                    //entering={entering} {scheme == 'dark' &&
                    //exiting={exiting}
                    style={[accent_dark, {position: 'absolute'}]}
                >
                <Text style={[staticStyles.letter, {color: colorIcon}]}>D</Text>         
                <Svg width={sizeIcon} height={sizeIcon} viewBox="0 0 36 43" fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Rect x="1.5" y="21.5" width="13" height="20" rx="1.5" fill={`${colorIcon}40`} stroke={colorIcon} strokeWidth="3"/>
                <Rect x="17" y="8" width="15" height="7" rx="2" stroke={colorIcon} strokeWidth="2"/>
                <Rect x="14.5" y="14.5" width="20" height="27" rx="1.5" fill={`${colorIcon}40`} stroke={colorIcon} strokeWidth="3"/>
                <Line x1="24.5" x2="24.5" y2="7" stroke={colorIcon} strokeWidth="3"/>
                <Line x1="15" y1="16.5" x2="34" y2="16.5" stroke={colorIcon}/>
                <Line x1="18.5" y1="14" x2="18.5" y2="9" stroke={colorIcon}/>
                <Line x1="30.5" y1="14" x2="30.5" y2="9" stroke={colorIcon}/>
                <Rect x="19.15" y="19.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Line x1="3" y1="42.5" x2="33" y2="42.5" stroke={colorIcon}/>
                <Rect x="26.15" y="19.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="6.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="6.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="19.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="26.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="26.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                <Rect x="19.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill={invertColorIcon} stroke={colorIcon} strokeWidth="0.3"/>
                </Svg>
                </Animated.View>
                
                <Animated.View
                    style={[accent_light, {position: 'absolute'}]}
                    //entering={entering}{scheme == 'light' &&
                    //exiting={exiting}
                >
                <Text style={[staticStyles.letter, {color: colorIcon}]}>L</Text> 
                <Svg width={sizeIcon} height={sizeIcon} viewBox="0 0 36 43" fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Rect x="1.5" y="21.5" width="13" height="20" rx="1.5" stroke={colorIcon} strokeWidth="3"/>
                <Rect x="17" y="8" width="15" height="7" rx="2" stroke={colorIcon} strokeWidth="2"/>
                <Rect x="14.5" y="14.5" width="20" height="27" rx="1.5" stroke={colorIcon} strokeWidth="3"/>
                <Line x1="24.5" x2="24.5" y2="7" stroke={colorIcon} strokeWidth="3"/>
                <Line x1="15" y1="16.5" x2="34" y2="16.5" stroke={colorIcon}/>
                <Line x1="18.5" y1="14" x2="18.5" y2="9" stroke={colorIcon}/>
                <Line x1="30.5" y1="14" x2="30.5" y2="9" stroke={colorIcon}/>
                <Rect x="6" y="26" width="4" height="4" rx="1" fill={colorIcon}/>
                <Rect x="6" y="33" width="4" height="4" rx="1" fill={colorIcon}/>
                <Rect x="19" y="33" width="4" height="4" rx="1" fill={colorIcon}/>
                <Rect x="26" y="33" width="4" height="4" rx="1" fill={colorIcon}/>
                <Rect x="19" y="26" width="4" height="4" rx="1" fill={colorIcon}/>
                <Rect x="19" y="19" width="4" height="4" rx="1" fill={colorIcon}/>
                <Rect x="26" y="26" width="4" height="4" rx="1" fill={colorIcon}/>
                <Rect x="26" y="19" width="4" height="4" rx="1" fill={colorIcon}/>
                <Line x1="3" y1="42.5" x2="33" y2="42.5" stroke={colorIcon}/>
                </Svg>
                </Animated.View>
            </View>
            {text && 
            <Text
                style = {[{
                    marginLeft: 10
                }, textStyle]}
            >
                {text}
            </Text>
            }    
        </Pressable>
        
    )
}

const staticStyles = StyleSheet.create({
    letter: {
        position: 'absolute',
        top: -4,
        left: 2,
        fontSize: 13,
        fontWeight: 'bold',
        fontVariant: ['small-caps']
    }
})