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

const RPressable = Reanimated.createAnimatedComponent(Pressable);
const ReanimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const { height: DEVICE_H, width: DEVICE_W } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Constants.statusBarHeight
//const SCREEN_PROXIMYTY_HRZ = listsHorizontalProximity['true']
const OS_NAVIGATION_BAR_HEIGHT = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight)


import values from "./common_values";
const {
    
    STYCKYS_HEIGHT,
    HEADER_TOOL_HEIGHT,
    SECTIONS_SELECTOR_HEIGHT,
    PRIMARY_HEADER_HEIGHT,
    SECONDARY_HEADER_HEIGHT,

    MARGIN_BOBBER,

    TRANSPARENT_COLOR
} = values


export default HeaderToolBar = (props) => {
    const {
        //animSelectorLine,

        chosesMod,

        uiStyle,
        uiTheme,

        appStyle,
        appConfig,
        LanguageAppIndex, //
        ThemeColorsAppIndex, //
        ThemeSchema, //
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].TasksScreen

    const [mod, setMod] = useState('default')

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
                zIndex: 3,
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

        appStyle,
        appConfig,
        LanguageAppIndex, //
        ThemeColorsAppIndex, //
        ThemeSchema, //
    } = props

    const {
        borderRadius : {
            
        },
        navigationMenu: {
            drawerPosition,
            type: menuType,
        },
        lists: {
            invertColorsHeader
        },
        functionButton: {
            position: fabPosition
        },
        effects: {
            
        }
    } = uiStyle

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
                primary: iconNP,
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


    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].TasksScreen

    const panelDirection = useAnimatedStyle(()=>{
        return {
            flexDirection: drawerPosition.value == 'left'? 'row' : 'row-reverse',
        }
    })

    const iconColor = useDerivedValue(()=>invertColorsHeader.value? iconNS.value: iconNP.value)

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
            opacity: fabPosition.value == 'top'? 1 : 0
        }
    })

    const fabHeadProps = useAnimatedProps(()=>{
        return {
            disabled: fabPosition.value != 'top',
            android_ripple: { 
                color: `${iconColor.value}20`,
                borderless: true,
                foreground: false
            } 
        }
    })

    const styleIcon = useAnimatedStyle(()=>({color: iconColor.value}))


    const MenuIcon = () => {

        const currentIcon = useDerivedValue(()=>{
            const drawerNaveWeather = (appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0)
            return (menuType.value == 'classical' && drawerNaveWeather)? "weather-partly-snowy-rainy" : menuType.value == 'not'? "menu" : 'cog'
        })

        const [nameIcon, setNameIcon] = useState(currentIcon.value)

        useAnimatedReaction(()=>currentIcon.value, (newValue, oldValue)=>{runOnJS(setNameIcon)(newValue)})

        return (
            <MaterialCommunityIcons 
                name={nameIcon}
                size={26}
            />
        )
    }

    const textColor = useAnimatedStyle(()=>({color: invertColorsHeader.value? textColorNS.value : textColorNP.value}))

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
            <Reanimated.Text style = {[textColor, {
                fontSize: 19,
                fontWeight: '500',
                letterSpacing: 1,
                fontVariant: ['small-caps'],
            }]}>
                {Language.HeaderTitle}
            </Reanimated.Text>
            <View style={{backgroundColor: TRANSPARENT_COLOR, borderRadius: HEADER_TOOL_HEIGHT/2}}>
                <RPressable 
                    style={[fabHeadVisible, {
                        height: HEADER_TOOL_HEIGHT,
                        width: HEADER_TOOL_HEIGHT,
                        //borderRadius: itemCategoryHeight/2, //appStyle.borderRadius.additional
                        justifyContent: 'center',
                        alignItems: 'center',
                    }]}
                    animatedProps={fabHeadProps}
                    onPress={fabPress}
                    onLongPress={fabLongPress}
                >
                    <Reanimated.Text style={styleIcon}>
                        <MaterialCommunityIcons 
                            name={'sticker-plus-outline'}
                            size={26}
                        />
                    </Reanimated.Text>
                </RPressable>
            </View>
        </Reanimated.View>
    )
}


const TasksTools = (props) => {
    const {
        chosesMod,

        uiStyle,
        uiTheme,

        appStyle,
        appConfig,
        LanguageAppIndex, //
        ThemeColorsAppIndex, //
        ThemeSchema, //

        changesClose,
        changesCheck,
        changesDelete,
        changesAllDelete,
    } = props

    const {
        borderRadius : {
            additional: borderRadius
        },
        navigationMenu: {
            drawerPosition,
            type: menuType,
        },
        lists: {
            invertColorsHeader
        },
        functionButton: {
            position: fabPosition
        },
        effects: {
            
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
                primary: iconAP
            },
            neutrals: {
                primary: iconNP,
                secondary: iconNS
            }
        },
        texts: {
            accents: {
              
            },
            neutrals: {
                primary: textNP,
                secondary: textNS,
            }
        },
        specials: {
            
        },
        
    } = uiTheme

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].TasksScreen

    const panelDirection = useAnimatedStyle(()=>{
        return {
            flexDirection: drawerPosition.value == 'left'? 'row' : 'row-reverse',
        }
    })

    const iconColor = useDerivedValue(()=>invertColorsHeader.value? iconNS.value: iconNP.value)

    const rippleProps = useAnimatedProps(()=>{
        return {
            android_ripple: { 
                color: `${iconColor.value}20`,
                borderless: true,
                foreground: false
            } 
        }
    })

    const styleIcon = useAnimatedStyle(()=>({color: iconColor.value}))

    const counterStyle = useAnimatedStyle(()=>{
        return {
            color: textNS.value,
            backgroundColor: basicAQ.value,
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
                            name={'close'}
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
                        width: 26,
                        height: 26,
                        textAlignVertical: 'center',
                        textAlign: 'center',
                        fontSize: 15,
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
                                name={'check'}
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
                                name={'delete'}
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