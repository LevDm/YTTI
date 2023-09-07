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
    withSequence
} from 'react-native-reanimated';

import themesColorsAppList, {themesApp} from "../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../app_values/Languages";

import { connect, useSelector } from "react-redux";
import store from "../../app_redux_files/store"
import mapDispatchToProps from "../../app_redux_files/dispatchToProps";
import mapStateToProps from "../../app_redux_files/stateToProps";

import Svg, { Circle, Rect, Ellipse, Path  } from "react-native-svg";

const RPath = Reanimated.createAnimatedComponent(Path);

/*
    "M183.321 197.675C170.488 200.008 164.488 189.841 164.488 189.841L135.821 139.841C132.488 134.675 138.321 130.008 142.488 132.675L171.488 152.841",
    "M188.492 164.685C199.992 172.018 196.992 183.685 196.992 183.685L184.492 239.352C183.459 245.413 175.992 245.185 174.659 240.018L166.992 205.852",
    "M164.763 170.072C165.43 168.739 168.597 166.072 168.597 166.072L215.597 133.239C220.478 129.5 225.919 134.704 223.597 139.072L205.93 169.905" 
*/


const paths = [
    "M178.976 200.635C170.058 200.635 163.688 188.404 163.688 188.404L137.187 141.901C135.149 136.804 140.755 131.836 145.851 135.658L166.236 152.221",
    "M171.332 215.923L175.154 237.582C176.428 242.378 184.072 242.378 185.346 237.582L195.648 192.753C195.648 192.753 199.361 181.524 194.264 175.154",
    
    "M210.827 167.51L226.115 143.303C227.389 138.207 222.293 135.659 217.197 138.207L171.332 170.058",
]

const STROKE_WIDTH = 10.1923

const ORIGINAL_COLORS = ["#FFF", "#FFF", "#F11"];

const SplashY = (props) => {
    const {
        //appStyle,
        //appConfig,
        onLayout,    
    } = props

    //const Theme = themesColorsAppList[themesApp.indexOf(appStyle.palette.theme)][ThemeSchema]
    //const iconColorSecondary = Theme.icons.accents.primary
    //const iconColorPrimary = Theme.icons.accents.secondary

    
    const colors2 = ORIGINAL_COLORS// [iconColorPrimary, iconColorPrimary, iconColorSecondary];

    const animationState = useSharedValue(1)
    const colorsAnimation = useSharedValue(0)

    const startAnimation = () => {
        "worklet";
        const duration = 1000

        //colorsAnimation.value = withDelay(duration*(0.3), withTiming(1, {duration: 0})) //{duration: duration/2, easing: Easing.inOut}

        animationState.value = withSequence(
            withTiming(2, {duration: duration*0.3, easing: Easing.linear}),
            withTiming(0, {duration: 0}),
            withRepeat(
                withSequence(
                    withTiming(1, {duration: duration*0.55, easing: Easing.linear}),
                    withTiming(1, {duration: duration*0.15, easing: Easing.linear}),
                    withTiming(2, {duration: duration*0.3, easing: Easing.linear})
                ),
                -1,
                false,
            )
        )
    }

    useEffect(()=>{
        startAnimation()
    }, [])

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
                style={[
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
                    {paths.map((d, index) => (<AnimatedStroke order={index} animationState={animationState} colors={ORIGINAL_COLORS} d={d} key={index} />))}            
                </Svg>
            </Reanimated.View>
            {/* 
            <Reanimated.View
                style={[users, {
                    position: 'absolute',
                }]}
            >
                <Svg 
                    width="360" 
                    height="360" 
                    viewBox="0 0 360 360" 
                    fill="none"
                >
                    {paths.map((d, index) => (<AnimatedStroke order={index} animationState={animationState} colors={colors2} d={d} key={index} />))}            
                </Svg>
            </Reanimated.View>*/}
        </Reanimated.View>
    )
}

export default SplashY//connect(mapStateToProps('SPLASH'), mapDispatchToProps('SPLASH'))(SplashY);


const lens = [
    //128.32154846191406,
    //128.24142456054688,
    //112.24468231201172,
    114.88301086425781,
    99.656982421875,
    97.82520294189453,
]

const AnimatedStroke = (props) => {
    const {
        order, 
        d, 
        animationState,
        colors, 
    } = props

    const rotation = order > 0 ? (1) : (-1)

    const earlyStarting = -(order>0? 0.12 : 0)
    const currentAnimState = useDerivedValue(()=>(
        interpolate(
            paths.length*animationState.value, 
            [order+earlyStarting, (order+1), paths.length + order + earlyStarting, paths.length + (order+1)], 
            [ 0, 1, 1, 2], 
            {extrapolateLeft: Extrapolation.CLAMP, extrapolateRight: Extrapolation.CLAMP}
        )
    ))

    const backgroundState = useDerivedValue(()=>(2*Easing.bezier(0.61, 1, 0.88, 1).factory()(interpolate(currentAnimState.value, [0,2], [0,1]))))
    const foregroundState = useDerivedValue(()=>(2*Easing.bezier(0.37, 0, 0.63, 1).factory()(interpolate(currentAnimState.value, [0,2], [0,1]))))

    const length = lens[order]
 
    //const [length, setLength] = useState(0);
    const ref = useRef(null);
    const animatedBGProps = useAnimatedProps(() => ({
        strokeDashoffset: interpolate(
            backgroundState.value,
            [ 0, 1, 2], 
            [(2-rotation)*length, 2*length, (2+rotation)*length]
        ),
        strokeWidth: 0.04 < currentAnimState.value && currentAnimState.value < 1.96? STROKE_WIDTH : 0, 
    }))
    const animatedProps = useAnimatedProps(() => {
        return ({
            strokeDashoffset: interpolate(
                foregroundState.value,
                [ 0, 1, 2],
                [(2-rotation)*length, 2*length, (2+rotation)*length]
            ),
            strokeWidth: 0.03 < currentAnimState.value && currentAnimState.value < 1.96? STROKE_WIDTH : 0,
        })
    })
    
    return (
        <>
        <RPath
            d={d}
            strokeDasharray={`${length} ${length}`}
            stroke={colors[order]}
            
            fill="none"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"     
            strokeLinejoin="round"
            strokeOpacity={0.5}
            animatedProps={animatedBGProps}
            
        />
        <RPath
            ref={ref}
            d={d}
            strokeDasharray={`${length} ${length}`}
            onLayout={() =>{
                //const len = ref.current?.getTotalLength()
                //console.log('layout len', len)
                //setLength(len)
            }} 
            stroke={colors[order]}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round" 
            strokeLinejoin="round"

            animatedProps={animatedProps}
        />
        </>
    )
}