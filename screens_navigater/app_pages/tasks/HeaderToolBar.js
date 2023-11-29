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

const RPressable = Reanimated.createAnimatedComponent(Pressable);
const ReanimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

import useTasksSizes, {TRANSPARENT_COLOR} from "./common_values";


import { useSelector } from "react-redux";
import useLanguage from "../../../app_hooks/useLanguage";

export default HeaderToolBar = (props) => {
    const {
        chosesMod,
        
        uiStyle,
        uiTheme,
    } = props

    const [mod, setMod] = useState('default')

    const {
        STATUS_BAR_HEIGHT,

        HEADER_TOOL_HEIGHT,

        DEVICE_W
    } = useTasksSizes()

    useAnimatedReaction(
        ()=>chosesMod.value,
        (newValue, oldValue)=>{
            const newMod = newValue == 0? 'default' : 'choses'
            runOnJS(setMod)(newMod)
        }
    )

    return (
        <Reanimated.View 
            style = {[{ 
                marginTop: STATUS_BAR_HEIGHT,
                position: 'absolute',
                height: HEADER_TOOL_HEIGHT,
                width: DEVICE_W,
                left: 0,
                //zIndex: 3,
            }]}
            //layout={FadingTransition}
            //
        >
            {mod == 'default' && <GroundTools {...props}/>}
            {mod == 'choses' && <TasksTools {...props}/>}
        </Reanimated.View>
    )
}



const GroundTools = (props) => {
    const {
        //animSelectorLine,

        menuPress,
        fabPress,
        fabLongPress,

        uiStyle,
        uiTheme,
        uiComposition
    } = props

    const {
        navigationMenu: {
            pos: {dx: drawerPosition},
            type: menuType,
        },
        fab: {
            pos: {y: fabPosition}
        },
    } = uiStyle


    const {
        weather: {
            type: weatherType
        }
    } = uiComposition

    const {
        basics: {
            neutrals: {
                
            },
            accents: {
      
            }
        },
        icons: {
            accents: {
                primary: iconAP
            },
            neutrals: {
                primary: iconColor,
                secondary: iconNS
            }
        },
        texts: {
            accents: {
              
            },
            neutrals: {
                primary: textColorNP,
                secondary: textColorNS,
            }
        },
        specials: {
            
        },
        
    } = uiTheme

    const {

        HEADER_TOOL_HEIGHT,

    } = useTasksSizes()


    const panelDirection = useAnimatedStyle(()=>{
        return {
            flexDirection: drawerPosition.value == 0? 'row' : 'row-reverse',
        }
    })

    const rippleProps = useAnimatedProps(()=>{
        return {
            android_ripple: { 
                color: `${iconColor.value}20`,
                borderless: true,
                foreground: false
            } 
        }
    })

    const fabHeadVisible = useAnimatedStyle(()=>{
        return {
            opacity: fabPosition.value == 0? 1 : 0
        }
    })

    const styleIcon = useAnimatedStyle(()=>({color: iconColor.value}))


    const MenuIcon = () => {

        const currentIcon = useDerivedValue(()=>{
            const weatherInDrawer = (weatherType.value == 'panel')
            return (menuType.value == 'type_1' && weatherInDrawer)? "weather-partly-snowy-rainy" : (menuType.value == 'type_2'? "menu" : 'cog')
        })

        const [nameIcon, setNameIcon] = useState(currentIcon.value)

        useAnimatedReaction(()=>currentIcon.value, (newValue, oldValue)=>{runOnJS(setNameIcon)(newValue)})

        return (
            <MaterialCommunityIcons 
                name={nameIcon}
                size={27}
            />
        )
    }

    const textColor = useAnimatedStyle(()=>({color: textColorNP.value}))

    const Title = () => {
        const Language = useLanguage().TasksScreen

        return(
            <Reanimated.Text 
                style = {[textColor, {
                    flex: 1,
                    fontSize: 23,
                    fontWeight: '600',
                    letterSpacing: 0.8,
                    fontVariant: ['small-caps'],
                    //backgroundColor: 'red',
                    paddingBottom: 4
                    //textAlign: 'left'
                }]}
            >
                {Language.HeaderTitle}
            </Reanimated.Text>
        )
    }

    const Fab = () => {

        const [disabled, setDisabled] = useState(fabPosition.value == 1)

        useAnimatedReaction(()=>fabPosition.value == 1, (newValue, oldValue)=>{runOnJS(setDisabled)(newValue)})

        return (
            <View style={{backgroundColor: TRANSPARENT_COLOR, borderRadius: HEADER_TOOL_HEIGHT/2}}>
                <RPressable 
                    style={[fabHeadVisible, {
                        height: HEADER_TOOL_HEIGHT,
                        width: HEADER_TOOL_HEIGHT,
                        //borderRadius: itemCategoryHeight/2, //appStyle.borderRadius.additional
                        justifyContent: 'center',
                        alignItems: 'center',
                    }]}
                    disabled={disabled}
                    animatedProps={rippleProps}
                    onPress={fabPress}
                    onLongPress={fabLongPress}
                >
                    <Reanimated.Text style={styleIcon}>
                        <MaterialCommunityIcons 
                            name={'sticker-plus-outline'}
                            size={27}
                        />
                    </Reanimated.Text>
                </RPressable>
            </View>
        )
    }

    return (
        <Reanimated.View
            entering={FadeIn} 
            style = {[panelDirection, { 
                paddingHorizontal: 12,
                alignItems: 'center',
                justifyContent: 'space-between',
            }]}
        >
            <View style={{backgroundColor: TRANSPARENT_COLOR, borderRadius: HEADER_TOOL_HEIGHT/2}}>
                <RPressable 
                    style={{
                        height: HEADER_TOOL_HEIGHT,
                        width: HEADER_TOOL_HEIGHT,
                         //appStyle.borderRadius.additional
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    animatedProps={rippleProps}
                    onPress={menuPress}
                >
                    <Reanimated.Text style={styleIcon}>
                        <MenuIcon />
                    </Reanimated.Text>
                </RPressable>
            </View>
            <Title />
            <Fab />
        </Reanimated.View>
    )
}


const TasksTools = (props) => {
    const {
        chosesMod,

        uiStyle,
        uiTheme,

        changesClose,
        changesCheck,
        changesDelete,
        changesAllDelete,
    } = props

    const {
        borderRadius : {
            secondary: borderRadius
        },
        navigationMenu: {
            pos: {dx: drawerPosition},
            type: menuType,
        }
    } = uiStyle

    const {
        basics: {
            neutrals: {
                
            },
            accents: {
                quaternary: basicAQ
            }
        },
        icons: {
            accents: {
                primary: iconAP,
                quaternary: iconAQ
            },
            neutrals: {
                primary: iconNP,
                secondary: iconNS,
            }
        },
        texts: {
            accents: {
              
            },
            neutrals: {
                primary: textNP,
                secondary: textNS,
                quaternary: textNQ
            }
        },
        specials: {
            
        },
        
    } = uiTheme

    const {
        HEADER_TOOL_HEIGHT,
    } = useTasksSizes()

    const panelDirection = useAnimatedStyle(()=>{
        return {
            flexDirection: drawerPosition.value == 0? 'row' : 'row-reverse',
        }
    })

    const rippleProps = useAnimatedProps(()=>{
        return {
            android_ripple: { 
                color: `${iconNP.value}20`,
                borderless: true,
                foreground: false
            } 
        }
    })

    const styleIcon = useAnimatedStyle(()=>({color: iconNP.value}))

    const counterStyle = useAnimatedStyle(()=>{
        return {
            color: textNP.value,
            borderColor: iconAQ.value,
            //backgroundColor: iconAQ.value,
            borderRadius: borderRadius.value,
        }
    })

    const counterValue = useAnimatedProps(()=>{
        const text = String(chosesMod.value > 0? chosesMod.value : '')
        return {
            value: text,
            text: text,
        }
    })


    return (
        <Reanimated.View
            entering={FadeIn}
            style = {[panelDirection, { 
                paddingHorizontal: 12,
                alignItems: 'center',
                justifyContent: 'space-between',
            }]}
        >
            <View style={{backgroundColor: TRANSPARENT_COLOR, borderRadius: HEADER_TOOL_HEIGHT/2}}>
                <RPressable 
                    style={{
                        height: HEADER_TOOL_HEIGHT,
                        width: HEADER_TOOL_HEIGHT,
                         //appStyle.borderRadius.additional
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    animatedProps={rippleProps}
                    onPress={changesClose}
                >
                    <Reanimated.Text style={styleIcon}>
                        <MaterialCommunityIcons 
                            name={'window-close'}
                            size={26}
                        />
                    </Reanimated.Text>
                </RPressable>
            </View>


            <Reanimated.View
                style = {[panelDirection, { 
                    width: '48%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }]}
            >
                <ReanimatedTextInput 
                    style={[counterStyle, {
                        minWidth: 26,
                        height: 26,
                        paddingHorizontal: 4,
                        textAlignVertical: 'center',
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 'bold',
                        borderWidth: 2
                    }]}
                    animatedProps={counterValue}
                />
                <View style={{backgroundColor: TRANSPARENT_COLOR, borderRadius: HEADER_TOOL_HEIGHT/2}}>
                    <RPressable 
                        style={{
                            height: HEADER_TOOL_HEIGHT,
                            width: HEADER_TOOL_HEIGHT,
                            //appStyle.borderRadius.additional
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        animatedProps={rippleProps}
                        onPress = {changesCheck}
                    >
                        <Reanimated.Text style={styleIcon}>
                            <MaterialCommunityIcons 
                                name={'sticker-check-outline'}
                                size={26}
                            />
                        </Reanimated.Text>
                    </RPressable>
                </View>
                <View style={{backgroundColor: TRANSPARENT_COLOR, borderRadius: HEADER_TOOL_HEIGHT/2}}>
                    <RPressable 
                        style={{
                            height: HEADER_TOOL_HEIGHT,
                            width: HEADER_TOOL_HEIGHT,
                            //appStyle.borderRadius.additional
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        animatedProps={rippleProps}
                        onPress = {changesDelete}
                        onLongPress = {changesAllDelete}
                    >
                        <Reanimated.Text style={styleIcon}>
                            <MaterialCommunityIcons 
                                name={'sticker-minus-outline'}
                                size={26}
                            />
                        </Reanimated.Text>
                    </RPressable>
                </View>
            </Reanimated.View>
        </Reanimated.View>
    )
}


const staticStyles = StyleSheet.create({


});