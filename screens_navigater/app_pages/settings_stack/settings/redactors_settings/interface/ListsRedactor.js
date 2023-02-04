import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

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
    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.lists


    const [sliderTextSizeValue, setSliderTextSizeValue] = useState(appStyle.lists.textSize);

    const setPrewTextSize = (value) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.lists.textSize = Number(value);
        setPreviewAppStyle(newAppStyle);
    }

    const [sliderProximityValue, setSliderProximityValue] = useState(appStyle.lists.proximity);

    const setPrewProximity = (value) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.lists.proximity = Number(value);
        setPreviewAppStyle(newAppStyle);
    }


    const [fullWidth, setFullWidth] = useState(appStyle.lists.fullWidth);
    
    const fullWidthChange = () =>{
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.lists.fullWidth = !fullWidth;
        setPreviewAppStyle(newAppStyle);
        setFullWidth(!fullWidth)
    }

    const [shadowUse, setShadowUse] = useState(appStyle.lists.shadow);
    
    const shadowChange = () =>{
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.lists.shadow = !shadowUse;
        setPreviewAppStyle(newAppStyle);
        setShadowUse(!shadowUse)
    }


    return (
    <View 
        style={{
            //marginBottom: 30,
        }}
    >
        <SliderField
            title = {Language.textSize}
            signaturesText = {{left: Language.slider.min, right: Language.slider.max}}      
            minimumValue={listsTextSize.min}
            maximumValue={listsTextSize.max}
            step = {listsTextSize.step}
            value = {sliderTextSizeValue}
            onSlidingComplete = {(value)=>{                 
                setSliderTextSizeValue(value);
                setPrewTextSize(value);
            }}
            onValueChange = {(value)=>{              
                setPrewTextSize(value);
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <SliderField
            title = {Language.proximity}
            signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
            minimumValue={listsProximity.min}
            maximumValue={listsProximity.max}
            step = {listsProximity.step}
            value = {sliderProximityValue}
            onSlidingComplete = {(value)=>{                 
                setSliderProximityValue(value);
                setPrewProximity(value);
            }}
            onValueChange = {(value)=>{              
                setPrewProximity(value);
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <SwitchField
            text = {`${Language.fullWidth} ${Language.fullWidthState[`${fullWidth}`]}`}
            primeValue={fullWidth}
            onChange={fullWidthChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <SwitchField
            text = {`${Language.shadows} ${Language.shadowsState[`${shadowUse}`]}`}
            primeValue={shadowUse}
            onChange={shadowChange}
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