import React, {} from "react";

import { 
    StyleSheet, 
    Text, 
    Pressable, 
    View,
} from 'react-native';

import Slider from "@react-native-community/slider";

import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 

} from 'react-native-reanimated';

import { MaterialCommunityIcons } from "@expo/vector-icons";


import themesColorsAppList, {themesApp} from "../../app_values/Themes";
const ThemeDefault = themesColorsAppList[1]['light']


export default (props) => {
    const {
       type = "ti",
        icon = {name: "border-none-variant", size: 25, color: ThemeDefault.icons.neutrals.primary },
        text = "Text",
        textProps = null,
        textStyle = {},
        style = {},
        styleItemContainer = {},  
        onPress,
        onLongPress,
        direction = "row", //column || row ?&&(-reverse)
        rippleColor = false,
        android_ripple,
        disabled = false 
    } = props

    for (let stylesObject of [textStyle, style, styleItemContainer]) {
        if(Array.isArray(stylesObject)){
            let newStyle = {}
            for (let i of stylesObject){
                for (let j in i){
                    newStyle[j]=i[j]
                }
            }

            if( stylesObject == style ){ style = newStyle } 
            //if( stylesObject == textStyle ){ textStyle = newStyle } 
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
        <Reanimated.View 
            style = {[
                style,
                dynamicStyle, 
                {        
                    //flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    //minHeight: 30,
                    //minWidth: 30,
                    //alignContent: 'center',
                    //borderRadius: 12,
                    //backgroundColor: 'blue',
                }
            ]}
        >
            <Pressable
                disabled={disabled}
                style = {[{
                    flex: 1,
                    //justifyContent: 'center',
                    //alignItems: 'center',
                    //alignContent: 'center', 
                    //borderRadius: 12,
                    height: '100%',
                    width: '100%',
                    //backgroundColor: 'grey',
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
                    <Text {...textProps} style = {[staticStyles.text, textStyle]}> {text} </Text>
                    }

                    {(type == "i" || type == "ti") && 
                    <MaterialCommunityIcons 
                        name = {icon.name == undefined? "border-none-variant" : icon.name} 
                        size = {icon.size == undefined? 25 : icon.size} 
                        color = {icon.color == undefined? ThemeDefault.icons.neutrals.primary : icon.color}
                    />
                    }
                </View>
            </Pressable>
        </Reanimated.View>               
    )
}

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