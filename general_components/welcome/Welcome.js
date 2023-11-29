import React, {memo, useRef, useState, useEffect} from "react";
import { StyleSheet, View, Pressable, Dimensions, Appearance, Text } from "react-native";
import Constants from "expo-constants";

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay, 
    useAnimatedScrollHandler, 
    cancelAnimation,
    useAnimatedRef,
    useDerivedValue,
    scrollTo,
    runOnJS,
    interpolateColor,
    Extrapolation,
    interpolate,
    Extrapolate,
    runOnUI,
    Easing, 
    useAnimatedProps,
    convertToRGBA,
    withSpring,
    withRepeat,
    FadeOut,
    withSequence,
} from 'react-native-reanimated';

import { connect } from "react-redux";
import mapDispatchToProps from "../../app_redux_files/dispatchToProps";
import mapStateToProps from "../../app_redux_files/stateToProps";

import { MaterialCommunityIcons } from '@expo/vector-icons';

import useLanguage from "../../app_hooks/useLanguage";

import ImageBackground from "./ImageBackground";

const WelcomeComponent = memo((props) => {
    const {
        componentSize,
        uiStyle,
        uiComposition,
        uiTheme,
        userData
    } = props

    const {
        h: componentHeight, 
        w: componentWidht
    } = componentSize
    
    const {
        name
    } = userData

    const {
        texts: {
            neutrals: {
                primary: textNP,
                secondary: textNS,
                tertiary: textNT,
            },
            accents: {
                primary: textAP,
                secondary: textAS,
                tertiary: textAT,
            }
        },
        icons: {
            neutrals: {
                primary: iconNP,
                secondary: iconNS,
                tertiary: iconNT,
            },
            accents: {
                primary: iconAP,
                secondary: iconAS,
                tertiary: iconAT,
            }
        },
      } = uiTheme

    const iconColorNP = useAnimatedStyle(()=>({
        color: iconNP.value
    })) 

    const getDayPart = () => {
        const dayParts = {
            'morning': {
                when: (hour) => 6 <= hour && hour < 9
            }, 
            'day': {
                when: (hour) => 9 <= hour && hour < 16
            }, 
            'evening': {
                when: (hour) => 16 <= hour && hour < 22
            },
            'night': {
                when: (hour) => 22 <= hour && hour <= 24 || 0 <= hour && hour < 6
            }, 
        }
        const currentTime= new Date().getHours()+1
        return Object.keys(dayParts)[Object.values(dayParts).findIndex(part=>part.when(currentTime))]
    }

    const textColor = useAnimatedStyle(()=>({color: textNP.value}))

    const Title = () => {
        const Language = useLanguage()
        const part = getDayPart()
        return (
            <Reanimated.Text
                style={[textColor, {
                    fontSize: 16, 
                    fontWeight: '500', 
                    fontVariant: ['small-caps'],
                    letterSpacing: 0.3,
                    textAlign: 'center' 
                }]}
                numberOfLines={3}
            >
                {Language.SplachScreen[part]}{name? `, ${name}` : ''}!
            </Reanimated.Text>
        )
    }

    return (
        <View
            style = {{
                flex: 1,
            }}
        >
            <ImageBackground {...props}/>
            <Reanimated.Text style={[iconColorNP, {position: 'absolute', zIndex: 1, top: 4, left: 16}]}>
                <MaterialCommunityIcons name="heart-outline" size={20}/>
            </Reanimated.Text>
            <View
                style = {{
                    flex: 1,
                    //justifyContent: 'center',
                    //alignItems: 'center',
                    paddingTop: 40
                }}
            >
               <Title/> 
            </View>
        </View>
    )
},
    (prev, next) => {
        const isEqual = (obj_1, obj_2) => JSON.stringify(obj_1) == JSON.stringify(obj_2)
        return isEqual(prev.userData, next.userData)
    }
)
export default connect(mapStateToProps("WELCOME"))(WelcomeComponent)


