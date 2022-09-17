import React, { useState } from 'react';
import { View, Text, Button, Dimensions } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { connect } from 'react-redux';
import store from "../../redux_files/store";
import mapStateToProps from "../../redux_files/stateToProps";
import mapDispatchToProps from "../../redux_files/dispatchToProps";

import themesColorsAppList, {themesApp} from "../../app_values/Themes";
import languagesAppList, {languagesApp} from "../../app_values/Languages";
import {deviceWidth } from '../../app_values/AppDefault';
const deviceHeight = Dimensions.get('screen').height
import SettingsStack from './settings_stack/SettingsStack';

import Home from './home/Home';
import Analytic from './analytic/Analytic';

import Classical from '../../general_components/tab_bars/Classical';

const Scr = ({ navigation, route }) => {
    const go = ()=> {
      if(route.name == "Settings"){navigation.navigate("Colors")}
      //if(route.name == "SettingsDr"){navigation.navigate("ColorsSt")}
      if(route.name == "Colors"){navigation.navigate("Settings")}

      if(route.name == "Splash"){navigation.navigate("App")}

      if(route.name == "Home"){navigation.navigate("Splash")}
    }
    const tabBar = route.name == "Home" || route.name == "Settings" || route.name == "Ohter"
    return (
        <View
            style ={{
                flex: 1,
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'blue'
            }}
        >
            <Text>Screen {route.name}</Text>
            <Button
              title={"Go"}
              onPress={go}
            >
            </Button>
            {tabBar && 
            <View
              style = {{
                position: 'absolute',
                backgroundColor: 'red',
                height: 60,
                width: 180,
                flexDirection: 'row',
                bottom: 10
              }}
            >
              <Button
                title={"Home"}
                color={route.name == "Home"?'green' : 'red'}
                onPress={()=>{navigation.navigate("Home")}}
              />
              <Button
                title={"Settings"}
                color={route.name == "Settings"?'green' : 'red'}
                onPress={()=>{navigation.navigate("SettingsStack")}}
              />
              <Button
                title={"Ohter"}
                color={route.name == "Ohter"?'green' : 'red'}
                onPress={()=>{navigation.navigate("Ohter")}}
              />
            </View>
            }
        </View>
    )
}

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
    const jet = props.navigation.getState()
    const lvl1 = jet.routes[jet.index]
    //console.log(lvl1)
    const lvl2 = lvl1.state? lvl1.state.routes[lvl1.state.index] : lvl1
    //console.log(lvl2)
    const lvl3 = lvl2.state? lvl2.state.routes[lvl2.state.index] : lvl2
    console.log(lvl3.name)

    const swipeEnabl = !(lvl3.name == "Colors")

    //console.log(lvl1)

    return (
        <Drawer.Navigator 
            //useLegacyImplementation
            animationTypeForReplace={"pop"}
            screenOptions = {{
                //gestureEnabled: false,
                swipeEnabled: swipeEnabl,
                //headerShown: false,
                swipeEdgeWidth: lvl3.name =='SettingsStack'? deviceWidth/4 : deviceWidth/2,
                drawerStyle: {
                  backgroundColor: 'white',
                  
                },
                header: ({ navigation, route, options }) => {
                  //const title = getHeaderTitle(options, route.name);
                
                  return (
                    <View
                      style = {{
                        position: 'absolute',
                        top: deviceHeight -appStyle.navigationMenu.height,
                        backgroundColor: 'red',
                        //height: 10
                      }}
                    >
                    {/*NAVIGATION MENU*/}
                    <Classical
                        //{...props}
                        state = {lvl1.state}
                        route = {props.route}  
                        navigation = {props.navigation}
                        
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
            <Drawer.Screen name="SettingsStack" component={SettingsStack} />
            <Drawer.Screen name="Analytic" component={Analytic} />
        </Drawer.Navigator>
    );
}


export default connect(mapStateToProps("NAVIGATER"), mapDispatchToProps("NAVIGATER"))(AppDrawer);
