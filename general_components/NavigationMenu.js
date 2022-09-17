import React, { useState, useEffect, useRef } from "react";
import { Keyboard, View, Pressable, Text, Dimensions, StyleSheet } from "react-native";

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Svg, {Path} from "react-native-svg";

import themesColorsAppList from "../app_values/Themes";
import languagesAppList from "../app_values/Languages";

import Classical from "./tab_bars/Classical";

const deviceHeight = Dimensions.get('screen').height
const deviceWidth = Dimensions.get('window').width

const NavigationMenu = ({ 
    navigation,
    state, 
    route,
    
    appStyle,
    appConfig,

    ThemeColorsAppIndex,
    LanguageAppIndex,
}) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const Thema = themesColorsAppList[ThemeColorsAppIndex]
    const Language = languagesAppList[LanguageAppIndex]

    if(!keyboardVisible){
    return (
        <View
            style = {[
                {
                    position: 'absolute',
                },
                appStyle.navigationMenu.type == 'classical'? {
                    top: deviceHeight -appStyle.navigationMenu.height,
                } : {}

            ]}
        >
            {appStyle.navigationMenu.type == 'classical' && 
            <Classical
                state = {state}
                route = {route}  
                navigation = {navigation}
                
                appStyle={appStyle}
                appConfig={appConfig}

                ThemeColorsAppIndex={ThemeColorsAppIndex}
                LanguageAppIndex={LanguageAppIndex}
            />
            }
        </View>
    )
    } else {return null}
}
export default NavigationMenu;