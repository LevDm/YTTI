import React, { useState, useRef, useEffect, memo } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated, { useAnimatedReaction } from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    cancelAnimation,
    useDerivedValue,
    runOnJS,
    withTiming
} from 'react-native-reanimated';

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { 
    BasePressable,
    BaseBox,
    BaseSwitch,
    BaseSlider 
} from "../../../../../../general_components/base_components/BaseElements";

//const borderRadiusValues = {min: 0, max: 32, step: 1}
import { borderRadiusValues } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, SliderField } from "../CommonElements";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

export default BorderRadiusRedactor = (props) => {
    const {
        uiStyle,
        uiTheme,

        aStyle,
        aTheme, 
        aPalette, 
        aScheme,
       
        appStyle,

        tagStyle,
    
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex   
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.fillets

    const settingBorderRadius = (type, value) =>{
        uiStyle.borderRadius[type].value = Number(value);
        tagStyle('borderRadius.'+type)
    }

    return (
        <View
            style = {{
               
            }}
        >
            {['basic','additional'].map((item, index)=>(
            <SliderField
                key = {String('slider'+item)}
                title = {Language.type[item]}

                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                minimumValue={borderRadiusValues.min}
                maximumValue={borderRadiusValues.max}
                step = {borderRadiusValues.step}

                aValue = {uiStyle.borderRadius[item]}

                onValueChange = {(value)=>{settingBorderRadius(item, value)}}

                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
            ))}
        </View>
    )
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});
