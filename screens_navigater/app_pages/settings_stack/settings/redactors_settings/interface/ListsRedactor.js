import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';


import { cancelAnimation, useDerivedValue, runOnJS } from "react-native-reanimated";


import { LinearGradient } from 'expo-linear-gradient';
import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


//const listsTextSize = {min: 10, max: 20, step: 1}
//const listsProximity = {min: 1, max: 5, step: 1}
import { listsTextSize, listsProximity } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, SliderField } from "../CommonElements";

import useLanguage from "../../../../../../app_hooks/useLanguage";


export default ListsRedactor = (props) => {
    const {
        uiStyle,
        uiTheme,

        showAllSettings,

        tagStyle,

        r_uiStyle,
        Theme
    } = props

    const Language = useLanguage().SettingsScreen.Redactors.lists

    const hrz_proximity = useDerivedValue(()=>uiStyle.lists.proximity.h.value === 12)
    
    const setPrewProximity = (value) => {
        uiStyle.lists.proximity.v.value = Number(value);
        tagStyle('lists.proximity.v')
    }
    
    const fullWidthChange = (value) =>{
        uiStyle.lists.proximity.h.value = value? 12 : 0;
        tagStyle('lists.proximity.h')
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
            aValue = {uiStyle.lists.proximity.v}
            //onSlidingComplete = {setPrewProximity}
            onValueChange = {setPrewProximity}
            appStyle = {r_uiStyle}
            Theme = {Theme}
        />
        <SwitchField
            textTitle = {Language.fullWidth}
            textStates = {Language.fullWidthState}
            //text = {`${Language.fullWidth} ${Language.fullWidthState[`${fullWidth}`]}`}
            aValue={hrz_proximity}
            onChange={fullWidthChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {r_uiStyle}
            Theme = {Theme}
        />
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
})