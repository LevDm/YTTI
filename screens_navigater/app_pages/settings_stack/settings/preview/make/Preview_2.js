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

const SkiaLinearGradient = ({previewAppStyleA, ThemeSchema}) => {
    //const gradientSize = 2.5*itemSize//-2
    const noneColor = '#00000000'
    const skiaFirstColor = useValue([noneColor, noneColor]);
    const skiaBorderRadius = useValue(0);
    
    useSharedValueEffect(() => {
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]


        skiaFirstColor.current = previewAppStyleA.value.modals.highlightMethods.gradient? [Theme.basics.accents.quaternary, Theme.basics.neutrals.quaternary] : [noneColor, noneColor]

    }, [previewAppStyleA]); // you can pass other shared values as extra parameters
    

    const generalRect = useComputedValue(() => {
        //console.log('s?', size.current)
        return rrect(rect(
          0, 
          0, 
          deviceWidth-(previewAppStyleA.value.modals.fullWidth? 0 : horizontalProximity), 
          100), 
          previewAppStyleA.value.borderRadius.additional, 
          previewAppStyleA.value.borderRadius.additional
        )
    }, [previewAppStyleA]);

    const colors = useComputedValue(() => {
        return skiaFirstColor.current
    }, [skiaFirstColor])

    console.log()

    return (
        <Canvas 
            style={{flex: 1, }}
        >
        <RoundedRect rect={generalRect}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, 100)}
            //positions={[0,1]}
            colors={colors}
          />
        </RoundedRect>
      </Canvas>
    )
}

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


    const modalGroundColor = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        //const height = deviceHeight*0.4

        //dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
        //gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}

        return {
            //dynamic style
            height: deviceHeight,
            width: deviceWidth,//-(previewAppStyleA.value.modals.fullWidth? 0 : 10),
            backgroundColor: previewAppStyleA.value.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: 'transparent',

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
    }, [previewAppStyleA])
    
    
    const modal = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        const height = deviceHeight*0.4

        //dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
        //gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}

        return {
            //dynamic style
            height: height,
            width: deviceWidth-(previewAppStyleA.value.modals.fullWidth? 0 : 2*horizontalProximity),
            backgroundColor: Theme.basics.neutrals.quaternary,

            borderWidth: previewAppStyleA.value.modals.highlightMethods.outline? 1 : 0,
            borderBottomWidth: 0,
            borderColor: Theme.basics.accents.tertiary,

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
    }, [previewAppStyleA])


    const hangle = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            backgroundColor: Theme.icons.accents.primary
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
            borderColor: Theme.icons.neutrals.primary
        }
    }, [previewAppStyleA])


    const ListIcon_1 = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            borderColor: Theme.icons.neutrals.secondary
        }
    }, [previewAppStyleA])


    const animStyleBodyItems = useAnimatedStyle(()=>{
        const Schema = previewAppStyleA.value.palette.scheme != 'auto'? previewAppStyleA.value.palette.scheme : ThemeSchema
        const ThemeIndex = themesApp.indexOf(previewAppStyleA.value.palette.theme)
        const Theme = themesColorsAppList[ThemeIndex][Schema]

        return {
            //dynamic style
            backgroundColor: Theme.basics.neutrals.secondary,
            borderRadius: previewAppStyleA.value.borderRadius.additional,
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
            borderRadius: previewAppStyleA.value.borderRadius.additional,
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
                        ThemeSchema = {ThemeSchema}
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