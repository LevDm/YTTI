import React, {useRef, useState, useEffect} from "react";
import { StyleSheet, View, Pressable, Dimensions, Appearance, Text } from "react-native";
import Constants from "expo-constants";

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay, 
    useAnimatedScrollHandler, 
    cancelAnimation,
    useAnimatedRef,
    useDerivedValue,
    scrollTo,
    runOnJS,
    interpolateColor,
    Extrapolation,
    interpolate,
    Extrapolate,
    runOnUI,
    Easing, 
    useAnimatedProps,
    convertToRGBA,
    withSpring,
    withRepeat,
    FadeOut,
    withSequence,
} from 'react-native-reanimated';


import  {Svg, Path, RadialGradient, LinearGradient, Stop , Defs, Rect,  } from "react-native-svg";

const RPath = Reanimated.createAnimatedComponent(Path);


const paths = [
    "M195.538 186.62C190.442 198.087 173.115 202.8 163.687 185.346L138.207 144.577C134.385 138.207 142.029 133.11 147.125 136.932L176.428 157.572",
    "M185.346 163.688L189.168 166.236C195.538 171.332 198.341 175.154 195.793 187.894C195.674 187.52 186.62 235.034 186.62 235.034C185.346 241.404 175.154 241.404 173.88 235.034L165.705 192.99",
    "M200.635 178.976L222.293 143.303C224.841 138.207 218.471 131.837 212.101 136.934L172.606 164.962C172.606 164.962 161.139 171.969 164.197 184.072",
]

const lens = [
    141.35824584960938,
    137.03329467773438,
    129.37606811523438,
]

const STROKE_WIDTH = 12.7404

const ORIGINAL_COLORS = ["#FFF", "#FFF", "#F11"];

const colorsForStroks = [["spaint4_linear", "spaint5_radial"], ["spaint0_radial", "spaint1_radial"], ["spaint2_linear", "spaint3_radial"]] 


const SplashY = (props) => {
    const {
        //appStyle,
        //appConfig,
        onLayout,    
    } = props

    //const Theme = themesColorsAppList[themesApp.indexOf(appStyle.palette.theme)][ThemeSchema]
    //const iconColorSecondary = Theme.icons.accents.primary
    //const iconColorPrimary = Theme.icons.accents.secondary

    const animationState = useSharedValue(1)
    const colorsAnimation = useSharedValue(0)

    const startAnimation = () => {
        "worklet";
        const duration = 1000

        animationState.value = withSequence(
            withTiming(2, {duration: duration*0.3, easing: Easing.linear}),
            withTiming(0, {duration: 0}),
            withRepeat(
                withSequence(
                    withTiming(1, {duration: duration*0.5, easing: Easing.linear}),
                    withTiming(1, {duration: duration*0.24, easing: Easing.linear}),
                    withTiming(2, {duration: duration*0.26, easing: Easing.linear}),
                ),
                -1,
                false,
            )
        )
    }

    useEffect(()=>{
        startAnimation()
    }, [])


    const Fills = () => {
        const colorB = 'white'
        const colorF = '#ff1111'

        return (
            <Defs>
                <RadialGradient id={"spaint0_radial"} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(180.25 180.25) rotate(90) scale(42.0433 42.5547)">
                <Stop stopColor={colorB} stopOpacity="0"/>
                <Stop offset="0.571915" stopColor={colorB} stopOpacity="0"/>
                <Stop offset="1" stopColor={colorB}/>
                </RadialGradient>
                <RadialGradient id={"spaint1_radial"} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(199.361 192.99) rotate(-149.931) scale(27.9709 65.2407)">
                <Stop offset="0.460095" stopColor={colorB}/>
                <Stop offset="1" stopColor={colorB} stopOpacity="0"/>
                </RadialGradient>


                <LinearGradient id={"spaint2_linear"} x1="181.524" y1="162.413" x2="189.168" y2="175.154" gradientUnits="userSpaceOnUse">
                <Stop stopColor={colorF}/>
                <Stop offset="1" stopColor={colorF} stopOpacity="0"/>
                </LinearGradient>
                <RadialGradient id={"spaint3_radial"} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(180.25 180.25) rotate(-20.8545) scale(28.6305 28.463)">
                <Stop stopColor={colorF} stopOpacity="0"/>
                <Stop offset="0.800957" stopColor={colorF} stopOpacity="0"/>
                <Stop offset="1" stopColor={colorF}/>
                </RadialGradient>


                <LinearGradient id={"spaint4_linear"} x1="173.88" y1="157.317" x2="170.058" y2="152.221" gradientUnits="userSpaceOnUse">
                <Stop stopColor={colorB} stopOpacity="0"/>
                <Stop offset="1" stopColor={colorB}/>
                </LinearGradient>
                <RadialGradient id={"spaint5_radial"} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(187.894 152.221) rotate(85.8151) scale(52.3752 29.8813)">
                <Stop offset="0.66209" stopColor={colorB} stopOpacity="0"/>
                <Stop offset="1" stopColor={colorB}/>
                </RadialGradient>                                       
            </Defs>
        )
    }

    const opacityStyle = useAnimatedStyle(()=>({
        opacity: interpolate(
            animationState.value,
            [0, 1, 2],
            [0, 2.5, 0]
        )
    }))

    return (
        <Reanimated.View
            style = {[StyleSheet.absoluteFill,{
                zIndex: 9999,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#111',
            }]}
            onLayout={onLayout}
        >   
            <Reanimated.View
                style={[opacityStyle,
                    //stock,
                    {
                    position: 'absolute',
                }]}
            >
                <Svg 
                    width="360" 
                    height="360" 
                    viewBox="0 0 360 360" 
                    fill="none"
                >
                    {[2, 0, 1].map((index, _) => (<AnimatedStroke order={index} animationState={animationState} colors={ORIGINAL_COLORS} d={paths[index]} key={index} />))} 
                    <Fills/>
                </Svg>          
            </Reanimated.View>
        </Reanimated.View>
    )
}

export default SplashY//connect(mapStateToProps('SPLASH'), mapDispatchToProps('SPLASH'))(SplashY);


const offsets = [0, 0, 0]//[0.26, 0.175, 0.24]
const startOrder = [0.01, 0.01, 0.01]

const AnimatedStroke = (props) => {
    const {
        order, 
        d, 
        animationState,
        colors, 
        //stroks,
    } = props

    const color = colorsForStroks[order]

    const primary_a = String(`url(#${color[0]})`)
    const secondary_a = String(`url(#${color[1]})`)

    const rotation = order > 1 ? (1) : (-1)

    const earlyStarting = -(order>0? 0 : 0) //0.12
    const currentAnimState = useDerivedValue(()=>{
        const phase = 1//paths.length // 1 //
        const start = startOrder[order] // 0 //
        return (
        interpolate(
            phase*animationState.value, 
            [start+earlyStarting, (start +1), phase + start  + earlyStarting, phase + (start +1)], 
            [ 0, 1, 1, 2], 
            {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP}
        )
    )})

    const backgroundState = useDerivedValue(()=>(2*Easing.bezier(0.61, 1, 0.88, 1).factory()(interpolate(currentAnimState.value, [0,2], [0,1]))))
    const foregroundState = useDerivedValue(()=>(2*Easing.bezier(0.37, 0, 0.63, 1).factory()(interpolate(currentAnimState.value, [0,2], [0,1])))) //0.37, 0, 0.63, 1

    const length = lens[order] 
    
    const input = [ 0, 1, 2]
    const bord_l = ((2-rotation)*length )
    const bord_r = ((2+rotation)*length )

    const offset_l =(length*offsets[order] )*((2-rotation) > 1? -1 : 1)
    const offset_r =(length*offsets[order] )*((2+rotation) > 1? -1 : 1)


    const out = [ bord_l+offset_l, 2*length, bord_r ]
 

    const ref = useRef(null);
    const animatedBGProps = useAnimatedProps(() => ({
        strokeDashoffset: interpolate(
            backgroundState.value,
            input,
            out,
            {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP}
        ),
        //strokeWidth: 0.04 < currentAnimState.value && currentAnimState.value < 1.96? STROKE_WIDTH : 0, 
    }))
    const animatedProps = useAnimatedProps(() => {
        return ({
            strokeDashoffset: interpolate(
                foregroundState.value,
                input,
                out,
                {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP}
            ),
            //strokeWidth: 0.03 < currentAnimState.value && currentAnimState.value < 1.96? STROKE_WIDTH : 0,
        })
    })
    
    return (
        <> 
        <RPath
            ref={ref}
            d={d}
            strokeDasharray={`${length} ${length}`}
            onLayout={() =>{
                //const len = ref.current?.getTotalLength()
                //console.log('layout len', len)
                //setLength(len)
            }} 
            stroke={primary_a}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round" 
            strokeLinejoin="round"
            //fill="none"
            animatedProps={animatedProps}
        />

        <RPath
            d={d}
            strokeDasharray={`${length} ${length}`}
            stroke={secondary_a}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round" 
            strokeLinejoin="round"
            animatedProps={animatedProps}
        />

        
        </>
    )
}