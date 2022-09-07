import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text,Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    interpolate,
    interpolateColors,
    interpolateColor,
    interpolateNode,
    Extrapolate,
    withTiming
} from 'react-native-reanimated';


import LanguagesAppList, {languagesApp} from "../language/language";
import ThemesColorsAppList, {themesApp} from "../styles/ColorsApp";
import dataRedactor from "../async_data_manager/data_redactor";
import ColorSplash from "../componets/StyleColorSplash";

import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../componets/base/BaseElements";


import Constants from "expo-constants";


const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


const AnimatedPressable = Animated.createAnimatedComponent(Pressable)


export const Phone = (props) => {

    const animatedState = useSharedValue(false)
    
    const duration = 400
    const scale = 2

    useEffect(()=>{
        //console.log(props.animatedValue)
        if(props.animatedValue != undefined && props.animatedValue != animatedState.value){
            animatedState.value = props.animatedValue
        }
    },[props.animatedValue])

    const animStyleBG = useAnimatedStyle(()=>{
        return {
            
            backgroundColor: withTiming( 
                interpolateColor(
                    animatedState.value, 
                    [0, 1],
                    ['white', 'black']  
                ),
                {duration: duration}
            ),
        }
    })

    const animStylePhone = useAnimatedStyle(()=>{
        const borderWidth = 5

        const heightValue = deviceHeight
        const heightHalfValue = heightValue/scale

        const widthValue = (deviceWidth+2*borderWidth)
        const widthHalfValue = widthValue/scale
        return {
            height: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ heightHalfValue, heightHalfValue+2*borderWidth],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
            width: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ widthHalfValue, widthValue],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
            borderRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ 20, 32],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),    
        }
    })

    return(
        <AnimatedPressable
            key = {props.key}
            style = {[animStyleBG,{
                top: 1,
                borderRadius: 16,
            }]}
            onPress={()=>{
                console.log('phone press')
                props.onPress != undefined? props.onPress() : NaN
                animatedState.value = !(animatedState.value)   
            }}
        >
            <Animated.View
                style = {[animStylePhone,{
                    //top: 1,
                    borderColor: 'black',
                    
                    backgroundColor: ThemesColorsAppList[0].ground,
                    alignItems: 'center',
                    borderWidth: 5,
                }]}
            >
                {props.children}
            </Animated.View>
        </AnimatedPressable>
    )
}

export default Preview = (props, {
    previewAppStyle,
    appStyle,
    setAppStyle,
    r_setAppStyle,
    getNewAppStyleObject,
    LanguageStore  
    }) => {
    //console.log('preview',appStyle, previewAppStyle)
    //console.log('preview props',props.appStyle, props.previewAppStyle)
    const animatedState = useSharedValue(false)
    const duration = 400
    const scale = 2

    const [PreviewThemeColorsAppIndex, setPreviewThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.theme))
    useEffect(()=>{
        let newThemeIndex = themesApp.indexOf(props.previewAppStyle.theme)
        if(newThemeIndex != PreviewThemeColorsAppIndex){setPreviewThemeColorAppIndex(newThemeIndex)}
        //console.log('preview theme', props.previewAppStyle.theme)
    },[props.previewAppStyle])

    const animStyleBody = useAnimatedStyle(()=>{
 
        const heightValueReal = deviceHeight/scale - ((Constants.statusBarHeight+1)+30+35)-30

        return {
            height: heightValueReal,
            transform: [
                {scale: withTiming( 
                    interpolate(
                        animatedState.value, 
                        [ 0, 1 ],
                        [ .4868, 1], //0
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                    )
                },
                
                {translateY:  withTiming( 
                    interpolate(
                        animatedState.value, 
                        [ 0, 1 ],
                        [ -((Constants.statusBarHeight+1)+30+35)/2-10, ((Constants.statusBarHeight+1)+30+35) ],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                    )
                },
                
            ],
        }
    })

    const animStyleBodyButton = useAnimatedStyle(()=>{

        const sizeValue = 60
        const sizeHalfValue = sizeValue/scale

        return {
            transform: [
                {scale: withTiming( 
                    interpolate(
                        animatedState.value, 
                        [ 0, 1 ],
                        [ 0.5, 1],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                    )
                },
                {translateX: withTiming( 
                    interpolate(
                        animatedState.value, 
                        [ 0, 1 ],
                        [ 30+10, 0],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                    )
                },
                {translateY: withTiming( 
                    interpolate(
                        animatedState.value, 
                        [ 0, 1 ],
                        [ 30+75, 0],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                    )
                }
            ]
        }    
    })

    const animStyleScale2 = useAnimatedStyle(()=>{
        return {
            transform: [
                {
                    scale: withTiming( 
                        interpolate(
                            animatedState.value, 
                            [ 0, 1 ],
                            [ .4868, 1],
                            { extrapolateRight: Extrapolate.CLAMP }
                        ),
                        {duration: duration}
                    ),
                    
                },
                {   translateY: withTiming( 
                    interpolate(
                        animatedState.value, 
                        [ 0, 1 ],
                        [ -50, 0],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                ),
                    
                }
            ],
        }
    })

    const animStyleScale3 = useAnimatedStyle(()=>{
        return {
            transform: [
                {
                    scale: withTiming( 
                        interpolate(
                            animatedState.value, 
                            [ 0, 1 ],
                            [ .4868, 1],
                            { extrapolateRight: Extrapolate.CLAMP }
                        ),
                        {duration: duration}
                    ),
                    
                },
                {   translateY: withTiming( 
                    interpolate(
                        animatedState.value, 
                        [ 0, 1 ],
                        [ 31, 0],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                ),
                    
                }
            ],
        }
    })

    const getTime = () => {
        const date = new Date()
        let hours = (date.getHours())
        hours = hours <= 9? '0'+hours : hours

        let minutes = date.getMinutes()
        minutes = minutes <= 9? '0'+minutes : minutes

        return `${hours}:${minutes}`
    }


    const [phoneAnimatedState, setPhoneAnimatedState] = useState(false);

    const newAnimatedState = (newValue) => {
        animatedState.value = newValue;
        setPhoneAnimatedState(newValue);
    }

    useEffect(()=>{
        //console.log(props.animatedValue)
        if(props.animatedValue != undefined && props.animatedValue != animatedState.value){
            newAnimatedState(props.animatedValue)
        }
    },[props.animatedValue])

    

    return (
        <Phone
            //key = {props.key}
            animatedValue = {phoneAnimatedState}
            onPress={()=>{
                props.onPress != undefined? props.onPress() : NaN

                newAnimatedState(!animatedState.value)
            }}
        >
                <Animated.View
                    key = {String('head')}
                    style = {[animStyleScale2,{
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].sky,
                        position: 'absolute',
                        zIndex: 1,
                        //opacity: 0.5,
                        top: 0
                    }]}
                >
                    <View
                        style = {[{
                            height: Constants.statusBarHeight+1,
                            width: deviceWidth,
                            borderTopLeftRadius: 25,
                            borderTopRightRadius: 25,
                            paddingHorizontal: 20,
                            backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].sky,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }]}
                    >
                        <Text
                            style ={{
                                fontWeight: 'bold',
                                fontSize: 13,
                            }}
                            >
                                00:00
                        </Text>
                        <View
                            style = {{         
                                transform: [
                                    {rotate: '90deg'}
                                ],
                            }}
                        >
                            <MaterialCommunityIcons name={'battery-outline'} size={30} color={"black"} />        
                        </View>
                    </View>
                    <View
                        style = {[{
                            flexDirection: 'row',
                            height: 30,
                            width: deviceWidth
                            //backgroundColor: ThemesColorsAppList[0].sky,
                        }]}
                    >
                        <View
                            style = {[{
                                paddingRight: 20,
                                flex: 1,
                                backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].sky,
                                alignItems: 'flex-end',
                                justifyContent: 'center'
                            }]}
                        >
                            <View
                            style = {{
                                height: 20,
                                width: 100,
                                backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolDark, 
                                borderRadius: 14,
                            }}
                            >
                            </View>
                        </View>

                        <View
                            style = {[{
                                paddingLeft: 20,
                                flex: 1,
                                backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].skyUp,
                                alignItems: 'flex-start',
                                justifyContent: 'center'
                            }]}
                        >
                            <View
                            style = {{
                                height: 20,
                                width: 100,
                                backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolDark, 
                                borderRadius: 14,
                            }}
                            />
                        </View>
                    </View>
                    <View
                        style = {[{
                            height: 35,
                            width: deviceWidth,
                            backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].skyUp,
        
                            paddingHorizontal: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }]}
                    >   
                    {[1,2,3].map((item, index)=>{
                            return(
                                <View
                                    key = {String('buttons'+item+index)} 
                                        style = {{

                                            height: 16,
                                            width: 60,
                                            backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolLight, 
                                            opacity: item === 1? 1 : .7,
                                            borderRadius: 14,
                                        }}
                                /> 
                            )
                        })}
                    </View>
                </Animated.View>


                <Animated.ScrollView
                    key = {String('body')}
                    scrollEnabled = {false}
                    style = {[animStyleBody,{
                        backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].ground,
                        //bottom: 30,
                        width: deviceWidth,
                        position: 'absolute'
                        //borderTopLeftRadius: 30,
                        //borderTopRightRadius: 30,
                    }]}
                >
                    {[1,2,3].map((item, index)=>{
                            const heightValueReal = deviceHeight/scale - ((Constants.statusBarHeight+1)+30+35)-30
                            const itemHeight = 120 
                            if(item * (itemHeight + 10) > heightValueReal){
                                return 
                            }

                            return(
                                <View
                                    key = {String('elements'+item+index)} 
                                    style = {[ {
                                        height: itemHeight,
                                        //zIndex: 0,
                                        borderRadius: props.previewAppStyle.borderRadius.basic,
                                        margin: 5,
                                        padding: 10,
                                        backgroundColor: 'white',
                                        elevation: 1,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 4,
                                        
                                    }]}
                                >
                                    <View
                                        style = {{
                                            height: '70%'
                                        }}
                                    >
                                        <View
                                        style = {{
                                            height: 16,
                                            width: '100%',
                                            backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolDark,
                                            borderRadius: 14,
                                        }}
                                        />
                                        <View
                                        style = {{
                                            height: 16,
                                            top: 2,
                                            width: '100%',
                                            backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolDark,
                                            borderRadius: 14,
                                        }}
                                        />
                                        <View
                                        style = {{
                                            height: 16,
                                            top: 4,
                                            width: '100%',
                                            backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolDark,
                                            borderRadius: 14,
                                        }}
                                        />
                                        <View
                                        style = {{
                                            height: 16,
                                            top: 6,
                                            width: '100%',
                                            backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolDark,
                                            borderRadius: 14,
                                        }}
                                        />

                                    </View>
                                    <View
                                        style = {{
                                            top: 5,
                                            height: '30%',
                                            //backgroundColor: 'red',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <View
                                        style = {{
                                            height: 28,
                                            width: 28,
                                            position: 'absolute',
                                            left: 0,
                                            backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolNeutral,
                                            borderRadius: 14,
                                            borderWidth: 2,
                                            borderColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolDark,
                                        }}
                                        /> 
                                        <View
                                        style = {{

                                            height: 10,
                                            width: 90,
                                            backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolNeutral,
                                            borderRadius: 14,
                                        }}
                                        /> 
                                    </View>
                                </View>
                            )
                    })}
                </Animated.ScrollView>


                <Animated.View
                    key = {String('foot')}
                    style = {[animStyleScale3, {
                        backgroundColor: 'white',
                        width: "100%",
                        bottom: 0,
                        position: 'absolute',
                        flexDirection: 'row',
                        height: 60,
                        width: deviceWidth,
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                        borderTopWidth: 1,
                        borderTopColor: '#00000015',
                        //borderWidth: 6,
                        //borderColor: 'blue',
                        //opacity: 0.5,
                        //
                    }]}
                >

                    {[1,2,3].map((item, index)=>{
                        return(
                                <View
                                    key = {String('navigater'+item+index)} 
                                    style = {{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 3,
                                    }}
                                >
                                    <View
                                        style = {{
                                            height: 28,
                                            width: 28,
                                            backgroundColor: item === 1 ? ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolDark : '',
                                            borderRadius: 14,
                                            borderWidth: 2,
                                            borderColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolDark,
                                        }}
                                    /> 
                                    <View
                                        style = {{
                                            height: 10,
                                            width: 50,
                                            top: 5,
                                            backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].symbolDark,
                                            borderRadius: 14,
                                        }}
                                    /> 
                                </View>
                        )
                    })}
                </Animated.View>

                <Animated.View
                    key = {String('funcbutton')}
                    style = {[animStyleBodyButton,{
                        backgroundColor: ThemesColorsAppList[PreviewThemeColorsAppIndex].sky,
                        position: 'absolute',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 4,
                        height: 60,
                        width: 60,
                        borderRadius: 30,
                        bottom: 70,
                        right: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        
                    }]}
                >
                    <View
                        style = {{
                            height: 28,
                            width: 28,
                            //backgroundColor: 'black',
                            borderRadius: 14,
                            borderWidth: 2,
                            borderColor: 'white',
                        }}
                    /> 
                </Animated.View> 
        </Phone>
    )
}

const staticStyles = StyleSheet.create({
    buttons: {
        flex: 0,
        height: 100, 
        width: 100,
        marginRight: 10,
    },
    buttonsText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontVariant: ['small-caps']
    },
});