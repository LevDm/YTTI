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

export default EffectsRedactor = (props) => {
    const {
        uiStyle,
        uiTheme,

        showAllSettings,

        aStyle,
        aTheme, 
        aPalette, 
        aScheme,

        tagStyle,

        appStyle,
        appConfig,
        redactorsSet,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.effects

    const shadowsSetting = (index) => {
        uiStyle.effects.shadows.value = shadowsValues[index];
        tagStyle('effects.shadows')
    }

    
    const blurChange = (value) =>{
        uiStyle.effects.blur.value = value;
        tagStyle('effects.blur')
    }
    
    const shadows = useDerivedValue(()=>shadowsValues.indexOf(uiStyle.effects.shadows.value))


    const ShadowItem = (accentState, index) =>{
        return (
            <View
                style = {{
                    //width: '75%',
                    height: 26,
                    width: 200,
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
                    initSize = {{height: 26, width: 200}}
                />
                <Text style = {[commonStaticStyles.listText, {color: Theme.texts.neutrals.secondary}]}>{Language.shadowsTypes[index]}</Text> 
            </View>
        )
    }

    return (
    <View 
        style = {{

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
            onPress = {shadowsSetting}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        {showAllSettings && <>
        <SwitchField
            textTitle = {Language.blur}
            textStates = {Language.blurState}
            //primeValue={blur}
            aValue = {uiStyle.effects.blur}
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
                //width: '85%',
                marginHorizontal: 8
            }}
        >
           {Language.warningBlur}
        </Text></>}
    </View>)
}

const staticStyles = StyleSheet.create({
    
    ...commonStaticStyles
});