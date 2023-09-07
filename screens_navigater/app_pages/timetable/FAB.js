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

    createAnimatedPropAdapter,
    processColor,
    withSpring,
} from 'react-native-reanimated';

import { Svg, Path } from "react-native-svg";
import { BlurView } from "@react-native-community/blur";
import MaskedView from '@react-native-masked-view/masked-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import SkiaViewDisign from "../../../general_components/base_components/SkiaViewDisign";

import themesColorsAppList, {themesApp} from "../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../app_values/Languages";


const { height: DEVICE_H, width: DEVICE_W } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Constants.statusBarHeight
//const SCREEN_PROXIMYTY_HRZ = listsHorizontalProximity['true']

const RPressable = Reanimated.createAnimatedComponent(Pressable);
const RIcon = Reanimated.createAnimatedComponent(MaterialCommunityIcons);
const RBlurView = Reanimated.createAnimatedComponent(BlurView);

//const OS_NAVIGATION_BAR_HEIGHT = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight)
import * as NavigationBar from 'expo-navigation-bar';

import values from "./common_values";
import { sizeButton } from "../../../app_values/AppDefault";
const {
    SCREEN_PROXIMYTY_HRZ,

    STYCKYS_HEIGHT,
    HEADER_TOOL_HEIGHT,
    SECTIONS_SELECTOR_HEIGHT,
    PRIMARY_HEADER_HEIGHT,
    SECONDARY_HEADER_HEIGHT,

    MARGIN_BOBBER,

    OS_NAVIGATION_BAR_HEIGHT,

    TRANSPARENT_COLOR
} = values

const SHADOW_MARGIN = 5


export default BobberButton = (props) => {
    const {
        onPress,
        onLongPress,
        aVisible,

        uiStyle,
        uiTheme,

    } = props

    const {
        borderRadius : {
            additional: borderRadius
        },
        navigationMenu: {
            type: menuType,
            height: menuHeight,
            position: {
                vertical,
                horizontal
            }
        },
        functionButton: {
            size: buttonSize,
            position: fabPosition,
            bottomPosition: buttonBottomPosition,
            outline,
            invertColors,
            ignoredShadows: {
                disable: disableShadow
            }
        },
        effects: {
            shadows,
            blur
        }
    } = uiStyle

    const enabled = useDerivedValue(()=>fabPosition.value != 'top')

    const {
        icons: {
            accents: {
                primary: iconColorA
            },
            neutrals: {
                primary: iconColorN
            }
        },
        specials: {
            separator,
            shadow: {
                primary: shadowColorP,
                secondary: shadowColorS
            }
        },
        basics: {
            neutrals: {
                tertiary: buttonColorN
            },
            accents: {
                secondary: buttonColorA
            }
        }
    } = uiTheme

    const osBarVisibility = NavigationBar.useVisibility() === 'visible'

    const aBottomBord = useDerivedValue(()=>{
        const hiddenPos = (menuType.value == 'hidden' && horizontal.value == 'center' && fabPosition.value == 'center')? 
            20 + interpolate(vertical.value, [-150, 150] , [0, 30]) : 0

        const osBarHeight = osBarVisibility? OS_NAVIGATION_BAR_HEIGHT : 0

        return MARGIN_BOBBER  +menuHeight.value +osBarHeight +hiddenPos //+ bottomSheetHeadHeight +aStyle.value.functionButton.size
    })


    

    const dynamicStyleBobberButton = useAnimatedStyle(()=>{
        const durationTranslate = 400;
        //console.log('FAB, f borderRadius')
        return {
            height: buttonSize.value, 
            width:  buttonSize.value,
            bottom: aBottomBord.value, 
            left:   interpolate(
                buttonBottomPosition.value,
                [0, 1],
                [MARGIN_BOBBER, DEVICE_W-MARGIN_BOBBER-buttonSize.value]
            ),
            transform: [
                {translateY: withTiming((aVisible.value == 0 && enabled.value)? 0 : (aBottomBord.value + buttonSize.value), {duration: durationTranslate})}
            ] 
        }
    })

    const pressableStyle = useAnimatedStyle(()=>{
        return {
            borderWidth: outline.value? 0.5 : 0,
            borderColor: `${separator.value}10`,
        }
    })

    const areaStyle = useAnimatedStyle(()=>{
        //console.log('FAB area,t borderRadius')
        return {
            height: buttonSize.value-2*SHADOW_MARGIN,
            width: buttonSize.value-2*SHADOW_MARGIN,
            borderRadius: borderRadius.value,
        }
    }) 

    const rippleProps = useAnimatedProps(()=>{
        return {
            android_ripple: { 
                color: `${invertColors.value? iconColorA.value : iconColorN.value}20`,
                borderless: true,
                foreground: false
            } 
        }
    })

    const styleIcon = useAnimatedStyle(()=>({
        color:  invertColors.value? iconColorA.value : iconColorN.value,
    }))

    const skiaBR = useDerivedValue(()=>borderRadius.value)
    const skiaBG = useDerivedValue(()=>invertColors.value? buttonColorN.value : buttonColorA.value)
    const skiaSize = useDerivedValue(()=>({height: buttonSize.value, width: buttonSize.value}))

    const skiaShadows = useDerivedValue(()=>{
        return {
            style: shadows.value == 'none' && disableShadow.value? 'material' : shadows.value,
            colors: {
                primary: shadowColorP.value,
                secondary: shadowColorS.value,
            } 
        }
    })


    const bg = useAnimatedStyle(()=>{
        //console.log('FAB BG')
        return {backgroundColor: `${skiaBG.value}${blur.value? '68' : '00'}`}
    })


    //console.log('-- BOBBER BUTTUN RENDER')
    return(
        <Reanimated.View 
            style = {[dynamicStyleBobberButton, {
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
            }]}
        >    
            <SkiaViewDisign
                aBorderRadius = {skiaBR}
                aBGColor = {skiaBG}
                aSize = {skiaSize}
                aShadows={skiaShadows}
                timing = {false}

                isGeneralObject={true} 

                shadowMargin={{horizontal: SHADOW_MARGIN, vertical: SHADOW_MARGIN}}
    
                adaptiveSizeForStyle={false}
                innerShadow={{
                    used: true,
                    borderWidth: 0.5
                }}
            />
            <BobberBlur uiStyle={uiStyle} uiTheme={uiTheme}/>
            {true && <Reanimated.View style={[StyleSheet.absoluteFillObject, areaStyle, bg, {left: SHADOW_MARGIN, top: SHADOW_MARGIN}]}/>}
            <Reanimated.View style={[ areaStyle, pressableStyle, {backgroundColor: TRANSPARENT_COLOR}]}>
                <RPressable
                    style={[{
                        height: '100%',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }]}
                    animatedProps={rippleProps}
                    onPress={onPress}
                    onLongPress={onLongPress}
                >
                    <Reanimated.Text style={styleIcon}>
                        <MaterialCommunityIcons
                            name = {'sticker-plus-outline'}
                            size = {26}
                        />
                    </Reanimated.Text>
                </RPressable>
            </Reanimated.View>
        </Reanimated.View>
    )
}



const BobberBlur = (props) => {
    const {
        uiStyle,
    } = props

    const {
        borderRadius : {
            additional: borderRadius
        },
        functionButton: {
            size: buttonSize,
        },
        effects: {
            blur: uiBlur
        }
    } = uiStyle

    const [blur, setBlur] = useState(false)

    const style = useAnimatedStyle(()=>{
        return {
            height: buttonSize.value-2*SHADOW_MARGIN,
            width:  buttonSize.value-2*SHADOW_MARGIN,
            borderRadius: borderRadius.value,
        }
    })

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
            style = {[StyleSheet.absoluteFillObject, style, {
                left: SHADOW_MARGIN,
                top: SHADOW_MARGIN,
                //height: appStyle.functionButton.size-10,
                //width: appStyle.functionButton.size-10,
                //specialty blur for android
                overflow: 'hidden',
                //borderRadius: appStyle.borderRadius.additional,
            }]}
        >
            <RBlurView
                style = {{flex: 1, }}
                blurType = {'light'}
                blurAmount = {10}
                
                //ANDROID_PROPS
                //overlayColor={`${appStyle.functionButton.invertColors? Theme.basics.neutrals.tertiary : Theme.basics.accents.secondary}90`}
                //animatedProps={blurProps}
                //overlayColor={'transparent'}
                //blurRadius	= {10}
                //downsampleFactor = {10}
            />
        </Reanimated.View>
    ) 
}