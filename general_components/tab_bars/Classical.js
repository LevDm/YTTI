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

import { BlurView } from "@react-native-community/blur";

import themesColorsAppList from "../../app_values/Themes";
import languagesAppList from "../../app_values/Languages";

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

const Classical = ({
    state = {
        index: 0, 
        routes: [
            {name: "home"},
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

    const tingDuration = 400
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

    const ripple = (color) => ({
        color: `${color}20`,
        borderless: true,
        foreground: false
    })

    return (
        <View
            style = {
                [{
                    height: appStyle.navigationMenu.height,
                    width: deviceWidth,
                },
                appStyle.effects.blur? {} : {
                    borderTopWidth: 0.4,
                    borderColor: `${Theme.specials.separator}25`,
                    backgroundColor: Theme.basics.neutrals.tertiary,
                }]
            }
        >   
            {appStyle.effects.blur && 
            <View 
                style = {[StyleSheet.absoluteFillObject, {
                    //specialty blur for android
                    overflow: 'hidden',
                }]}
            >
            <BlurView
                style = {{flex: 1, }}
                blurType = {'light'}
                blurAmount = {10}
                
                //ANDROID_PROPS
                overlayColor={`${Theme.basics.neutrals.tertiary}90`}
                //overlayColor={'transparent'}
                //blurRadius	= {10}
                //downsampleFactor = {10}
            />
            </View>}

            <View 
                style = {{
                    flex: 1, 
                    flexDirection: 'row',
                }}
            >
            {state.routes.map((route, index) => {

                const routes =  {
                    tasks : {name: "home"},
                    notes : {name: "notes"},
                    settings : {name: "settingsStack"},
                    analytics : {name: "analytics"},
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

                
                //const page = appConfig.appFunctions[route.name]
                //const isFocused = state.index === index;

                


                if(!routes[current]){
                    //console.log('cmenu page not used', route.name, page.used)
                    return null
                } else {
                    //console.log('cmenu page used',route.name, page, (page != undefined) && !page.used)
                }

                //console.log('???', croute, cpage, 'focus', state.routes[state.index].name,'=',croute.name)
                const cisFocused = state.routes[state.index].name === croute.name;


                let size = 19;
                size = (appStyle.navigationMenu.height-5-15)//(appStyle.navigationMenu.signatureIcons? 15 : 0)
                size = (size > 32? 32 : size)

                const iconsNames = {focus: '', notFocus: ''}
                let screenName = ''

                switch(croute.name){
                    case "home":
                        iconsNames.focus = 'home-edit';
                        iconsNames.notFocus = 'home-edit-outline';
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

                    default:
                        iconsNames.focus = "border-none-variant"
                        iconsNames.notFocus = "border-none-variant"
                        screenName = 'screenName'
                }

                return (
                    <View
                        key = {`${Math.random()}`}
                        style = {{
                            flex: 1, 
                            backgroundColor: 'transparent',
                            borderRadius: appStyle.borderRadius.additional
                        }}
                    >
                    <Pressable
                        disabled = {cisFocused}
                        onPress={()=>{
                            navigation.navigate(croute.name)
                        }}
                        style={[
                                {
                                flex: 1, 
                                alignItems: 'center',
                                alignContent: 'center',
                                paddingTop: appStyle.navigationMenu.height > 55? 8 : 3,
                                justifyContent: 'flex-start',
                                //backgroundColor: 'transparent' 
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
                                <MaterialCommunityIcons 
                                    name={appStyle.navigationMenu.accentsType.filling? iconsNames.focus : iconsNames.notFocus} 
                                    size={size} 
                                    color = {appStyle.navigationMenu.accentsType.coloring? Theme.icons.accents.primary : Theme.icons.neutrals.secondary}
                                />
                                {appStyle.navigationMenu.signatureIcons &&
                                <Text
                                    style = {[
                                        {
                                            fontSize: 10,
                                            width: '100%',
                                            textAlign: 'center',
                                            fontVariant: ['small-caps'],
                                            fontWeight: '600',
                                            color: appStyle.navigationMenu.accentsType.coloring? Theme.texts.accents.primary : Theme.texts.neutrals.secondary
                                        }
                                    ]}
                                >
                                    {screenName}
                                </Text>
                                }
                            </Animated.View>        
                        }
                        {!cisFocused && 
                            <Animated.View
                                exiting={exiting}
                                style = {{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <MaterialCommunityIcons 
                                    name={iconsNames.notFocus} 
                                    size={size} 
                                    color = {appStyle.navigationMenu.accentsType.coloring? Theme.icons.neutrals.tertiary : Theme.icons.neutrals.secondary}
                                />
                                {appStyle.navigationMenu.signatureIcons &&
                                <Text
                                    style = {[
                                        {
                                            fontSize: 10,
                                            width: '100%',
                                            textAlign: 'center',
                                            fontVariant: ['small-caps'],
                                            fontWeight: '600',
                                            color: appStyle.navigationMenu.accentsType.coloring? Theme.texts.neutrals.tertiary : Theme.texts.neutrals.secondary
                                        }
                                    ]}
                                >
                                    {screenName}
                                </Text>
                                }
                            </Animated.View>        
                        }
                    </Pressable>    
                    </View>
                )
            })}
            </View>
        </View>
    );
}

export default Classical;


const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'column',
        position: 'absolute',
        right: 3,
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        elevation: 0 
    },

});