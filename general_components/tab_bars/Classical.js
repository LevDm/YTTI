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

    const BLUR = true

    return (
        <View
            style = {
                [{
                    height: appStyle.navigationMenu.height,
                    width: deviceWidth,
                },
                BLUR? {} : {
                    borderTopWidth:1,
                    borderColor: `${Theme.basics.neutrals.tertiary}25`,
                    backgroundColor: Theme.basics.neutrals.secondary,
                }]
            }
        >   
            {BLUR && 
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
                overlayColor={`${Theme.basics.neutrals.secondary}90`}
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
                const page = appConfig.appFunctions[route.name]
                if(page && !page.used){
                    console.log('cmenu page not used', route.name, page.used)
                    return null
                } else {
                    console.log('cmenu page used',route.name, page, (page != undefined) && !page.used)
                }

                const isFocused = state.index === index;
                let size = 19;
                size = (appStyle.navigationMenu.height-5-15)//(appStyle.navigationMenu.signatureIcons? 15 : 0)
                size = (size > 32? 32 : size)

                const iconsNames = {focus: '', notFocus: ''}
                let screenName = ''

                switch(route.name){
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
                        disabled = {isFocused}
                        onPress={()=>{
                            navigation.navigate(route.name)
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
                        android_ripple = {appStyle.navigationMenu.rippleEffect? {
                            color: `${Theme.icons.accents.primary}20`, 
                            borderless: true,
                            foreground: false
                        } : false}
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
                                <MaterialCommunityIcons name={iconsNames.focus} size={size} color = {Theme.icons.accents.primary}/>
                                {appStyle.navigationMenu.signatureIcons &&
                                <Text
                                    style = {[
                                        {
                                            fontSize: 10,
                                            width: '100%',
                                            textAlign: 'center',
                                            fontVariant: ['small-caps'],
                                            fontWeight: '600',
                                            color: Theme.icons.accents.primary
                                        }
                                    ]}
                                >
                                    {screenName}
                                </Text>
                                }
                            </Animated.View>        
                        }
                        {!isFocused && 
                            <Animated.View
                                exiting={exiting}
                                style = {{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <MaterialCommunityIcons name={iconsNames.notFocus} size={size} color = {Theme.icons.neutrals.secondary}/>
                                {appStyle.navigationMenu.signatureIcons &&
                                <Text
                                    style = {[
                                        {
                                            fontSize: 10,
                                            width: '100%',
                                            textAlign: 'center',
                                            fontVariant: ['small-caps'],
                                            fontWeight: '600',
                                            color: Theme.icons.neutrals.secondary
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