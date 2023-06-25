import React, { useState, useEffect, useRef } from "react";
import { Keyboard, View, Pressable, Text, Dimensions, StyleSheet } from "react-native";

import Reanimated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    useDerivedValue
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Svg, {Path} from "react-native-svg";

import { BlurView } from "@react-native-community/blur";

import themesColorsAppList from "../../app_values/Themes";
import languagesAppList from "../../app_values/Languages";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

const Reanimated_Text = Reanimated.createAnimatedComponent(Text);
const Reanimated_Icon = Reanimated.createAnimatedComponent(MaterialCommunityIcons)

import { ripple, getNavigateItems } from "./tools";


function Classical(props){
    const {
        state,  
        route,
        navigation, 
        
        appStyle,
        appConfig,

        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props


    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]


    const MenuItem = (props) => {
        const {
            accentState,
            onPress,
            icons,
            iconSize,
            title
        } = props
        
        const accent = useDerivedValue(()=>accentState)
        //const accent = accentState// (accentIndex == itemIndex)
        //console.log('>>MENU_RERENDEER', itemIndex)
        const tingDuration = 300

        const accentStyle = useAnimatedStyle(()=>{
            return {
                color:appStyle.navigationMenu.accentsType.coloring && accent.value? Theme.texts.accents.primary : Theme.texts.neutrals.secondary,
            }
        })

        const accentProps = useAnimatedProps(()=>{
            return {
                name: icons[appStyle.navigationMenu.accentsType.filling && accent.value], 
                size: iconSize,
                color:  appStyle.navigationMenu.accentsType.coloring && accent.value? Theme.icons.accents.primary : Theme.icons.neutrals.secondary, 
            }
        })

        const pressItem = () => {
            if(!accent.value){
                accent.value = true
                setTimeout(onPress, 300) 
            } else {
                //accent.value = false
            }
        }

        return (
            <View
                key = {props.keyID}
                style = {{
                    flex: 1, 
                    backgroundColor: 'transparent',
                    borderRadius: appStyle.borderRadius.additional
                }}
            >
            <Pressable
                //disabled = {accent}
                onPress={onPress}
                style={[
                        {
                        flex: 1, 
                        alignItems: 'center',
                        alignContent: 'center',
                        paddingTop: appStyle.navigationMenu.height > 55? 8 : 3,
                        justifyContent: 'flex-start',
                        //backgroundColor: 'transparent' 
                    }
                ]}
                android_ripple = {appStyle.effects.ripple == 'all'? ripple(Theme.icons.accents.primary) : false}
            >
                <Reanimated.View 
                    //exiting={exiting}
                    style = {{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    //entering={entering}
                >
                    <Reanimated_Icon
                        animatedProps={accentProps}
                    />
                    {appStyle.navigationMenu.signatureIcons &&
                    <Reanimated_Text
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
                    </Reanimated_Text>
                    }
                </Reanimated.View>        
            </Pressable>    
            </View>
        )
    }

    const tingDuration = 350
    const entering = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(1, { duration: tingDuration }),
        };
        const initialValues = {
          opacity: 0,
        };
        return {
          initialValues,
          animations,
        };
    };
    const exiting = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(0, { duration: tingDuration }),
        };
        const initialValues = {
          opacity: 1,
        };
        return {
          initialValues,
          animations,
        };
    };

    //console.log("cur acc", )
    //if(state.routes[state.index].name != route.name){return null}

    return (
        <Reanimated.View
            key = {`${Math.random()}`}
            style = {
                [{
                    height: appStyle.navigationMenu.height,
                    width: deviceWidth,
                },
                appStyle.effects.blur? {} : {
                    borderTopWidth: 0.4,
                    borderColor: `${Theme.specials.separator}25`,
                    backgroundColor: Theme.basics.neutrals.tertiary,
                }]
            }
        >   
            {appStyle.effects.blur && 
            <View 
                style = {[StyleSheet.absoluteFillObject, {
                    //specialty blur for android
                    overflow: 'hidden',
                }]}
            >
            <BlurView
                style = {{flex: 1, }}
                blurType = {'light'}
                blurAmount = {10}
                
                //ANDROID_PROPS
                overlayColor={`${Theme.basics.neutrals.tertiary}90`}
                //overlayColor={'transparent'}
                //blurRadius	= {10}
                //downsampleFactor = {10}
            />
            </View>}
            
            {true && //state.routes[state.index].name == route.name ||
            <Reanimated.View
                //entering={entering}
                //exiting={exiting} 
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

               
                let size = 19;
                size = (appStyle.navigationMenu.height-5-15)
                size = (size > 32? 32 : size)



                const navigate = () =>{
                    //console.log('PRESS', croute.name)
                    navigation.navigate(routeName)
                }

                return (
                    <MenuItem
                        keyID = {`${routeName}_${index}`}
                        accentState = {isFocused}
                        onPress = {navigate}
                        icons = {iconFocus}
                        iconSize = {size}
                        title = {screenTItle}
                    />
                )
            })}
            </Reanimated.View>}
        </Reanimated.View>
    );
}

export default Classical;


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