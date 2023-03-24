import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text,Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Reanimated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    useAnimatedReaction,
    useDerivedValue,
    interpolate,
    interpolateColors,
    interpolateColor,
    interpolateNode,
    Extrapolate,
    withTiming
} from 'react-native-reanimated';


import languagesAppList, {languagesApp} from "../../../../../../app_values/Languages";
import themesColorsAppList, {themesApp} from "../../../../../../app_values/Themes";


import { BasePressable } from "../../../../../../general_components/base_components/BaseElements";
import SkiaViewDisign from "../../../../../../general_components/base_components/SkiaViewDisign";

import Constants from "expo-constants";


const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable)
const ReanimatedText = Reanimated.createAnimatedComponent(Text)

export default Phone = (props) => {

    const {
        animatedValue,
        previewAppStyleA, //= {palette: {theme: 'stock', scheme: 'auto', statusbar: 'auto'}}
        ThemeSchema
    } = props

    const animatedState = useSharedValue(false)
    
    const duration = 400
    const scale = 2

    useEffect(()=>{
        //console.log(props.animatedValue)
        if(animatedValue != undefined && animatedValue != animatedState.value){
            animatedState.value = animatedValue
        }
    },[animatedValue])

    const animStyleBG = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]
        //console.log(Theme, previewAppStyleA.value)
        return {
            
            backgroundColor: Theme.basics.neutrals.primary,
            /* 
            withTiming( 
                interpolateColor(
                    animatedState.value, 
                    [0, 1],
                    [Theme.basics.neutrals.primary, 'black']  
                ),
                {duration: duration}
            ),*/
            borderRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ 32, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
        }
    },[previewAppStyleA])

    const animStylePhone = useAnimatedStyle(()=>{
        const borderWidth = 5

        const heightValue = deviceHeight
        const heightHalfValue = heightValue/scale

        const widthValue = (deviceWidth+2*borderWidth)
        const widthHalfValue = (widthValue/scale)//-0.1
        return {
            height: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ heightHalfValue, heightHalfValue+2*borderWidth],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
            width: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ widthHalfValue, widthValue],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
            borderRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ 20, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),    
        }
    })

    return(
        <Reanimated.View
            key = {props.key}
            style = {[animStyleBG,{
                top: 1,
                //borderRadius: 32,
            }]}
        >
            <Reanimated.View
                style = {[animStylePhone,{
                    //top: 1,
                    borderColor: 'black',
                    left: -0.1,
                    //backgroundColor: themesColorsAppList[0].ground,
                    alignItems: 'center',
                    borderWidth: 5,
                }]}
            >
                {props.children}
            </Reanimated.View>
        </Reanimated.View>
    )
}