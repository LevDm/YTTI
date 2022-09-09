import React, {
    useState,  
    useEffect
} from "react";

import { 
    StyleSheet, 
    Text, 
    Pressable, 
    View,
} from 'react-native';

import Slider from "@react-native-community/slider";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    interpolateColor,
    Extrapolate,
    withTiming
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from "@expo/vector-icons";
import LanguagesAppList, {languagesApp} from "../../language/language";
import ThemesColorsAppList, {themesApp} from "../../styles/ColorsApp";

export const BasePressable = ({
    type = "ti",
    icon = {name: "border-none-variant", size: 25, color: ThemesColorsAppList[0].symbolDark },
    text = "Text",
    textStyle = {},
    style = {},
    styleItemContainer = {},  
    onPress,
    onLongPress,
    direction = "row", //column || row ?&&(-reverse)
    rippleColor = ThemesColorsAppList[0].shadowBlack,
    }) => {

    for (let stylesObject of [textStyle, style, styleItemContainer]) {
        if(Array.isArray(stylesObject)){
            let newStyle = {}
            for (let i of stylesObject){
                for (let j in i){
                    newStyle[j]=i[j]
                }
            }

            if( stylesObject == style ){ style = newStyle } 
            if( stylesObject == textStyle ){ textStyle = newStyle } 
            if( stylesObject == styleItemContainer ){ styleItemContainer = newStyle } 
        } 
    } 

    return (
        <View 
            style = {[
                staticStyles.area, 
                style, 
                {
                    //borderRadius: appStyle.borderRadius.additional
                }
            ]}
        >
            <Pressable
                style = {[
                    staticStyles.button, 
                    {
                        //borderRadius: appStyle.borderRadius.additional
                    }
                ]} 
                android_ripple = {{
                    color: rippleColor,
                    borderless: true,
                    foreground: true
                }}
                unstable_pressDelay = {300}
                onLongPress = {onLongPress}
                onPress = {onPress}
                
            >   
                <View
                    style = {[                     
                        {
                            flex: 1,
                            flexDirection: direction,
                            alignItems: 'center', 
                            justifyContent: 'center',
                            padding: 0
                        },
                        styleItemContainer
                    ]}
                >
                    {(type == "t" || type == "ti") && 
                    <Text style = {[staticStyles.text, textStyle]}> {text} </Text>
                    }

                    {(type == "i" || type == "ti") && 
                    <MaterialCommunityIcons 
                        name = {icon.name == undefined? "border-none-variant" : icon.name} 
                        size = {icon.size == undefined? 25 : icon.size} 
                        color = {icon.color == undefined? ThemesColorsAppList[0].symbolDark : icon.color}
                    />
                    }
                </View>
            </Pressable>
        </View>               
    )
}

export const BaseSlider = ({
    signaturesText = {left: 'left bord',right: 'right bord'},
    signaturesStyle = {},
    areaStyle = {},

    maximumTrackTintColor,
    maximumValue,
    minimumTrackTintColor,
    minimumValue,
    onSlidingComplete,
    onValueChange,
    step,
    thumbTintColor,
    value,
    }) => {

    return (
        <View      
            style = {[areaStyle,{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: "100%",
                height: 40,
                paddingBottom: 15
                //backgroundColor: 'red'
            }]}
        >
            <Text
                style = {[signaturesStyle, {
                    position: 'absolute',
                    left: 10,
                    bottom: 5
                }]}
            >
                {signaturesText.left}
            </Text>
            <Slider                
                style = {{
                    flex: 1,
                }}
                maximumTrackTintColor = {maximumTrackTintColor}
                minimumTrackTintColor = {minimumTrackTintColor}
                thumbTintColor = {thumbTintColor}

                value = {value}
                maximumValue = {maximumValue}
                minimumValue = {minimumValue}
                step = {step}

                onSlidingComplete = {onSlidingComplete}
                onValueChange = {onValueChange}  
            />
            <Text
                style = {[signaturesStyle, {
                    position: 'absolute',
                    right: 10,
                    bottom: 5
                }]}
            >
                {signaturesText.right}
            </Text>
        </View>   
    )
}

export const BaseCheckBox = ({
    Item = <Text>Text</Text>,
    BoxBorderRadius = 12,
    style = {},
    rippleColor = ThemesColorsAppList[0].shadowBlack,
    ColorsChange = {true: ThemesColorsAppList[0].symbolDark, false: ThemesColorsAppList[0].symbolNeutral},
    Check = false,
    onLongPress,
    onPress,
}, props) => {

    return (
        <View
            props = {props}
            style = {[
                {
                    minHeight: 30,
                    minWidth: 30,
                    //backgroundColor: '#00ff000f'    
                }, 
                style
            ]}
        >
            <Pressable
                style = {{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
                //android_ripple = {{
                //    color: rippleColor,
                //    borderless: true,
                //    foreground: false
                //}}
                unstable_pressDelay = {300}
                onLongPress = {onLongPress}
                onPress = {onPress}
            >
                <View
                    style = {{
                        borderRadius: BoxBorderRadius,
                        borderWidth: Check? 2 : 0,
                        minHeight: 30,
                        minWidth: 30,
                        //marginHorizontal: 10,
                        borderColor: ColorsChange.true,
                        justifyContent: "center",
                        alignContent: 'center'
                    }}
                >
                    <View
                        style = {{
                            borderRadius: BoxBorderRadius-4,
                            margin: Check? 2 : 4,
                            flex: 1,
                            backgroundColor: Check? ColorsChange.true : ColorsChange.false,
                        }}
                    />
                </View>
                
                {Item}

            </Pressable>
        </View>
    );
};


const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
export const BaseSwitch = ({
    trackStyle = {},
    thumbStyle = {},
    style = {},
    size = 30,
    primeValue = false,
    colors = {track: {true: 'green', false: 'grey'}, thumb: {true: 'green', false: 'blue'} },
    onChange,
    duration = 300
}, props) => {

    const [switchValue, setSwitchValue] = useState(primeValue);
    const animationState = useSharedValue(false);

    useEffect(()=>{
        if (animationState.value != switchValue) {animationState.value = switchValue};
    },[switchValue])


    const animStyleBG = useAnimatedStyle(()=>{
        return {
            
            backgroundColor: withTiming( 
                interpolateColor(
                    animationState.value, 
                    [0, 1],
                    [colors.track.false, colors.track.true]  
                ),
                {duration: duration}
            ),
        }
    })
    

    const animatedStyle = useAnimatedStyle(()=>{
        return {
            backgroundColor: withTiming( 
                interpolateColor(
                    animationState.value, 
                    [0, 1],
                    [colors.thumb.false, colors.thumb.true]  
                ),
                {duration: duration}
            ),
            transform: [
                {   translateX: withTiming( 
                        interpolate(
                            animationState.value, 
                            [ 0, 1 ],
                            [ -size*0.5, size*0.6],
                            { extrapolateRight: Extrapolate.CLAMP }
                        ),
                        {duration: duration}
                    ),
                    
                }
            ],
        }
    })

    return (
        <View
            style = {[{
                height: size,
                width: size*2.2,
                //backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
            }, style]}
        >
        <AnimatedPressable
            props = {props}
            style = {[{
                height: size*0.75,
                width: size*1.1,
                justifyContent: 'center',
            }, trackStyle, animStyleBG]}
            onPress = {()=>{
                setSwitchValue(!switchValue)
                if(onChange != undefined){onChange()};
            }}
        >
            <Animated.View
                style = {[{
                    height: size,
                    width: size,
                    //opacity: .3,
                    position: 'absolute' 
                }, thumbStyle, animatedStyle]}
            />
        </AnimatedPressable>
        </View>
    );
};



const staticStyles = StyleSheet.create({
    area: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 30,
        minWidth: 30,
        //alignContent: 'center',
        //borderRadius: 12,
        //backgroundColor: 'blue',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //alignContent: 'center', 
        //borderRadius: 12,
        height: '100%',
        width: '100%',
        //backgroundColor: 'grey',
    },
    text: {
        fontSize: 20,
    }
});