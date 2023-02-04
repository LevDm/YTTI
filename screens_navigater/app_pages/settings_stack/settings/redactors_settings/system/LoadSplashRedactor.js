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
import dataRedactor from "../../../../../../async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseBox,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { SwitchField } from "../CommonElements";

export default LoadSplashRedactor = ({
    appStyle,
    setAppStyle,
    r_setAppStyle,

    setPreviewAppStyle,
    getNewAppStyleObject,

    getNewAppConfigObject,
    appConfig,
    r_setAppConfig,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {

    const [loadSplash, setLoadSplash] = useState(appConfig.splachScreenShow);
    
    const loadSplashShowSetting = () =>{
        //let newAppStyle = getNewAppStyleObject('currentStyle');
        //newAppStyle.splachLoadShow = (!loadSplash)
        //setAppStyle(newAppStyle)
        //dataRedactor("storedAppStyle", newAppStyle);
        //r_setAppStyle(newAppStyle)
        

        let newAppConfig = getNewAppConfigObject();
        newAppConfig.splachScreenShow = (!loadSplash);
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);
        setLoadSplash(!loadSplash)
    }

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.loadAnimation

    return (
    <SwitchField
        text = {`${Language.show} ${Language.showState[`${loadSplash}`]}`}
        primeValue={loadSplash}
        onChange={loadSplashShowSetting}
        style={{
            //height: 60
        }}
        appStyle = {appStyle}
        ThemeColorsAppIndex = {ThemeColorsAppIndex}
        ThemeSchema = {ThemeSchema}
    />
    )
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});