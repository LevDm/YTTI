import React, {useRef, useState, useEffect} from "react";
import { StyleSheet, View, Pressable, Dimensions, Appearance, Text } from "react-native";
import Constants from "expo-constants";

import Animated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay, 
    useAnimatedScrollHandler, 
    cancelAnimation,
    useAnimatedRef,
    useDerivedValue,
    scrollTo,
    runOnJS,
    interpolateColor,
    Extrapolation,
    interpolate,
    Extrapolate,
    runOnUI,
    Easing, 
    useAnimatedProps
} from 'react-native-reanimated';

import themesColorsAppList, {themesApp} from "../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../app_values/Languages";

import { connect } from "react-redux";
import store from "../../redux_files/store"
import mapDispatchToProps from "../../redux_files/dispatchToProps";
import mapStateToProps from "../../redux_files/stateToProps";


const screen = Dimensions.get('screen')
const widthScreen = screen.width
const heightScreen = screen.height
//console.log(screen)
const widthLogo = 980/screen.scale
//const sizeY = 440/screen.scale
const sizeY = 146.67//*screen.scale
const borderWidth = 13.33//40/screen.scale
//general anim duration
const globalDuration = 1000 * 1

import Svg, { Circle, Rect, Ellipse  } from "react-native-svg";

const SplashY = (props) => {

    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.palette.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);

    const [ThemeSchema, setThemeSchema] = useState(props.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : props.appStyle.palette.scheme)
    
    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]    
    const [appConfig, setAppConfig] = useState(props.appConfig);
    

    store.subscribe(() => {
        let jstore = store.getState();

        if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
           setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
        }

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.palette.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.palette.theme));
        }

        if(ThemeSchema != jstore.appStyle.palette.scheme){
            setThemeSchema(jstore.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.palette.scheme);
        }

        if (appStyle != jstore.appStyle) {
            setAppStyle(jstore.appStyle);
        }

        if (appConfig != jstore.appConfig) {
            setAppConfig(jstore.appConfig);
        }
    })
    
    const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
    useEffect(()=>{
        if(listenerColorSheme){
            if(appStyle.palette.scheme == 'auto' && (listenerColorSheme != ThemeSchema)){
                console.log('splashY accept new color sheme', listenerColorSheme, 'used shema', appStyle.palette.scheme)
                setThemeSchema(listenerColorSheme)
            }
        }
    },[listenerColorSheme])
    
    Appearance.addChangeListener(({colorScheme})=>{
        setListinerColorScheme(colorScheme)
    })

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SplachScreen
 
    const time = ['night','morning', 'day', 'evening'][Math.floor((new Date()).getHours()/6)]

    const start = 30
    const dgDuration = 930//globalDuration
    const circleDuration = dgDuration/2
    const opacityDuration = 100
    const general = dgDuration+opacityDuration
   
    const state = useSharedValue(0)
    const body = useAnimatedStyle(()=>({
        opacity: interpolate(
            state.value,
            [dgDuration, general],
            [1, 0],
        ) 
    }))

    const bg = useAnimatedStyle(()=>({
        backgroundColor: interpolateColor(
            state.value,
            [start, dgDuration],
            [ `${Theme.basics.accents.primary}00`, Theme.basics.accents.primary]
            /* 
            {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP
            }*/  
        ),
    }))

    const hello = useAnimatedStyle(()=>({
        opacity: interpolate(
            state.value,
            [start, circleDuration],
            [0, 1],
        ) 
    }))

    const circle = useAnimatedStyle(()=>({
        opacity: interpolate(
            state.value,
            [start, circleDuration],
            [1, 0],
        ) 
    }))

    useEffect(()=>{
        if(props.splashStart){
            state.value = withTiming(general, {duration: general})
            setTimeout(()=>{
                props.splashOut()
            },general)
        }
    },[props.splashStart])

    return (
        <Animated.View
            style = {[StyleSheet.absoluteFill,{
                backgroundColor: 'black'
                //paddingTop: Constants.statusBarHeight
            },body]}
        >   
            <Animated.View
                style = {[{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    
                },bg]}
            >

            <Animated.View
                style = {[{position: 'absolute'}]}
            >                
                {false &&
                <Svg width={290/screen.scale} height={345/screen.scale} viewBox="0 -55 290 345" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Circle cx="30" cy="30" r="30" fill="white"/>
                <Circle cx="260" cy="30" r="30" fill="white"/>
                <Circle cx="145" cy="260" r="30" fill="white"/>
                <Circle cx="145" cy="144" r="30" fill="white"/>
                <Rect x="115" y="259" width="115" height="60" transform="rotate(-90 115 259)" fill="white"/>
                <Rect x="124" y="123.502" width="161.93" height="60" transform="rotate(-45 124 123.502)" fill="white"/>
                <Rect x="51.4264" y="9" width="161.93" height="60" transform="rotate(45 51.4264 9)" fill="white"/>
                </Svg>}
          
                <Svg width={148} height={148} viewBox="0 0 148 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Circle cx="35.6666" cy="45.6667" r="10" fill="white"/>
                <Circle cx="112.333" cy="45.6667" r="10" fill="white"/>
                <Circle cx="74" cy="122.333" r="10" fill="white"/>
                <Circle cx="74" cy="83.6667" r="10" fill="white"/>
                <Rect x="64" y="122" width="38.3333" height="20" transform="rotate(-90 64 122)" fill="white"/>
                <Rect x="67" y="76.834" width="53.9767" height="20" transform="rotate(-45 67 76.834)" fill="white"/>
                <Rect x="42.8087" y="38.6667" width="53.9767" height="20" transform="rotate(45 42.8087 38.6667)" fill="white"/>
                </Svg>

            </Animated.View>

            <Animated.View
                style = {[  
                    {
                    position: 'absolute',                    
                    width: sizeY,
                    height: sizeY,
                    borderRadius: sizeY/2,
                    borderWidth: borderWidth,
                    borderColor: 'white',
                },circle]}
            />
            

            {(appConfig.splash.welcome) &&
            <Animated.View
                style = {[{
                    position: 'absolute',
                    bottom: 200,
                }, hello]}
            >
            <Text
                style = {{
                    
                    color: 'white',
                    fontSize: 30,
                }}
            >
                {appConfig.user.name? `${Language[time]}, ${appConfig.user.name}!` : `${Language[time]}!`}
            </Text>
            </Animated.View> }
            </Animated.View>   
        </Animated.View>
    )
}

export default connect(mapStateToProps('SPLASH'), mapDispatchToProps('SPLASH'))(SplashY);