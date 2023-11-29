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


import { borderRadiusValues } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, SliderField } from "../CommonElements";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

import useLanguage from "../../../../../../app_hooks/useLanguage";

export default BorderRadiusRedactor = (props) => {
    const {
        uiStyle,

        appLanguage,
        r_uiStyle,

        tagStyle,
    
        Theme
  
    } = props


    const Language = useLanguage().SettingsScreen.Redactors.fillets

    const settingBorderRadius = (type, value) =>{
        uiStyle.borderRadius[type].value = Number(value);
        tagStyle('borderRadius.'+type)
    }

    return (
        <View
            style = {{
               
            }}
        >
            {['primary','secondary'].map((item, index)=>(
            <SliderField
                key = {String('slider'+item)}
                title = {Language.type[item]}

                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                minimumValue={borderRadiusValues.min}
                maximumValue={borderRadiusValues.max}
                step = {borderRadiusValues.step}

                aValue = {uiStyle.borderRadius[item]}

                onValueChange = {(value)=>{settingBorderRadius(item, value)}}

                appStyle = {r_uiStyle}
                Theme = {Theme}
            />
            ))}
        </View>
    )
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});
