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

import languagesAppList, { languagesApp } from "../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../app_values/Themes";

import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch,
    BaseSlider 
} from "../../../../../general_components/base_components/BaseElements";

//const borderRadiusValues = {min: 0, max: 32, step: 1}
import { borderRadiusValues } from "../../../../../app_values/AppDefault";

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
        if(type == "basic" || synchronousSlider){
            isComplete? setSliderValueBasic(value) : null
            newAppStyle.borderRadius.basic = Number(value);
        }
        if(type == "additional" || synchronousSlider){
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
            <Text style = {[staticStyles.text, staticStyles.switchText, {color: Thema.texts.neutrals.secondary}]}>
                {Language.synhronous} {Language.synhronousState[`${synchronousSlider}`]}
            </Text>
            <View style={[staticStyles.verticalLine, {backgroundColor: Thema.icons.accents.tertiary}]}/>
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
            }}
        >
            {['basic','additional'].map((item, index)=>(
            <View
                key = {String('slider'+item)}
                style = {{marginTop: 15}}
            >
                <Text
                    style = {[staticStyles.text, {color: Thema.texts.neutrals.secondary}]}
                >
                    {Language.type[item]}
                </Text>
                <BaseSlider
                    signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                    signaturesStyle = {[staticStyles.signaturesText, {color: Thema.texts.neutrals.tertiary}]}
                    areaStyle = {{marginLeft: 60}}
                    minimumValue={borderRadiusValues.min}
                    maximumValue={borderRadiusValues.max}
                    step = {borderRadiusValues.step}
                    value = {item === 'basic'? sliderValueBasic : sliderValueAdditional}
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
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    adaptiveText: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5,
        textAlign: 'justify', 
        width: '70%'
    },
    signaturesText: {
        //fontVariant: ['small-caps'],
        fontWeight: '400',
        fontSize: 12,
    },
    switchText: {
        textAlign: 'justify', 
        width: '70%',
    },
    verticalLine: {
        height: 45,
        width: 1.5,
        marginRight: 10
    }
});
