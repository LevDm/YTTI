import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text,Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Reanimated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    useAnimatedReaction,
    useDerivedValue,
    interpolate,
    interpolateColors,
    interpolateColor,
    interpolateNode,
    Extrapolate,
    withTiming
} from 'react-native-reanimated';


import languagesAppList, {languagesApp} from "../../../../../../app_values/Languages";
import themesColorsAppList, {themesApp} from "../../../../../../app_values/Themes";


import { BasePressable } from "../../../../../../general_components/base_components/BaseElements";


import Constants from "expo-constants";


const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable)


export const Phone = (props) => {

    const {
        animatedValue,
        previewAppStyleA //= {palette: {theme: 'stock', scheme: 'auto', statusbar: 'auto'}}
    } = props

    const animatedState = useSharedValue(false)
    
    const duration = 400
    const scale = 2

    useEffect(()=>{
        //console.log(props.animatedValue)
        if(animatedValue != undefined && animatedValue != animatedState.value){
            animatedState.value = animatedValue
        }
    },[animatedValue])

    const animStyleBG = useAnimatedStyle(()=>{

        const Theme = themesColorsAppList[themesApp.indexOf(previewAppStyleA.value.palette.theme)][previewAppStyleA.value.palette.scheme]

        return {
            
            backgroundColor: withTiming( 
                interpolateColor(
                    animatedState.value, 
                    [0, 1],
                    [Theme.basics.neutrals.primary, 'black']  
                ),
                {duration: duration}
            ),
        }
    },[previewAppStyleA])

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
        <Reanimated.View
            key = {props.key}
            style = {[animStyleBG,{
                top: 1,
                borderRadius: 32,
            }]}
        >
            <Reanimated.View
                style = {[animStylePhone,{
                    //top: 1,
                    borderColor: 'black',
                    
                    backgroundColor: themesColorsAppList[0].ground,
                    alignItems: 'center',
                    borderWidth: 5,
                }]}
            >
                {props.children}
            </Reanimated.View>
        </Reanimated.View>
    )
}

export default Preview = (props) => {
    const {
       // previewAppStyle,
        previewAppStyleA,
        //appStyle,
        //setAppStyle,
        //r_setAppStyle,
        //getNewAppStyleObject,
        //LanguageStore,
        onPress,
        animatedValue 
    } = props
    //console.log('preview',appStyle, previewAppStyle)
    //console.log('preview props',props.appStyle, props.previewAppStyle)
    const animatedState = useSharedValue(false)
    const duration = 400
    const scale = 2

    const scheme = 'light'
    const indexTheme = 1
    
    
    const header = useAnimatedStyle(()=>{
        const Theme = themesColorsAppList[themesApp.indexOf(previewAppStyleA.value.palette.theme)][previewAppStyleA.value.palette.scheme]

        return {
            //dynamic style
            backgroundColor: previewAppStyleA.value.lists.invertColorsHeader? Theme.basics.neutrals.secondary : Theme.basics.accents.primary, // 
            //scale params
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
    }, [previewAppStyleA])
   
    const animStyleBody = useAnimatedStyle(()=>{
        const Theme = themesColorsAppList[themesApp.indexOf(previewAppStyleA.value.palette.theme)][previewAppStyleA.value.palette.scheme]

        const heightValueReal = deviceHeight/scale - ((Constants.statusBarHeight+1)+30+35)-30

        return {
            //dynamic style
            backgroundColor: Theme.basics.neutrals.primary, 
            //scale params
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
    }, [previewAppStyleA])

    const animStyleBodyItems = useAnimatedStyle(()=>{
        const Theme = themesColorsAppList[themesApp.indexOf(previewAppStyleA.value.palette.theme)][previewAppStyleA.value.palette.scheme]

        return {
            //dynamic style
            backgroundColor: Theme.basics.neutrals.secondary,
            borderRadius: previewAppStyleA.value.borderRadius.basic,
            //scale params
        }
    }, [previewAppStyleA])

    const animStyleBodyButton = useAnimatedStyle(()=>{
        const Theme = themesColorsAppList[themesApp.indexOf(previewAppStyleA.value.palette.theme)][previewAppStyleA.value.palette.scheme]

        const sizeValue = 60
        const sizeHalfValue = sizeValue/scale

        return {
            //dynamic style
            backgroundColor: Theme.basics.accents.secondary, // Theme.basics.neutrals.tertiary
            borderRadius: previewAppStyleA.value.borderRadius.additional,
            //scale params
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
    }, [previewAppStyleA])

    

    const navigationMenu = useAnimatedStyle(()=>{
        const Theme = themesColorsAppList[themesApp.indexOf(previewAppStyleA.value.palette.theme)][previewAppStyleA.value.palette.scheme]

        return {
            //dynamic style
            backgroundColor: Theme.basics.neutrals.tertiary,
            //scale params
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
    }, [previewAppStyleA])

    const [phoneAnimatedState, setPhoneAnimatedState] = useState(false);

    const newAnimatedState = (newValue) => {
        animatedState.value = newValue;
        setPhoneAnimatedState(newValue);
    }

    useEffect(()=>{
        //console.log(props.animatedValue)
        if(animatedValue != undefined && animatedValue != animatedState.value){
            newAnimatedState(animatedValue)
        }
    },[animatedValue])

    //console.log(Theme,'|||',ThemeUpdater)

    return (
        <Phone
            //key = {props.key}
            animatedValue = {phoneAnimatedState}
            previewAppStyleA={previewAppStyleA}
            //onPress={()=>{
            //    onPress != undefined? onPress() : NaN

            //    newAnimatedState(!animatedState.value)
            //}}
        >
                <Reanimated.View
                    key = {'head'}
                    style = {[header,{
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30, //,//
                        //backgroundColor: 'red',
                        position: 'absolute',
                        zIndex: 1,
                        //opacity: 0.5,
                        top: 0
                    }, 
                    //useAnimatedStyle(()=>({backgroundColor: ThemeUpdater.value.basics.accents.primary}))
                    ]}
                >
                    <View
                        style = {[{
                            height: Constants.statusBarHeight+1,
                            width: deviceWidth,
                            borderTopLeftRadius: 25,
                            borderTopRightRadius: 25,
                            paddingHorizontal: 20,
                            //backgroundColor: themesColorsAppList[indexTheme][scheme].sky,
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
                                backgroundColor: themesColorsAppList[indexTheme][scheme].sky,
                                alignItems: 'flex-end',
                                justifyContent: 'center'
                            }]}
                        >
                            <View
                            style = {{
                                height: 20,
                                width: 100,
                                backgroundColor: themesColorsAppList[indexTheme][scheme].symbolDark, 
                                borderRadius: 14,
                            }}
                            >
                            </View>
                        </View>

                        <View
                            style = {[{
                                paddingLeft: 20,
                                flex: 1,
                                backgroundColor: themesColorsAppList[indexTheme][scheme].skyUp,
                                alignItems: 'flex-start',
                                justifyContent: 'center'
                            }]}
                        >
                            <View
                            style = {{
                                height: 20,
                                width: 100,
                                backgroundColor: themesColorsAppList[indexTheme][scheme].symbolDark, 
                                borderRadius: 14,
                            }}
                            />
                        </View>
                    </View>

                    <View
                        style = {[{
                            height: 35,
                            width: deviceWidth,
                            backgroundColor: themesColorsAppList[indexTheme][scheme].skyUp,
        
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
                                            backgroundColor: themesColorsAppList[indexTheme][scheme].symbolLight, 
                                            opacity: item === 1? 1 : .7,
                                            borderRadius: 14,
                                        }}
                                /> 
                            )
                        })}
                    </View>
                </Reanimated.View>


                <Reanimated.ScrollView
                    key = {'body'}
                    scrollEnabled = {false}
                    style = {[animStyleBody,{
                        //bottom: 30,
                        width: deviceWidth,
                        position: 'absolute'
                        //borderTopLeftRadius: 30,
                        //borderTopRightRadius: 30,
                    }, 
                    //useAnimatedStyle(()=>({backgroundColor: ThemeUpdater.value.basics.neutrals.primary}))
                    ]}
                >
                    {[1,2,3].map((item, index)=>{
                            const heightValueReal = deviceHeight/scale - ((Constants.statusBarHeight+1)+30+35)-30
                            const itemHeight = 120 
                            if(item * (itemHeight + 10) > heightValueReal){
                                return 
                            }

                            return(
                                <Reanimated.View
                                    key = {String('elements'+item+index)} 
                                    style = {[{
                                        height: itemHeight,
                                        //zIndex: 0,
                                        //borderRadius: previewAppStyle.borderRadius.basic,
                                        //borderRadius: previewAppStyleA.value.borderRadius.additional,
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
                                        
                                    },animStyleBodyItems]}
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
                                            backgroundColor: themesColorsAppList[indexTheme][scheme].symbolDark,
                                            borderRadius: 14,
                                        }}
                                        />
                                        <View
                                        style = {{
                                            height: 16,
                                            top: 2,
                                            width: '100%',
                                            backgroundColor: themesColorsAppList[indexTheme][scheme].symbolDark,
                                            borderRadius: 14,
                                        }}
                                        />
                                        <View
                                        style = {{
                                            height: 16,
                                            top: 4,
                                            width: '100%',
                                            backgroundColor: themesColorsAppList[indexTheme][scheme].symbolDark,
                                            borderRadius: 14,
                                        }}
                                        />
                                        <View
                                        style = {{
                                            height: 16,
                                            top: 6,
                                            width: '100%',
                                            backgroundColor: themesColorsAppList[indexTheme][scheme].symbolDark,
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
                                            backgroundColor: themesColorsAppList[indexTheme][scheme].symbolNeutral,
                                            borderRadius: 14,
                                            borderWidth: 2,
                                            borderColor: themesColorsAppList[indexTheme][scheme].symbolDark,
                                        }}
                                        /> 
                                        <View
                                        style = {{

                                            height: 10,
                                            width: 90,
                                            backgroundColor: themesColorsAppList[indexTheme][scheme].symbolNeutral,
                                            borderRadius: 14,
                                        }}
                                        /> 
                                    </View>
                                </Reanimated.View>
                            )
                    })}
                </Reanimated.ScrollView>


                <Reanimated.View
                    key = {String('foot')}
                    style = {[navigationMenu, {
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
                                            backgroundColor: item === 1 ? themesColorsAppList[indexTheme][scheme].symbolDark : '',
                                            borderRadius: 14,
                                            borderWidth: 2,
                                            borderColor: themesColorsAppList[indexTheme][scheme].symbolDark,
                                        }}
                                    /> 
                                    <View
                                        style = {{
                                            height: 10,
                                            width: 50,
                                            top: 5,
                                            backgroundColor: themesColorsAppList[indexTheme][scheme].symbolDark,
                                            borderRadius: 14,
                                        }}
                                    /> 
                                </View>
                        )
                    })}
                </Reanimated.View>

                <Reanimated.View
                    key = {String('funcbutton')}
                    style = {[animStyleBodyButton,{
                        backgroundColor: themesColorsAppList[indexTheme][scheme].sky,
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
                </Reanimated.View> 
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