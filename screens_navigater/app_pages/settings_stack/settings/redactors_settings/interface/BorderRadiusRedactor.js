import React, { useState, useRef, useEffect, memo } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated from "react-native-reanimated";
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

import { 
    BasePressable,
    BaseBox,
    BaseSwitch,
    BaseSlider 
} from "../../../../../../general_components/base_components/BaseElements";

//const borderRadiusValues = {min: 0, max: 32, step: 1}
import { borderRadiusValues } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, SliderField } from "../CommonElements";

export default BorderRadiusRedactor = ({
    appStyle,

    //previewAppStyle,
    //setPreviewAppStyle,

    previewAppStyleA,
    
    //getNewAppStyleObject,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex   
}) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.fillets

    const settingBorderRadius = (type, value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        if(type == "basic" ){
            //isComplete? setSliderValueBasic(value) : null
            newAppStyle.borderRadius.basic = Number(value);
        }
        if(type == "additional"){
            //isComplete? setSliderValueAdditional(value) : null
            newAppStyle.borderRadius.additional = Number(value);
        }
        newAppStyle.presetUsed = 'YTTI-custom';
        
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
        //setPreviewAppStyle(newAppStyle)
    }

    const basic = useDerivedValue(()=>previewAppStyleA.value.borderRadius.basic)
    const additional = useDerivedValue(()=>previewAppStyleA.value.borderRadius.additional)

    return (
        <View
            style = {{
                //marginBottom: 30,
                paddingBottom: 12
            }}
        >
            {['basic','additional'].map((item, index)=>(
            <SliderField
                key = {String('slider'+item)}
                //style = {{marginTop: 15}}

                title = {Language.type[item]}

                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                minimumValue={borderRadiusValues.min}
                maximumValue={borderRadiusValues.max}
                step = {borderRadiusValues.step}

                aValue = {item === 'basic'? basic : additional}

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
