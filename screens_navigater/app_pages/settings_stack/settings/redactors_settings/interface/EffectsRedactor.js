import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { cancelAnimation } from "react-native-reanimated";

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

export default EffectsRedactor = ({
    appStyle,
    previewAppStyleA,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.effects


    const rippleSetting = (index) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.effects.ripple = rippleValues[index];
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    const shadowsSetting = (index) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.effects.shadows = shadowsValues[index];
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    };

    const [blur, setBlur] = useState(appStyle.effects.blur)
    const blurChange = () =>{
        //let newAppStyle = getNewAppStyleObject();
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.effects.blur = !blur;
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
        setBlur(!blur)
    }

    return (
    <View 
        style = {{
            //marginBottom: 30,
        }}
    >
        <BoxsField
            //  'one'>true || 'multiple'>false
            isChoiceOne={true}
            title = {Language.ripple}
            //  'one'>index || 'multiple'>[indexs]
            primaryValue = {rippleValues.indexOf(appStyle.effects.ripple)} 
            groupSize = {rippleValues.length}
            groupItems = {Language.ripples}         
            onPress = {(activeIndex)=>{rippleSetting(activeIndex)}}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <BoxsField
            //  'one'>true || 'multiple'>false
            isChoiceOne={true}
            title = {Language.shadows}
            //  'one'>index || 'multiple'>[indexs]
            primaryValue = {shadowsValues.indexOf(appStyle.effects.shadows)} 
            groupSize = {shadowsValues.length}
            groupItems = {Language.shadowsTypes}         
            onPress = {(activeIndex)=>{shadowsSetting(activeIndex)}}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <SwitchField
            text = {`${Language.blur} ${Language.blurState[blur]}`}
            primeValue={blur}
            onChange={blurChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
    </View>)
}

const staticStyles = StyleSheet.create({
    
    ...commonStaticStyles
});