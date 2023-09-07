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
    convertToRGBA,
    withTiming
} from 'react-native-reanimated';


import languagesAppList, {languagesApp} from "../../../../../../app_values/Languages";
import themesColorsAppList, {themesApp} from "../../../../../../app_values/Themes";

import {
    Canvas,
    RoundedRect,
    LinearGradient,
    useValue,
    useComputedValue,
    useSharedValueEffect,
    Skia,
    Shader,
    rrect,
    rect,
    vec
} from "@shopify/react-native-skia";

import { BasePressable } from "../../../../../../general_components/base_components/BaseElements";
import SkiaViewDisign from "../../../../../../general_components/base_components/SkiaViewDisign";

import Constants from "expo-constants";

import { listsHorizontalProximity } from "../../../../../../app_values/AppDefault";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const horizontalProximity = listsHorizontalProximity['true']

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable)
const ReanimatedText = Reanimated.createAnimatedComponent(Text)

import Phone from "./Basis"

const SkiaLinearGradient = (props) => {
    const {
        previewAppStyleA, 
        //ThemeSchema, 
        previewAppPalette
    } = props 
    //const gradientSize = 2.5*itemSize//-2
    const noneColor = '#00000000'
    const skiaFirstColor = useValue([noneColor, noneColor]);
    const skiaBorderRadius = useValue(0);
    
    //console.log()
    const c = useDerivedValue(()=>convertToRGBA(previewAppStyleA.value.modals.highlightMethods.gradient? [previewAppPalette.value.basics.accents.quaternary, previewAppPalette.value.basics.neutrals.quaternary] : [noneColor, noneColor]) )


    const w = useDerivedValue(()=>deviceWidth-(previewAppStyleA.value.modals.fullWidth? 0 : horizontalProximity))
    const r = useDerivedValue(()=>previewAppStyleA.value.borderRadius.additional)

    return (
        <Canvas 
            style={{flex: 1, }}
        >
        <RoundedRect
            x={0}
            y={0}
            width={w}
            height={100}
            r={r}
            //color={c}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, 100)}
            //positions={[0,1]}
            colors={c}
          />
        </RoundedRect>
      </Canvas>
    )
}

export default Preview = (props) => {
    const {
        previewAppStyleA,
        previewAppPalette,
        //ThemeSchema,
        //frameColor,
        //index,
        aScale: animatedValue 
    } = props
    //console.log('preview',appStyle, previewAppStyle)
    //console.log('preview props',props.appStyle, props.previewAppStyle)
    const animatedState = useDerivedValue(()=>{
        return animatedValue.value//[index]
    }, [animatedValue])
    //const animatedState = useSharedValue(false)
    const duration = 400
    const scale = 2

    const scheme = 'light'
    const indexTheme = 1


    const modalGroundColor = useAnimatedStyle(()=>{
        //const height = deviceHeight*0.4

        //dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
        //gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}

        return {
            //dynamic style
            height: deviceHeight,
            width: deviceWidth,//-(previewAppStyleA.value.modals.fullWidth? 0 : 10),
            backgroundColor: previewAppStyleA.value.modals.highlightMethods.dimOutDark? `${previewAppPalette.value.specials.dimout}25`: 'transparent',

            //borderWidth: previewAppStyleA.value.modals.highlightMethods.outline? 1 : 0,
           // borderBottomWidth: 0,
            //borderColor: Theme.basics.accents.tertiary,

            borderRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ 10, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
            
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
                        [ deviceHeight/2+20, 0],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                ),
                    
                }
            ],
        }
    }, [previewAppStyleA, previewAppPalette])
    
    
    const modal = useAnimatedStyle(()=>{
        const height = deviceHeight*0.4

        //dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
        //gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}

        return {
            //dynamic style
            height: height,
            width: deviceWidth-(previewAppStyleA.value.modals.fullWidth? 0 : 2*horizontalProximity),
            backgroundColor: previewAppPalette.value.basics.neutrals.quaternary,

            borderWidth: previewAppStyleA.value.modals.highlightMethods.outline? 1 : 0,
            borderBottomWidth: 0,
            borderColor: previewAppPalette.value.basics.accents.tertiary,

            borderTopLeftRadius: previewAppStyleA.value.borderRadius.additional,
            borderTopRightRadius: previewAppStyleA.value.borderRadius.additional,
            //scale params

            borderBottomLeftRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ 30, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),

            borderBottomRightRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ 30, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),

            
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
                        [ height/2 + 10, 0],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                ),
                    
                }
            ],
        }
    }, [previewAppStyleA, previewAppPalette])


    const hangle = useAnimatedStyle(()=>{
        return {
            backgroundColor: previewAppPalette.value.icons.accents.primary
        }
    }, [previewAppStyleA, previewAppPalette])



    const ListText_0 = useAnimatedStyle(()=>{

        return {
            color: previewAppPalette.value.texts.neutrals.primary
        }
    }, [previewAppStyleA, previewAppPalette])

    const ListText_1 = useAnimatedStyle(()=>{

        return {
            color: previewAppPalette.value.texts.neutrals.secondary
        }
    }, [previewAppStyleA, previewAppPalette])

    const ListText_2 = useAnimatedStyle(()=>{

        return {
            color: previewAppPalette.value.texts.neutrals.tertiary
        }
    }, [previewAppStyleA, previewAppPalette])

    const ListIcon_0 = useAnimatedStyle(()=>{

        return {
            borderColor: previewAppPalette.value.icons.neutrals.primary
        }
    }, [previewAppStyleA, previewAppPalette])


    const ListIcon_1 = useAnimatedStyle(()=>{

        return {
            borderColor: previewAppPalette.value.icons.neutrals.secondary
        }
    }, [previewAppStyleA, previewAppPalette])


    const animStyleBodyItems = useAnimatedStyle(()=>{

        return {
            //dynamic style
            backgroundColor: previewAppPalette.value.basics.neutrals.secondary,
            borderRadius: previewAppStyleA.value.borderRadius.additional,
            //scale params
        }
    }, [previewAppStyleA, previewAppPalette.value])

    const aStyleShadows = useAnimatedStyle(()=>{
        const type = previewAppStyleA.value.effects.shadows
        const primary = previewAppPalette.value.specials.shadow.primary
        const secondary = previewAppPalette.value.specials.shadow.secondary

        let shadowSize = {top: 0, left: 0, right: 0, bottom: 0}
        let shadowOpacity = {top: '', left: '', right: '', bottom: ''}
        let shadowColors= {top: 'transparent', left: 'transparent', right: 'transparent', bottom: 'transparent'}

        const vertical = 4
        const horizontal = previewAppStyleA.value.lists.fullWidth? 0 : 4

        switch(type){
            case 'material':
                shadowSize = {top: 0, left: 0, right: 0, bottom: vertical};
                shadowOpacity = {top: '20', left: '20', right: '20', bottom: '20'};
                shadowColors = {top: primary, left: primary, right: primary, bottom: primary};
                break;
            case 'neomorphism':
                shadowSize = {top: vertical, left: horizontal, right: horizontal, bottom: vertical};
                shadowOpacity = {top: '20', left: '20', right: '20', bottom: '20'};
                shadowColors = {top: secondary, left: secondary, right: primary, bottom: primary};
                break;
            case "square":
                shadowSize = {top: 0, left: 0, right: horizontal, bottom: vertical};
                shadowOpacity = {top: '01', left: '01', right: '89', bottom: '89'};
                shadowColors = {top: primary, left: primary, right: primary, bottom: primary};
                break;    
            case 'full':
                shadowSize = {top: vertical, left: horizontal, right: horizontal, bottom: vertical};
                shadowOpacity = {top: '20', left: '20', right: '20', bottom: '20'};
                shadowColors = {top: primary, left: primary, right: primary, bottom: primary};
                break;
            
            default:
                console.log('off shadows in preview_1')
        }
        //console.log(type, shadowSize, shadowOpacity, shadowColors)
        return {
            borderTopWidth: shadowSize.top,
            borderLeftWidth: shadowSize.left,

            borderRightWidth: shadowSize.right,
            borderBottomWidth: shadowSize.bottom,

            borderTopColor:`${shadowColors.top}${shadowOpacity.top}`,
            borderLeftColor:`${shadowColors.left}${shadowOpacity.left}`,

            borderRightColor:`${shadowColors.right}${shadowOpacity.right}`,
            borderBottomColor:`${shadowColors.bottom}${shadowOpacity.bottom}`,
        }
    },[previewAppStyleA, previewAppPalette])


    const animStyleBodyItems_w = useAnimatedStyle(()=>{

        return {
            //dynamic style
            backgroundColor: previewAppPalette.value.basics.accents.tertiary,
            borderRadius: previewAppStyleA.value.borderRadius.additional,
        }
    }, [previewAppStyleA, previewAppPalette])

    /*
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
    */
    //console.log(Theme,'|||',ThemeUpdater)

    return (
        <Phone
            //key = {props.key}
            //index = {index}
            //animatedValue = {animatedValue}
            //previewAppStyleA={previewAppStyleA}
            //previewAppPalette={previewAppPalette}
            //frameColor = {frameColor}
            //ThemeSchema={ThemeSchema}
            //onPress={()=>{
            //    onPress != undefined? onPress() : NaN

            //    newAnimatedState(!animatedState.value)
            //}}
            {...props}
        >
            <Reanimated.View
                key = {'modalGroud'}
                style = {[modalGroundColor,{
                    //borderTopLeftRadius: 30,
                    //borderTopRightRadius: 30, //,//
                    //backgroundColor: 'red',
                    
                    position: 'absolute',
                    //zIndex: 1,
                    //opacity: 0.5,
                    bottom: 0
                }]}
            />
            <Reanimated.View
                key = {'modal'}
                style = {[modal,{
                    position: 'absolute',
                    zIndex: 1,
                    bottom: 0,
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }]}
            >
                <View 
                    style={{
                        height: 100,
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        opacity: 0.25,
                        //borderRadius: 20
                    }}
                >
                    <SkiaLinearGradient 
                        previewAppStyleA = {previewAppStyleA}
                        previewAppPalette = {previewAppPalette}
                        //ThemeSchema = {ThemeSchema}
                    />
                </View>
                <Reanimated.View
                    style = {[hangle,{
                        width: 50, 
                        height: 4,
                        borderRadius: 2,
                        marginTop: 10
                    }]}
                />
                <View
                    style={{
                        marginTop: 20,
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 30
                    }}
                >
                    <Reanimated.View style={[ListIcon_1, staticStyles.iconBorder, {height: 20, width: 20}]}/>
                    <ReanimatedText
                        style ={[ListText_1, {
                            fontWeight: 'bold',
                            fontSize: 20,
                        }]}
                    >
                        Text
                    </ReanimatedText>
                    <ReanimatedText
                        style ={[ListText_2, {
                            fontWeight: 'bold',
                            fontSize: 20,
                        }]}
                    >
                        Text
                    </ReanimatedText>
                </View>

                {[1,2].map((item, index)=>(
                <Reanimated.View
                    key = {String('elements'+item+index)} 
                    style = {[{
                        width: '70%',
                        height: 100,
                        marginTop: 10,
                        //zIndex: 0,
                        //borderRadius: previewAppStyle.borderRadius.basic,
                        //borderRadius: previewAppStyleA.value.borderRadius.additional,
                        //margin: 5,
                        padding: 10,
                        //backgroundColor: 'white',
                        /* 
                        elevation: 1,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        */
                    },aStyleShadows, index != 0? animStyleBodyItems : animStyleBodyItems_w]}
                >
                    {index != 0 && <>
                        <Reanimated.View style={[ListIcon_1, staticStyles.iconBorder, {height: 20, width: 20}]}/>
                        <ReanimatedText
                            style ={[ListText_1, {
                                fontWeight: 'bold',
                                fontSize: 14,
                            }]}
                        >
                            Text
                        </ReanimatedText>
                        <ReanimatedText
                            style ={[ListText_2, {
                                fontWeight: 'bold',
                                fontSize: 12
                            }]}
                        >
                            Text
                        </ReanimatedText>
                    </>}

                    {index == 0 && <>
                        <Reanimated.View style={[ListIcon_0, staticStyles.iconBorder, {height: 20, width: 20}]}/>
                        <ReanimatedText
                            style ={[ListText_0, {
                                fontWeight: 'bold',
                                fontSize: 15,
                            }]}
                        >
                            Text
                        </ReanimatedText>
                        <ReanimatedText
                            style ={[ListText_2, {
                                fontWeight: 'bold',
                                fontSize: 12,
                            }]}
                        >
                            Text
                        </ReanimatedText>
                    
                    </>}

                </Reanimated.View>
            ))}
            </Reanimated.View>


        </Phone>
    )
}

const staticStyles = StyleSheet.create({

    iconBorder: {
        borderWidth: 2,
        height: 30,
        width: 30,
        borderRadius: 15
    }
});