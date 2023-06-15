import React, { useState, useEffect, useRef } from "react";
import { Keyboard, View, Pressable, Text, Dimensions, StyleSheet } from "react-native";

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    interpolate,
    withTiming
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 



import Svg, {Path} from "react-native-svg";

import themesColorsAppList from "../app_values/Themes";
import languagesAppList from "../app_values/Languages";

import Classical from "./tab_bars/Classical";
import Hidden from "./tab_bars/Hidden";

const deviceHeight = Dimensions.get('screen').height
const deviceWidth = Dimensions.get('window').width

const NavigationMenu = ({ 
    navigation,
    state, 
    route,
    keyID,
    hideMenu,

    addTestActions,
    
    appStyle,
    appConfig,

    ThemeColorsAppIndex,
    ThemeSchema,
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

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    


    const styleMenu = ()=> {
        const margin = 10
        let h = 40
        let size = (state.routes).length  * (h+ 2*margin)
        if(appStyle.navigationMenu.position.horizontal != 'center'){
            size = 40
            h = (state.routes).length  * (size+ 2*margin)
        }

        if(appStyle.navigationMenu.type == 'classical'){
            return {
                top: deviceHeight -appStyle.navigationMenu.height
            }
        }
        if(appStyle.navigationMenu.type == 'hidden'){
            const marginBord = 7
            let left = appStyle.navigationMenu.position.horizontal == 'left'? marginBord : deviceWidth - size -marginBord
            
            let top = deviceHeight - 10 - h - (deviceHeight/2) - appStyle.navigationMenu.position.vertical
            if(appStyle.navigationMenu.position.horizontal == 'center'){
                left = deviceWidth/2 - size/2
                let bottom = interpolate(appStyle.navigationMenu.position.vertical, [-150, 150] , [5, 35])
                top = deviceHeight - bottom - h
            }
            let align = 'center'
            let just = 'flex-end'
            if(appStyle.navigationMenu.position.horizontal == 'right'){
                align = 'flex-end'
                just = 'center'
            } else if (appStyle.navigationMenu.position.horizontal == 'left'){
                align = 'flex-start'
                just = 'center'
            }
            return {
                top: top,
                left: left,
                height: h,
                width: size,
                justifyContent: just,
                alignItems: align
            }       
        }
    }

    if(!keyboardVisible && !hideMenu){
    return (
        <View
            key={keyID}
            style = {[
                {
                    position: 'absolute',
                },
                styleMenu()
            ]}
        >
            {appStyle.navigationMenu.type == 'classical' && 
            <Classical
                state = {state}
                route = {route}  
                navigation = {navigation}

                addTestActions={addTestActions}
                
                appStyle={appStyle}
                appConfig={appConfig}

                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema={ThemeSchema}
                LanguageAppIndex={LanguageAppIndex}
            />
            }
            {appStyle.navigationMenu.type == 'hidden' && 
            <Hidden
                state = {state}
                route = {route}  
                navigation = {navigation}
                
                appStyle={appStyle}
                appConfig={appConfig}

                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema={ThemeSchema}
                LanguageAppIndex={LanguageAppIndex}
            />
            }
        </View>
    )
    } else {return null}
}
export default NavigationMenu;