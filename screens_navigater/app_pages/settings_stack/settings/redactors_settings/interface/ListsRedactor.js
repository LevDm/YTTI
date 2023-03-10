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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


//const listsTextSize = {min: 10, max: 20, step: 1}
//const listsProximity = {min: 1, max: 5, step: 1}
import { listsTextSize, listsProximity } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, SliderField } from "../CommonElements";

export default ListsRedactor = ({
    appStyle,
    //setPreviewAppStyle,
    //getNewAppStyleObject,
    previewAppStyleA,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.lists

    const setPrewProximity = (value) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.lists.proximity = Number(value);
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }
    
    const fullWidthChange = (value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.lists.fullWidth = value;//!fullWidth;
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    const invertChange = (value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.lists.invertColorsHeader = value;//!invertColors;
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }


    return (
    <View 
        style={{
            //marginBottom: 30,
        }}
    >
        <SliderField
            title = {Language.proximity}
            signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
            minimumValue={listsProximity.min}
            maximumValue={listsProximity.max}
            step = {listsProximity.step}
            value = {appStyle.lists.proximity}
            onSlidingComplete = {setPrewProximity}
            onValueChange = {setPrewProximity}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <SwitchField
            textTitle = {Language.fullWidth}
            textStates = {Language.fullWidthState}
            //text = {`${Language.fullWidth} ${Language.fullWidthState[`${fullWidth}`]}`}
            primeValue={appStyle.lists.fullWidth}
            onChange={fullWidthChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <SwitchField
            textTitle = {Language.invertColorsHeader}
            textStates = {Language.invertColorsHeaderState}
            //text = {`${Language.invertColorsHeader} ${Language.invertColorsHeaderState[invertColors]}`}
            primeValue={appStyle.lists.invertColorsHeader}
            onChange={invertChange}
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