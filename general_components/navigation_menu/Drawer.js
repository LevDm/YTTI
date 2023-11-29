import React, { useState, useEffect, useRef } from "react";
import { Keyboard, View, Pressable, Text, Dimensions, StyleSheet } from "react-native";

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
    FadeOut,
    SequencedTransition,
    Layout
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { ripple, getNavigateItems, fromSharedObject } from "./tools";
import useLanguage from "../../app_hooks/useLanguage";

const ITEM_MENU_HEIGHT = 40
const ITEM_ICON_SIZE = 30

export default DrawerMenu = (props) => {
    const {
        screenOpen,

        uiStyle,
        uiTheme,
        uiScheme,
        uiComposition,
    } = props
    
    const {
        texts: {
            neutrals: {
                secondary: textNS
            }
        },
        icons: {
            neutrals: {
                secondary: iconNS
            }
        },
    } = uiTheme

    const {
        navigationMenu: {
            type
        }
    } = uiStyle

    const {
        appFunctions
    } = uiComposition


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
            style={{
                width: '100%',
            }}
            layout={SequencedTransition}
        >
        {getNavigateItems({appFunctions: showFunction})
        .map((item, index) => (
            <ItemMenuDrawer
                key = {item.routeName+"_menu_item"} 
                keyID = {item.routeName+"_menu_item"} 
                title = {item.screenName}
                icon = {item.iconFocus[false]}
                onPress = {()=>{screenOpen(item.routeName)}}

                uiTheme={uiTheme}
                uiStyle={uiStyle}
            />
        ))}
        </Reanimated.View>
    )
}

const RPressable = Reanimated.createAnimatedComponent(Pressable)

export const ItemMenuDrawer = (props) => {
    const {
        title,
        icon,
        keyID = "menu_item",
        uiStyle,
        uiTheme,
        uiScheme,

        onPress
    } = props

    const {
        texts: {
            neutrals: {
                secondary: textNS
            }
        },
        icons: {
            neutrals: {
                secondary: iconNS
            }
        },
    } = uiTheme

    const {
        navigationMenu: {
            type
        }
    } = uiStyle

    const iconColor = useAnimatedStyle(()=>({
        color: iconNS.value
    }))

    const textColor = useAnimatedStyle(()=>({
        color: textNS.value
    }))

    const rippleProps = useAnimatedProps(()=>({
        android_ripple: {
            color: `${iconNS.value}20`,
            borderless: false,
            foreground: false
        }
    }))


    const Signature = (props) => {
        const Language = useLanguage()

        return (
            <Reanimated.Text
                style = {[textColor, {
                    fontSize: 16,
                    letterSpacing: 0.2,
                    marginLeft: 12,
                    textAlign: 'center',
                    fontVariant: ['small-caps'],
                    fontWeight: '500',
                }]}
            >
                {Language[props.title].HeaderTitle}
            </Reanimated.Text>
        )
    }

    return (
        <Reanimated.View
            key = {keyID}
            style = {{
                backgroundColor: '#00000001',
                alignItems: 'center',
            }}
            exiting={FadeOut}
            layout={Layout}
            entering={FadeIn}
        >
            <RPressable
                onPress={onPress}
                style={[{
                    paddingHorizontal: 20,
                    height: ITEM_MENU_HEIGHT,
                    width: '100%', 
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                }]}
                animatedProps={rippleProps}
            >
                <Reanimated.Text style={iconColor}>
                    <MaterialCommunityIcons 
                        name={icon} //Focus[appStyle.navigationMenu.accentsType.filling && isFocused]
                        size={ITEM_ICON_SIZE} 
                    />
                </Reanimated.Text>
                <Signature  title={title}/>      
            </RPressable>    
        </Reanimated.View>
    )
}