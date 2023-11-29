import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import {
    Appearance, 
    StyleSheet, 
    Text,
    Button, 
    Pressable,
    TextInput, 
    FlatList, 
    SectionList,
    View, 
    Dimensions,
    ToastAndroid,
    Keyboard,
    BackHandler,
    Vibration 
} from 'react-native';

import Constants from "expo-constants";

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay,
    withSequence, 
    useAnimatedScrollHandler,
    useAnimatedProps, 
    cancelAnimation,
    useAnimatedRef,
    useDerivedValue,
    scrollTo,
    runOnJS,
    interpolateColor,
    interpolate,
    Extrapolate,
    runOnUI,
    Easing,
    Extrapolation,

    Layout,
    SequencedTransition,
    CurvedTransition,
    FadingTransition,
    Transition,
    FadeIn,
    useAnimatedReaction,
    convertToRGBA
} from 'react-native-reanimated';

import { Svg, Path } from "react-native-svg";
import { BlurView } from "@react-native-community/blur";
import MaskedView from '@react-native-masked-view/masked-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const { height: DEVICE_H, width: DEVICE_W } = Dimensions.get('window');

import useTasksSizes, {TRANSPARENT_COLOR} from "./common_values";



const RBlurView = Reanimated.createAnimatedComponent(BlurView);



export default HeaderBackground = (props) => {
    const {
        animValueScrollY, //negative

        uiStyle,
        uiTheme,
    } = props
    

    const {
        effects: {
            blur: uiBlur,
        }
    } = uiStyle

    const {
        basics: {
            neutrals: {
                secondary: basicNP
            },
            accents: {
                primary: basicAP
            }
        },
        icons: {
            accents: {
                
            },
            neutrals: {
               
            }
        },
        texts: {
            accents: {
              
            },
            neutrals: {
                
            }
        },
        specials: {
            separator,
        },
        
    } = uiTheme

    const {

        HEADER_TOOL_HEIGHT,

        SECONDARY_HEADER_HEIGHT,

        HEAD_COMPONENT_HEIGHT,
    } = useTasksSizes()

    const animSelectorLine = useDerivedValue(()=> (Math.max(((HEAD_COMPONENT_HEIGHT)  +animValueScrollY.value ), 0)))

    //const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const header = useAnimatedStyle(()=>{
        const aBlur = uiBlur.value
        //console.log('header blur', aBlur)
        const borderColor = convertToRGBA(aBlur? 'transparent' : `${separator.value}25`)
        return {
            transform: [
                {translateY: interpolate(
                    animSelectorLine.value, 
                    [0, HEADER_TOOL_HEIGHT],
                    [0, -(HEADER_TOOL_HEIGHT-4)],
                    {
                        extrapolateLeft: Extrapolation.CLAMP,
                        extrapolateRight: Extrapolation.CLAMP
                    }  
                )}
            ],
            borderColor: aBlur? 'transparent' : `${separator.value}25`,
            borderBottomWidth: interpolate(
                animSelectorLine.value, 
                [0, HEADER_TOOL_HEIGHT],
                [0.4, 0],
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }  
            )
        }
         
    })

    const bg = useAnimatedStyle(()=>{
        const aBlur = uiBlur.value
        return {backgroundColor: `${basicAP.value}${aBlur? '68' : 'ff'}`}
    })

    
    //console.log('render> HeaderBackground')
    return (
        <Reanimated.View
            style={[ header, {   
                top: 0,
                //zIndex: 1,
                position: 'absolute',       
                //borderBottomWidth: 0.4,
                //marginHorizontal: 5,
                //paddingHorizontal: 5,
                //marginTop: 1,
                height: SECONDARY_HEADER_HEIGHT,
                width: '100%' // DEVICE_W                 
            }]}
        >
            <BlurFill {...props} /> 
            <Reanimated.View style={[StyleSheet.absoluteFillObject, bg, {}]}/> 
        </Reanimated.View>
    )
}


const BlurFill = (props) => {
    const {
        uiStyle,
        uiTheme
    } = props

    const {
        effects: {
            blur: uiBlur,
        }
    } = uiStyle

    const [blur, setBlur] = useState(false)

    useAnimatedReaction(
        ()=>uiBlur.value,
        (newValue, oldValue)=>{
            if(newValue && !blur){
                runOnJS(setBlur)(true)
            }
            if(!newValue && blur){
                runOnJS(setBlur)(false)
            }
        }
    )

    if(!blur){return null}
    return (
        <Reanimated.View 
            style = {[StyleSheet.absoluteFillObject, {
                overflow: 'hidden',
            }]}
        >
        <RBlurView
            style = {{flex: 1, }}
            blurType = {'light'}
            blurAmount = {10}
        />
        </Reanimated.View>
    )
}

const staticStyles = StyleSheet.create({

});