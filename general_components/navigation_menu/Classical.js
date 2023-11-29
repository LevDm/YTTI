import React, { useState, useEffect, useRef } from "react";
import { Keyboard, View, Pressable, Text, Dimensions, StyleSheet } from "react-native";
import Constants from "expo-constants";
import Reanimated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    useDerivedValue,
    useAnimatedReaction,
    runOnJS,
    FadeIn,
    runOnUI,
    CurvedTransition,
    FadingTransition,
    FadeOut
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Svg, {Path} from "react-native-svg";

import { BlurView } from "@react-native-community/blur";


const Reanimated_Text = Reanimated.createAnimatedComponent(Text);
const Reanimated_Icon = Reanimated.createAnimatedComponent(MaterialCommunityIcons)
const RBlurView = Reanimated.createAnimatedComponent(BlurView);
const RPressable = Reanimated.createAnimatedComponent(Pressable);

import { ripple, getNavigateItems, fromSharedObject } from "./tools";

import * as NavigationBar from 'expo-navigation-bar';
import useLanguage from "../../app_hooks/useLanguage";
import useSizes from "../../app_hooks/useSizes";

function Classical(props){
    const {
        state,  
        route,
        navigation, 

        uiStyle,
        uiTheme,
        uiComposition,
    
    } = props
    //console.log('route', route)


    const {
        navigationMenu: {
            height: menuHeight,
            icons: {
                highlight: {coloring, filling},
                signature: iconSignature
            }
        },
        effects:{
            blur: uiBlur
        }
    } = uiStyle

    const {
        basics:{
            neutrals:{
                tertiary: basicNT
            }
        },
        texts: {
            accents: {
                primary: textAP
            },
            neutrals: {
                secondary: textNS,
                tertiary: textNT,
            }
        },
        icons: {
            accents: {
                primary: iconAP
            },
            neutrals: {
                secondary: iconNS,
                tertiary: iconNT,
            }
        },
        specials:{
            separator
        }
    } = uiTheme

    const {
        appFunctions
    } = uiComposition

    
    const getEnabled = (sharedAppFunctions) => {
        'worklet';
        return ((Object.values(sharedAppFunctions).filter((el)=>el.used.value)).length > 1)
    }

    const [ menuEnabled, setMenuEnabled ] = useState(getEnabled(appFunctions))

    useAnimatedReaction(()=>getEnabled(appFunctions),
        (newValue, oldValue)=>{
            if(newValue != menuEnabled){
                runOnJS(setMenuEnabled)(newValue)
            }      
        }
    )

    const osBarVisibility = NavigationBar.useVisibility() === 'visible'


    const {height, width, osHeights: {navigationBar}} = useSizes()


    const menu = useAnimatedStyle(()=>{
        const addHeight = (menuEnabled && osBarVisibility)? navigationBar : 0
        return ({
            height: menuHeight.value + withTiming(addHeight), //enabled? withTiming(addHeight) :
            borderColor: `${separator.value}25`,
            paddingBottom: withTiming(addHeight) //enabled? withTiming(addHeight) : 
        })
    })

    const bg = useAnimatedStyle(()=>{
        const aBlur = uiBlur.value
        return {backgroundColor: `${basicNT.value}${aBlur? '68' : 'ff'}`}
    })

    

    const heightRow = useAnimatedStyle(()=>{
        return ({
            height: menuHeight.value
        })
    })
    

    const MenuItem = React.memo((props) => {
        const {
            accentState,
            onPress,
            icons,
            title
        } = props

        const accentStyle = useAnimatedStyle(()=>{
            return {
                color: coloring.value? (accentState? textAP.value : textNT.value) : textNS.value ,
            }
        })

        const iconStyle = useAnimatedStyle(()=>{
            const iconSize = Math.min((menuHeight.value-5-15 +(iconSignature.value? 0 : 4)), 33)// [20, 33]
            //console.log('menu', height.value)
            return ({
                color: coloring.value ? (accentState? iconAP.value : iconNT.value ) : iconNS.value , 
                //backgroundColor: 'green',
                transform: [
                    {scale: iconSize/20},
                    {translateY: iconSize/10}
                ],
                textAlign: 'center',
                textAlignVertical: 'center'
            })
        })

        const size = useAnimatedStyle(()=>{
            const iconSize = Math.min((menuHeight.value-5-15 +(iconSignature.value? 0 : 4)), 33)// [20, 33]
            return ({
                //backgroundColor: 'red',
                height: iconSize,
                width: iconSize,
            })
        })

        const MenuIcon = () => {
            const currentIcon = useDerivedValue(()=>{
                return icons[filling.value && accentState]
            })
    
            const [nameIcon, setNameIcon] = useState(currentIcon.value)
    
            useAnimatedReaction(()=>currentIcon.value, (newValue, oldValue)=>{runOnJS(setNameIcon)(newValue)})
    
            return (
                <Reanimated.View style={size}>
                    <Reanimated.Text style={iconStyle}>
                        <MaterialCommunityIcons 
                            name={nameIcon}
                            size={20}
                        />
                    </Reanimated.Text>
                </Reanimated.View>
            )
        }

        const pressableStyle = useAnimatedStyle(()=>({
            paddingTop: menuHeight.value > 55? 8 : 3,
        }))

        const pressableProps = useAnimatedProps(()=>({
            android_ripple: {
                color: `${iconAP.value}20`,
                borderless: false,
                foreground: false
            }
        }))


       

        const Signature = (props) => {
            const Language = useLanguage()
            const [signature, setSignature] = useState(iconSignature.value)
            useAnimatedReaction(()=>iconSignature.value, (newValue)=>{runOnJS(setSignature)(newValue)})

            if(!signature){return null}
            return (
                <Reanimated.Text
                    style = {[
                        {
                            fontSize: 13,
                            width: '100%',
                            textAlign: 'center',
                            fontVariant: ['small-caps'],
                            fontWeight: '500',
                        },
                        accentStyle
                    ]}
                >
                    {Language[props.title].HeaderTitle.toLowerCase()}
                </Reanimated.Text>
            )
        }

        return (
            <Reanimated.View
                key = {props.keyID}
                style = {{
                    flex: 1, 
                    backgroundColor: 'transparent',
                    //borderRadius: appStyle.borderRadius.additional
                }}
                entering={accentState? FadeIn : undefined}
                exiting={FadeOut}
            >
                <RPressable
                    onPress={onPress}
                    style={[pressableStyle, {
                        flex: 1, 
                        alignItems: 'center',
                        alignContent: 'center',
                        //paddingTop: appStyle.navigationMenu.height > 55? 8 : 3,
                        justifyContent: 'flex-start',
                        //backgroundColor: 'transparent' 
                    }]}
                    //android_ripple = {appStyle.effects.ripple == 'all'? ripple(Theme.icons.accents.primary) : false}
                    animatedProps={pressableProps}
                >
                    <Reanimated.View 
                        style = {{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <MenuIcon />
                        <Signature title={title}/>
                    </Reanimated.View>        
                </RPressable>    
            </Reanimated.View>
        )
    })

    //console.log('menu', enabled, osBarVisibility)

    const ItemsRow = () => {
        const [showFunction, setShowFunction] = useState(fromSharedObject(appFunctions, fromSharedObject))

        useAnimatedReaction(()=>fromSharedObject(appFunctions, fromSharedObject),
            (newValue, oldValue)=>{
                if(JSON.stringify(newValue) != JSON.stringify(showFunction)){
                    runOnJS(setShowFunction)(newValue) 
                } 
            }
        )

        return (
            <Reanimated.View
                style = {[heightRow, {
                    flex: 1, 
                    maxWidth: 400,
                    flexDirection: 'row',
                }]}
            >
                {getNavigateItems({
                    state: state,
                    appFunctions: showFunction
                }).map((item, index) => {
                    const  {
                        routeName,
                        screenName,
                        iconFocus,
                        isFocused,
                    } = item
                    //console.log(index, routeName, isFocused)
                    const navigate = () =>{
                        //console.log('PRESS', croute.name)
                        navigation.navigate(routeName)
                    }

                    return (
                        <MenuItem
                            key = {`item_${routeName}_${index}`}
                            keyID = {`item_${routeName}_${index}`}
                            accentState = {isFocused}
                            onPress = {navigate}
                            icons = {iconFocus}
                            //iconSize = {iconSize}
                            title = {screenName}
                        />
                    )
                })}
            </Reanimated.View>
        )
    }

    
    return (
        <>
        {menuEnabled && 
        <Reanimated.View
            style = {[menu, {
                width: width,
                borderTopWidth: 0.4,
                alignItems: 'center',
            }]}
        >   
            <BlurFill uiStyle={uiStyle}/>
            <Reanimated.View style={[StyleSheet.absoluteFillObject, bg, {}]}/> 
            <ItemsRow />
        </Reanimated.View>}
        </>
    )
}
export default Classical;



const BlurFill = (props) => {
    const {
        uiStyle,
    } = props

    const {
        effects: {
            blur: uiBlur,
        }
    } = uiStyle

    const [blur, setBlur] = useState(false)

    useAnimatedReaction(
        ()=>uiBlur.value,
        (newValue, oldValue)=>{
            if(newValue && !blur){
                runOnJS(setBlur)(true)
            }
            if(!newValue && blur){
                runOnJS(setBlur)(false)
            }
        }
    )

    if(!blur){return null}
    return (
        <Reanimated.View 
            style = {[StyleSheet.absoluteFillObject, {
                overflow: 'hidden',
            }]}
        >
        <RBlurView
            style = {{flex: 1, }}
            blurType = {'light'}
            blurAmount = {10}
        />
        </Reanimated.View>
    )
}


const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'column',
        position: 'absolute',
        right: 3,
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        elevation: 0 
    },

});