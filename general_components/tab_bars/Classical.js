import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, Text, Dimensions, StyleSheet } from "react-native";

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Svg, {Path} from "react-native-svg";

import themesColorsAppList from "../../app_values/Themes";
import languagesAppList from "../../app_values/Languages";

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

const Classical = ({ 
    state, 
    descriptors, 
    navigation, 

    appStyle,
    appConfig,

    ThemeColorsAppIndex,
    LanguageAppIndex,

    type, 
    ColorsApp, 
    LanguageStore
}) => {

    const tingDuration = 300
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

    return (
        <View
            style = {[
                {
                    height: appStyle.navigationMenu.height,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0, 
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderColor: '#00000015'
                }
            ]}
        >
            {state.routes.map((route, index) => {

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                    });
                };
                       
                let iconName;
                let size = 19;
                let color = ColorsApp.symbolDark;
                size = (appStyle.navigationMenu.height-5-15)//(appStyle.navigationMenu.signatureIcons? 15 : 0)
                size = (size > 32? 32 : size)

                const iconsNames = {focus: '', notFocus: ''}
                if (isFocused) { 
                    if (route.name == "screen_1"){iconsNames.focus = 'home-edit';}
                    if (route.name == "screen_2"){iconsNames.focus = 'circle-slice-1';}
                    if (route.name == "screen_3"){iconsNames.focus = 'cog';}  
                } else {
                    if (route.name == "screen_1"){iconsNames.notFocus = 'home-edit-outline';}
                    if (route.name == "screen_2"){iconsNames.notFocus = 'circle-outline';} 
                    if (route.name == "screen_3"){iconsNames.notFocus = 'cog-outline';}
                }
                

                if (route.name == "screen_1"){tabBarName = LanguageStore.TasksScreen.HeaderTitle;}
                if (route.name == "screen_2"){tabBarName = LanguageStore.AnalyticsScreen.HeaderTitle;} 
                if (route.name == "screen_3"){tabBarName = LanguageStore.SettingsScreen.HeaderTitle;}

                return (
                    <View 
                        key = {route.key}
                        style = {[
                            {
                                //borderRadius: 12,
                                //borderTopWidth: 1,
                                //borderLeftWidth: 1,
                                //borderRightWidth: 1,
                                //borderColor: isFocused? ColorsApp.navigatorFieldIcon: '#00000000',
                                //margin: 2,
                                //alignItems: 'flex-start',
                                flex: 1
                            }
                        ]}
                    >
                        <View
                            style={[
                                {
                                    flex: 1,
                                    //justifyContent: 'flex-start',
                                    //backgroundColor: 'red',
                                    //marginBottom: 5
                                }
                            ]}
                        >
                            <Pressable
                                key = {route.key}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={[
                                     {
                                        flex: 1, 
                                        alignItems: 'center',
                                        paddingTop: appStyle.navigationMenu.height > 55? 8 : 3,
                                        justifyContent: 'flex-start'
                                    }
                                ]}
                                android_ripple = {{color: ColorsApp.navigatorFieldIcon,borderless: true}}
                            >
                                {isFocused && 
                                    <Animated.View 
                                        //exiting={exiting}
                                        entering={entering}
                                    >
                                        <MaterialCommunityIcons name={iconsNames.focus} size={size} color = {color}/>
                                    </Animated.View>        
                                }
                                {!isFocused && 
                                    <Animated.View
                                        exiting={exiting}
                                        //entering={entering}
                                    >
                                        <MaterialCommunityIcons name={iconsNames.notFocus} size={size} color = {color}/>
                                    </Animated.View>        
                                }

                                {appStyle.navigationMenu.signatureIcons &&
                                <Text
                                    style = {[
                                        {
                                            fontSize: 10,
                                        }
                                    ]}
                                >
                                    {tabBarName}
                                </Text>
                                }
                                
                            </Pressable>    
                        </View> 
                    </View>
                );
            })}
        </View>
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