import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, View,  Dimensions } from 'react-native';
import Svg, { 
    Rect, 
    Defs,  
    Stop, 
    Line,
    LinearGradient,
} from "react-native-svg";

export default ColorSchemeSwitch = ({
    scheme = 'auto',
    sizeIcon = 25,
    switching
}) => {
    const [ lscheme, setLScheme ] = useState(scheme)

    const switching0 = ()=>{
        const schemes = ['auto', 'light', 'dark'] 
        let index = schemes.indexOf(lscheme)
        index = (index+1) == schemes.length? 0 : index+1
        setLScheme(schemes[index]) 
    }

    return (
        <Pressable
            style = {{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10
            }}
            onPress={switching}
        >
            <View
                style = {{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: sizeIcon,
                    width: sizeIcon
                }}
            >
                {scheme == 'auto' && 
                <Svg width={sizeIcon} height={sizeIcon} viewBox="0 0 36 43" fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Rect x="1.5" y="21.5" width="13" height="20" rx="1.5" fill="url(#paint0_linear_401_109)" stroke="black" strokeWidth="3"/>
                <Rect x="17" y="8" width="15" height="7" rx="2" stroke="black" strokeWidth="2"/>
                <Rect x="14.5" y="14.5" width="20" height="27" rx="1.5" fill="url(#paint1_linear_401_109)" stroke="black" strokeWidth="3"/>
                <Line x1="24.5" x2="24.5" y2="7" stroke="black" strokeWidth="3"/>
                <Line x1="15" y1="16.5" x2="34" y2="16.5" stroke="black"/>
                <Line x1="18.5" y1="14" x2="18.5" y2="9" stroke="black"/>
                <Line x1="30.5" y1="14" x2="30.5" y2="9" stroke="black"/>
                <Rect x="19.15" y="19.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Line x1="3" y1="42.5" x2="33" y2="42.5" stroke="black"/>
                <Rect x="26.15" y="19.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Rect x="6.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill="black" stroke="black" strokeWidth="0.3"/>
                <Rect x="6.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Rect x="19.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill="black" stroke="black" strokeWidth="0.3"/>
                <Rect x="26.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill="black" stroke="black" strokeWidth="0.3"/>
                <Rect x="26.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill="black" stroke="black" strokeWidth="0.3"/>
                <Rect x="19.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Defs>
                <LinearGradient id="paint0_linear_401_109" x1="17" y1="30.5" x2="7" y2="41" gradientUnits="userSpaceOnUse">
                <Stop offset="0.46875" stopColor="#222222"/>
                <Stop offset="0.510417" stopColor="#222222" stopOpacity="0"/>
                </LinearGradient>
                <LinearGradient id="paint1_linear_401_109" x1="32" y1="30" x2="22.5" y2="20.5" gradientUnits="userSpaceOnUse">
                <Stop offset="0.473958" stopColor="#222222" stopOpacity="0"/>
                <Stop offset="0.510417" stopColor="#222222"/>
                </LinearGradient>
                </Defs>
                </Svg>
                }
                {scheme == 'dark' &&          
                <Svg width={sizeIcon} height={sizeIcon} viewBox="0 0 36 43" fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Rect x="1.5" y="21.5" width="13" height="20" rx="1.5" fill="#222222" stroke="black" strokeWidth="3"/>
                <Rect x="17" y="8" width="15" height="7" rx="2" stroke="black" strokeWidth="2"/>
                <Rect x="14.5" y="14.5" width="20" height="27" rx="1.5" fill="#222222" stroke="black" strokeWidth="3"/>
                <Line x1="24.5" x2="24.5" y2="7" stroke="black" strokeWidth="3"/>
                <Line x1="15" y1="16.5" x2="34" y2="16.5" stroke="black"/>
                <Line x1="18.5" y1="14" x2="18.5" y2="9" stroke="black"/>
                <Line x1="30.5" y1="14" x2="30.5" y2="9" stroke="black"/>
                <Rect x="19.15" y="19.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Line x1="3" y1="42.5" x2="33" y2="42.5" stroke="black"/>
                <Rect x="26.15" y="19.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Rect x="6.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Rect x="6.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Rect x="19.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Rect x="26.15" y="33.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Rect x="26.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                <Rect x="19.15" y="26.15" width="3.7" height="3.7" rx="0.85" fill="white" stroke="black" strokeWidth="0.3"/>
                </Svg>
                }
                {scheme == 'light' && 
                <Svg width={sizeIcon} height={sizeIcon} viewBox="0 0 36 43" fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Rect x="1.5" y="21.5" width="13" height="20" rx="1.5" stroke="black" strokeWidth="3"/>
                <Rect x="17" y="8" width="15" height="7" rx="2" stroke="black" strokeWidth="2"/>
                <Rect x="14.5" y="14.5" width="20" height="27" rx="1.5" stroke="black" strokeWidth="3"/>
                <Line x1="24.5" x2="24.5" y2="7" stroke="black" strokeWidth="3"/>
                <Line x1="15" y1="16.5" x2="34" y2="16.5" stroke="black"/>
                <Line x1="18.5" y1="14" x2="18.5" y2="9" stroke="black"/>
                <Line x1="30.5" y1="14" x2="30.5" y2="9" stroke="black"/>
                <Rect x="6" y="26" width="4" height="4" rx="1" fill="black"/>
                <Rect x="6" y="33" width="4" height="4" rx="1" fill="black"/>
                <Rect x="19" y="33" width="4" height="4" rx="1" fill="black"/>
                <Rect x="26" y="33" width="4" height="4" rx="1" fill="black"/>
                <Rect x="19" y="26" width="4" height="4" rx="1" fill="black"/>
                <Rect x="19" y="19" width="4" height="4" rx="1" fill="black"/>
                <Rect x="26" y="26" width="4" height="4" rx="1" fill="black"/>
                <Rect x="26" y="19" width="4" height="4" rx="1" fill="black"/>
                <Line x1="3" y1="42.5" x2="33" y2="42.5" stroke="black"/>
                </Svg>
                }
            </View>
            <Text
                style = {{
                    marginLeft: 10
                }}
            >
            {scheme}
            </Text>    
        </Pressable>
        
    )
}