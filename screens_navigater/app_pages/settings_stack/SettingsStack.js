import React, { useState, useEffect } from 'react';
import { View, Text, Button, Appearance } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { connect } from 'react-redux';
import store from '../../../app_redux_files/store';
import mapStateToProps from "../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../app_redux_files/dispatchToProps";

import themesColorsAppList, { themesApp } from '../../../app_values/Themes';
import languagesAppList, { languagesApp } from "../../../app_values/Languages";

import Settings from './settings/Settings';
import Palette from './palette/Palette';

const Stack = createStackNavigator();

function SettingsStack(props) {
    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.palette.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [appConfig, setAppConfig] = useState(props.appConfig);

    const [ThemeSchema, setThemeSchema] = useState(props.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : props.appStyle.palette.scheme)
    
    store.subscribe(() => {
        let jstore = store.getState();

        if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
            setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
        }

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.palette.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.palette.theme));
        }

        if(ThemeSchema != jstore.appStyle.palette.scheme){
            setThemeSchema(jstore.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.palette.scheme);
        }

        if (appStyle != jstore.appStyle) {
            setAppStyle(jstore.appStyle);
        }

        if (appConfig != jstore.appConfig) {
            setAppConfig(jstore.appConfig);
        }
    })

    const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
    useEffect(()=>{
        if(listenerColorSheme){
            if(appStyle.palette.scheme == 'auto' && listenerColorSheme != ThemeSchema){
                console.log('settings stack accept new color sheme', listenerColorSheme, 'used shema', appStyle.palette.scheme)
                setThemeSchema(listenerColorSheme)
            }
        }
    },[listenerColorSheme])
    
    Appearance.addChangeListener(({colorScheme})=>{
        setListinerColorScheme(colorScheme)
    })
    
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    return (
        <Stack.Navigator
            initialRouteName = {"settings"}
            
            
            //animationTypeForReplace={"pop"}
            //presentation = {'Modal'}
            screenOptions = {{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
                cardStyle: {
                    backgroundColor: Theme.basics.neutrals.primary
                },
            }}
        >
            <Stack.Screen 
                name="settings" 
                component={Settings} 
                //options={{detachPreviousScreen: false}}
            />
            <Stack.Screen 
                name="palette" 
                component={Palette} 
                options={{

                    //headerShown: true
                    //cardStyle: {
                    //    backgroundColor: 'tomato',
                    //},
                    detachPreviousScreen: false
                }} 
            />
        </Stack.Navigator>
    );
}

export default connect(mapStateToProps("NAVIGATER"), mapDispatchToProps("NAVIGATER"))(SettingsStack);