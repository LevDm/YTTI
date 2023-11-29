import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { AppState, StyleSheet, SafeAreaView, View, Text, Appearance, Dimensions, Alert } from 'react-native';

import Reanimated, { cancelAnimation, runOnJS, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';


import Constants from "expo-constants";
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

import { connect, useSelector } from 'react-redux';
import store from '../../../app_redux_files/store';
import mapStateToProps from "../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../app_redux_files/dispatchToProps";

import themesColorsAppList, { themesApp } from '../../../app_values/Themes';
import presets from '../../../app_values/AppDesigns';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SettingsWindow from './settings/Settings';

import dataRedactor from '../../../app_async_data_manager/data_redactor';

const getScheme = (listenerColorScheme, styleScheme, oldScheme) => {
    return  listenerColorScheme? (styleScheme == 'auto'? listenerColorScheme : styleScheme) : oldScheme
}

const fromSharedObject = (obj) => {
    'worklet'
    const newObj = {}
    for(const key in obj){
        if(obj[key].value != undefined){
            newObj[key] = obj[key].value
        } else {
            newObj[key] = fromSharedObject(obj[key])
        }
    }
    return newObj
}

const arrayEqual = (arr1, arr2) => arr1.join('|') === arr2.join('|')
const isValudObjKeys = (correctObj, checkableObj) => {
    //const stock = presets[0].options

    const correct = Object.keys(correctObj).sort()
    const checkable = Object.keys(checkableObj).sort()

    const primaryValid = arrayEqual(correct, checkable)
    if(!primaryValid){   
        console.log('NOT VALID', correct, checkable)     
        return false
    }
    let secondaryValid = true
    for(const key in correctObj){
        if(!Array.isArray(correctObj[key]) && typeof correctObj[key] === "object"){
            secondaryValid = secondaryValid && isValudObjKeys(correctObj[key], checkableObj[key])
        }
    }
    return secondaryValid
}


const checkUpdatedForSave = async (currentData) => {
    const r_store = store.getState()
    //console.log(r_store)
    //console.log('lang', currentData.appLanguage.letter, r_store.appLanguage.letter)

    const dispatchTypes = {
        appLanguage: 'SET_APP_LANGUAGE',
        style: 'SET_UI_STYLE',
        palette: 'SET_UI_PALETTE',
        composition: 'SET_UI_COMPOSITION'
    }

    const memoryStors = {
        ui: "storedUIConfiguration",
        user: "storedUser",
        weather: "storedWeather",
        tasks: "storedTasks"
    }

    const uiConfiguration = {
        appLanguage: r_store.appLanguage,
        style:  currentData.uiStyle,
        palette: currentData.uiPalette,
        composition: currentData.uiComposition
    }

    if(currentData.appLanguage.letter !=  r_store.appLanguage.letter){
        console.log('upd lang', currentData.appLanguage.letter, r_store.appLanguage.letter)
        //uiConfiguration.appLanguage = r_store.appLanguage
    }
    if(JSON.stringify(currentData.uiStyle) != JSON.stringify(r_store.uiStyle)){
        console.log('upd style')
        //uiConfiguration.style = currentData.uiStyle
    }
    if(JSON.stringify(currentData.uiComposition) != JSON.stringify(r_store.uiComposition)){
        console.log('upd composition')
        //uiConfiguration.composition = currentData.uiComposition
    }
    if(JSON.stringify(currentData.uiPalette) != JSON.stringify(r_store.uiPalette)){
        console.log('upd palette')
        //uiConfiguration.palette = currentData.uiPalette
    }

    if(JSON.stringify(currentData.userData) != JSON.stringify(r_store.userData)){
        console.log('upd user', currentData.userData, r_store.userData)
        dataRedactor("storedUser", r_store.userData)
    }

    

    if(Object.keys(uiConfiguration).length > 0){
        dataRedactor("storedUIConfiguration", uiConfiguration)
        for(const part in uiConfiguration){
            if(part != 'appLanguage'){
                store.dispatch({type: dispatchTypes[part], value: uiConfiguration[part]})
            }
        }
    }

    
}

const UIConfigurationProvider = memo((props) => {
    const {
        //appLanguage,
        r_uiStyle,
        r_uiPalette,
        r_uiComposition,
        //userData,

        r_setUiStyle,
        r_setUiComposition,
        r_setUiPalette,
        r_setAppLanguage,
        r_setUserData,

        children
    } = props
    
    //console.log('ui provider',r_uiComposition )

    const backupLanguage = useRef()//appLanguage
    const backupUserData = useRef()//userData


    const listenerColorSheme = Appearance.getColorScheme()
    const ThemeSchema = getScheme(listenerColorSheme, r_uiPalette.scheme, ThemeSchema)
    const uiScheme = useSharedValue(ThemeSchema)
    Appearance.addChangeListener(({colorScheme})=>{
        const newScheme = getScheme(colorScheme, r_uiPalette.scheme, uiScheme.value)
        if(uiScheme.value != newScheme){uiScheme.value = newScheme}
    })

    const Theme = r_uiPalette[ThemeSchema]


    const uiPalette = useSharedValue(r_uiPalette)


    const createSharedObject = (obj) => {
        const myObj = {}
        for(const key in obj){
            if(typeof obj[key] === "object" && !Array.isArray(obj[key])){
                myObj[key] = createSharedObject(obj[key])
            } else {
                myObj[key] = useSharedValue(obj[key])
            }
        }
        return myObj
    }


    const updateSharedObject = (obj, newObj, isAnimated = false) => {
        //console.log('upd', newObj)
        for(const key in newObj){
            if(typeof newObj[key] === "object"){
                //console.log('open', newObj)
                updateSharedObject(obj[key], newObj[key], isAnimated)
            } else {
                //console.log('updateSharedObject undef key', key,)
                cancelAnimation(obj[key])
                obj[key].value = isAnimated? withTiming(newObj[key], {duration: 160}) : newObj[key] 
            }
        }
    }


    const setShadowsStyle = (newStyle) => {
        updateSharedObject(uiStyle.effects.shadows, newStyle)
    }



    const updateBackups = () => {
        const r_store = store.getState()
        backupLanguage.current = r_store.appLanguage
        backupUserData.current = r_store.userData
    }

    
    useEffect(()=>{
        NavigationBar.setBackgroundColorAsync('#00000001');
        updateBackups()
    }, [])


    const settings = useSharedValue({visible: 0, page: undefined})


    const updateStarting = async () => {
        const c_uiStyle = fromSharedObject(uiStyle)
        const c_uiComposition = fromSharedObject(uiComposition)

        const current = {
            appLanguage: backupLanguage.current,
            userData: backupUserData.current,
            uiStyle: c_uiStyle,
            uiComposition: c_uiComposition,
            uiPalette: uiPalette.value
        }
        checkUpdatedForSave(current)
        updateBackups()
    }

    const getCurrentDesign = () => {
        const c_uiStyle = fromSharedObject(uiStyle)
        const desing = {
            palette: uiPalette.value,
            style: c_uiStyle
        }
        return JSON.stringify(desing)
    }



    const hideWindow = (pageIndex, frameCount = 2) => {
        if(settings.value.visible == 1){
            settings.value = {visible: 0, page: undefined}
            setTimeout(()=>{settings.value = {visible: 1, page: pageIndex}}, 12*frameCount)
        }
    }

    const updateCurrentDesign = (data) => {
        //console.log(JSON.stringify(data))
        const newPalette = data.palette
        newPalette.scheme = uiPalette.value.scheme
        uiPalette.value = newPalette
        updateSharedObject(uiStyle, data.style)
        updateSharedObject(uiTheme, newPalette[uiScheme.value])
    }

    const setLoadedDesign = (stringDataDesing) => {
        console.log('loadNewDesign')
        let data = {}
        let validation
        try {
            data = JSON.parse(stringDataDesing)
        } catch (e) {
            alert(`QR-code reading error`);
            return
        } 
            
        if(data.style && data.palette){
            const validationStyle = isValudObjKeys(r_uiStyle, data.style)
            const validationPalette = isValudObjKeys(uiPalette.value, data.palette)
            console.log('valid', 'style=', validationStyle, 'palette=', validationPalette)
            validation = validationStyle && validationPalette
            if(validation){
                updateCurrentDesign(data)
                return validation
            } else {
                alert(`QR-code validation error: palette ${validationPalette}, style ${validationStyle}`);
            }
        } else {
            alert(`QR-code сontent error`);
        }
        return
    }


    const closeSettingsWindow = () => {
        settings.value = {visible: 0, page: undefined}
        setTimeout(updateStarting, 48)
    }


    const openSettingsWindow = (page) => {
        if(settings.value.visible == 0){
            settings.value = {visible: 1, page: undefined}
        } else {
            closeSettingsWindow()
        }
    }


    const updateWindowScheme = () => {
        if(settings.value.visible == 1){
            settings.value = {visible: 0, page: undefined}
            const schemePageIndex = 6
            setTimeout(()=>{settings.value = {visible: 1, page: schemePageIndex}}, 24)
        }
    }


    const updateScheme = (scheme) => {
        const newScheme = getScheme(listenerColorSheme, scheme, uiScheme.value)
        uiScheme.value = newScheme
        const copy = JSON.parse(JSON.stringify(uiPalette.value))
        copy.scheme = scheme
        cancelAnimation(uiPalette)
        uiPalette.value = copy 
        setTimeout(updateWindowScheme, 24)
        return newScheme
    }


    const updateFullTheme = (titleTheme, scheme, isAnimated = false) => {
        console.log('theme update', titleTheme, scheme)
        let themeScheme = uiScheme.value
        if(scheme != undefined){
            themeScheme = updateScheme(scheme)
        }

        if(titleTheme != undefined){
            const indexTheme = themesApp.indexOf( titleTheme == 'current'? uiStyle.palette.value : titleTheme)
            if(indexTheme != 0){
                const newPalette = JSON.parse(JSON.stringify(themesColorsAppList[indexTheme]))
                const pScheme = scheme?? uiPalette.value.scheme
                newPalette.scheme = pScheme
                //console.log(newPalette, pScheme)
                uiPalette.value = newPalette

                const newTheme = themesColorsAppList[indexTheme][themeScheme]
                updateSharedObject(uiTheme, newTheme, isAnimated)
            } else {
                updateSharedObject(uiTheme, uiPalette.value[themeScheme], isAnimated)
            }
        }
    }


    const updateFullStyle = (indexPreset, ignored = []) => {
        if(indexPreset != 0){
            const newStyle = presets[indexPreset].options
            //console.log("updateFullStyle")

            //console.log(newStyle)
           // console.log(JSON.stringify(uiStyle.effects.shadows.design.value))

            ignored.map((param)=>{
                newStyle[param] = fromSharedObject(uiStyle[param])
            })

            updateSharedObject(uiStyle, newStyle)
            updateFullTheme(newStyle.palette)
        }
    }


    const tagStyle = (keys) => {
        if(uiStyle.presetUsed.value != 'YTTI-custom'){
            console.log('TAG CUSTOM STYLE')
            uiStyle.presetUsed.value = 'YTTI-custom'
        }
    }


    const uiStyle = createSharedObject(r_uiStyle)
    const uiTheme = createSharedObject(Theme)
    const uiComposition = createSharedObject(r_uiComposition)

    const showAllSettings = true //appConfig.user.role == 'a'

    const childRender = () => {
        return (
            Array.isArray(children)? children : [children]).map((child, index) => (
                React.cloneElement(child, {       
                    key: String('ui_configuration_provider_child_'+index),  
                    windowState: settings,
                    openSettingsWindow: openSettingsWindow, 
                    closeWindow: closeSettingsWindow,

                    uiStyle: uiStyle,
                    uiTheme: uiTheme,
                    uiComposition: uiComposition,
                    uiScheme: uiScheme,
                    updateFullTheme: updateFullTheme,
                })
            )
        )
    }


    return (
        <GestureHandlerRootView style={[{flex: 1}]}>
            {childRender()}
            <RStatusBar 
                uiTheme = {uiTheme}  
            />
            <SettingsWindow
                windowState = {settings} 
                closeWindow={closeSettingsWindow}

                updateFullStyle={updateFullStyle}
                updateFullTheme={updateFullTheme}
                setShadowsStyle={setShadowsStyle}

                tagStyle = {tagStyle}

                uiStyle = {uiStyle}
                uiTheme = {uiTheme}
                uiScheme = {uiScheme}
                uiComposition = {uiComposition}
                uiPalette = {uiPalette}

                showAllSettings={showAllSettings}

                getCurrentDesign={getCurrentDesign}
                setLoadedDesign={setLoadedDesign}
                //{...props}
            />
        </GestureHandlerRootView>
    )
}, //
    (prev, next)=>{ 
        //console.log('prev', prev)
        //console.log('next', next)
        const isEqual = (item_1, item_2) => JSON.stringify(item_1) == JSON.stringify(item_2)
        const isEqualProps =( 
            isEqual(prev.r_uiComposition, next.r_uiComposition) 
            && isEqual(prev.r_uiPalette, next.r_uiPalette)
            && isEqual(prev.r_uiStyle, next.r_uiStyle)
        )
        return isEqualProps
    }
)
export default connect(mapStateToProps('UI_PROVIDER'), mapDispatchToProps('SETTINGS'))(UIConfigurationProvider);



const RStatusBar = (props) => {
    const {
        uiTheme
    } = props

    const {
        basics: {
            accents: {
                primary: headerColor
            }
        }
    } = uiTheme


    const getContrast = (color) => {
        'worklet'

        let r = 0, g = 0, b = 0, alfa
        if( color.slice(0,4) == 'rgba'){
            const rgba = (color.replace('rgba', '').replace('(', '').replaceAll(' ', '').replace(')', '')).split(',')
            r = rgba[0]
            g = rgba[1]
            b = rgba[2]
            alfa = rgba[3]
        } else {
            if (color.length == 4) {
                r = "0x" + color[1] + color[1];
                g = "0x" + color[2] + color[2];
                b = "0x" + color[3] + color[3];
            } else if (color.length == 7) {
                r = "0x" + color[1] + color[2];
                g = "0x" + color[3] + color[4];
                b = "0x" + color[5] + color[6];
            } else if (color.length > 7) {
                alfa = "0x"+color.slice(7)
                alfa /= 255
                return alfa > 0.5? "light" : 'dark'
            }
        }
  
        
        
        r /= 255;
        g /= 255;
        b /= 255;
      
        const count = (coef) => ((coef+0.055)/1.055)**2.4 
        
        let contr = count(r)+count(g)+count(b)
      
        return contr <= 0.5? 'light' : 'dark'
    }

    const [ style, setStyle ] = useState('auto')
    useAnimatedReaction(()=>getContrast(headerColor.value),
        (newValue, oldValue)=>{
            //onsole.log(headerColor.value, newValue)
            if(newValue != oldValue){    
                runOnJS(setStyle)(newValue)
            }
        }
    )
    return (
        <StatusBar 
            style={style}
            hidden = {false}
            animated={true}
        />
    )
}
