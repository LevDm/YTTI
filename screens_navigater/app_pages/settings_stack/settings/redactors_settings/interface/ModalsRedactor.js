import React, { useState, useRef, useEffect } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    useDerivedValue,
    runOnJS,
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

import { modalsHorizontalProximity } from "../../../../../../app_values/AppDefault";

export default ModalsRedactor = (props) => {
    const {
        uiStyle,
        uiTheme,

        showAllSettings,

        tagStyle,

        aStyle,
        aTheme, 
        aPalette, 
        aScheme,

        appStyle,
        appConfig,
        redactorsSet,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.modals

    const params = Object.keys(appStyle.modals.highlightMethods) // ['outline', 'dimOutDark', 'gradient']
    //const paramsGroup =  Object.values(appStyle.modals.highlightMethods)
    

    const items = [Language.dimOutDark, Language.gradient, Language.outline, ]


    const highlight = useDerivedValue(()=>{
        const toIndexs = (group) => group.map((item, index)=> item.value? index : -1).filter(item => item >= 0)
        return toIndexs(Object.values(uiStyle.modals.highlightMethods))
    })
    
    const changeHorizontalProximity = (value) => { 
        uiStyle.modals.fullWidth.value = value;
        tagStyle('modals.fullWidth')
    }

    const settingMethods = (indexs) => {   
        for (let i = 0; i < params.length; i++){
            uiStyle.modals.highlightMethods[params[i]].value = indexs.includes(i)
            tagStyle('modals.highlightMethods.'+params[i])
        }
    }

    return (<View style={{paddingBottom: 12}}>
        <SwitchField
            textTitle = {Language.horizontalProximity}
            textStates = {Language.horizontalProximityState}
            //text = {`${Language[`horizontalProximity`]} ${Language[`horizontalProximityState`][`${horizontalProximity}`]}`}
            aValue={uiStyle.modals.fullWidth}
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
            aValue = {highlight}
            groupSize = {params.length}
            groupItems = {items}         
            onPress = {settingMethods}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});
