import React, { useState } from 'react';
import { View, Text, Button, Dimensions } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

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

const Drawer = createDrawerNavigator();


function AppDrawer(props) {
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
        <Drawer.Navigator 
            //useLegacyImplementation
            animationTypeForReplace={"pop"}
            screenOptions = {{
                swipeEnabled: true,
                swipeEdgeWidth: deviceWidth/2, //(lvl3.name =='SettingsStack'? deviceWidth/4 :) 
                drawerStyle: {
                    backgroundColor: 'white',
                },
                header: ({ navigation, route }) => {

                  return (
                    <View
                      style = {{
                        position: 'absolute',
                        top: deviceHeight -appStyle.navigationMenu.height,
                      }}
                    >
                    {/*NAVIGATION MENU*/}
                    <Classical
                        state = {navigation.getState()}
                        route = {route}  
                        navigation = {navigation}
                        
                        appStyle={appStyle}
                        appConfig={appConfig}

                        ThemeColorsAppIndex={ThemeColorsAppIndex}
                        LanguageAppIndex={LanguageAppIndex}
                    />  
                    </View>
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
