import React, { useState, useRef, useEffect } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import languagesAppList, { languagesApp } from "../../Languages";
import themesColorsAppList, { themesApp } from "../../Themes";
import dataRedactor from "../../async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch,
    BaseSlider 
} from "../../componets/base/BaseElements";

const borderRadiusValues = {min: 0, max: 32, step: 1}

export default BorderRadiusRedactor = ({
    appStyle,

    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    LanguageAppIndex   
}) => {
    const [sliderValueBasic, setSliderValueBasic] = useState(appStyle.borderRadius.basic);
    const [sliderValueAdditional, setSliderValueAdditional] = useState(appStyle.borderRadius.additional);

    const [synchronousSlider, setSynchronousSlider] = useState(appStyle.borderRadius.basic == appStyle.borderRadius.additional);

    const Thema = themesColorsAppList[ThemeColorsAppIndex]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.fillets

    const settingBorderRadius = (type, value, isComplete) =>{
        const newAppStyle = getNewAppStyleObject();
        if(type == "Basic" || synchronousSlider){
            isComplete? setSliderValueBasic(value) : null
            newAppStyle.borderRadius.basic = Number(value);
        }
        if(type == "Additional" || synchronousSlider){
            isComplete? setSliderValueAdditional(value) : null
            newAppStyle.borderRadius.additional = Number(value);
        }
        setPreviewAppStyle(newAppStyle);
    }

    const change = () =>{
        setSliderValueAdditional(sliderValueBasic)
        setSynchronousSlider(!synchronousSlider)     
    }

    return (
        <View
            style = {{

            }}
        >
        <View
            style = {{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Text
                style = {[staticStyles.adaptiveText, {color: Thema.neutrals.secondary}]}
            >
                {Language.synhronous} {Language.synhronousState[`${synchronousSlider}`]}
            </Text>
            <BaseSwitch
                size={24}
                style = {{
                    right: 20,
                }}
                trackStyle={{
                    borderRadius: appStyle.borderRadius.additional,
                }}
                thumbStyle = {{
                    borderRadius: appStyle.borderRadius.additional,
                    borderWidth: 3,
                    borderColor:  Thema.icons.accents[synchronousSlider?"primary":"quaternary"]
                }}
                colors={{
                    track: { 
                        false: Thema.icons.accents.quaternary, 
                        true: Thema.icons.accents.primary
                    },
                    thumb: { 
                        false: Thema.icons.neutrals.primary, 
                        true: Thema.icons.neutrals.primary,  
                    }
                }}
                primeValue={synchronousSlider}
                onChange={change}
            />
        </View>
        <View
            style = {{
                justifyContent: 'center',
                marginBottom: 10
            }}
        >
        {['Basic','Additional'].map((item, index)=>(
        <View
            key = {String('slider'+item)}
            style = {{marginTop: 20}}
        >
            <Text
                style = {[staticStyles.text, {color: Thema.neutrals.secondary}]}
            >
                {item === 'Basic'? Language.type.basic : Language.type.additional}
            </Text>
            <BaseSlider
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                signaturesStyle = {[staticStyles.signaturesText, {color: Thema.neutrals.tertiary}]}
                
                minimumValue={borderRadiusValues.min}
                maximumValue={borderRadiusValues.max}
                step = {borderRadiusValues.step}
                value = {item === 'Basic'? sliderValueBasic : sliderValueAdditional}
                onSlidingComplete = {(value)=>{settingBorderRadius(item, value, true)}}
                onValueChange = {(value)=>{settingBorderRadius(item, value, false)}}
                minimumTrackTintColor = {Thema.icons.accents.primary}
                maximumTrackTintColor = {Thema.icons.accents.quaternary}
                thumbTintColor = {Thema.icons.accents.primary}
            />
        </View>
        ))}
        </View>
    </View>)
}

const staticStyles = StyleSheet.create({
    text: {
        fontSize: 16, 
        fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    adaptiveText: {
        fontSize: 16, 
        fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5,
        textAlign: 'justify', 
        width: '70%'
    },
    signaturesText: {
        fontSize: 16, 
        fontVariant: ['small-caps'],
        fontWeight: '400',
        fontSize: 12,
    }
});