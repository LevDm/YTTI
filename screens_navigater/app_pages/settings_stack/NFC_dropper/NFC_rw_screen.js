import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
    Appearance, 
    StyleSheet, 
    Text,
    Button, 
    Pressable,
    TextInput, 
    FlatList, 
    SectionList,
    View, 
    Dimensions,
    ToastAndroid,
    Keyboard,
    BackHandler 
} from 'react-native';
import Constants from "expo-constants";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay,
    withSequence, 
    useAnimatedScrollHandler,
    useAnimatedProps, 
    cancelAnimation,
    useAnimatedRef,
    useDerivedValue,
    scrollTo,
    runOnJS,
    interpolateColor,
    interpolate,
    Extrapolate,
    runOnUI,
    Easing,
    Extrapolation 
} from 'react-native-reanimated';

import dataRedactor from "../../../../app_async_data_manager/data_redactor";

import store from "../../../../app_redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../../app_redux_files/dispatchToProps";

import { BasePressable, BaseTextInput } from "../../../../general_components/base_components/BaseElements";

import themesColorsAppList, { themesApp } from "../../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../../app_values/Languages";


import "./Outlet";
import NFC_test from "./test_0";
import NfcPromptAndroid from "./Modal";

const NFC_Screen = (props) => {

    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.palette.theme));//LanguagesAppList[LanguageAppIndex]
  
    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [ThemeSchema, setThemeSchema] = useState(props.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : props.appStyle.palette.scheme)
    const [appConfig, setAppConfig] = useState(props.appConfig);
  
    store.subscribe(() => {
      const jstore = store.getState();
  
      if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
        setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
      }
  
      if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.palette.theme)){
        setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.palette.theme));
      }
  
      if(ThemeSchema != jstore.appStyle.palette.scheme){
        setThemeSchema(jstore.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.palette.scheme);
      }
  
      if(JSON.stringify(appStyle) != JSON.stringify(jstore.appStyle)){
        setAppStyle(jstore.appStyle);
      }
  
      if(JSON.stringify(appConfig) != JSON.stringify(jstore.appConfig)){
        setAppConfig(jstore.appConfig);
      }
    })
  
    const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
    useEffect(()=>{
      if(listenerColorSheme){
        if(appStyle.palette.scheme == 'auto' && listenerColorSheme != ThemeSchema){
          //console.log('pallete accept new color sheme', listenerColorSheme, 'used shema', appStyle.palette.scheme)
          setThemeSchema(listenerColorSheme)
        }
      }
    },[listenerColorSheme])
    
    Appearance.addChangeListener(({colorScheme})=>{
      setListinerColorScheme(colorScheme)
    })
  
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.NFCScreen

  
    useEffect(() => {
      const backAction = () => {
        back()
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, []);
  
    const exit = () => {
      console.log('exit')
      props.r_setHideMenu(false)
      props.navigation.goBack()
    }

    return (
        <View
            style ={{
            width: '100%',
            paddingTop: statusBarHeight,
            height: statusBarHeight+45+35,
            backgroundColor: 'black',   
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            borderBottomWidth: 2,
            borderColor: 'white'
            }}
        >
            <View
                style ={{
                    width: deviceWidth/2,
                    height: 45,
                    paddingHorizontal: 3
                }}
            >
            <View
                style = {{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',                    
                }}
            >
                <BasePressable
                    type='i'
                    icon={{name: "keyboard-backspace", size: 24, color: 'white' }}
                    style={{
                        height: 45, 
                        width: 45,
                        paddingTop: 4,
                        marginLeft: 15,
                        borderRadius: 22.5//appStyle.borderRadius.additional
                    }}
                    onPress={exit}
                    android_ripple={{
                        color: 'white',
                        borderless: true,
                        foreground: false
                    }}
                    />
                <Text
                    style = {[staticStyles.headerText, {
                        left: 0,
                        color: 'white'
                    }]}
                >
                    {Language.title}
                </Text>
            </View>
            </View>
            <NFC_test {...props}/>
            <NfcPromptAndroid />
        </View>
    )
}
export default connect(mapStateToProps('NFC_SCREEN'), mapDispatchToProps('NFC_SCREEN'))(NFC_Screen);


const staticStyles = StyleSheet.create({
    headerText: {
      fontSize: 20,
      fontWeight: '500',
      letterSpacing: 0.5,
      fontVariant: ['small-caps'],
    },
})
