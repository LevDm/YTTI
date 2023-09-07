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


    const groundColor = useAnimatedStyle(()=>{
        //const height = deviceHeight*0.4

        //dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
        //gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}

        return {
            //dynamic style
            height: deviceHeight,
            width: deviceWidth,//-(previewAppStyleA.value.modals.fullWidth? 0 : 10),
            backgroundColor: `${previewAppPalette.value.specials.dimout}25`,

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
    
    
    const panel = useAnimatedStyle(()=>{
        const height = deviceHeight/2 + 20

        //dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
        //gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}

        const angleLeft = previewAppStyleA.value.navigationMenu.drawerPosition == 'left' ? 30 : 0
        const angleRight = previewAppStyleA.value.navigationMenu.drawerPosition == 'right' ? 30 : 0

        return {
            //dynamic style
            height: deviceHeight+2,
            width: deviceWidth*0.75,
            backgroundColor: previewAppPalette.value.basics.neutrals.primary,

            left: previewAppStyleA.value.navigationMenu.drawerPosition == 'right'? deviceWidth*0.25 : 0,
            //right: 0,

            borderTopLeftRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ angleLeft, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
            borderBottomLeftRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ angleLeft, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),

            borderTopRightRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ angleRight, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
            borderBottomRightRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ angleRight, 0],
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
                            [ -(deviceHeight/2+22), 0],
                            { extrapolateRight: Extrapolate.CLAMP }
                        ),
                        {duration: duration}
                    ), 
                },
                {   translateX: withTiming( 
                    interpolate(
                        animatedState.value, 
                        [ 0, 1 ],
                        [ previewAppStyleA.value.navigationMenu.drawerPosition == 'left' ? -(deviceWidth*0.40) : -(deviceWidth*0.657), 0],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                ), 
            },
            ],
        }
    }, [previewAppStyleA, previewAppPalette])


    const panelHead = useAnimatedStyle(()=>{
        const angleRight = previewAppStyleA.value.navigationMenu.drawerPosition == 'right' ? 30 : 0
        const angleLeft = previewAppStyleA.value.navigationMenu.drawerPosition == 'left' ? 30 : 0
        return {
            borderTopRightRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ angleRight, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
            borderTopLeftRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ angleLeft, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
            //justifyContent: previewAppStyleA.value.navigationMenu.drawerPosition == 'left'? 'flex-end' : 'flex-start',
            backgroundColor: previewAppStyleA.value.lists.invertColorsHeader? previewAppPalette.value.basics.neutrals.secondary : previewAppPalette.value.basics.accents.primary,
        }
    }, [previewAppStyleA, previewAppPalette])

    const panelHeadIcon = useAnimatedStyle(()=>{

        return {
            marginLeft: previewAppStyleA.value.navigationMenu.drawerPosition == 'left'? deviceWidth*0.55: 0,
            borderColor: previewAppStyleA.value.lists.invertColorsHeader? previewAppPalette.value.icons.neutrals.secondary : previewAppPalette.value.icons.neutrals.primary
        }
    }, [previewAppStyleA, previewAppPalette])

    

    const MenuText_0 = useAnimatedStyle(()=>{
        const visible = previewAppStyleA.value.navigationMenu.type == 'not'

        return {
            color: ( visible)?  previewAppPalette.value.texts.neutrals.secondary : 'transparent'
        }
    }, [previewAppStyleA, previewAppPalette])

    const MenuText_1 = useAnimatedStyle(()=>{
        const visible = previewAppStyleA.value.navigationMenu.type == 'not'

        return {
            color: (visible)? 
                (previewAppStyleA.value.navigationMenu.accentsType.coloring? previewAppPalette.value.texts.accents.primary : previewAppPalette.value.texts.neutrals.secondary ) :
                'transparent'
        }
    }, [previewAppStyleA, previewAppPalette])


    const MenuIcon_0 = useAnimatedStyle(()=>{
        const visible = previewAppStyleA.value.navigationMenu.type == 'not'

        return {
            borderColor: visible? previewAppPalette.value.texts.neutrals.secondary : 'transparent'
        }
    }, [previewAppStyleA, previewAppPalette])

    const MenuIcon_1 = useAnimatedStyle(()=>{
        const visible = previewAppStyleA.value.navigationMenu.type == 'not'

        return {
            backgroundColor: (previewAppStyleA.value.navigationMenu.accentsType.filling && visible)? (previewAppStyleA.value.navigationMenu.accentsType.coloring?  previewAppPalette.value.texts.accents.primary : previewAppPalette.value.texts.neutrals.secondary ) : 'transparent',
            borderColor: visible? (previewAppStyleA.value.navigationMenu.accentsType.coloring? previewAppPalette.value.texts.accents.primary : previewAppPalette.value.texts.neutrals.secondary) : 'transparent'
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


    return (
        <Phone
            //key = {props.key}
            //index = {index}
           // animatedValue = {animatedValue}
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
                key = {'Groud'}
                style = {[groundColor,{
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
                key = {'PANEL'}
                style = {[panel,{
                    //borderTopLeftRadius: 30,
                    //borderTopRightRadius: 30, //,//
                    //backgroundColor: 'red',
                    //top: 0,
                    position: 'absolute',
                    top: -1
                }]}
            >
                <Reanimated.View
                    style={[{
                        //backgroundColor: 'red',
                        height: 100,
                        width: '100%',
                        paddingTop: 30,
                        paddingHorizontal: 24
                    }, panelHead]}
                >
                    <Reanimated.View style={[panelHeadIcon, staticStyles.iconBorder, {height: 35, width: 35, borderRadius: 20}]}/>
                </Reanimated.View>

                <View
                    key = {String('navigater')} 
                    style = {{
                        //flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        //backgroundColor: 'red',
                        padding: 3,
                    }}
                >
                    <Reanimated.View style = {[staticStyles.iconBorder, MenuIcon_0, {}]}/> 
                    
                    <ReanimatedText
                        style={[MenuText_0,{
                            fontSize: 16
                        }]}
                    >
                        Text
                    </ReanimatedText>
                    <View
                        style={{
                            top: 10,
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        <Reanimated.View style = {[staticStyles.iconBorder, MenuIcon_1, { marginLeft: 2}]}/> 
                        <ReanimatedText
                            style={[MenuText_1,{
                                fontSize: 16
                            }]}
                        >
                            Text
                        </ReanimatedText>
                    </View>
                </View>

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