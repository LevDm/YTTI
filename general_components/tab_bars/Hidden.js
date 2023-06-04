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
            {name: "tasks"},
            {name: "timetable"},
            {name: "notes"},
            {name: "settingsStack"},
            {name: "analytics"},
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

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    const tingDuration = 200
    const entering = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(1, { duration: tingDuration }),
        };
        const initialValues = {
          opacity: -0.5,
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
        let openHeight = 40
        let openWidth = (state.routes).length  * (openHeight+ 2*margin)
        let closeHeight = 0.45 * openHeight
        let closeWidth = 0.5 * openWidth
        closeWidth = (openWidth > 100 ? 100 : openWidth)

        if(appStyle.navigationMenu.position.horizontal != 'center'){
            openWidth = 40
            openHeight = (state.routes).length  * (openWidth+ 2*margin)
            closeHeight = 0.5 * openHeight
            closeWidth = 0.45 * openWidth
            closeHeight = (openHeight > 100 ? 100 : openHeight)
        } 
        
        return {
            height: withTiming( (open? openHeight : closeHeight), {duration: duration}),
            width: withTiming( (open? openWidth : closeWidth), {duration: duration}),
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

    const ripple = (color) => ({
        color: `${color}20`,
        borderless: true,
        foreground: false
    })

    return (
        <Animated.View
            style = {[
                transitonArea,
                {
                    //height: h,
                    
                    //width: size,
                    
                    backgroundColor: `${Theme.specials.separator}20`,
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
                const routes =  {
                    tasks : {name: "tasks"},
                    timetable: {name: "timetable"},
                    notes : {name: "notes"},
                    analytics : {name: "analytics"},
                    settings : {name: "settingsStack"},
                }
                let current 
                let uses = new Array(Object.keys(appConfig.appFunctions).length)//['','','','']
                Object.keys(appConfig.appFunctions).map((litem, lindex)=>{
                    if(appConfig.appFunctions[litem].useId == index){
                        current = litem
                    } 
                    if(appConfig.appFunctions[litem].used){
                        uses[appConfig.appFunctions[litem].useId] = litem
                    } 
                })
                const croute = routes[current]
                const cpage = appConfig.appFunctions[current]
                if(!routes[current]){return null} 
                const cisFocused = state.routes[state.index].name === croute.name;


                let size = 30;
                const iconsNames = {focus: '', notFocus: ''}
                let screenName = ''

                switch(croute.name){
                    case "tasks":
                        iconsNames.focus = 'sticker-check';//'home-edit';
                        iconsNames.notFocus = 'sticker-check-outline';//'home-edit-outline';
                        screenName = Language.TasksScreen.HeaderTitle;
                        break;

                    case "analytics":
                        iconsNames.focus = 'circle-slice-1';
                        iconsNames.notFocus = 'circle-outline';
                        screenName = Language.AnalyticsScreen.HeaderTitle;
                        break;

                    case "settingsStack": 
                        iconsNames.focus = 'cog'; 
                        iconsNames.notFocus = 'cog-outline';
                        screenName = Language.SettingsScreen.HeaderTitle;
                        break;

                    case "notes":
                        iconsNames.focus = 'note-edit'; 
                        iconsNames.notFocus = 'note-edit-outline';
                        screenName = Language.NotesScreen.HeaderTitle;
                        break;

                    case "timetable":
                        iconsNames.focus = 'timetable'; 
                        iconsNames.notFocus = 'timetable';
                        screenName = Language.TimetableScreen.HeaderTitle;
                        break;

                    default:
                        iconsNames.focus = "border-none-variant"
                        iconsNames.notFocus = "border-none-variant"
                        screenName = 'screenName'
                }

                return (
                    <AnimatedPressable
                        key = {`${Math.random()}`}
                        disabled = {cisFocused}
                        onPress={()=>{
                            //setOpen(false)
                            navigation.navigate(croute.name)
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
                        android_ripple = {appStyle.effects.ripple == 'all'? ripple(Theme.icons.accents.primary) : false}
                    >
                        {cisFocused && 
                            <Animated.View 
                                //exiting={exiting}
                                style = {{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                entering={entering}
                            >
                                <MaterialCommunityIcons name={iconsNames.focus} size={size} color = {Theme.icons.accents.primary}/>
                            </Animated.View>        
                        }
                        {!cisFocused && 
                            <Animated.View
                                //exiting={exiting}
                                entering={entering}
                                style = {{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <MaterialCommunityIcons name={iconsNames.notFocus} size={size} color = {Theme.icons.neutrals.tertiary}/>
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