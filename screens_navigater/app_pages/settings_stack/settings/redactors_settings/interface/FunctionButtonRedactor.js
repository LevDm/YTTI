import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Reanimated, { withTiming, cancelAnimation, useDerivedValue, runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


//const sizeButton = {min: 40, max: 70, step: 5}
//const valuePosition = ['left','center','right']
import { sizeButton, positionFAB, FAB_bottomPosition } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, SliderField, BoxsField } from "../CommonElements";

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


    const Language = useLanguage().SettingsScreen.Redactors.bobberButton

    
    const settingBottomPosition = (value) =>{
        uiStyle.fab.pos.x.value = Number(value);
        tagStyle('fab.pos.x')
    }
    
    const positionButtonSetting = (index) => {
        uiStyle.fab.pos.y.value = positionFAB[index]//
        tagStyle('fab.pos.y')
    };

    const settingSizeButton = (value) =>{
        uiStyle.fab.size.value = Number(value);
        tagStyle('fab.size')
    }

    const disableChange = (value) =>{
        uiStyle.fab.highlight.ignoredShadows.disable.value = value;
        tagStyle('fab.highlight.ignoredShadows.disable')
    }

    const outlineChange = (value) =>{
        uiStyle.fab.highlight.outline.value = value;
        tagStyle('fab.highlight.outline')
    }

    const position = useDerivedValue(()=>positionFAB.indexOf(uiStyle.fab.pos.y.value))

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
            appStyle = {r_uiStyle}
            Theme = {Theme}
        />
        <View style={{height: showAllSettings? 300 : 150}}>
        
            <SliderField
                title = {Language.size}
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                minimumValue={sizeButton.min}
                maximumValue={sizeButton.max}
                step = {sizeButton.step}
                aValue = {uiStyle.fab.size}
                onValueChange = {settingSizeButton}
                appStyle = {r_uiStyle}
                Theme = {Theme}
            />

            <SliderField
                title = {Language.bottomPosition}
                signaturesText = {{left: Language.bottomPositionSlider.min, right: Language.bottomPositionSlider.max}}
                minimumValue={FAB_bottomPosition.min}
                maximumValue={FAB_bottomPosition.max}
                step = {FAB_bottomPosition.step}
                aValue = {uiStyle.fab.pos.x}
                onValueChange = {settingBottomPosition}
                appStyle = {r_uiStyle}
                Theme = {Theme}
            />
            {showAllSettings && 
            <SwitchField
                textTitle = {Language.disabledShadows}
                textStates = {Language.disabledShadowsState}
                //text = {`${Language.invertColors} ${Language.invertColorsState[invertColors]}`}
                aValue={uiStyle.fab.highlight.ignoredShadows.disable}
                onChange={disableChange}
                style = {{
                    marginTop: 10
                }}
                appStyle = {r_uiStyle}
                Theme = {Theme}
            />}
            {showAllSettings && 
            <SwitchField
                textTitle = {Language.outline}
                textStates = {Language.outlineState}
                //text = {`${Language.outline} ${Language.outlineState[outline]}`}
                aValue={uiStyle.fab.highlight.outline}
                onChange={outlineChange}
                style = {{
                    marginTop: 10
                }}
                appStyle = {r_uiStyle}
                Theme = {Theme}
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