import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Reanimated, { withTiming, cancelAnimation, useDerivedValue, runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

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
import { sizeButton, positionFAB, FAB_bottomPosition } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, SliderField, BoxsField } from "../CommonElements";

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
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.bobberButton


    
    const settingBottomPosition = (value) =>{
        uiStyle.functionButton.bottomPosition.value = Number(value);
        tagStyle('functionButton.bottomPosition')
    }
    
    const positionButtonSetting = (index) => {
        uiStyle.functionButton.position.value = positionFAB[index];
        tagStyle('functionButton.position')
    };

    const settingSizeButton = (value) =>{
        uiStyle.functionButton.size.value = Number(value);
        tagStyle('functionButton.size')
    }

    const disableChange = (value) =>{
        uiStyle.functionButton.ignoredShadows.disable.value = value;
        tagStyle('functionButton.ignoredShadows.disable')
    }

    const invertChange = (value) =>{
        uiStyle.functionButton.invertColors.value = value;
        tagStyle('functionButton.invertColors')
    }

    const outlineChange = (value) =>{
        uiStyle.functionButton.outline.value = value;
        tagStyle('functionButton.outline')
    }

    const position = useDerivedValue(()=>positionFAB.indexOf(uiStyle.functionButton.position.value))

    const blind = useAnimatedStyle(()=>{
        const tingDuration = 150
        return {
            height: withTiming(position.value == 0? '100%' : '0%', {duration: tingDuration})
        }
    })

    
    return (
    <View 
        style = {{
            
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
            onPress = {positionButtonSetting}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <View style={{height: showAllSettings? 300 : 150}}>
        
            <SliderField
                title = {Language.size}
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                minimumValue={sizeButton.min}
                maximumValue={sizeButton.max}
                step = {sizeButton.step}
                aValue = {uiStyle.functionButton.size}
                onValueChange = {settingSizeButton}
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />

            <SliderField
                title = {Language.bottomPosition}
                signaturesText = {{left: Language.bottomPositionSlider.min, right: Language.bottomPositionSlider.max}}
                minimumValue={FAB_bottomPosition.min}
                maximumValue={FAB_bottomPosition.max}
                step = {FAB_bottomPosition.step}
                aValue = {uiStyle.functionButton.bottomPosition}
                onValueChange = {settingBottomPosition}
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />


            {showAllSettings && 
            <SwitchField
                textTitle = {Language.invertColors}
                textStates = {Language.invertColorsState}
                //text = {`${Language.invertColors} ${Language.invertColorsState[invertColors]}`}
                aValue={uiStyle.functionButton.invertColors}
                onChange={invertChange}
                style = {{
                    marginTop: 10
                }}
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />}
            {showAllSettings && 
            <SwitchField
                textTitle = {Language.disabledShadows}
                textStates = {Language.disabledShadowsState}
                //text = {`${Language.invertColors} ${Language.invertColorsState[invertColors]}`}
                aValue={uiStyle.functionButton.ignoredShadows.disable}
                onChange={disableChange}
                style = {{
                    marginTop: 10
                }}
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />}
            {showAllSettings && 
            <SwitchField
                textTitle = {Language.outline}
                textStates = {Language.outlineState}
                //text = {`${Language.outline} ${Language.outlineState[outline]}`}
                aValue={uiStyle.functionButton.outline}
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
                    minHeight : 0,
                    width: '100%', 
                    //left: 12, 
                    backgroundColor: `${Theme.basics.neutrals.secondary}90`
                }, blind]}
            />
        </View>
    </View>)
}

const staticStyles = StyleSheet.create({
    
    ...commonStaticStyles
});