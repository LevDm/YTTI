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
    withTiming, 
    useAnimatedScrollHandler, 
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
    useAnimatedProps
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import languagesAppList, {languagesApp} from "../../app_values/Languages";
import themesColorsAppList, {themesApp} from "../../app_values/Themes";
const Thema = themesColorsAppList[0]['light']

export const BasePressable = ({
    type = "ti",
    icon = {name: "border-none-variant", size: 25, color: Thema.icons.neutrals.primary },
    text = "Text",
    textStyle = {},
    style = {},
    styleItemContainer = {},  
    onPress,
    onLongPress,
    direction = "row", //column || row ?&&(-reverse)
    rippleColor = false,
    android_ripple
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
    
    let rippleRadius = 15
    if(style.width && style.height){
        if(style.width >= style.height){
            rippleRadius = style.width/2
        } else {
            rippleRadius = style.height/2
        }
    } else if(style.width){
        rippleRadius = style.width/2
    } else if(style.height){
        rippleRadius = style.height/2
    }


    const dynamicStyle = useAnimatedStyle(()=>{
        const duration = 300
        return {
            height: withTiming(style.height, {duration: duration}),
            width: withTiming(style.width, {duration: duration}),
            borderRadius: withTiming(style.borderRadius, {duration: duration}),
            backgroundColor: withTiming(style.backgroundColor, {duration: duration}),
        }
    })

    return (
        <Animated.View 
            style = {[
                staticStyles.area, 
                style,
                dynamicStyle, 
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
                android_ripple = {android_ripple? android_ripple : {}}
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
                        color = {icon.color == undefined? Thema.icons.neutrals.primary : icon.color}
                    />
                    }
                </View>
            </Pressable>
        </Animated.View>               
    )
}

const AnimatedSlider = Animated.createAnimatedComponent(Slider)
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
            style = {[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                //width: "100%",
                flex: 1,
                height: 40,
                paddingBottom: 15
                //backgroundColor: 'red'
            }, areaStyle]}
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
            <AnimatedSlider                
                style = {{
                    flex: 1,
                }}
                //animatedProps={dynamicColors}
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

export const BaseBox = ({
    isCheckBox = false,
    Item = <Text>Text</Text>,
    BoxBorderRadius = 12,
    style = {},
    rippleColor = '#00000080',
    ColorsChange = {true: Thema.icons.neutrals.primary, false: Thema.icons.neutrals.secondary},
    Check = false,
    onLongPress,
    onPress,
    android_ripple
}, props) => {

    const dynamicStylePrimaryBox = useAnimatedStyle(()=>{
        const duration = 300
        return {
            borderWidth: withTiming(isCheckBox? 2 :(Check? 2 : 0), {duration: duration}),
            borderRadius: withTiming(BoxBorderRadius, {duration: duration}),
            borderColor: withTiming(ColorsChange.true, {duration: duration}),
        }
    }, [Check,BoxBorderRadius, ColorsChange])

    const dynamicStyleSecondaryBox = useAnimatedStyle(()=>{
        const duration = 300
        return {
            margin: withTiming(isCheckBox? 2 : (Check? 2 : 4), {duration: duration}),
            borderRadius: withTiming((BoxBorderRadius-4), {duration: duration}),
            backgroundColor: withTiming((Check? ColorsChange.true : ColorsChange.false) , {duration: duration})
        }
    }, [Check, BoxBorderRadius, ColorsChange])

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
                android_ripple = {android_ripple? android_ripple : {}}
                //android_ripple = {{
                //    color: rippleColor,
                //    borderless: true,
                //    foreground: false
                //}}
                unstable_pressDelay = {300}
                onLongPress = {onLongPress}
                onPress = {onPress}
            >
                <Animated.View
                    style = {[dynamicStylePrimaryBox, {
                        //borderRadius: BoxBorderRadius,
                        //borderWidth: Check? 2 : 0,
                        minHeight: 30,
                        minWidth: 30,
                        //borderColor: ColorsChange.true,
                        justifyContent: "center",
                        alignContent: 'center'
                    }]}
                >
                    <Animated.View
                        style = {[dynamicStyleSecondaryBox, {
                            //borderRadius: BoxBorderRadius-4,
                            //margin: Check? 2 : 4,
                            flex: 1,
                            //backgroundColor: Check? ColorsChange.true : ColorsChange.false,
                        }]}
                    />
                </Animated.View>
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

    const dynamicStyleTrack = useAnimatedStyle(()=>{
        return {    
            backgroundColor: withTiming((switchValue? colors.track.true : colors.track.false), {duration: duration}),
        }
    },[switchValue, colors])
    

    const dynamicStyleTrumb = useAnimatedStyle(()=>{
        return {
            backgroundColor: withTiming((!switchValue? colors.thumb.true : colors.thumb.false), {duration: duration}),
            transform: [
                {translateX: withTiming((size*(!switchValue? -0.5 : 0.6)), {duration: duration})}
            ],
        }
    },[switchValue, colors])

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
            }, trackStyle, dynamicStyleTrack]}
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
                }, thumbStyle, dynamicStyleTrumb]}
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