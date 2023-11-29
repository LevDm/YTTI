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

import WeatherComponent from "../../../weather/WeatherComponent";
import Welcome from "../../../general_components/welcome/Welcome";
import News from "../../../general_components/welcome/News";

import useLanguage from "../../../app_hooks/useLanguage";
import useTasksSizes, {TRANSPARENT_COLOR} from "./common_values";


export default HeadItem = memo((props) => {
    const {
        container,

        uiStyle,
        uiTheme,
        uiComposition,
    } = props

    const {
        borderRadius : {
            primary: basicRadius,
            secondary: addRadius,
        },
        lists: {
            proximity: {
                h: fullWidth
            }
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
                secondary: basicAS,
                tertiary: basicAT
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
            shadow /** : {
                primary: shadowColorP,
                secondary: shadowColorS
            }*/
        },
        
    } = uiTheme

    const {
        SCREEN_PROXIMYTY_HRZ,

        HEAD_COMPONENT_HEIGHT,


    } = useTasksSizes()

    const ITEM_HEAD_SIZE = {
        h: (HEAD_COMPONENT_HEIGHT -12),
        w: (HEAD_COMPONENT_HEIGHT -12)*0.75,
    }



    const rippleProps = useAnimatedProps(()=>({
        android_ripple: {
            color: `${textColorNS.value}18`,
            borderless: true,
            foreground: false
        }
    }))


    const itemBorders = useAnimatedStyle(()=>({
        borderRadius: addRadius.value,
        backgroundColor: basicAS.value,
        //borderWidth: 3,
        //borderColor: basicAS.value
    }))

    const Content = () => {

        const {
            weather: {
                type
            },
            welcome: {
                show
            }
        } = uiComposition
    
    
        
        const [weather, setWeather] = useState(type.value == 'lists'? 'weather' : null)
        const [welcome, setWelcome] = useState(show.value? 'welcome' : null)
    
        useAnimatedReaction(
            ()=>type.value == 'lists'? 'weather' : null,
            (newValue, oldValue) => {
                if(newValue != oldValue){
                    runOnJS(setWeather)(newValue)
                }
            }
        )
    
        useAnimatedReaction(
            ()=>show.value? 'welcome' : null,
            (newValue, oldValue) => {
                if(newValue != oldValue ){
                    runOnJS(setWelcome)(newValue)
                }
            }
        )

        const data = useMemo(()=>{
            const row = []

            if(weather){
                row.push({
                    id: 'weather',
                    render: () => (
                        <WeatherComponent
                            type = 'lists'
                            componentSize={ITEM_HEAD_SIZE}
                            {...props}
                        />
                    )

                })
            }

            if(welcome){
                row.push({
                    id: 'welcome',
                    render: () => (
                        <Welcome
                            componentSize={ITEM_HEAD_SIZE}
                            {...props}
                        />
                    )
                    
                })
            }


            row.push({
                id: 'news',
                render: () => (
                    <News 
                        componentSize={ITEM_HEAD_SIZE}
                        {...props}
                    />
                )
            })
            return row
        }, [weather, welcome])

        const renderItem = useCallback(({item})=>{
            const {
                id,
                render
            } = item
            return (
                <Reanimated.View 
                    key={id}
                    style={[itemBorders, {
                        height: ITEM_HEAD_SIZE.h,
                        width:ITEM_HEAD_SIZE.w,
                        overflow: 'hidden',
                    }]}
                >
                    {render()}
                </Reanimated.View>
            )
        })

        return (
            <Reanimated.FlatList
                horizontal
                showsHorizontalScrollIndicator = {false}
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    padding: 2,
                    paddingHorizontal: 12,
                    alignItems: 'center',
                    gap: 12
                }}
                data={data}
                renderItem={renderItem}
            />    
        )
    }

    console.log('head item render')
    return (
        <Reanimated.View 
            style={[container, {
                position: 'absolute',
                width: '100%',
                height: HEAD_COMPONENT_HEIGHT
            }]}
            layout={Layout}
        >         
            <Content />
        </Reanimated.View>
    )
})


const staticStyles = StyleSheet.create({
   
});