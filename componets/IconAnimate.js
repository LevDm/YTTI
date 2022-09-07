import React, { useState, useEffect } from "react";
import { View,Pressable, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated from "react-native-reanimated";

//import { motify } from 'moti'

import {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';



const AnimatedPath = Animated.createAnimatedComponent(Path);
const pathCheck = "M 214.472 403.673 L 317.318 526.241 L 634.843 259.805 C 658.208 240.2 728.318 217.965 772.971 271.18 C 816.037 322.505 801.443 379.787 762.758 412.248 L 369.777 741.998 C 342.2 765.138 317.638 767.603 287.207 764.941 C 256.776 762.278 233.332 735.739 216.62 715.822 L 62.029 531.588 C 28.9254 492.137 36.7702 426.811 76.9875 393.065 C 117.205 359.318 181.368 364.222 214.472 403.673 Z"
const pathCircle = "M 716 194.742     L 720.5 199.742   L 725 204.742     C 818 314.742 843.5 481.742 784 617.242        C 745.355 705.248 665 799.242 527 843.242         L 492 851.742     C 358 873.242 238 839.242 139 745.242           C 40 651.242 19 519.527 19 476.242               L 19 448.742     C 29 244.742 157.5 131.741 277 85.7418            C 396.5 39.7422 588.5 48.2424 716 194.742         Z"

const pathCheckValues = [
    {
        x: 214.472,
        y: 403.673
    },
    {
        x: 317.318,
        y: 526.241
    },
    {
        x: 634.843,
        y: 259.805
    },
    {
        x1: 658.208,
        y1: 240.2,
        x2: 728.318,
        y2: 217.965,
        x3: 772.971,
        y3: 271.18,
    },
    {
        x1: 816.037,
        y1: 322.505,
        x2: 801.443,
        y2: 379.787,
        x3: 762.758,
        y3: 412.248,
    },
    {
        x: 369.777,
        y: 741.998
    },
    {     
        x1: 342.2,
        y1: 765.138,
        x2: 317.638,
        y2: 767.603,
        x3: 287.207,
        y3: 764.941,
    },
    {    
        x1: 256.776,
        y1: 762.278,
        x2: 233.332,
        y2: 735.739,
        x3: 216.62,
        y3: 715.822,
    },
    { 
        x: 62.029,
        y: 531.588
    },
    {     
        x1: 28.9254,
        y1: 492.137,
        x2: 36.7702,
        y2: 426.811,
        x3: 76.9875,
        y3: 393.065,
    },
    {
        x1: 117.205,
        y1: 359.318,
        x2: 181.368,
        y2: 364.222,
        x3: 214.472,
        y3: 403.673,
    },
]

const pathCircleValues = [
    {
        x: 716,
        y: 194.742
    },
    { 
        x: 720.5,
        y: 199.742
    },
    {  
        x: 725,
        y: 204.742
    },
    {     
        x1: 818,
        y1: 314.742,
        x2: 843.5,
        y2: 481.742,
        x3: 784,
        y3: 617.242,
    },
    {   
        x1: 745.355,
        y1: 705.248,
        x2: 665,
        y2: 799.242,
        x3: 527,
        y3: 843.242,
    },
    { 
        x: 492,
        y: 851.742
    },
    {    
        x1: 358,
        y1: 873.242,
        x2: 238,
        y2: 839.242,
        x3: 139,
        y3: 745.242,
    },
    {    
        x1: 40,
        y1: 651.242,
        x2: 19,
        y2: 519.527,
        x3: 19,
        y3: 476.242,
    },
    {
        x: 19,
        y: 448.742
    },
    {    
        x1: 29,
        y1: 244.742,
        x2: 157.5,
        y2: 131.741,
        x3: 277,
        y3: 85.7418,
    },
    {  
        x1: 396.5,
        y1: 39.7422,
        x2: 588.5,
        y2: 48.2424,
        x3: 716,
        y3: 194.742,
    },
]

const pathValues = [pathCircleValues, pathCheckValues]



const IconAnimate = ({startIconAnimate, setStartIconAnimate}) => {

    const [statusAnimated, setStatusAnimated] = useState(true)

    const state = useSharedValue(0);

    const m_x = useSharedValue(pathCircleValues[0].x); //-> pathCircleValues[0].x
    const m_y = useSharedValue(pathCircleValues[0].y); //-> pathCircleValues[0].y

    const l1_x = useSharedValue(pathCircleValues[1].x); //-> pathCircleValues[1].x
    const l1_y = useSharedValue(pathCircleValues[1].y); //-> pathCircleValues[1].y

    const l2_x = useSharedValue(pathCircleValues[2].x); //-> pathCircleValues[2].x
    const l2_y = useSharedValue(pathCircleValues[2].y); //-> pathCircleValues[2].y

    const l3_x = useSharedValue(pathCircleValues[5].x); //-> pathCircleValues[5].x
    const l3_y = useSharedValue(pathCircleValues[5].y); //-> pathCircleValues[5].y

    const l4_x = useSharedValue(pathCircleValues[8].x); //-> pathCircleValues[8].x
    const l4_y = useSharedValue(pathCircleValues[8].y); //-> pathCircleValues[8].y

    const c1_1x = useSharedValue(pathCircleValues[3].x1); //-> pathCircleValues[3].x1
    const c1_1y = useSharedValue(pathCircleValues[3].y1); //-> pathCircleValues[3].y1
    const c1_2x = useSharedValue(pathCircleValues[3].x2); //-> pathCircleValues[3].x2
    const c1_2y = useSharedValue(pathCircleValues[3].y2); //-> pathCircleValues[3].y2
    const c1_3x = useSharedValue(pathCircleValues[3].x3); //-> pathCircleValues[3].x3
    const c1_3y = useSharedValue(pathCircleValues[3].y3); //-> pathCircleValues[3].y3

    const c2_1x = useSharedValue(pathCircleValues[4].x1); //-> pathCircleValues[4].x1
    const c2_1y = useSharedValue(pathCircleValues[4].y1); //-> pathCircleValues[4].y1
    const c2_2x = useSharedValue(pathCircleValues[4].x2); //-> pathCircleValues[4].x2
    const c2_2y = useSharedValue(pathCircleValues[4].y2); //-> pathCircleValues[4].y2
    const c2_3x = useSharedValue(pathCircleValues[4].x3); //-> pathCircleValues[4].x3
    const c2_3y = useSharedValue(pathCircleValues[4].y3); //-> pathCircleValues[4].y3

    const c3_1x = useSharedValue(pathCircleValues[6].x1); //-> pathCircleValues[6].x1
    const c3_1y = useSharedValue(pathCircleValues[6].y1); //-> pathCircleValues[6].y1
    const c3_2x = useSharedValue(pathCircleValues[6].x2); //-> pathCircleValues[6].x2
    const c3_2y = useSharedValue(pathCircleValues[6].y2); //-> pathCircleValues[6].y2
    const c3_3x = useSharedValue(pathCircleValues[6].x3); //-> pathCircleValues[6].x3
    const c3_3y = useSharedValue(pathCircleValues[6].y3); //-> pathCircleValues[6].y3

    const c4_1x = useSharedValue(pathCircleValues[7].x1); //-> pathCircleValues[7].x1
    const c4_1y = useSharedValue(pathCircleValues[7].y1); //-> pathCircleValues[7].y1
    const c4_2x = useSharedValue(pathCircleValues[7].x2); //-> pathCircleValues[7].x2
    const c4_2y = useSharedValue(pathCircleValues[7].y2); //-> pathCircleValues[7].y2
    const c4_3x = useSharedValue(pathCircleValues[7].x3); //-> pathCircleValues[7].x3
    const c4_3y = useSharedValue(pathCircleValues[7].y3); //-> pathCircleValues[7].y3

    const c5_1x = useSharedValue(pathCircleValues[9].x1); //-> pathCircleValues[9].x1
    const c5_1y = useSharedValue(pathCircleValues[9].y1); //-> pathCircleValues[9].y1
    const c5_2x = useSharedValue(pathCircleValues[9].x2); //-> pathCircleValues[9].x2
    const c5_2y = useSharedValue(pathCircleValues[9].y2); //-> pathCircleValues[9].y2
    const c5_3x = useSharedValue(pathCircleValues[9].x3); //-> pathCircleValues[9].x3
    const c5_3y = useSharedValue(pathCircleValues[9].y3); //-> pathCircleValues[9].y3

    const c6_1x = useSharedValue(pathCircleValues[10].x1); //-> pathCircleValues[10].x1
    const c6_1y = useSharedValue(pathCircleValues[10].y1); //-> pathCircleValues[10].y1
    const c6_2x = useSharedValue(pathCircleValues[10].x2); //-> pathCircleValues[10].x2
    const c6_2y = useSharedValue(pathCircleValues[10].y2); //-> pathCircleValues[10].y2
    const c6_3x = useSharedValue(pathCircleValues[10].x3); //-> pathCircleValues[10].x3
    const c6_3y = useSharedValue(pathCircleValues[10].y3); //-> pathCircleValues[10].y3

    const opacity = useSharedValue(0);
    const scale = useSharedValue(1.4);
    
    const duration = 600;

    const animatedProps = useAnimatedProps(() => {

        const path = `
            M ${m_x.value} ${m_y.value} 
            L ${l1_x.value} ${l1_y.value} 
            L ${l2_x.value} ${l2_y.value} 
            C ${c1_1x.value} ${c1_1y.value} ${c1_2x.value} ${c1_2y.value} ${c1_3x.value} ${c1_3y.value} 
            C ${c2_1x.value} ${c2_1y.value} ${c2_2x.value} ${c2_2y.value} ${c2_3x.value} ${c2_3y.value} 
            L ${l3_x.value} ${l3_y.value} 
            C ${c3_1x.value} ${c3_1y.value} ${c3_2x.value} ${c3_2y.value} ${c3_3x.value} ${c3_3y.value} 
            C ${c4_1x.value} ${c4_1y.value} ${c4_2x.value} ${c4_2y.value} ${c4_3x.value} ${c4_3y.value} 
            L ${l4_x.value} ${l4_y.value} 
            C ${c5_1x.value} ${c5_1y.value} ${c5_2x.value} ${c5_2y.value} ${c5_3x.value} ${c5_3y.value}
            C ${c6_1x.value} ${c6_1y.value} ${c6_2x.value} ${c6_2y.value} ${c6_3x.value} ${c6_3y.value} 
            Z
        `
        return {
            d: path,
        };
    });
    
    

    const style = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {duration: duration+400,}),
            transform: [
                {
                    scale: withTiming(scale.value, {duration: duration+400,})
                },
            ]
            
        };
    });
    
    


    const iconAnimate = () => {

        opacity.value = (opacity.value > 0.6? 0.5 : 1)
        scale.value = (scale.value > 1.2? 1 : 1.4)

        
        const outValue = state.value == 0? 1 : 0
        state.value = withTiming(state.value == 0? 1 : 0, {duration: duration})

        m_x.value = withTiming(pathValues[outValue][0].x, {duration: duration})
        m_y.value = withTiming(pathValues[outValue][0].y, {duration: duration})

        l1_x.value = withTiming(pathValues[outValue][1].x, {duration: duration})
        l1_y.value = withTiming(pathValues[outValue][1].y, {duration: duration})

        l2_x.value = withTiming(pathValues[outValue][2].x, {duration: duration})
        l2_y.value = withTiming(pathValues[outValue][2].y, {duration: duration})

        l3_x.value = withTiming(pathValues[outValue][5].x, {duration: duration})
        l3_y.value = withTiming(pathValues[outValue][5].y, {duration: duration})

        l4_x.value = withTiming(pathValues[outValue][8].x, {duration: duration})
        l4_y.value = withTiming(pathValues[outValue][8].y, {duration: duration})

        c1_1x.value = withTiming(pathValues[outValue][3].x1, {duration: duration})
        c1_1y.value = withTiming(pathValues[outValue][3].y1, {duration: duration})
        c1_2x.value = withTiming(pathValues[outValue][3].x2, {duration: duration})
        c1_2y.value = withTiming(pathValues[outValue][3].y2, {duration: duration})
        c1_3x.value = withTiming(pathValues[outValue][3].x3, {duration: duration})
        c1_3y.value = withTiming(pathValues[outValue][3].y3, {duration: duration})

        c2_1x.value = withTiming(pathValues[outValue][4].x1, {duration: duration})
        c2_1y.value = withTiming(pathValues[outValue][4].y1, {duration: duration})
        c2_2x.value = withTiming(pathValues[outValue][4].x2, {duration: duration})
        c2_2y.value = withTiming(pathValues[outValue][4].y2, {duration: duration})
        c2_3x.value = withTiming(pathValues[outValue][4].x3, {duration: duration})
        c2_3y.value = withTiming(pathValues[outValue][4].y3, {duration: duration})

        c3_1x.value = withTiming(pathValues[outValue][6].x1, {duration: duration})
        c3_1y.value = withTiming(pathValues[outValue][6].y1, {duration: duration})
        c3_2x.value = withTiming(pathValues[outValue][6].x2, {duration: duration})
        c3_2y.value = withTiming(pathValues[outValue][6].y2, {duration: duration})
        c3_3x.value = withTiming(pathValues[outValue][6].x3, {duration: duration})
        c3_3y.value = withTiming(pathValues[outValue][6].y3, {duration: duration})

        c4_1x.value = withTiming(pathValues[outValue][7].x1, {duration: duration})
        c4_1y.value = withTiming(pathValues[outValue][7].y1, {duration: duration})
        c4_2x.value = withTiming(pathValues[outValue][7].x2, {duration: duration})
        c4_2y.value = withTiming(pathValues[outValue][7].y2, {duration: duration})
        c4_3x.value = withTiming(pathValues[outValue][7].x3, {duration: duration})
        c4_3y.value = withTiming(pathValues[outValue][7].y3, {duration: duration})

        c5_1x.value = withTiming(pathValues[outValue][9].x1, {duration: duration})
        c5_1y.value = withTiming(pathValues[outValue][9].y1, {duration: duration})
        c5_2x.value = withTiming(pathValues[outValue][9].x2, {duration: duration})
        c5_2y.value = withTiming(pathValues[outValue][9].y2, {duration: duration})
        c5_3x.value = withTiming(pathValues[outValue][9].x3, {duration: duration})
        c5_3y.value = withTiming(pathValues[outValue][9].y3, {duration: duration})

        c6_1x.value = withTiming(pathValues[outValue][10].x1, {duration: duration})
        c6_1y.value = withTiming(pathValues[outValue][10].y1, {duration: duration})
        c6_2x.value = withTiming(pathValues[outValue][10].x2, {duration: duration})
        c6_2y.value = withTiming(pathValues[outValue][10].y2, {duration: duration})
        c6_3x.value = withTiming(pathValues[outValue][10].x3, {duration: duration})
        c6_3y.value = withTiming(pathValues[outValue][10].y3, {duration: duration})

        //setTimeout(()=>{setStatusAnimated(true);},duration)
        //setStatusAnimated(true);
    };

    /*
    if(startIconAnimate && statusAnimated){
        setStatusAnimated(false);

        // warning setStartIconAnimate(false);
        
        
        
        iconAnimate();
    }
    */
    

    useEffect(()=>{
        iconAnimate();
    },[])

    return (
        <Animated.View
            style ={[style, {height: 120, width: 120, }]} 
        >
        <Svg height = {120} width = {120} viewBox = {[12,60, 810, 800]}>
            <AnimatedPath  
                animatedProps={animatedProps} 
                fill="white"
                stroke="white"
                strokeWidth="5"
                
            />
        </Svg>
        </Animated.View>
    )
}

export default IconAnimate;