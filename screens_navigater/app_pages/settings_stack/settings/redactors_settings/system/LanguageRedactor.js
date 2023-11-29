import React, {useState, useRef, useEffect, Component} from "react";

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
import dataRedactor from "../../../../../../app_async_data_manager/data_redactor";


import languagesAppList, { languagesApp } from "../../../../../../app_values/languages/Languages";


import commonStaticStyles, { SwitchField, BoxsField } from "../CommonElements";
import { useSelector } from "react-redux";

import { updateWeatherConfig } from "../../../../../../weather/api";

export default LanguageRedactor = (props) => {
    const {
        Theme,

        r_uiStyle,
        r_setAppLanguage
    } = props
    const appLanguage = useSelector((state)=>state.appLanguage)
    const storedIndex = useSharedValue(appLanguage.storedIndex)

    const weatherConfig = useSelector((state)=>state.weatherConfig)
    const weatherLanguageSetting = (letter) => {
        const copy = JSON.parse(JSON.stringify(weatherConfig))
        copy.requestLanguage = letter
        updateWeatherConfig(copy)
    }

    const languageSetting = (index) => {
        const newLanguage = JSON.parse(JSON.stringify(appLanguage));
        //newLanguage.updated = true
        newLanguage.letter = languagesApp[index]
        newLanguage.storedIndex = index
        storedIndex.value = index
        r_setAppLanguage(newLanguage)
        weatherLanguageSetting(languagesApp[index])
    }

    const getItems = () => {
        const items = []
        for(let i = 0; i< languagesApp.length; i++){
            items.push(languagesAppList[i].SettingsScreen.Redactors.languages.thisLanguage)
        }
        return items
    }


    
    return (
        <View style={{paddingBottom: 12}}>
            <BoxsField
                //  'one'>true || 'multiple'>false
                isChoiceOne={true}
                title = {false}
                //  'one'>index || 'multiple'>[indexs]
                aValue={storedIndex}
                groupSize = {languagesApp.length}
                groupItems = {getItems()}         
                onPress = {languageSetting}          
                appStyle = {r_uiStyle}
                Theme = {Theme}
            />
        </View>
    )
}   

const staticStyles = StyleSheet.create({
    ...commonStaticStyles
});
