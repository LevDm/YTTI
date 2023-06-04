import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Reanimated, { withTiming, cancelAnimation, useDerivedValue, runOnJS, useAnimatedStyle } from "react-native-reanimated";

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
import { sizeButton, positionFAB } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, SliderField, BoxsField } from "../CommonElements";

export default ListsRedactor = ({
    appStyle,
    appConfig,
    //setPreviewAppStyle,
    //getNewAppStyleObject,

    previewAppStyleA,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.bobberButton


    const position = useDerivedValue(()=>positionFAB.indexOf(previewAppStyleA.value.functionButton.position))
    const size = useDerivedValue(()=>previewAppStyleA.value.functionButton.size)
    const invertColors = useDerivedValue(()=>previewAppStyleA.value.functionButton.invertColors)
    const outline = useDerivedValue(()=>previewAppStyleA.value.functionButton.outline)
    const disabledShadows = useDerivedValue(()=>previewAppStyleA.value.functionButton.ignoredShadows.disable)
    //const signatures = useDerivedValue(()=>previewAppStyleA.value.functionButton.topSignatures)
    

    const positionButtonSetting = (index) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.functionButton.position = positionFAB[index];
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    };

    const settingSizeButton = (value, isComplete) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        //isComplete? setSliderValue(value) : null
        newAppStyle.functionButton.size = Number(value);
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    const signaturesChange = (value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.functionButton.topSignatures = value;
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    const disableChange = (value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.functionButton.ignoredShadows.disable = value;
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    const invertChange = (value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.functionButton.invertColors = value;//!invertColors;
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
        //setInvertColors(!invertColors)
    }


    const outlineChange = (value) =>{
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.functionButton.outline = value;// !outline;
        newAppStyle.presetUsed = 'YTTI-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
        //setOutline(!outline)
    }

    const tingDuration = 300
    const blind = useAnimatedStyle(()=>{
        return {
            height: withTiming(position.value == 3? '100%' : '0%', {duration: tingDuration})
        }
    })

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
            title = {Language.position}
            //  'one'>index || 'multiple'>[indexs]
            //primaryValue = 
            aValue={position}
            groupSize = {positionFAB.length}
            groupItems = {Language.positions}         
            onPress = {(activeIndex)=>{positionButtonSetting(activeIndex)}}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <View style={{height: appConfig.user.role == 'a'? 220 : 80}}>
        
        <SliderField
            title = {Language.size}
            signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
            minimumValue={sizeButton.min}
            maximumValue={sizeButton.max}
            step = {sizeButton.step}
            aValue = {size}
            onSlidingComplete = {(value)=>{settingSizeButton(value, true)}}
            onValueChange = {(value)=>{settingSizeButton(value, false)}}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        {appConfig.user.role == 'a' && 
        <SwitchField
            textTitle = {Language.invertColors}
            textStates = {Language.invertColorsState}
            //text = {`${Language.invertColors} ${Language.invertColorsState[invertColors]}`}
            aValue={invertColors}
            onChange={invertChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />}
        {appConfig.user.role == 'a' && 
        <SwitchField
            textTitle = {Language.disabledShadows}
            textStates = {Language.disabledShadowsState}
            //text = {`${Language.invertColors} ${Language.invertColorsState[invertColors]}`}
            aValue={disabledShadows}
            onChange={disableChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />}
        {appConfig.user.role == 'a' && 
        <SwitchField
            textTitle = {Language.outline}
            textStates = {Language.outlineState}
            //text = {`${Language.outline} ${Language.outlineState[outline]}`}
            aValue={outline}
            onChange={outlineChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />}

        <Reanimated.View 
            style = {[{
                position: 'absolute',
                //height: '100%', 
                minHeight : 1,
                width: '94%', 
                left: 12, 
                backgroundColor: `${Theme.basics.neutrals.secondary}90`
            }, blind]}
        />

        {false && // position top
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
        >
        <SwitchField
            textTitle = {Language.signatures}
            textStates = {Language.signaturesState}
            //text = {`${Language.fullWidth} ${Language.fullWidthState[`${fullWidth}`]}`}
            aValue={signatures}
            onChange={signaturesChange}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        </Reanimated.View>}
        </View>
    </View>)
}

const staticStyles = StyleSheet.create({
    
    ...commonStaticStyles
});