import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { cancelAnimation, useDerivedValue, runOnJS, useSharedValue } from "react-native-reanimated";


import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

import { rippleValues, shadowsValues } from "../../../../../../app_values/AppDefault";

import commonStaticStyles, { SwitchField, BoxsField } from "../CommonElements";
import SkiaViewDisign from "../../../../../../general_components/base_components/SkiaViewDisign";

import useLanguage from "../../../../../../app_hooks/useLanguage";




const curStyle = 'full'//'square' //'neomorphism'//"material"

const shadowStyles = {
    none: {
        design: 'none',
        inner: {
            use: false,
            opacity: 0
        },
        countColors: 0,
        blur: 0,
        opacity: 0,
        pos: {
            x1:0,
            y1:0,
            x2:0, 
            y2:0
        }
    },
    material: {
        design: 'material',
        inner: {
            use: false,
            opacity: 0
        },
        countColors: 1,
        blur: 0.42,
        opacity: 0.19,
        pos: {
            x1:0,
            y1:0.33,
            x2:0, 
            y2:0
        }
    }, 
    neomorphism: {
        design: 'neomorphism',
        inner: {
            use: true,
            opacity: 0.1
        },
        countColors: 2,
        blur: 0.31,
        opacity: 0.32,
        pos: {
            x1:0.39,
            y1:0.39,
            x2:-0.39, 
            y2:-0.39
        }
    }, 
    full: {
        design: 'full',
        inner: {
            use: false,
            opacity: 0
        },
        countColors: 1,
        blur: 0.52,
        opacity: 0.18,
        pos: {
            x1:0,
            y1:0,
            x2:0, 
            y2:0
        }
    },
    square: {
        design: 'square',
        inner: {
            use: false,
            opacity: 0
        },
        countColors: 1,
        blur: 0.1,
        opacity: 0.54,
        pos: {
            x1:0.71,
            y1:0.71,
            x2:0, 
            y2:0
        }
    }, 
}

export default EffectsRedactor = (props) => {
    const {
        uiStyle,
        uiTheme,

        showAllSettings,
        setShadowsStyle,
        tagStyle,

        r_uiStyle,
  
        Theme
    } = props

    const Language = useLanguage().SettingsScreen.Redactors.effects

    const shadowsSetting = (index) => {
        //uiStyle.effects.shadows.design.value = shadowsValues[index];
        console.log('shadowsSetting', shadowsValues[index])
        setShadowsStyle(shadowStyles[shadowsValues[index]])
        tagStyle('effects.shadows')
    }

    
    const blurChange = (value) =>{
        uiStyle.effects.blur.value = value;
        tagStyle('effects.blur')
    }
    console.log('design', uiStyle.effects.shadows.design.value)
    const shadows = useDerivedValue(()=>shadowsValues.indexOf(uiStyle.effects.shadows.design.value))


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
                    borderRadius = {r_uiStyle.borderRadius.primary}
                    backgroundColor = {Theme.basics.neutrals.secondary}
                    shadowColors = {Theme.specials.shadow}
                    shadowMargin={{horizontal: 5, vertical: 5}}
                    
                    adaptiveSizeForStyle={false}
                    innerShadow={{
                        used: true,
                        borderWidth: 0
                    }}
                    initSize = {{height: 26, width: 200}}

                    shadowStyle = {shadowStyles[shadowsValues[index]]}
        
                />
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
            appStyle = {r_uiStyle}
            Theme = {Theme}
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
            appStyle = {r_uiStyle}
            Theme = {Theme}
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