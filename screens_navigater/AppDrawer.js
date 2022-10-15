import React, { useState, useEffect } from 'react';
import { View, Text, Button, Dimensions, Appearance } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import { connect } from 'react-redux';
import store from "../redux_files/store";
import mapStateToProps from "../redux_files/stateToProps";
import mapDispatchToProps from "../redux_files/dispatchToProps";

import themesColorsAppList, {themesApp} from "../app_values/Themes";
import languagesAppList, {languagesApp} from "../app_values/Languages";
import {deviceWidth } from '../app_values/AppDefault';
const deviceHeight = Dimensions.get('screen').height
import SettingsStack from './app_pages/settings_stack/SettingsStack';

import Home from './app_pages/home/Home';
import Analytic from './app_pages/analytic/Analytic';

import Classical from '../general_components/tab_bars/Classical';

import NavigationMenu from '../general_components/NavigationMenu';

const Drawer = createDrawerNavigator();


function AppDrawer(props) {

    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [appConfig, setAppConfig] = useState(props.appConfig);
    const [previewOpen, setPreviewOpen] = useState(props.previewOpen);

    const [ThemeSchema, setThemeSchema] = useState(props.appStyle.colorScheme == 'auto'? Appearance.getColorScheme() : props.appStyle.colorScheme)

    store.subscribe(() => {
        let jstore = store.getState();

        if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
            setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
        }

        if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.theme)){
            setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.theme));
        }

        if(ThemeSchema != jstore.appStyle.colorScheme){
            setThemeSchema(jstore.appStyle.colorScheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.colorScheme);
        }

        if (appStyle != jstore.appStyle){
            setAppStyle(jstore.appStyle);
        }

        if (appConfig != jstore.appConfig){
            setAppConfig(jstore.appConfig);
        }

        if(previewOpen != jstore.previewOpen){
            setPreviewOpen(jstore.previewOpen)
        }
    })
    
    const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
    useEffect(()=>{
        if(listenerColorSheme){
            if(appStyle.colorScheme == 'auto'){
                console.log('drawer accept new color sheme', listenerColorSheme, 'used shema', appStyle.colorScheme)
                setThemeSchema(listenerColorSheme)
            }
        }
    },[listenerColorSheme])
    
    Appearance.addChangeListener(({colorScheme})=>{
        setListinerColorScheme(colorScheme)
    })

    const Thema = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    return (
        
        <Drawer.Navigator 
            //useLegacyImplementation
            //detachInactiveScreens={false}
            animationTypeForReplace={"pop"}
            screenOptions = {{
                swipeEnabled: true,
                drawerPosition: appStyle.navigationMenu.drawerPosition === 'left'? 'left' : 'right',
                swipeEdgeWidth: deviceWidth/2, //(lvl3.name =='SettingsStack'? deviceWidth/4 :) 
                drawerStyle: {
                    backgroundColor: Thema.basics.grounds.primary,
                },
                header: ({ navigation, route }) => {
                  return (
                    <NavigationMenu
                        state = {navigation.getState()}
                        route = {route}  
                        navigation = {navigation}

                        previewOpen = {previewOpen}
                        
                        appStyle={appStyle}
                        appConfig={appConfig}

                        ThemeColorsAppIndex={ThemeColorsAppIndex}
                        ThemeSchema={ThemeSchema}
                        LanguageAppIndex={LanguageAppIndex}
                    />
                  );
                }
            }}
        >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="SettingsStack" component={SettingsStack} options={{swipeEnabled: false}}/>
            <Drawer.Screen name="Analytic" component={Analytic} />
        </Drawer.Navigator>
    );
}


export default connect(mapStateToProps("NAVIGATER"), mapDispatchToProps("NAVIGATER"))(AppDrawer);
