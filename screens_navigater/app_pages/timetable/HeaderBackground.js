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
    useAnimatedReaction
} from 'react-native-reanimated';

import { Svg, Path } from "react-native-svg";
import { BlurView } from "@react-native-community/blur";
import MaskedView from '@react-native-masked-view/masked-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import themesColorsAppList, {themesApp} from "../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../app_values/Languages";


const { height: DEVICE_H, width: DEVICE_W } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Constants.statusBarHeight
//const SCREEN_PROXIMYTY_HRZ = listsHorizontalProximity['true']
const OS_NAVIGATION_BAR_HEIGHT = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight)


const RBlurView = Reanimated.createAnimatedComponent(BlurView);

import values from "./common_values";
const {
    SCREEN_PROXIMYTY_HRZ,

    STYCKYS_HEIGHT,
    HEADER_TOOL_HEIGHT,
    SECTIONS_SELECTOR_HEIGHT,
    PRIMARY_HEADER_HEIGHT,
    SECONDARY_HEADER_HEIGHT,

    HEAD_COMPONENT_HEIGHT,
    MARGIN_BOBBER,

    TRANSPARENT_COLOR
} = values


export default HeaderBackground = (props) => {
    const {
        animValueScrollY, //negative

        uiStyle,
        uiTheme,
    } = props
    

    const {
        lists: {
            invertColorsHeader
        },
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

    const animSelectorLine = useDerivedValue(()=> (Math.max(((HEAD_COMPONENT_HEIGHT)  +animValueScrollY.value ), 0)))

    //const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const header = useAnimatedStyle(()=>{
        const aBlur = uiBlur.value
        //console.log('header blur', aBlur)
        return {
            height: interpolate(
                animSelectorLine.value, 
                [HEADER_TOOL_HEIGHT, 0],
                [PRIMARY_HEADER_HEIGHT, SECONDARY_HEADER_HEIGHT],
                //extrapolation
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }  
            ),
            
            borderColor: aBlur? 'transparent' : `${separator.value}25`, // 
            //backgroundColor: `${aStyle.value.lists.invertColorsHeader? aTheme.value.basics.neutrals.secondary : aTheme.value.basics.accents.primary}${aBlur? '90' : 'ff'}`
            // ? 'transparent' : (aStyle.value.lists.invertColorsHeader? aTheme.value.basics.neutrals.secondary : aTheme.value.basics.accents.primary)
        }
    })

    const bg = useAnimatedStyle(()=>{
        const aBlur = uiBlur.value
        return {backgroundColor: `${invertColorsHeader.value? basicNP.value : basicAP.value}${aBlur? '68' : 'ff'}`}
    })

    
    //console.log('render> HeaderBackground')
    return (
        <Reanimated.View
            style={[ header, {   
                top: 0,
                zIndex: 1,
                position: 'absolute',       
                borderBottomWidth: 0.4,
                //marginHorizontal: 5,
                //paddingHorizontal: 5,
                //marginTop: 1,
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
            console.log('reaction blur')
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
    FlatListsArea: {
        width: DEVICE_W,
    },
    frontFLArea: {
        marginHorizontal: 5,
        paddingHorizontal: 5,
        marginTop: 1,
    },

    frontFLText: {
        fontSize: 15,
        fontWeight: '500',
        fontVariant: ['small-caps'],
    },

    AnimatedHeaderText: {
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: 0.5,
        fontVariant: ['small-caps'],
    }

});