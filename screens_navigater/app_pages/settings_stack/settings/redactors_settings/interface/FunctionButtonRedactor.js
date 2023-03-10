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


//const sizeButton = {min: 40, max: 70, step: 5}
//const valuePosition = ['left','center','right']
import { sizeButton, valuePosition } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, SliderField, BoxsField } from "../CommonElements";

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
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.bobberButton

    //const [sliderValue, setSliderValue] = useState(appStyle.functionButton.size);

    const positionButtonSetting = (index) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.functionButton.position = valuePosition[index];
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    };

    const settingSizeButton = (value, isComplete) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        //isComplete? setSliderValue(value) : null
        newAppStyle.functionButton.size = Number(value);
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    //const [invertColors, setInvertColors] = useState(appStyle.functionButton.invertColors)

    const invertChange = (value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.functionButton.invertColors = value;//!invertColors;
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
        //setInvertColors(!invertColors)
    }

    //const [outline, setOutline] = useState(appStyle.functionButton.outline)

    const outlineChange = (value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.functionButton.outline = value;// !outline;
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
        //setOutline(!outline)
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
            title = {Language.position}
            //  'one'>index || 'multiple'>[indexs]
            primaryValue = {valuePosition.indexOf(appStyle.functionButton.position)} 
            groupSize = {valuePosition.length}
            groupItems = {Language.positions}         
            onPress = {(activeIndex)=>{positionButtonSetting(activeIndex)}}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <SliderField
            viewProps={{
                style: {
                    marginTop: 10,
                }
            }}
            
            title = {Language.size}
            signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
            minimumValue={sizeButton.min}
            maximumValue={sizeButton.max}
            step = {sizeButton.step}
            value = {appStyle.functionButton.size}
            onSlidingComplete = {(value)=>{settingSizeButton(value, true)}}
            onValueChange = {(value)=>{settingSizeButton(value, false)}}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <SwitchField
            textTitle = {Language.invertColors}
            textStates = {Language.invertColorsState}
            //text = {`${Language.invertColors} ${Language.invertColorsState[invertColors]}`}
            primeValue={appStyle.functionButton.invertColors}
            onChange={invertChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <SwitchField
            textTitle = {Language.outline}
            textStates = {Language.outlineState}
            //text = {`${Language.outline} ${Language.outlineState[outline]}`}
            primeValue={appStyle.functionButton.outline}
            onChange={outlineChange}
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