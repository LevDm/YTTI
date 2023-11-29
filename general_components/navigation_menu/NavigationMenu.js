import React, { useState, useEffect, useRef } from "react";
import { Keyboard, View, Pressable, Text, Dimensions, StyleSheet } from "react-native";

import Reanimated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    interpolate,
    withTiming,
    useAnimatedReaction,
    runOnJS
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import * as NavigationBar from 'expo-navigation-bar';

import Svg, {Path} from "react-native-svg";

import Classical from "./Classical";
import Hidden from "./Hidden";


const NavigationMenu = (props) => {
    const { 
        navigation,
        state, 
        route,

        uiStyle,
        uiTheme,
        uiCompositions,
    } = props

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        }
    }, []);


    const visibility = NavigationBar.useVisibility() === 'visible'
    //console.log('ANDROID BAR',visibility)

    const {
        navigationMenu: {
            type,
        }
    } = uiStyle

    const [currentType, setCurrentType] = useState(type.value)

    useAnimatedReaction(()=>type.value, (newValue, oldValue)=>{
        runOnJS(setCurrentType)(newValue)
    })

    const areaMenu = useAnimatedStyle(()=>{
        if(type.value == 'type_1'){
            return {
                bottom: 0// (visibility?  (deviceHeight + statusBarHeight) : screenHeight) -height.value
            }
        }
        return {}
        /* 
        if(type.value  == 'hidden'){
            
            const margin = 10
            let h = 40
            let size = (state.routes).length  * (h+ 2*margin)
            if(horizontal.value != 'center'){
                size = 40
                h = (state.routes).length  * (size+ 2*margin)
            }

            const marginBord = 7
            let left = horizontal.value == 'left'? marginBord : deviceWidth - size -marginBord
            
            let top = deviceHeight - 10 - h - (deviceHeight/2) - vertical.value 
            if(appStyle.navigationMenu.position.horizontal == 'center'){
                left = deviceWidth/2 - size/2
                let bottom = interpolate(vertical.value , [-150, 150] , [5, 35])
                top = deviceHeight - bottom - h
            }
            let align = 'center'
            let just = 'flex-end'
            if(horizontal.value  == 'right'){
                align = 'flex-end'
                just = 'center'
            } else if (horizontal.value  == 'left'){
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
        */
    })



    //if(!keyboardVisible && !hideMenu){} else {return null}
    return (
        <Reanimated.View
            //key={keyID}
            style = {[areaMenu, {
                position: 'absolute',

            }]}
        >
            {currentType == 'type_1' && <Classical {...props}/>}

            {currentType == 'type_3' &&
            <Text style={{backgroundColor: 'red'}}>THIS MENU TYPE NOT READY</Text>
            /* 
            <Hidden
                state = {state}
                route = {route}  
                navigation = {navigation}
                
                appStyle={appStyle}
                appConfig={appConfig}

                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema={ThemeSchema}
                LanguageAppIndex={LanguageAppIndex}
            />*/ 
            }
        </Reanimated.View>
    )
    
}
export default NavigationMenu;

/*


*/