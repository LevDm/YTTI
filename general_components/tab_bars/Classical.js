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

const Classical = ({
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
    LanguageAppIndex,
}) => {

    const Thema = themesColorsAppList[ThemeColorsAppIndex]
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

    

    return (
        <View
            style = {[
                {
                    height: appStyle.navigationMenu.height,
                    //zIndex: 0,
                    width: deviceWidth,
                    //position: 'absolute',
                    //bottom: 0, 
                    backgroundColor: Thema.navigateBar.ground,
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderColor: '#00000010'
                }
            ]}
        >
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                let size = 19;
                size = (appStyle.navigationMenu.height-5-15)//(appStyle.navigationMenu.signatureIcons? 15 : 0)
                size = (size > 32? 32 : size)

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
                    <Pressable
                        key = {`${Math.random()}`}
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
                                {appStyle.navigationMenu.signatureIcons &&
                                <Text
                                    style = {[
                                        {
                                            fontSize: 10,
                                            width: '100%',
                                            textAlign: 'center',
                                            fontVariant: ['small-caps'],
                                            fontWeight: '600',
                                            color: Thema.navigateBar.text.active
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
                                <MaterialCommunityIcons name={iconsNames.notFocus} size={size} color = {Thema.navigateBar.icons.notActive}/>
                                {appStyle.navigationMenu.signatureIcons &&
                                <Text
                                    style = {[
                                        {
                                            fontSize: 10,
                                            width: '100%',
                                            textAlign: 'center',
                                            fontVariant: ['small-caps'],
                                            fontWeight: '600',
                                            color: Thema.navigateBar.text.notActive
                                        }
                                    ]}
                                >
                                    {screenName}
                                </Text>
                                }
                            </Animated.View>        
                        }
                    </Pressable>    

                );
            })}
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