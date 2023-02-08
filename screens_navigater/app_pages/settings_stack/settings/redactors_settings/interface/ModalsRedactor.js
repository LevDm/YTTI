import React, { useState, useRef, useEffect } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    cancelAnimation
} from 'react-native-reanimated';

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";
import { 
    BasePressable,
    BaseBox,
    BaseSwitch,
    BaseSlider 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { SwitchField, BoxsField } from "../CommonElements";

//const borderRadiusValues = {min: 0, max: 32, step: 1}
//import { borderRadiusValues } from "../../../../../app_values/AppDefault";

export default ModalsRedactor = ({
    appStyle,

    setPreviewAppStyle,
    getNewAppStyleObject,

    previewAppStyleA,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex   
}) => {

    const [ horizontalProximity, setHorizontalProximity ] = useState(appStyle.modals.horizontalProximity == 0? true : false)

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.modals

    const params = Object.keys(appStyle.modals.highlightMethods) // ['outline', 'dimOutDark', 'gradient']
    const paramsGroup =  Object.values(appStyle.modals.highlightMethods)
    const toIndexs = (group) => {
        return group.map((item, index)=> item? index : -1).filter(item => item >= 0);
    }

    const items = [Language.outline, Language.dimOutDark, Language.gradient]
    
    const changeHorizontalProximity = () => {
        //const newAppStyle = getNewAppStyleObject();
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.modals.horizontalProximity = !horizontalProximity? 0 : 5
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle

        setHorizontalProximity(!horizontalProximity)
    }

    const settingMethods = (indexs) => {
        //const newAppStyle = getNewAppStyleObject();
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        for (let i = 0; i < params.length; i++){
            newAppStyle.modals.highlightMethods[params[i]] = indexs.includes(i)
        }            
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    return (<>
        <SwitchField
            text = {`${Language[`horizontalProximity`]} ${Language[`horizontalProximityState`][`${horizontalProximity}`]}`}
            primeValue={horizontalProximity}
            onChange={changeHorizontalProximity}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />

        <BoxsField
            //  'one'>true || 'multiple'>false
            isChoiceOne={false}
            title = {Language.highlightMethods}
            //  'one'>index || 'multiple'>[indexs]
            primaryValue = {toIndexs(paramsGroup)}
            groupSize = {params.length}
            groupItems = {items}         
            onPress = {(activeIndexs)=>{settingMethods(activeIndexs)}}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
    </>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});
