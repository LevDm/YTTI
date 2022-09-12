import React, { useState, useEffect, useRef } from "react";
import { Keyboard, View, Pressable, TouchableOpacity, Text, Animated, ActivityIndicator, Dimensions, ScrollView, FlatList } from "react-native";

import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from "../screens/Home";
import SettingsScreen from "../screens/Settings";
import AnalyticScreen from "../screens/Analytic";

import store from "../redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../redux_files/stateToProps";
import mapDispatchToProps from "../redux_files/dispatchToProps";

import LanguageStor from "../language/language";

import ThemesColorsAppList, {themesApp} from "../styles/ColorsApp";
import LanguagesAppList, {languagesApp} from "../language/language";

import TextAnimate from "../componets/TextAnimate";
import { LinearGradient } from 'expo-linear-gradient';
import { getHeaderTitle } from '@react-navigation/elements';

import Svg, {Path} from "react-native-svg";
import { transform } from "@motify/core/node_modules/framer-motion";

let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

import TabBar from "./TabBar";
import ScreensHeader from "./ScreensHeader";

import AppStack from "../screens_navigater/AppStack";

const Tab = createBottomTabNavigator();
const Tabs = (props) => {
    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.theme));//LanguagesAppList[LanguageAppIndex]
    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [appConfig, setAppConfig] = useState(props.appConfig);
    
    store.subscribe(() => {
        let jstore = store.getState();

        if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
            setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
        }

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.theme));
        }

        if (appStyle != jstore.appStyle) {
            setAppStyle(jstore.appStyle);
        }

        if (appConfig != jstore.appConfig) {
            setAppConfig(jstore.Config);
        }
    });

    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const screens = [
        {
            number: 1,
            component: HomeScreen,
        },
        {
            number: 2,
            component: AnalyticScreen,
        },
        {
            number: 3,
            component: SettingsScreen,
        },
        {
            number: 4,
            component: AppStack,
        },
    ]


    return (
        <Tab.Navigator
            initialRouteName = 'screen_1'
            tabBar={(props) => (   
                <>
                {!keyboardVisible && 
                <TabBar 
                    {...props} 
                    appStyle={appStyle}
                    appConfig={appConfig}

                    ThemeColorsAppIndex={ThemeColorsAppIndex}
                    LanguageAppIndex={LanguageAppIndex}


                    type={appStyle.navigationMenu.type}

                    ColorsApp = {ThemesColorsAppList[ThemeColorsAppIndex]} 
                    LanguageStore = {LanguagesAppList[LanguageAppIndex]}
                />}
                </>
            )}
            sceneContainerStyle = {{
                backgroundColor: ThemesColorsAppList[ThemeColorsAppIndex].ground, 
            }}
            screenOptions = {() => ({
                headerShown: false,
                header: ({ navigation, route, options })=> (
                    <ScreensHeader 
                        screen={getHeaderTitle(options, route.name)}
                        ThemeColorsAppIndex = {ThemeColorsAppIndex}
                        LanguageAppIndex = {LanguageAppIndex}
                    />
                )
            })}
        >
            {screens.map((screen, index) => {
                return (<Tab.Screen key = {index} name = {`screen_${screen.number}`} component = {screen.component}/>)
            })}            
        </Tab.Navigator>
    );
}
export default connect(mapStateToProps("TABS_NAVIGATER"), mapDispatchToProps("TABS_NAVIGATER"))(Tabs);



const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'column',
        position: 'absolute',
        bottom: '30%',
        right: 3,
        //backgroundColor: ColorsApp.navigatorField,
        borderRadius: 12,
        height: "22%",
        width: "12%",
        //marginLeft: "25%",
        //marginRight: "25%",
        //marginHorizontal: '25%',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        //transform: [{ rotate: "90deg" }],
        elevation: 0 
    },

});