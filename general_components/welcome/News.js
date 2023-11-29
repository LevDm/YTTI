import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import {
    StyleSheet, 
    View, 
} from 'react-native';

import Constants from "expo-constants";

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
} from 'react-native-reanimated';

;
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


import useLanguage from "../../app_hooks/useLanguage";
import ImageBackground from "./ImageBackground";


const News = memo((props) => {
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

    const textColor = useAnimatedStyle(()=>({color: textNP.value}))


    const Title = () => {
        const Language = useLanguage()

        return (
            <Reanimated.Text
                style={[textColor, {
                    fontSize: 16, 
                    fontWeight: '500', 
                    fontVariant: ['small-caps'],
                    letterSpacing: 0.3,
                    textAlign: 'center' 
                }]}
                numberOfLines={6}
            >
                Поздавляю, теперь Ты тестировщик мобильных приложений! 
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
                <MaterialCommunityIcons name="newspaper-variant-multiple-outline" size={20}/>
            </Reanimated.Text>
            <View
                style = {{
                    flex: 1,
                    paddingTop: 40
                }}
            >
               <Title/> 
            </View>
        </View>
    )
})
export default News

const staticStyles = StyleSheet.create({
   
});