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

import { structureCustomizer as tasksStructure  } from "./tools";

import values from "./common_values";
const {
    SCREEN_PROXIMYTY_HRZ,

    STYCKYS_HEIGHT,
    HEADER_TOOL_HEIGHT,
    SECTIONS_SELECTOR_HEIGHT,
    PRIMARY_HEADER_HEIGHT,
    SECONDARY_HEADER_HEIGHT,


    LIST_ITEM_SIZE,

    MARGIN_BOBBER,

    TRANSPARENT_COLOR
} = values


export default Item = memo((props) => {
    const {
        keyID,
        item,
        index: itemIndex,

        chosenItems,
        chosesMod,
        openItem,
        onOpen,

        listItemChosePress,
        listItemLongChosePress,
        listItemPress,

        uiStyle,
        uiTheme

    } = props

    const {
        borderRadius : {
            basic: borderRadius
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
                secondary: itemColor
            },
            accents: {
      
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

    

    const {
        indexSection
    } = item

    const place = {
        categoryIndex: indexSection,
        itemIndex: itemIndex,
        itemsCount: tasksStructure[indexSection].data[0].length
    }
    
    const [scale, setScale] = useState(false)
    const choses = useSharedValue(0)

    useDerivedValue(()=>{
        if(chosesMod.value == 0 && choses.value == 1){
            choses.value = 0
        }
        if(JSON.stringify(openItem.value) != JSON.stringify(place) && scale){
            runOnJS(setScale)(false)
        }
    })
    
    const onPress = () => {
        //console.log(chosenItems.current)
        if(chosenItems.current.length > 0){
            if(chosenItems.current.includes(place)){
                choses.value = 0
                chosesMod.value -= 1
                if(chosenItems.current.length == 1){
                    //chosesMod.value = 0
                }
            } else {
                choses.value = 1
                chosesMod.value += 1
            }
            listItemChosePress(place)
        } else {
            onOpen(JSON.stringify(openItem.value) == JSON.stringify(place)? null : place) 
            listItemPress()
            setScale(!scale)
        }
    }

    const onLongPress = () => {
        if(chosenItems.current.length == 0){
            chosesMod.value = 1
            choses.value = 1
            listItemLongChosePress(place)
        } else {
            onPress()
        }
    }

    const itemsBG = useDerivedValue(()=>{

        return itemColor.value
    })

    const itemsBR = useDerivedValue(()=>{
        return borderRadius.value
    })

    const itemsMargin = useDerivedValue(()=>{
        const margin = (fullWidth.value? 0 : SCREEN_PROXIMYTY_HRZ)*0.5 || 1
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


    const chosesStyle = useAnimatedStyle(()=>{
        return {
            opacity: withTiming(chosesMod.value > 0? 1 : 0),
            backgroundColor: choses.value == 1? 'red' : 'blue'
        }
    })

    
    

    const aSize = useDerivedValue(()=>{
        const margin = (fullWidth.value? 0 : SCREEN_PROXIMYTY_HRZ)/2
        return {
            width: (scale? 2 : 1) * (LIST_ITEM_SIZE.w-margin),
            height: (scale? 2 : 1) * (LIST_ITEM_SIZE.h-margin),
        }
    })

    const itemSize = useAnimatedStyle(()=>{
        const margin = (fullWidth.value? 0 : SCREEN_PROXIMYTY_HRZ)/2
        return {
            width: (scale? 2 : 1) * (LIST_ITEM_SIZE.w) -margin,
            height: (scale? 2 : 1) * (LIST_ITEM_SIZE.h),
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

    console.log('item render', itemIndex, item)
    return (
        <Reanimated.View 
            key={keyID}
            style={[itemSize, {
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
                /* 
                initSize={{
                    height: (scale? 2 : 1) * LIST_ITEM_SIZE.h,
                    width: (scale? 2 : 1) * (LIST_ITEM_SIZE.w),
                }}
                
                */
            />
            <Reanimated.View layout={Layout} style={[dynamicStyleListItems, {backgroundColor: TRANSPARENT_COLOR}]}>
                <RPressable
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: TRANSPARENT_COLOR
                    }}
                    animatedProps={rippleProps}
                    layout={FadingTransition}
                    onPress={onPress}
                    onLongPress={onLongPress}
                >
                    <Reanimated.View style={[chosesStyle, {height: 22, width: 22, borderRadius: 11}]}/>
                    <Text>{item.param}</Text>
                    
                </RPressable>     
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