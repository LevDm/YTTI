import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { cancelAnimation, useDerivedValue, runOnJS } from "react-native-reanimated";

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";
import { 
    BasePressable,
    BaseBox,
    BaseSlider,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";

import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

import { rippleValues, shadowsValues } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, BoxsField } from "../CommonElements";
import SkiaViewDisign from "../../../../../../general_components/base_components/SkiaViewDisign";

export default EffectsRedactor = ({
    appStyle,
    appConfig,
    previewAppStyleA,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.effects

    const shadows = useDerivedValue(()=>shadowsValues.indexOf(previewAppStyleA.value.effects.shadows))
    const ripples = useDerivedValue(()=>rippleValues.indexOf(previewAppStyleA.value.effects.ripple))
    const blur = useDerivedValue(()=>previewAppStyleA.value.effects.blur)


    const rippleSetting = (index) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.effects.ripple = rippleValues[index];
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    const shadowsSetting = (index) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.effects.shadows = shadowsValues[index];
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    
    const blurChange = (value) =>{
        //let newAppStyle = getNewAppStyleObject();
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.effects.blur = value;//!blur;
        newAppStyle.presetUsed = 'YTTI-custom';
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
        //setBlur(!blur)
    }

    const ShadowItem = (accentState, index) =>{
        return (
            <View
                style = {{
                    width: '75%',
                    height: 40,
                    //flexDirection: 'row',
                    //justifyContent: 'space-between',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <SkiaViewDisign 
                    borderRadius = {appStyle.borderRadius.basic}
                    backgroundColor = {Theme.basics.neutrals.secondary}
                    shadowColors = {Theme.specials.shadow}
                    shadowMargin={{horizontal: 5, vertical: 5}}
                    shadowStyle = {shadowsValues[index]}
                    adaptiveSizeForStyle={false}
                    innerShadow={{
                        used: true,
                        borderWidth: 2
                    }}
                />
                <Text style = {[commonStaticStyles.listText, {color: Theme.texts.neutrals.secondary}]}>{Language.shadowsTypes[index]}</Text> 
            </View>
        )
    }

    return (
    <View 
        style = {{
            //marginBottom: 30,
            paddingBottom: 12
        }}
    >
        <BoxsField
            //  'one'>true || 'multiple'>false
            isChoiceOne={true}
            title = {Language.shadows}
            //  'one'>index || 'multiple'>[indexs]
            //primaryValue = {shadows} 
            aValue={shadows}
            groupSize = {shadowsValues.length}
            groupItems = {Language.shadowsTypes}   
            Item = {ShadowItem}
            onPress = {(activeIndex)=>{shadowsSetting(activeIndex)}}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        {appConfig.user.role == 'a' && 
        <BoxsField
            //  'one'>true || 'multiple'>false
            isChoiceOne={true}
            title = {Language.ripple}
            //  'one'>index || 'multiple'>[indexs]
            //primaryValue = {ripples} 
            aValue={ripples}
            groupSize = {rippleValues.length}
            groupItems = {Language.ripples}         
            onPress = {(activeIndex)=>{rippleSetting(activeIndex)}}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />}
        {appConfig.user.role == 'a' && <>
        <SwitchField
            textTitle = {Language.blur}
            textStates = {Language.blurState}
            //primeValue={blur}
            aValue = {blur}
            onChange={blurChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <Text 
            style={{
                color: Theme.texts.neutrals.tertiary,
                fontSize: 10,
                width: '85%',
                marginLeft: 30
            }}
        >
           {Language.warningBlur}
        </Text></>}
    </View>)
}

const staticStyles = StyleSheet.create({
    
    ...commonStaticStyles
});