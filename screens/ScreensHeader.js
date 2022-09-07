import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, Text, Animated, Dimensions, StyleSheet } from "react-native";
import Svg, {Path} from "react-native-svg";

import Constants from "expo-constants";

import ThemesColorsAppList, {themesApp} from "../styles/ColorsApp";
import LanguagesAppList, {languagesApp} from "../language/language";

import { LinearGradient } from 'expo-linear-gradient';

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

export default ScreensHeader = ({ 
    screen,

    ThemeColorsAppIndex,
    LanguageAppIndex
    })=>{
    //console.log()

    let headerTitle = '';
    let headerHeigt = 0;
    let statusBarBG = ThemesColorsAppList[ThemeColorsAppIndex].statusBar
    if(screen == 'screen_3'){
        headerTitle = LanguagesAppList[LanguageAppIndex].SettingsScreen.HeaderTitle;
        statusBarBG = ThemesColorsAppList[ThemeColorsAppIndex].sky
        headerHeigt = 30;
    }

    useEffect(()=>{

    },[screen])

    return (
        <>
        <View
            //status bar
            style = {{
                height: Constants.statusBarHeight+1,
                backgroundColor: statusBarBG,
                //position: 'absolute',
            }} 
        />
        <View
            style = {{
                //top: Constants.statusBarHeight+1,
                height: headerHeigt,
                backgroundColor: statusBarBG,
                //flexDirection: 'row',
                //position: 'absolute',
            }} 
        >
        {/* 
        <LinearGradient
            colors={[ThemesColorsAppList[ThemeColorsAppIndex].sky, ThemesColorsAppList[ThemeColorsAppIndex].skyUp]}
            style={{
                position: 'absolute',
                height: headerHeigt,
                width: deviceWidth
            }}
        />*/}
            <View 
                style = {{  
                    //backgroundColor: ThemesColorsAppList[ThemeColorsAppIndex].sky,
                    //alignItems: 'flex-end',
                    //justifyContent: "center",
                    left: 0,
                    alignItems: 'flex-end',
                    position: 'absolute',
                    paddingHorizontal: 5,
                    paddingRight: 5,
                    //backgroundColor: 'red',
                    width: deviceWidth/2
                }} 
            >
                
                <Text
                    style = {{
                        fontSize: 20,
                        fontWeight: 'bold',
                        fontVariant: ['small-caps'],
                        letterSpacing: 0.5,
                        color: 'white',
                        opacity: .85
                    }}
                >
                    {headerTitle}
                </Text>
            </View>
        </View>
        </>
    )
}