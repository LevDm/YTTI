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

import { listsHorizontalProximity } from "../../../../../../app_values/AppDefault";

import { BasePressable } from "../../../../../../general_components/base_components/BaseElements";
import SkiaViewDisign from "../../../../../../general_components/base_components/SkiaViewDisign";

import Constants from "expo-constants";


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
        frameColor,
        index,
        animatedValue 
    } = props
    //console.log('preview',appStyle, previewAppStyle)
    //console.log('preview props',props.appStyle, props.previewAppStyle)

    const animatedState = useDerivedValue(()=>{
        return animatedValue.value[index]
    }, [animatedValue])

    //const animatedState = useSharedValue(false)
    const duration = 400
    const scale = 2

    const scheme = 'light'
    const indexTheme = 1
    
    
    const header = useAnimatedStyle(()=>{
        //console.log('PREVIEW 2', previewAppPalette.value)
        return {
            //dynamic style
            backgroundColor: `${previewAppStyleA.value.lists.invertColorsHeader? previewAppPalette.value.basics.neutrals.secondary : previewAppPalette.value.basics.accents.primary}${previewAppStyleA.value.effects.blur? '90' : 'ff'}`, // 
            //scale params
            borderTopLeftRadius: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ 30, 0],
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
            borderTopRightRadius: withTiming( 
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
                        [ -50, 0],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                ),
                    
                }
            ],
        }
    }, [previewAppStyleA, previewAppPalette])


    const StatusBarText = useAnimatedStyle(()=>{
        const groundColor = previewAppStyleA.value.lists.invertColorsHeader? previewAppPalette.value.basics.neutrals.secondary : previewAppPalette.value.basics.accents.primary

        const getContrast = (hcolor) => {
            let r = 0, g = 0, b = 0;
            if (hcolor.length == 4) {
              r = "0x" + hcolor[1] + hcolor[1];
              g = "0x" + hcolor[2] + hcolor[2];
              b = "0x" + hcolor[3] + hcolor[3];
            } else if (hcolor.length == 7) {
              r = "0x" + hcolor[1] + hcolor[2];
              g = "0x" + hcolor[3] + hcolor[4];
              b = "0x" + hcolor[5] + hcolor[6];
            } else if (hcolor.length > 7) {
              let alfa = "0x"+hcolor.slice(7)
              alfa /= 255
              return alfa > 0.5? "white" : 'black'
            }
            r /= 255;
            g /= 255;
            b /= 255;
          
            const count = (coef) => ((coef+0.055)/1.055)**2.4 
            
            let contr = count(r)+count(g)+count(b)
            console.log('PREVIEW_STATUSBAR', contr)
            return contr <= 0.65? 'white' : 'black'
        }

        const autoColor = getContrast(groundColor)

        return {
            color: previewAppStyleA.value.palette.statusBar == 'auto'? autoColor :
                previewAppStyleA.value.palette.statusBar == 'inverted'? (autoColor == 'white'? 'black' : 'white') :
                (previewAppStyleA.value.palette.statusBar == 'light'? 'white' : 'black')
        }
    }, [previewAppStyleA, previewAppPalette])


    const HeaderText = useAnimatedStyle(()=>{

        return {
            color: previewAppStyleA.value.lists.invertColorsHeader? previewAppPalette.value.texts.neutrals.secondary : previewAppPalette.value.texts.neutrals.primary
        }
    }, [previewAppStyleA, previewAppPalette])

    const HeaderIcon = useAnimatedStyle(()=>{

        return {
            borderColor: previewAppStyleA.value.lists.invertColorsHeader? previewAppPalette.value.icons.neutrals.secondary : previewAppPalette.value.icons.neutrals.primary
        }
    }, [previewAppStyleA, previewAppPalette])

    const HeaderFuncIcon = useAnimatedStyle(()=>{

        return {
            opacity: previewAppStyleA.value.functionButton.position == 'top'? 1:0
        }
    }, [previewAppStyleA, previewAppPalette])


    const HeaderIndicator = useAnimatedStyle(()=>{

        return {
            backgroundColor: previewAppStyleA.value.lists.invertColorsHeader? previewAppPalette.value.basics.accents.primary : previewAppPalette.value.basics.accents.quaternary
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
            borderColor: previewAppPalette.value.icons.accents.primary
        }
    }, [previewAppStyleA, previewAppPalette])


    const ListIcon_1 = useAnimatedStyle(()=>{

        return {
            borderColor: previewAppPalette.value.icons.neutrals.tertiary
        }
    }, [previewAppStyleA, previewAppPalette])

    const ListIcon_2 = useAnimatedStyle(()=>{

        return {
            borderColor: previewAppPalette.value.specials.fire.primary
        }
    }, [previewAppStyleA, previewAppPalette])

    const ListIcon_3 = useAnimatedStyle(()=>{

        return {
            borderColor: previewAppPalette.value.specials.fire.secondary
        }
    }, [previewAppStyleA, previewAppPalette])


    const MenuText_0 = useAnimatedStyle(()=>{
        const visible = previewAppStyleA.value.navigationMenu.type == 'classical'

        return {
            color: (previewAppStyleA.value.navigationMenu.signatureIcons && visible)?  previewAppPalette.value.texts.neutrals.secondary : 'transparent'
        }
    }, [previewAppStyleA, previewAppPalette])

    const MenuText_1 = useAnimatedStyle(()=>{
        const visible = previewAppStyleA.value.navigationMenu.type == 'classical'

        return {
            color: (previewAppStyleA.value.navigationMenu.signatureIcons && visible)? 
                (previewAppStyleA.value.navigationMenu.accentsType.coloring? previewAppPalette.value.texts.accents.primary : previewAppPalette.value.texts.neutrals.secondary ) :
                'transparent'
        }
    }, [previewAppStyleA, previewAppPalette])


    const MenuIcon_0 = useAnimatedStyle(()=>{
        const visible = previewAppStyleA.value.navigationMenu.type == 'classical'

        return {
            borderColor: visible? previewAppPalette.value.texts.neutrals.secondary : 'transparent'
        }
    }, [previewAppStyleA, previewAppPalette])

    const MenuIcon_1 = useAnimatedStyle(()=>{
        const visible = previewAppStyleA.value.navigationMenu.type == 'classical'

        return {
            backgroundColor: (previewAppStyleA.value.navigationMenu.accentsType.filling && visible)? (previewAppStyleA.value.navigationMenu.accentsType.coloring?  previewAppPalette.value.texts.accents.primary : previewAppPalette.value.texts.neutrals.secondary ) : 'transparent',
            borderColor: visible? (previewAppStyleA.value.navigationMenu.accentsType.coloring? previewAppPalette.value.texts.accents.primary : previewAppPalette.value.texts.neutrals.secondary) : 'transparent'
        }
    }, [previewAppStyleA, previewAppPalette])


   
    const animStyleBody = useAnimatedStyle(()=>{
        const heightValueReal = (deviceHeight/scale) //- ((Constants.statusBarHeight+1)+30+35)-30

        return {
            //dynamic style
            //backgroundColor: 'red',//Theme.basics.neutrals.primary, 
            //scale params
            height: withTiming( 
                interpolate(
                    animatedState.value, 
                    [ 0, 1 ],
                    [ 500, 280], //0
                    { extrapolateRight: Extrapolate.CLAMP }
                ),
                {duration: duration}
            ),
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
                        [ -((Constants.statusBarHeight+1)+30+35)-78, ((Constants.statusBarHeight+1)+30+35) ],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                    )
                },
                
            ],
        }
    }, [previewAppStyleA])

    

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

    const animStyleBodyItems = useAnimatedStyle(()=>{

        //const s = getShadows(previewAppStyleA.value.effects.shadows, previewAppPalette.value.specials.shadow.primary, previewAppPalette.value.specials.shadow.secondary)
        //console.log(s)
        return {
            //dynamic style
            backgroundColor: previewAppPalette.value.basics.neutrals.secondary,
            borderRadius: 5+previewAppStyleA.value.borderRadius.basic,
            marginHorizontal: previewAppStyleA.value.lists.fullWidth? 0 : horizontalProximity,
            marginVertical: 2*previewAppStyleA.value.lists.proximity,
            //scale params
        
        }
    }, [previewAppStyleA, previewAppPalette])


    const animStyleBodyItems_w = useAnimatedStyle(()=>{

        return {
            //dynamic style
            backgroundColor: previewAppPalette.value.basics.accents.tertiary,
            borderRadius: 5+previewAppStyleA.value.borderRadius.basic,
            marginHorizontal: previewAppStyleA.value.lists.fullWidth? 0 : horizontalProximity,
            marginVertical: 2*previewAppStyleA.value.lists.proximity,
        }
    }, [previewAppStyleA, previewAppPalette.value])

    const animStyleBodyButton = useAnimatedStyle(()=>{
        const y = previewAppStyleA.value.functionButton.size  + 12.5 + previewAppStyleA.value.navigationMenu.height 

    
        const sizeValue = previewAppStyleA.value.functionButton.size-10
        const positionX = previewAppStyleA.value.functionButton.position == 'center'? ((deviceWidth-sizeValue)/2) :
                        previewAppStyleA.value.functionButton.position == 'right'? (12.5) : (deviceWidth-sizeValue-12.5)

        const translateX = previewAppStyleA.value.functionButton.position == 'center'? (deviceWidth)/2.05 + (sizeValue)/8   :
                        previewAppStyleA.value.functionButton.position == 'right'? 50 : deviceWidth - (12.5+sizeValue)/2

        //console.log(positionX, previewAppStyleA.value.functionButton.position )

        return {
            //dynamic style
            backgroundColor: `${previewAppStyleA.value.functionButton.invertColors? previewAppPalette.value.basics.neutrals.tertiary : previewAppPalette.value.basics.accents.secondary}${previewAppStyleA.value.effects.blur? '90' : 'ff'}` , // Theme.basics.neutrals.tertiary
            borderRadius: previewAppStyleA.value.borderRadius.additional,
            height: sizeValue,
            width: sizeValue,

            borderWidth: previewAppStyleA.value.functionButton.outline? 0.5 : 0,
            borderColor: `${previewAppPalette.value.specials.separator}20`,

            opacity: previewAppStyleA.value.functionButton.position == 'top'? 0 : 1,

            bottom: 12.5,
            right: positionX,

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
                        [ translateX, 0],
                        { extrapolateRight: Extrapolate.CLAMP, extrapolateLeft: Extrapolate.CLAMP}
                    ),
                    {duration: duration}
                    )
                },
                {translateY: withTiming( 
                    interpolate(
                        animatedState.value, 
                        [ 0, 1 ],
                        [ 50-previewAppStyleA.value.navigationMenu.height, -previewAppStyleA.value.navigationMenu.height],
                        { extrapolateRight: Extrapolate.CLAMP, extrapolateLeft: Extrapolate.CLAMP}
                    ),
                    {duration: duration}
                    )
                }
            ]
        }    
    }, [previewAppStyleA, previewAppPalette])

    const ButtonIcon_1 = useAnimatedStyle(()=>{
        return {
            borderColor: previewAppStyleA.value.functionButton.invertColors? previewAppPalette.value.icons.accents.primary : previewAppPalette.value.icons.neutrals.primary
        }
    }, [previewAppStyleA, previewAppPalette])
    

    const navigationMenu = useAnimatedStyle(()=>{

        return {
            //dynamic style
            borderTopWidth: 1,
            borderTopColor: `${previewAppPalette.value.specials.separator}20`,
            backgroundColor: `${previewAppPalette.value.basics.neutrals.tertiary}${previewAppStyleA.value.effects.blur? '90' : 'ff'}`,
            height: previewAppStyleA.value.navigationMenu.height, 
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
                        [ previewAppStyleA.value.navigationMenu.height/2, 0],
                        { extrapolateRight: Extrapolate.CLAMP }
                    ),
                    {duration: duration}
                ),
                    
                }
            ],
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
            index={index}
            animatedValue = {animatedValue}
            previewAppStyleA={previewAppStyleA}
            previewAppPalette={previewAppPalette}
            frameColor = {frameColor}
            //ThemeSchema={ThemeSchema}
            //onPress={()=>{
            //    onPress != undefined? onPress() : NaN

            //    newAnimatedState(!animatedState.value)
            //}}
        >
                <Reanimated.View
                    key = {'head'}
                    style = {[header,{
                        //borderTopLeftRadius: 30,
                        //borderTopRightRadius: 30, //,//
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
                        <ReanimatedText
                            style ={[StatusBarText, {
                                fontWeight: 'bold',
                                fontSize: 13,
                            }]}
                        >
                                00:00
                        </ReanimatedText>
                        <ReanimatedText
                            style ={[StatusBarText, {
                                fontWeight: 'bold',
                                fontSize: 13,
                            }]}
                        >
                                99%
                        </ReanimatedText>
                    </View>


                    <View
                        style = {[{
                            flexDirection: 'row',
                            height: 30,
                            paddingHorizontal: 24,
                            width: deviceWidth,
                            justifyContent: 'space-between',
                            alignItems: 'center'
                            //backgroundColor: ThemesColorsAppList[0].sky,<Reanimated.View style = {[staticStyles.iconBorder, HeaderIcon]}/>  
                        }]}
                    > 
                        <Reanimated.View style={[HeaderIcon, staticStyles.iconBorder, {height: 20, width: 20}]}/>
                        <ReanimatedText
                            style ={[HeaderText, {
                                fontWeight: 'bold',
                                fontSize: 20,
                            }]}
                        >
                            Text
                        </ReanimatedText>
                        <Reanimated.View style={[HeaderIcon, HeaderFuncIcon, staticStyles.iconBorder, {height: 20, width: 20}]}/>
                    </View>

                    <View
                        style = {[{
                            height: 35,
                            width: deviceWidth,
        
                            paddingHorizontal: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }]}
                    >   
                    {[1,2,3].map((item, index)=>(
                    <ReanimatedText
                        key = {String('buttons'+item+index)} 
                        style ={[HeaderText, {
                            fontWeight: 'bold',
                            fontSize: 18,
                        }]}
                    >
                        Text
                    </ReanimatedText>))}

                    <Reanimated.View style={[HeaderIndicator,{position: 'absolute', height: 2, width: 50, bottom: 0, borderRadius: 1}]}/>
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
                                //return 
                            }

                            return(
                                <Reanimated.View
                                    key = {String('elements'+item+index)} 
                                    style = {[{

                                        height: itemHeight,
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
                                        
                                    }, aStyleShadows, index != 0? animStyleBodyItems : animStyleBodyItems_w]}
                                >
                                    {index != 0 && <>
                                    <View
                                        style = {{
                                            height: 30,
                                            width: '100%',
                                            paddingHorizontal: 20,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Reanimated.View style={[ListIcon_0, staticStyles.iconBorder, {height: 20, width: 20}]}/>
                                        <ReanimatedText
                                            style ={[ListText_2, {
                                                fontWeight: 'bold',
                                                fontSize: 12,
                                                marginLeft: 200
                                            }]}
                                        >
                                            Text
                                        </ReanimatedText>
                                        <Reanimated.View style={[ListIcon_1, staticStyles.iconBorder, {height: 20, width: 20}]}/>
                                        <Reanimated.View style={[ListIcon_3, staticStyles.iconBorder, {height: 20, width: 20}]}/>
                                        <Reanimated.View style={[ListIcon_2, staticStyles.iconBorder, {height: 20, width: 20, left: -16}]}/>
                                    </View>
                                    <ReanimatedText
                                        style ={[ListText_1, {
                                            fontWeight: 'bold',
                                            fontSize: 14,
                                        }]}
                                    >
                                        Text
                                    </ReanimatedText>
                                    </>}

                                    {index == 0 && <>
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
                            )
                    })}
                </Reanimated.ScrollView>


                <Reanimated.View
                    key = {String('foot')}
                    style = {[navigationMenu, {
                        //backgroundColor: 'white',
                        //width: "100%",
                        bottom: 0,
                        position: 'absolute',
                        flexDirection: 'row',
                        //height: 60,
                        width: deviceWidth,
                        //borderBottomLeftRadius: 30,
                        //borderBottomRightRadius: 30,
                        
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
                                    <Reanimated.View style = {[staticStyles.iconBorder, MenuIcon_0, {}]}/> 
                                    
                                    <ReanimatedText
                                        style={[MenuText_0,{
                                            fontSize: 10
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
                                        }}
                                    >
                                        <Reanimated.View style = {[staticStyles.iconBorder, MenuIcon_1, { marginLeft: 2}]}/> 
                                        <ReanimatedText
                                            style={[MenuText_1,{
                                                fontSize: 10
                                            }]}
                                        >
                                            Text
                                        </ReanimatedText>
                                    </View>
                                </View>
                        )
                    })}
                </Reanimated.View>

                <Reanimated.View
                    key = {String('funcbutton')}
                    style = {[animStyleBodyButton,{
                        position: 'absolute',

                        /* 
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 4,
                        */
                        
                        //height: 60,
                        //width: 60,
                        //borderRadius: 30,

                        alignItems: 'center',
                        justifyContent: 'center',
                        
                    }]}
                >
                    <Reanimated.View style = {[staticStyles.iconBorder, ButtonIcon_1]}/> 
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
    iconBorder: {
        borderWidth: 2,
        height: 30,
        width: 30,
        borderRadius: 15
    }
});