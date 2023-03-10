import React, { useState, useRef, useEffect, memo } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    cancelAnimation,
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

    //console.log('BR', basic, additional)

    const [sliderValueBasic, setSliderValueBasic] = useState(appStyle.borderRadius.basic);
    const [sliderValueAdditional, setSliderValueAdditional] = useState(appStyle.borderRadius.additional);

    useEffect(()=>{
        sliderValueBasic != appStyle.borderRadius.basic? setSliderValueBasic(appStyle.borderRadius.basic) : null
        sliderValueAdditional != appStyle.borderRadius.additional? setSliderValueAdditional(appStyle.borderRadius.additional) : null
    }, [appStyle])

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.fillets

    const settingBorderRadius = (type, value, isComplete) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        if(type == "basic" ){
            //isComplete? setSliderValueBasic(value) : null
            newAppStyle.borderRadius.basic = Number(value);
        }
        if(type == "additional"){
            //isComplete? setSliderValueAdditional(value) : null
            newAppStyle.borderRadius.additional = Number(value);
        }
        newAppStyle.presetUsed = 'YTAT-custom';
        
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
        //setPreviewAppStyle(newAppStyle)
    }

    const accepteer = () => {//path, value
        //const xx = {...JSON.parse(JSON.stringify(previewAppStyleA.value)), ...newAppStyle}


        //console.log(JSON.stringify(xx))
    }

    

    return (
        <View
            style = {{
                //marginBottom: 30,
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
                value = {item === 'basic'? appStyle.borderRadius.basic : appStyle.borderRadius.additional}
                onSlidingComplete = {(value)=>{settingBorderRadius(item, value, true)}}
                onValueChange = {(value)=>{settingBorderRadius(item, value, false)}}

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
