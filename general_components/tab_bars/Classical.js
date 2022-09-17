import React, { useState, useEffect, useRef } from "react";
import { Keyboard, View, Pressable, Text, Dimensions, StyleSheet } from "react-native";

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
    state = {
        index: 0, 
        routes: [
            {name: "Home"},
            {name: "SettingsStack"},
            {name: "Analytic"},
        ]
    },  
    route,
    navigation, 

    appStyle,
    appConfig,

    ThemeColorsAppIndex,
    LanguageAppIndex,
}) => {
    //const state = navigation.getState()

    //console.log(state)

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const Thema = themesColorsAppList[ThemeColorsAppIndex]
    const Language = languagesAppList[LanguageAppIndex]

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
                    //zIndex: 0,
                    width: deviceWidth,
                    //position: 'absolute',
                    //bottom: 0, 
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderColor: '#00000015'
                }
            ]}
        >
            {state.routes.map((route, index) => {

                const isFocused = state.index === index;
                //navigation.isFocused()
                const onPress = () => {
                    /*
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({ name: route.name, merge: true });
                    }
                    */
                    navigation.navigate(route.name)
                    //navigation.jumpTo(route.name)
                };
                       
                let iconName;
                let size = 19;
                let color = Thema.navigateBar.icons.active;
                size = (appStyle.navigationMenu.height-5-15)//(appStyle.navigationMenu.signatureIcons? 15 : 0)
                size = (size > 32? 32 : size)

                const iconsNames = {focus: '', notFocus: ''}
                let tabBarName = ''      

                switch(route.name){
                    case "Home":
                        iconsNames.focus = 'home-edit';
                        iconsNames.notFocus = 'home-edit-outline';
                        tabBarName = Language.TasksScreen.HeaderTitle;
                        break;

                    case "Analytic":
                        iconsNames.focus = 'circle-slice-1';
                        iconsNames.notFocus = 'circle-outline';
                        tabBarName = Language.AnalyticsScreen.HeaderTitle;
                        break;

                    case "SettingsStack": 
                        iconsNames.focus = 'cog'; 
                        iconsNames.notFocus = 'cog-outline';
                        tabBarName = Language.SettingsScreen.HeaderTitle;
                        break;

                    default:
                }

                return (
                    <View 
                        key = {`${Math.random()}`}
                        style = {[
                            {
                                //borderRadius: 12,
                                //borderTopWidth: 1,
                                //borderLeftWidth: 1,
                                //borderRightWidth: 1,
                                //borderColor: isFocused? ColorsApp.navigatorFieldIcon: '#00000000',
                                //margin: 2,
                                //alignItems: 'flex-start',
                                flex: 1,
                                zIndex: -10
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
                                //key = {route.key}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                onPress={onPress}
                                //onLongPress={onLongPress}
                                style={[
                                     {
                                        flex: 1, 
                                        alignItems: 'center',
                                        paddingTop: appStyle.navigationMenu.height > 55? 8 : 3,
                                        justifyContent: 'flex-start'
                                    }
                                ]}
                                android_ripple = {appStyle.navigationMenu.rippleEffect? {color: Thema.navigateBar.icons.active,borderless: true} : false}
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