import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import store from "../redux_files/store";
import {connect} from 'react-redux';
import mapStateToProps from "../redux_files/stateToProps";
import mapDispatchToProps from "../redux_files/dispatchToProps";

import themesColorsAppList, {themesApp} from "../app_values/Themes";
import languagesAppList, {languagesApp} from "../app_values/Languages";

import AppDrawer from './AppDrawer';

import Splash from './app_loadSplash/Splash';

const Stack = createStackNavigator();

function AppStack(props) {
    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [appConfig, setAppConfig] = useState(props.appConfig);

    const Thema = themesColorsAppList[ThemeColorsAppIndex]
    const Language = languagesAppList[LanguageAppIndex]

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
            setAppConfig(jstore.appConfig);
        }
    })

    return (
        <Stack.Navigator
            initialRouteName = {props.initial}
            detachInactiveScreens = {false}
            screenOptions = {{
                headerShown: false,
                presentation: 'transparentModal',
                animationTypeForReplace: "fade",
                //animationEnabled: false,
                gestureEnabled: false,
                cardStyle: {
                    backgroundColor: 'transparent'
                },
            }}
        > 
            <Stack.Screen name="App" component={AppDrawer} />
            <Stack.Screen name="Splash" component={Splash} />
        </Stack.Navigator>
    );
}

export default connect(mapStateToProps("NAVIGATER"), mapDispatchToProps("NAVIGATER"))(AppStack);