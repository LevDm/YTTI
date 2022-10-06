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

import themesColorsAppList from "../../app_values/Themes";
import languagesAppList from "../../app_values/Languages";

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width


const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const Hidden = ({
    state = {
        index: 0, 
        routes: [
            {name: "Home"},
            {name: "SettingsStack"},
            {name: "Analytic"},
        ]
    },  
    route,
    navigation, 

    appStyle,
    appConfig,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex,
}) => {

    const Thema = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    const tingDuration = 200
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
    //const margin = 10
    //const h = 40
    //const size = (state.routes).length  * (h+ 2*margin)

    const [open, setOpen] = useState(false)

    const transitonArea = useAnimatedStyle(()=>{
        const duration = 200
        const margin = 10
        let h = 40
        let size = (state.routes).length  * (h+ 2*margin)
        if(appStyle.navigationMenu.position.horizontal != 'center'){
            size = 40
            h = (state.routes).length  * (size+ 2*margin)
        }
        return {
            height: withTiming( (open? 1 : 0.5)*h, {duration: duration}),
            width: withTiming( (open? 1 : 0.4)*size, {duration: duration}),
            transform: [
                //{scale: withTiming( (open? 1 : 0.5), {duration: 400})},
            ]
        }
    })

    const transitonIcons = useAnimatedStyle(()=>{
        const duration = 400
        const margin = 10
        let h = 40
        let size = (state.routes).length  * (h+ 2*margin)
        if(appStyle.navigationMenu.position.horizontal != 'center'){
            size = 40
            h = (state.routes).length  * (size+ 2*margin)
        }
        return {
            height: 40,
            width: 40,
        }
    })

    return (
        <Animated.View
            style = {[
                transitonArea,
                {
                    //height: h,
                    
                    //width: size,
                    
                    backgroundColor: Thema.navigateBar.transparentGround,
                    borderRadius: appStyle.borderRadius.additional,
                    flexDirection: appStyle.navigationMenu.position.horizontal == 'center'?'row':'column',
                }
            ]}
        >
            {!open && 
            <AnimatedPressable
                style={{
                    flex: 1
                }}
                onPress={()=>{
                    setOpen(true)
                    setTimeout(()=>{setOpen(false)}, 1100)
                }}
            />}
            {open && <>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                let size = 30;


                const iconsNames = {focus: '', notFocus: ''}
                let screenName = ''

                switch(route.name){
                    case "Home":
                        iconsNames.focus = 'home-edit';
                        iconsNames.notFocus = 'home-edit-outline';
                        screenName = Language.TasksScreen.HeaderTitle;
                        break;

                    case "Analytic":
                        iconsNames.focus = 'circle-slice-1';
                        iconsNames.notFocus = 'circle-outline';
                        screenName = Language.AnalyticsScreen.HeaderTitle;
                        break;

                    case "SettingsStack": 
                        iconsNames.focus = 'cog'; 
                        iconsNames.notFocus = 'cog-outline';
                        screenName = Language.SettingsScreen.HeaderTitle;
                        break;

                    default:
                        iconsNames.focus = "border-none-variant"
                        iconsNames.notFocus = "border-none-variant"
                        screenName = 'screenName'
                }

                return (
                    <AnimatedPressable
                        key = {`${Math.random()}`}
                        disabled = {isFocused}
                        onPress={()=>{
                            //setOpen(false)
                            navigation.navigate(route.name)
                        }}
                        style={[
                            transitonIcons,
                            {
                                flex: 1, 
                                alignItems: 'center',
                                justifyContent: 'center',
                                //marginHorizontal: margin,
                                //height: h,
                                //width: h
                            }
                        ]}
                        android_ripple = {appStyle.navigationMenu.rippleEffect? {color: Thema.navigateBar.icons.active, borderless: true} : false}
                    >
                        {isFocused && 
                            <Animated.View 
                                //exiting={exiting}
                                style = {{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                entering={entering}
                            >
                                <MaterialCommunityIcons name={iconsNames.focus} size={size} color = {Thema.navigateBar.icons.active}/>
                            </Animated.View>        
                        }
                        {!isFocused && 
                            <Animated.View
                                //exiting={exiting}
                                entering={entering}
                                style = {{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <MaterialCommunityIcons name={iconsNames.notFocus} size={size} color = {Thema.navigateBar.icons.notActive}/>
                            </Animated.View>        
                        }
                    </AnimatedPressable>    

                );
            })
            }
            </>}
        </Animated.View>
    );
}

export default Hidden;