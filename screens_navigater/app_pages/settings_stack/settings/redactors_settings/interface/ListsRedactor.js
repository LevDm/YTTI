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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


//const listsTextSize = {min: 10, max: 20, step: 1}
//const listsProximity = {min: 1, max: 5, step: 1}
import { listsTextSize, listsProximity } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, SliderField } from "../CommonElements";

export default ListsRedactor = (props) => {
    const {
        uiStyle,
        uiTheme,

        showAllSettings,

        tagStyle,

        aStyle,
        aTheme, 
        aPalette, 
        aScheme,

        appStyle,
        appConfig,
        redactorsSet,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.lists

    
    const setPrewProximity = (value) => {
        uiStyle.lists.proximity.value = Number(value);
        tagStyle('lists.proximity')
    }
    
    const fullWidthChange = (value) =>{
        uiStyle.lists.fullWidth.value = value;
        tagStyle('lists.fullWidth')
    }

    const invertChange = (value) =>{
        uiStyle.lists.invertColorsHeader.value = value;
        tagStyle('lists.invertColorsHeader')
    }

    return (
    <View 
        style={{
            
        }}
    >
        <SliderField
            viewProps={{style: {height: 72,}}}
            title = {Language.proximity}
            signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
            minimumValue={listsProximity.min}
            maximumValue={listsProximity.max}
            step = {listsProximity.step}
            aValue = {uiStyle.lists.proximity}
            //onSlidingComplete = {setPrewProximity}
            onValueChange = {setPrewProximity}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <SwitchField
            textTitle = {Language.fullWidth}
            textStates = {Language.fullWidthState}
            //text = {`${Language.fullWidth} ${Language.fullWidthState[`${fullWidth}`]}`}
            aValue={uiStyle.lists.fullWidth}
            onChange={fullWidthChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        {showAllSettings && 
        <SwitchField
            textTitle = {Language.invertColorsHeader}
            textStates = {Language.invertColorsHeaderState}
            //text = {`${Language.invertColorsHeader} ${Language.invertColorsHeaderState[invertColors]}`}
            aValue={uiStyle.lists.invertColorsHeader}
            onChange={invertChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />}
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
})