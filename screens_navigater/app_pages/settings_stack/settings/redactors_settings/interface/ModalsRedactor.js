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


import commonStaticStyles, { SwitchField, BoxsField } from "../CommonElements";

//const borderRadiusValues = {min: 0, max: 32, step: 1}
//import { borderRadiusValues } from "../../../../../app_values/AppDefault";

import { modalsHorizontalProximity } from "../../../../../../app_values/AppDefault";
import useLanguage from "../../../../../../app_hooks/useLanguage";

export default ModalsRedactor = (props) => {
    const {
        uiStyle,
        uiTheme,

        showAllSettings,

        tagStyle,

        r_uiStyle,
        Theme
    } = props

    const Language = useLanguage().SettingsScreen.Redactors.modals

    const params = Object.keys(r_uiStyle.modals.highlight) // ['outline', 'dimOutDark', 'gradient']
    //const paramsGroup =  Object.values(appStyle.modals.highlightMethods)
    
    const {
        modals: {
            highlight: highlightMethods
        }
    } = uiStyle

    const items = [Language.dimOutDark, Language.gradient, Language.outline, ]

    const hrz_proximity = useDerivedValue(()=>uiStyle.modals.proximity.h.value === 12)
    

    const highlight = useDerivedValue(()=>{
        const toIndexs = (group) => group.map((item, index)=> item.value? index : -1).filter(item => item >= 0)
        return toIndexs(Object.values(highlightMethods))
    })
    
    const changeHorizontalProximity = (value) => { 
        uiStyle.modals.proximity.h.value = value ? 12 : 0;
        tagStyle('modals.proximity.h')
    }

    const settingMethods = (indexs) => {   
        for (let i = 0; i < params.length; i++){
            uiStyle.modals.highlight[params[i]].value = indexs.includes(i)
            tagStyle('modals.highlight.'+params[i])
        }
    }

    return (<View style={{paddingBottom: 12}}>
        <SwitchField
            textTitle = {Language.horizontalProximity}
            textStates = {Language.horizontalProximityState}
            //text = {`${Language[`horizontalProximity`]} ${Language[`horizontalProximityState`][`${horizontalProximity}`]}`}
            aValue={hrz_proximity}
            onChange={changeHorizontalProximity}
            appStyle = {r_uiStyle}
            Theme = {Theme}
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
            appStyle = {r_uiStyle}
            Theme = {Theme}
        />
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});
