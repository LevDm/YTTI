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
        ThemeSchema,
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
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]
        return {
            //dynamic style
            backgroundColor: previewAppStyleA.value.lists.invertColorsHeader? Theme.basics.neutrals.secondary : Theme.basics.accents.primary, // 
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
    }, [previewAppStyleA])


    const StatusBarText = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        const groundColor = previewAppStyleA.value.lists.invertColorsHeader? Theme.basics.neutrals.secondary : Theme.basics.accents.primary

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
          
            return contr <= 0.5? 'white' : 'black'
        }

        const autoColor = getContrast(groundColor)

        return {
            color: previewAppStyleA.value.palette.StatusBar == 'auto'? autoColor :
                previewAppStyleA.value.palette.StatusBar == 'inverted'? (autoColor == 'white'? 'black' : 'white') :
                (previewAppStyleA.value.palette.StatusBar == 'light'? 'white' : 'black')
        }
    }, [previewAppStyleA])


    const HeaderText = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            color: previewAppStyleA.value.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary
        }
    }, [previewAppStyleA])


    const HeaderIcon = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            backgroundColor: previewAppStyleA.value.lists.invertColorsHeader? Theme.basics.accents.primary : Theme.basics.accents.quaternary
        }
    }, [previewAppStyleA])


    const ListText_0 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            color: Theme.texts.neutrals.primary
        }
    }, [previewAppStyleA])

    const ListText_1 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            color: Theme.texts.neutrals.secondary
        }
    }, [previewAppStyleA])

    const ListText_2 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            color: Theme.texts.neutrals.tertiary
        }
    }, [previewAppStyleA])

    const ListIcon_0 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            borderColor: Theme.icons.accents.primary
        }
    }, [previewAppStyleA])


    const ListIcon_1 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            borderColor: Theme.icons.neutrals.tertiary
        }
    }, [previewAppStyleA])

    const ListIcon_2 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            borderColor: Theme.specials.fire.primary
        }
    }, [previewAppStyleA])

    const ListIcon_3 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            borderColor: Theme.specials.fire.secondary
        }
    }, [previewAppStyleA])


    const MenuText_0 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        const visible = previewAppStyleA.value.navigationMenu.type == 'classical'

        return {
            color: (previewAppStyleA.value.navigationMenu.signatureIcons && visible)?  Theme.texts.neutrals.secondary : 'transparent'
        }
    }, [previewAppStyleA])

    const MenuText_1 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        const visible = previewAppStyleA.value.navigationMenu.type == 'classical'

        return {
            color: (previewAppStyleA.value.navigationMenu.signatureIcons && visible)? 
                (previewAppStyleA.value.navigationMenu.accentsType.coloring? Theme.texts.accents.secondary : Theme.texts.neutrals.secondary ) :
                'transparent'
        }
    }, [previewAppStyleA])


    const MenuIcon_0 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        const visible = previewAppStyleA.value.navigationMenu.type == 'classical'

        return {
            borderColor: visible? Theme.texts.neutrals.secondary : 'transparent'
        }
    }, [previewAppStyleA])

    const MenuIcon_1 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        const visible = previewAppStyleA.value.navigationMenu.type == 'classical'

        return {
            backgroundColor: (previewAppStyleA.value.navigationMenu.accentsType.filling && visible)? (previewAppStyleA.value.navigationMenu.accentsType.coloring?  Theme.texts.accents.secondary : Theme.texts.neutrals.secondary ) : 'transparent',
            borderColor: visible? (previewAppStyleA.value.navigationMenu.accentsType.coloring?  Theme.texts.accents.secondary : Theme.texts.neutrals.secondary) : 'transparent'
        }
    }, [previewAppStyleA])


   
    const animStyleBody = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

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



    const animStyleBodyItems = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            //dynamic style
            backgroundColor: Theme.basics.neutrals.secondary,
            borderRadius: previewAppStyleA.value.borderRadius.basic,
            marginHorizontal: previewAppStyleA.value.lists.fullWidth? 0 : horizontalProximity,
            marginVertical: 2*previewAppStyleA.value.lists.proximity
            //scale params
        }
    }, [previewAppStyleA])


    const animStyleBodyItems_w = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            //dynamic style
            backgroundColor: Theme.basics.accents.tertiary,
            borderRadius: previewAppStyleA.value.borderRadius.basic,
            marginHorizontal: previewAppStyleA.value.lists.fullWidth? 0 : horizontalProximity,
            marginVertical: 2*previewAppStyleA.value.lists.proximity
            //scale params
        }
    }, [previewAppStyleA])

    const animStyleBodyButton = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        const y = previewAppStyleA.value.functionButton.size  + 12.5 + previewAppStyleA.value.navigationMenu.height 

    
        const sizeValue = previewAppStyleA.value.functionButton.size 
        const positionX = previewAppStyleA.value.functionButton.position == 'center'? ((deviceWidth-sizeValue)/2) :
                        previewAppStyleA.value.functionButton.position == 'right'? (12.5) : (deviceWidth-sizeValue-12.5)

        const translateX = previewAppStyleA.value.functionButton.position == 'center'? (deviceWidth)/2.05 + (sizeValue)/8   :
                        previewAppStyleA.value.functionButton.position == 'right'? 50 : deviceWidth - (12.5+sizeValue)/2

        console.log(positionX, previewAppStyleA.value.functionButton.position )

        return {
            //dynamic style
            backgroundColor: previewAppStyleA.value.functionButton.invertColors? Theme.basics.neutrals.tertiary : Theme.basics.accents.secondary, // Theme.basics.neutrals.tertiary
            borderRadius: previewAppStyleA.value.borderRadius.additional,
            height: sizeValue,
            width: sizeValue,

            borderWidth: previewAppStyleA.value.functionButton.outline? 0.5 : 0,
            borderColor: `${Theme.specials.separator}20`,


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
    }, [previewAppStyleA])

    const ButtonIcon_1 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            borderColor: previewAppStyleA.value.functionButton.invertColors? Theme.icons.accents.primary : Theme.icons.neutrals.primary
        }
    }, [previewAppStyleA])
    

    const navigationMenu = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            //dynamic style
            borderTopWidth: 1,
            borderTopColor: `${Theme.specials.separator}20`,

            backgroundColor: Theme.basics.neutrals.tertiary,
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
            ThemeSchema={ThemeSchema}
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
                            width: deviceWidth,
                            justifyContent: 'center'
                            //backgroundColor: ThemesColorsAppList[0].sky,<Reanimated.View style = {[staticStyles.iconBorder, HeaderIcon]}/>  
                        }]}
                    > 
                        <ReanimatedText
                            style ={[HeaderText, {
                                fontWeight: 'bold',
                                fontSize: 20,
                            }]}
                        >
                            Text
                        </ReanimatedText>
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

                    <Reanimated.View style={[HeaderIcon,{position: 'absolute', height: 2, width: 50, bottom: 0}]}/>
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
                                        elevation: 1,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 4,
                                        
                                    },index != 0? animStyleBodyItems : animStyleBodyItems_w]}
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

                        
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 4,
                        
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