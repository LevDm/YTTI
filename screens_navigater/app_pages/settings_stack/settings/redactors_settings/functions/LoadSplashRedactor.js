import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";
import dataRedactor from "../../../../../../app_async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseBox,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { SwitchField } from "../CommonElements";

export default LoadSplashRedactor = ({
    appStyle,
    //setAppStyle,
    //r_setAppStyle,

    //setPreviewAppStyle,
    //getNewAppStyleObject,

    //getNewAppConfigObject,
    appConfig,
    r_setAppConfig,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.loadAnimation

    const loadSplashShowSetting = (value) =>{
        const newAppConfig = JSON.parse(JSON.stringify(appConfig));
        newAppConfig.splash.show = value;//(!loadSplash);
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);
    }

    const welcomeUsedSetting = (value) => {
        const newAppConfig = JSON.parse(JSON.stringify(appConfig));
        newAppConfig.splash.welcome = value;// !welcomeUsed
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);
    }

    return (<>
    <SwitchField
        textTitle = {Language.show}
        textStates = {Language.showState}
        //text = {`${Language.show} ${Language.showState[`${loadSplash}`]}`}
        primeValue={appConfig.splash.show}
        onChange={loadSplashShowSetting}
        style={{
            //height: 60
        }}
        appStyle = {appStyle}
        ThemeColorsAppIndex = {ThemeColorsAppIndex}
        ThemeSchema = {ThemeSchema}
    />
    <View
        style = {{
            //flexDirection: 'row',
            justifyContent: 'center',   
            //alignItems: 'center',
            height: 60,
            //paddingLeft: !appConfig.splachScreenShow? 10 : 0
        }}
    >      
        <SwitchField
            textTitle = {Language.welcome}
            textStates = {Language.welcomeState}
            //text = {`${Language.welcome} ${Language.welcomeState[`${welcomeUsed}`]}`}
            primeValue={appConfig.splash.welcome}
            onChange={welcomeUsedSetting}
            style={{
                //height: 60,
                //flex: 1
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        {!appConfig.splash.show && 
        <View
            style = {{
                width: '90%',
                height: '100%',
                position: 'absolute',
                left: 20,
                //left: -5,
                backgroundColor: `${Theme.basics.neutrals.secondary}90`,
                //borderRadius: appStyle.borderRadius.additional
            }}
        />}
    </View>
    </>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});