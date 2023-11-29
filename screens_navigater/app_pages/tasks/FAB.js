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

const RPressable = Reanimated.createAnimatedComponent(Pressable);
const RIcon = Reanimated.createAnimatedComponent(MaterialCommunityIcons);
const RBlurView = Reanimated.createAnimatedComponent(BlurView);

//const OS_NAVIGATION_BAR_HEIGHT = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight)
import * as NavigationBar from 'expo-navigation-bar';

import { sizeButton } from "../../../app_values/AppDefault";

const SHADOW_MARGIN = 5

import useTasksSizes, {TRANSPARENT_COLOR} from "./common_values";


export default BobberButton = (props) => {
    const {
        onPress,
        onLongPress,
        aVisible,

        uiStyle,
        uiTheme,
        uiComposition,
    } = props

    const {
        borderRadius : {
            secondary: borderRadius
        },
        navigationMenu: {
            type: menuType,
            height: menuHeight,
            pos: {
                y: vertical,
                x: horizontal
            }
        },
        fab: {
            size: buttonSize,
            pos:{
                x: buttonBottomPosition,
                y: fabPosition
            },
            highlight: {
                outline,
                ignoredShadows: {
                    disable: disableShadow
                }
            }
        },
        effects: {
            shadows,
            blur
        }
    } = uiStyle

    const enabled = useDerivedValue(()=>fabPosition.value != 0)

    const {
        icons: {
            accents: {
                primary: iconColorA
            },
            neutrals: {
                primary: iconColorN,
                quaternary: iconNQ
            }
        },
        specials: {
            separator,
            shadow/* : {
                primary: shadowColorP,
                secondary: shadowColorS
            }*/
        },
        basics: {
            neutrals: {
                tertiary: buttonColorN
            },
            accents: {
                secondary: buttonColorA,
                quaternary: basicAQ,
            }
        }
    } = uiTheme


    const {
        OS_NAVIGATION_BAR_HEIGHT,
        MARGIN_BOBBER,
        DEVICE_W
    } = useTasksSizes()


    const {
        appFunctions
    } = uiComposition

    
    const getEnabled = (sharedAppFunctions) => {
        'worklet';
        return ((Object.values(sharedAppFunctions).filter((el)=>el.used.value)).length > 1)
    }

    const menuEnabled = useSharedValue(getEnabled(appFunctions))

    useAnimatedReaction(()=>getEnabled(appFunctions),
        (newValue, oldValue)=>{
            if(newValue != menuEnabled.value){
                menuEnabled.value = newValue
            }      
        }
    )

    const osBarVisibility = NavigationBar.useVisibility() === 'visible'

    const aBottomBord = useDerivedValue(()=>{
        const hiddenPos = (menuType.value == 'type_3' && horizontal.value == 'center' && fabPosition.value == 'center')? 
            20 + interpolate(vertical.value, [-150, 150] , [0, 30]) : 0

        const osBarHeight = osBarVisibility? OS_NAVIGATION_BAR_HEIGHT : 0
        const navigationHeight = ((menuType.value == 'type_1' && menuEnabled.value)? menuHeight.value : 0)
        console.log(MARGIN_BOBBER ,navigationHeight ,osBarHeight ,hiddenPos)
        return (MARGIN_BOBBER  +navigationHeight +osBarHeight +hiddenPos) //+ bottomSheetHeadHeight +aStyle.value.functionButton.size
    })


    
    

    const dynamicStyleBobberButton = useAnimatedStyle(()=>{
        //console.log('FAB, f borderRadius')
        return {
            height: buttonSize.value, 
            width:  buttonSize.value,
            bottom: withTiming(aBottomBord.value), 
            //left:   0,
            transform: [
                {translateY: withTiming((aVisible.value == 0 && enabled.value)? 0 : (aBottomBord.value + buttonSize.value))},
                {translateX: interpolate(
                    buttonBottomPosition.value,
                    [0, 1],
                    [MARGIN_BOBBER, DEVICE_W-MARGIN_BOBBER-buttonSize.value]
                )}
            ] 
        }
    })

    const pressableStyle = useAnimatedStyle(()=>{
        return {
            borderWidth: outline.value? 1 : 0,
            borderColor: `${separator.value}18`,
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
        //console.log('FAB ripple')
        return {
            android_ripple: { 
                color: `${iconNQ.value}20`,
                borderless: true,
                foreground: false
            } 
        }
    })

    const styleIcon = useAnimatedStyle(()=>({
        color:  iconNQ.value,
    }))

    //const skiaBR = useDerivedValue(()=>borderRadius.value)
    const skiaBG = useDerivedValue(()=>basicAQ.value)
    const skiaSize = useDerivedValue(()=>({height: buttonSize.value, width: buttonSize.value}))


    /* 
    const skiaShadows = useDerivedValue(()=>{
        return {
            style: shadows.value == 'none' && disableShadow.value? 'material' : shadows.value,
            colors: {
                primary: shadowColorP.value,
                secondary: shadowColorS.value,
            } 
        }
    })*/


    const bg = useAnimatedStyle(()=>{
        //console.log('FAB BG')
        return {
            backgroundColor: basicAQ.value,
            opacity: blur.value? 0.4 : 0
            //`${}${blur.value? '68' : '00'}`
        }
    })


    //console.log('-- BOBBER BUTTUN RENDER')
    return(
        <Reanimated.View 
            style = {[dynamicStyleBobberButton, {
                position: 'absolute',
                left:   0,
                alignItems: 'center',
                justifyContent: 'center',
            }]}
        >    
            <SkiaViewDisign
                aBorderRadius = {borderRadius}
                aBGColor = {basicAQ}//skiaBG
                aSize = {skiaSize}
                //aShadows={skiaShadows}
                timing = {false}

                aShadowStyle = {shadows}
                aShadowColor = {shadow}

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
            secondary: borderRadius
        },
        fab: {
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