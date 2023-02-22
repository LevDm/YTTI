import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

//import LanguagesAppList, {languagesApp} from "../../../../../language/language";
//import ThemesColorsAppList, {themesApp} from "../../../../../styles/ColorsApp";
import dataRedactor from "../../../../../../async_data_manager/data_redactor";


import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";

import { 
    BasePressable,
    BaseBox,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { SwitchField, BoxsField } from "../CommonElements";

export default LanguageRedactor = ({
    appStyle,
    //setAppStyle,

    appConfig,
    r_setAppConfig,

    //r_setLanguageApp,
    //getNewAppStyleObject,
    getNewAppConfigObject,
    //LanguageStore,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.languages

    const languageSetting = (index) => {
        //let newAppConfig = getNewAppConfigObject();
        const newAppConfig = JSON.parse(JSON.stringify(appConfig));
        newAppConfig.languageApp = languagesApp[index];
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);
    };

    const getItems = () => {
        const items = []
        for(let i = 0; i< languagesApp.length; i++){
            items.push(languagesAppList[i].SettingsScreen.Redactors.languages.thisLanguage)
        }
        return items
    }
    
    return (<>
        <BoxsField
            //  'one'>true || 'multiple'>false
            isChoiceOne={true}
            title = {false}
            //  'one'>index || 'multiple'>[indexs]
            primaryValue = {LanguageAppIndex} 
            groupSize = {languagesApp.length}
            groupItems = {getItems()}         
            onPress = {(activeIndex)=>{languageSetting(activeIndex)}}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
    </>)
}

const staticStyles = StyleSheet.create({
    ...commonStaticStyles
});