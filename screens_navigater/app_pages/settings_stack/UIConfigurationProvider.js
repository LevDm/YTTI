import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppState, StyleSheet, SafeAreaView, View, Text, Appearance, Dimensions } from 'react-native';

import Reanimated, { cancelAnimation, runOnJS, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';


import Constants from "expo-constants";
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

import { connect } from 'react-redux';
import store from '../../../app_redux_files/store';
import mapStateToProps from "../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../app_redux_files/dispatchToProps";

import themesColorsAppList, { themesApp } from '../../../app_values/Themes';
import presets from '../../../app_values/AppDesigns';
import languagesAppList, { languagesApp } from "../../../app_values/Languages";

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SettingsWindow from './settings/Settings';

const getScheme = (listenerColorScheme, styleScheme, oldScheme) => {
    return  listenerColorScheme? (styleScheme == 'auto'? listenerColorScheme : styleScheme) : oldScheme
}

const UIConfigurationProvider = (props) => {
    const {
        appStyle,
        appConfig,
    } = props

    const aStyle = useSharedValue(appStyle)
    const aPalette = useSharedValue(themesColorsAppList[themesApp.indexOf(appStyle.palette.theme)])

    const listenerColorSheme = Appearance.getColorScheme()
    const ThemeSchema = getScheme(listenerColorSheme, appStyle.palette.scheme, ThemeSchema)

    const uiScheme = useSharedValue(ThemeSchema)

    Appearance.addChangeListener(({colorScheme})=>{
        const newScheme = getScheme(colorScheme, aStyle.value.palette.scheme, uiScheme.value)
        if(uiScheme.value != newScheme){uiScheme.value = newScheme}
    })

    const aTheme = useDerivedValue(()=>aPalette.value[uiScheme.value])

    const createSharedObject = (obj) => {
        const myObj = {}
        for(const key in obj){
            if(typeof obj[key] === "object"){
                myObj[key] = createSharedObject(obj[key])
            } else {
                myObj[key] = useSharedValue(obj[key])
            }
        }
        return myObj
    }

    const updateSharedObject = (obj, newObj) => {
        //console.log('upd', newObj)
        for(const key in newObj){
            if( typeof newObj[key] === "object"){
                //console.log('open', newObj)
                updateSharedObject(obj[key], newObj[key])
            } else {
                //console.log(key, ':::', obj[key].value, '=', newObj[key])
                obj[key].value = newObj[key] 
            }
        }
    }


    const ThemeColorsAppIndex = themesApp.indexOf(appStyle.palette.theme)
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    
    const statusBarStyle = useDerivedValue(()=>{
        return appStyle.palette.statusBar
    })
    
    

    useEffect(()=>{
    //NavigationBar.addVisibilityListener(({ visibility }) => {
        console.log('>uiProv--OS BAR', Theme?.basics.neutrals.tertiary, Theme?.statusBar)
        NavigationBar.setBackgroundColorAsync('#00000001'); //Theme?.basics.neutrals.tertiary
        NavigationBar.setButtonStyleAsync(Theme?.statusBar);
    //});
    }, [ThemeColorsAppIndex, ThemeSchema, ])
      

    const settings = useSharedValue({visible: 0, page: undefined})

    const closeSettingsWindow = () => {
        console.log('close_settings')
        settings.value = {visible: 0, page: undefined}
    }

    const openSettingsWindow = (page) => {
        settings.value = {visible: 1, page: undefined}
    }

    const updateScheme = (scheme) => {
        const newScheme = getScheme(listenerColorSheme, scheme, uiScheme.value)
        uiScheme.value = newScheme
        return newScheme
    }

    const updateFullTheme = (titleTheme, scheme) => {
        console.log('theme update', titleTheme, scheme)


        let themeScheme = uiScheme.value
        if(scheme != undefined){
            themeScheme = updateScheme(scheme)
        }

        if(titleTheme != undefined){
            const indexTheme = themesApp.indexOf( titleTheme == 'current'? uiStyle.palette.theme.value : titleTheme)
            if(indexTheme != 0){
                const newTheme = themesColorsAppList[indexTheme][themeScheme]
                updateSharedObject(uiTheme, newTheme)
                aPalette.value = themesColorsAppList[indexTheme]
            }
        }
    }

    const updateFullStyle = (indexPreset) => {
        if(indexPreset != 0){
            const newStyle = presets[indexPreset].options
            updateSharedObject(uiStyle, newStyle)

            updateFullTheme(newStyle.palette.theme)
        }
    }

    const tagStyle = (keys) => {
        //const keys = 'a.aa.aaa'
        //const shared = keys.split('.').reduce((acc, value)=>acc[value], uiStyle)
        //shared.value = value
        if(uiStyle.presetUsed.value != 'YTTI-custom'){
            console.log('TAG CUSTOM STYLE')
            uiStyle.presetUsed.value = 'YTTI-custom'
        }
    }

    const uiStyle = createSharedObject(appStyle)
    const uiTheme = createSharedObject(Theme)
    const uiCompositions = createSharedObject(appConfig)

    const userData = null

    const showAllSettings = appConfig.user.role == 'a'


    return (
        <GestureHandlerRootView style={[{flex: 1}]}>
            {(Array.isArray(props.children)? props.children : [props.children]).map((child, index) =>  
                (React.cloneElement(child, {       
                    key: String('ui_configuration_provider_child_'+index),  
                    windowState: settings,
                    openSettingsWindow: openSettingsWindow, 
                    closeWindow: closeSettingsWindow,

                    aStyle: aStyle,
                    aTheme: aTheme,

                    uiStyle: uiStyle,
                    uiTheme: uiTheme,
                    uiCompositions: uiCompositions,
                    uiScheme: uiScheme,
                    updateFullTheme: updateFullTheme,

                    ThemeColorsAppIndex: ThemeColorsAppIndex,
                    ThemeSchema: ThemeSchema,
                }))
            )}
            <RStatusBar 
                aStyle={statusBarStyle}    
            />
            <SettingsWindow
                windowState = {settings} 
                closeWindow={closeSettingsWindow}

                updateFullStyle={updateFullStyle}
                updateFullTheme={updateFullTheme}

                tagStyle = {tagStyle}

                uiStyle = {uiStyle}
                uiTheme = {uiTheme}
                uiScheme = {uiScheme}
                uiCompositions = {uiCompositions}
                aPalette = {aPalette}
                
                
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}

                showAllSettings={showAllSettings}
                //{...props}
            />
        </GestureHandlerRootView>
    )
}
export default connect(mapStateToProps('SETTINGS_SCREEN'), mapDispatchToProps('SETTINGS_SCREEN'))(UIConfigurationProvider);


const RStatusBar = (props) => {
    const {aStyle} = props
    const [ style, setStyle ] = useState(aStyle.value)
    useAnimatedReaction(()=>aStyle.value,(newValue)=>{runOnJS(setStyle)(newValue)})
    return (
        <StatusBar 
            style={style}
            hidden = {false}
            animated={true}
        />
    )
}
