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
    FadeIn
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Svg, {Path} from "react-native-svg";

import { BlurView } from "@react-native-community/blur";

import themesColorsAppList from "../../app_values/Themes";
import languagesAppList from "../../app_values/Languages";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

const Reanimated_Text = Reanimated.createAnimatedComponent(Text);
const Reanimated_Icon = Reanimated.createAnimatedComponent(MaterialCommunityIcons)
const RBlurView = Reanimated.createAnimatedComponent(BlurView);
const RPressable = Reanimated.createAnimatedComponent(Pressable);

import { ripple, getNavigateItems } from "./tools";

import * as NavigationBar from 'expo-navigation-bar';
const OS_NAVIGATION_BAR_HEIGHT = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight)


function Classical(props){
    const {
        state,  
        route,
        navigation, 

        uiStyle,
        uiTheme,
        uiCompositions,
        
        appStyle,
        appConfig,

        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props
    //console.log('route', route)

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]


    const {
        navigationMenu: {
            type,
            position: {
                horizontal,
                vertical
            },
            height,
            accentsType: {
                coloring,
                filling
            },
            signatureIcons
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
                secondary: textNS
            }
        },
        icons: {
            accents: {
                primary: iconAP
            },
            neutrals: {
                secondary: iconNS
            }
        },
        specials:{
            separator
        }
    } = uiTheme


    const osBarVisibility = NavigationBar.useVisibility() === 'visible'
    console.log('ANDROID BAR', NavigationBar.useVisibility(), osBarVisibility, OS_NAVIGATION_BAR_HEIGHT)


    const MenuItem = (props) => {
        const {
            accentState,
            onPress,
            icons,
            title
        } = props

        const accentStyle = useAnimatedStyle(()=>{
            return {
                color: coloring.value && accentState? textAP.value  : textNS.value ,
            }
        })

        const iconStyle = useAnimatedStyle(()=>{
            const iconSize = Math.min((height.value-5-15 +(signatureIcons.value? 0 : 4)), 33)// [20, 33]
            //console.log('menu', height.value)
            return ({
                color: coloring.value && accentState? iconAP.value : iconNS.value , 
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
            const iconSize = Math.min((height.value-5-15 +(signatureIcons.value? 0 : 4)), 33)// [20, 33]
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
            paddingTop: height.value > 55? 8 : 3,
        }))

        const pressableProps = useAnimatedProps(()=>({
            android_ripple: {
                color: `${iconAP.value}20`,
                borderless: false,
                foreground: false
            }
        }))

        const [signature, setSignature] = useState(signatureIcons.value)

        useAnimatedReaction(()=>signatureIcons.value, (newValue)=>{runOnJS(setSignature)(newValue)})



        return (
            <View
                key = {props.keyID}
                style = {{
                    flex: 1, 
                    backgroundColor: 'transparent',
                    //borderRadius: appStyle.borderRadius.additional
                }}
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
                        {signature &&
                        <Reanimated.Text
                            style = {[
                                {
                                    fontSize: 10,
                                    width: '100%',
                                    textAlign: 'center',
                                    fontVariant: ['small-caps'],
                                    fontWeight: '500',
                                },
                                accentStyle
                            ]}
                        >
                            {title}
                        </Reanimated.Text>}
                    </Reanimated.View>        
                </RPressable>    
            </View>
        )
    }

    

    const menu = useAnimatedStyle(()=>{
        const addHeight = osBarVisibility? OS_NAVIGATION_BAR_HEIGHT : 0
        return ({
            height: addHeight+ height.value, 
            borderColor: `${separator.value}25`,
            paddingBottom: addHeight
            //backgroundColor: Theme.basics.neutrals.tertiary,
        })
    })

    const bg = useAnimatedStyle(()=>{
        const aBlur = uiBlur.value
        return {backgroundColor: `${basicNT.value}${aBlur? '68' : 'ff'}`}
    })


    return (
        <Reanimated.View
            style = {[menu, {
                width: deviceWidth,
            }]}
        >   
            <BlurFill uiStyle={uiStyle}/>
            <Reanimated.View style={[StyleSheet.absoluteFillObject, bg, {}]}/> 

            {true && 
            <Reanimated.View
                style = {{
                    flex: 1, 
                    flexDirection: 'row',
                }}
            >
            {getNavigateItems({
                state: state,
                LanguageAppIndex: LanguageAppIndex,
                appConfig: appConfig
            }).map((item, index) => {
                
                const  {
                    routeName,
                    screenTItle,
                    iconFocus,
                    isFocused,
                } = item

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
                        title = {screenTItle}
                    />
                )
            })}
            </Reanimated.View>}
        </Reanimated.View>
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
            console.log('reaction blur')
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