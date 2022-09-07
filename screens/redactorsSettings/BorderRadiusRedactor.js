import React, { useState, useRef, useEffect } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import Slider from '@react-native-community/slider';

import LanguagesAppList, { languagesApp } from "../../language/language";
import ThemesColorsAppList, { themesApp } from "../../styles/ColorsApp";
import dataRedactor from "../../async_data_manager/data_redactor";
import ColorSplash from "../../componets/StyleColorSplash";

import Svg, { Path } from "react-native-svg";

//import BasePressable from "../../componets/base/BasePressable"
import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch,
    BaseSlider 
} from "../../componets/base/BaseElements";

const borderRadiusValues = {min: 0, max: 32, step: 1}

export default BorderRadiusRedactor = ({
    appStyle,
    setAppStyle,
    r_setAppStyle,

    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    LanguageAppIndex   
}) => {
    const [sliderValueBasic, setSliderValueBasic] = useState(appStyle.borderRadius.basic);
    const [sliderValueAdditional, setSliderValueAdditional] = useState(appStyle.borderRadius.additional);

    const [synchronousSlider, setSynchronousSlider] = useState(appStyle.borderRadius.basic == appStyle.borderRadius.additional);

    const setPrew = (value) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.borderRadius.basic = Number(value);
        newAppStyle.borderRadius.additional = Number(value);
        setPreviewAppStyle(newAppStyle);
    }

    const setPrewBasic = (valueBasic) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.borderRadius.basic = Number(valueBasic);
        setPreviewAppStyle(newAppStyle);
    }

    const setPrewAdd = (valueAdditional) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.borderRadius.additional = Number(valueAdditional);
        setPreviewAppStyle(newAppStyle);
    }

    const change = () =>{
        //let newAppStyle = getNewAppStyleObject();
        //newAppStyle.splachLoadShow = (!loadSplash)
        //console.log(loadSplash)
        //setAppStyle(newAppStyle)
        //dataRedactor("storedAppStyle",newAppStyle);
        setSynchronousSlider(!synchronousSlider)
    }

    return (
        <View
            style = {{
                //alignItems: 'flex-end',
            }}
        >
        <View
            style = {{
                flexDirection: 'row',
                //backgroundColor: 'red',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <Text
                style = {{color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral}}
            >
                {`This slider synhronous: ${synchronousSlider}`}
            </Text>
            <BaseSwitch
                size={24}
                style = {{
                    right: 20
                }}
                trackStyle={{
                    borderRadius: appStyle.borderRadius.additional
                }}
                thumbStyle = {{
                    borderRadius: appStyle.borderRadius.additional,
                    borderWidth: 3,
                    borderColor: synchronousSlider? ThemesColorsAppList[ThemeColorsAppIndex].sky : ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp
                }}
                colors={{
                    track: { 
                        false: ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp, 
                        true: ThemesColorsAppList[ThemeColorsAppIndex].sky  
                    },
                    thumb: { 
                        false: ThemesColorsAppList[ThemeColorsAppIndex].symbolLight, 
                        true: ThemesColorsAppList[ThemeColorsAppIndex].symbolLight  
                    }
                }}
                primeValue={synchronousSlider}
                onChange={change}
            />
        </View>

        

        

        <View
            style = {{
                justifyContent: 'center',
                height: 160,
                paddingTop: 5,
                marginBottom: 9
            }}
        >
        {['Basic','Additional'].map((item, index)=>{
            //if (synchronousSlider && index > 0) { return }
            return(
                <View
                    key = {String('slider'+item)}
                >
                    <Text>{item}</Text>
                    <BaseSlider
                        signaturesText = {{left: 'straighter',right: 'rounder'}}
                        signaturesStyle = {{color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral}}
                        
                        minimumValue={borderRadiusValues.min}
                        maximumValue={borderRadiusValues.max}
                        step = {borderRadiusValues.step}
                        value = {item === 'Basic'? sliderValueBasic : sliderValueAdditional}
                        onSlidingComplete = {(value)=>{
                            if(synchronousSlider){
                                setSliderValueBasic(value);
                                setSliderValueAdditional(value);
                                setPrew(value);
                            } else {
                                if (item === 'Basic'){
                                    setSliderValueBasic(value);
                                    setPrewBasic(value);
                                }  else if (item === 'Additional'){
                                    setSliderValueAdditional(value);
                                    setPrewAdd(value);
                                } 
                            }    
                        }}
                        onValueChange = {(value)=>{
                            if(synchronousSlider){
                                setPrew(value);
                            } else {
                                if (item === 'Basic'){
                                    setPrewBasic(value);
                                }  else if (item === 'Additional'){
                                    setPrewAdd(value);
                                } 
                            }
                                
                        }}
                        minimumTrackTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].skyUpUp}
                        maximumTrackTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp}
                        thumbTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].sky}
                    />
                </View>
            )
        })}
        </View>
    </View>)
}

const staticStyles = StyleSheet.create({
    
});