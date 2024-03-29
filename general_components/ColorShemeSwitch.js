import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, View,  Dimensions, TextInput } from 'react-native';
import Svg, { 
    Rect, 
    Defs,  
    Stop, 
    Line,
    LinearGradient,
} from "react-native-svg";
import Reanimated, {
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
    Easing, 
    createAnimatedPropAdapter
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const RTextInput = Reanimated.createAnimatedComponent(TextInput)

const TextInputAdapter = createAnimatedPropAdapter(
    (props) => {
      'worklet';
      const keys = Object.keys(props);
      if (keys.includes('value')) {
        props.text = props.value;
        delete props.value;
      }
    },
    ['text']
);

export default ColorSchemeSwitch = ({

    aScheme,
    aStyleScheme, 
    aColorPrimaryIcon,
    aColorSecondaryIcon,

    scheme = 'auto',
    sizeIcon = 25,
    colorIcon = '#ffffff',
    invertColorIcon = '#000000',
    textStyle = {},
    text = false, //or string
    pressableStyle = {},
    switching
}) => {
    const schemes = [ 'light', 'dark'] //aStyleScheme.value == 'auto'?'auto',

    const currentScheme = useDerivedValue(()=> aScheme.value)

    const press = () => {
        const newScheme = currentScheme.value == 'light'? 'dark' : 'light'
        console.log('SWITCH SCHEMA',newScheme)
        switching(newScheme)
    }
    /*
        
    */
    const iconStyle = useAnimatedStyle(()=>({
        color: (aColorPrimaryIcon && aColorPrimaryIcon.value)? aColorPrimaryIcon.value : colorIcon
    }))

    const letterValue = useAnimatedProps(()=>{
        const text = currentScheme.value[0].toUpperCase()
        return ({
            value: text,
        })
    }, [], TextInputAdapter)

    return (
        <Pressable
            style = {[{
                padding: 4,
                paddingLeft: 12,
                paddingTop: 12,
                //backgroundColor: 'red'
            },pressableStyle]}
            onPress={press}
        >
            <RTextInput
                editable = {false} 
                style={[staticStyles.letter, iconStyle]}
                animatedProps={letterValue}
            />
            <Reanimated.Text
                style = {[iconStyle, {
                    height: sizeIcon,
                    width: sizeIcon,
                }]}
            >
                <MaterialCommunityIcons name="theme-light-dark" size={sizeIcon}/> 
            </Reanimated.Text> 
        </Pressable>
        
    )
}

const staticStyles = StyleSheet.create({
    letter: {
        position: 'absolute',
        top: -3,
        left: 4,
        fontSize: 14,
        fontWeight: 'bold',
        fontVariant: ['small-caps']
    }
})

/*

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

*/