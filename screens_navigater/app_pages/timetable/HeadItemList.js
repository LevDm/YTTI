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


import SkiaViewDisign from "../../../general_components/base_components/SkiaViewDisign";

import themesColorsAppList, {themesApp} from "../../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../../app_values/Languages";


const { height: DEVICE_H, width: DEVICE_W } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Constants.statusBarHeight
//const SCREEN_PROXIMYTY_HRZ = listsHorizontalProximity['true']

const RPressable = Reanimated.createAnimatedComponent(Pressable);

const OS_NAVIGATION_BAR_HEIGHT = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight)

import WeatherComponent from "../../../weather/WeatherComponent";

import values from "./common_values";
const {
    SCREEN_PROXIMYTY_HRZ,

    STYCKYS_HEIGHT,
    HEADER_TOOL_HEIGHT,
    SECTIONS_SELECTOR_HEIGHT,
    PRIMARY_HEADER_HEIGHT,
    SECONDARY_HEADER_HEIGHT,

    HEAD_COMPONENT_HEIGHT,
    LIST_ITEM_SIZE,

    MARGIN_BOBBER,

    TRANSPARENT_COLOR
} = values

const ITEM_HEAD_SIZE = {
    h: (HEAD_COMPONENT_HEIGHT-8 -12),
    w: (HEAD_COMPONENT_HEIGHT-8 -12)*0.75,
}

export default HeadItem = memo((props) => {
    const {

        uiStyle,
        uiTheme,
    } = props

    const {
        borderRadius : {
            basic: basicRadius,
            additional: addRadius,
        },
        lists: {
            fullWidth
        },
        effects: {
            shadows,
        }
    } = uiStyle

    const {
        basics: {
            neutrals: {
                secondary: itemColor,
                secondary: basicNS,
            },
            accents: {
                tertiary: basicAT,
                quaternary: basicAQ
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
                secondary: textColorNS,
            }
        },
        specials: {
            shadow: {
                primary: shadowColorP,
                secondary: shadowColorS
            }
        },
        
    } = uiTheme
    
    const onPress = () => {

    }

    const onLongPress = () => {

    }

    const itemsBG = useDerivedValue(()=>{

        return basicAQ.value
    })

    const itemsBR = useDerivedValue(()=>{
        return basicRadius.value
    })

    const itemsMargin = useDerivedValue(()=>{
        const margin = (fullWidth.value? 0 : SCREEN_PROXIMYTY_HRZ)/2 //|| 1
        return {
            l: margin,
            r: margin,
            t: margin,
            b: margin,
        }
    })

    const aShadows = useDerivedValue(()=>{
        return {
            style: shadows.value,
            colors: {
                primary: shadowColorP.value,
                secondary: shadowColorS.value,
            } 
        }
    })

    const rippleProps = useAnimatedProps(()=>({
        android_ripple: {
            color: `${textColorNS.value}18`,
            borderless: true,
            foreground: false
        }
    }))


    const paddingColums = useAnimatedStyle(()=>{
        return {
            paddingHorizontal: (fullWidth.value? 0 : SCREEN_PROXIMYTY_HRZ)/2
        }
    })


    const aSize = useDerivedValue(()=>{
        const margin = (fullWidth.value? 0 : SCREEN_PROXIMYTY_HRZ)
        return {
            width: (DEVICE_W-margin),
            height: (HEAD_COMPONENT_HEIGHT +margin-SCREEN_PROXIMYTY_HRZ+1),
        }
    })

    const size =  useAnimatedStyle(()=>({...aSize.value}))
    
    const dynamicStyleListItems = useAnimatedStyle(()=>{
        return {
            marginHorizontal: itemsMargin.value.l,
            marginVertical: itemsMargin.value.t,

            borderRadius: itemsBR.value, // raStyle.borderRadius.basic.value,

            width: aSize.value.width-2*itemsMargin.value.l,
            height: aSize.value.height-2*itemsMargin.value.t
        }
    })

    const itemBorders = useAnimatedStyle(()=>({
        borderRadius: addRadius.value,
        backgroundColor: basicAT.value
    }))

    console.log('head item render')
    return (
        <Reanimated.View 
            style={[size, {
                //height: (scale? 2 : 1) * LIST_ITEM_SIZE.h,
                //width: (scale? 2 : 1) * (LIST_ITEM_SIZE.w),
                //backgroundColor: 'green'
            }]}
            layout={CurvedTransition}
        >    
            <SkiaViewDisign 
                aBorderRadius = {itemsBR}
                aBGColor = {itemsBG} 
                fullShadowMargin = {itemsMargin}
                aShadows={aShadows}
                aSize = {aSize}
                innerShadow={{
                    used: true,
                    borderWidth: 2
                }}
            />
            <Reanimated.View layout={Layout} style={[dynamicStyleListItems, {overflow: 'hidden',}]}>
                <Reanimated.FlatList
                    horizontal
                    showsHorizontalScrollIndicator = {false}
                    style={{
                    }}
                    contentContainerStyle={{
                        padding: 2,
                    }}
                    data={[1,2,3]}
                    //animatedProps={rippleProps}
                    layout={FadingTransition}
                    //onPress={onPress}
                    //onLongPress={onLongPress}
                    renderItem={({item, index})=>(
                        <Reanimated.View 
                            key={item+index}
                            style={[itemBorders, {
                                height: ITEM_HEAD_SIZE.h,
                                width:ITEM_HEAD_SIZE.w,
                                //backgroundColor: TRANSPARENT_COLOR,
                                //backgroundColor: 'red',
                                overflow: 'hidden',
                                marginLeft: index? SCREEN_PROXIMYTY_HRZ : 0
                            }]}
                        >
                            {index == 0 &&
                            <WeatherComponent 
                                type = {'lists'} 
                                componentSize={ITEM_HEAD_SIZE}
                                {...props}    
                            />
                            }
                        </Reanimated.View>
                    )}
                />    
            </Reanimated.View>
        </Reanimated.View>
    )
})


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