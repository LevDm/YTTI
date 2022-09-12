import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { connect } from 'react-redux';
import store from '../../../redux_files/store';
import mapStateToProps from "../../../redux_files/stateToProps";
import mapDispatchToProps from "../../../redux_files/dispatchToProps";

import themesColorsAppList, { themesApp } from '../../../Themes';
import languagesAppList, { languagesApp } from "../../../Languages";

const Scr = ({ navigation, route }) => {
    const go = ()=> {
      if(route.name == "Settings"){navigation.navigate("Colors")}
      //if(route.name == "SettingsDr"){navigation.navigate("ColorsSt")}
      if(route.name == "Colors"){navigation.navigate("Settings")}

      if(route.name == "Splash"){navigation.navigate("App")}
    }
    const tabBar = route.name == "Home" || route.name == "Settings" || route.name == "Ohter"
    return (
        <View
            style ={{
                flex: 1,
                alignItems: 'center', 
                justifyContent: 'center',
                //backgroundColor: 'blue'
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



const Stack = createStackNavigator();

function SettingsStack(props) {
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
            initialRouteName = {"Settings"}
            
            
            //animationTypeForReplace={"pop"}
            //presentation = {'Modal'}
            screenOptions = {{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
                cardStyle: {
                    backgroundColor: 'green'
                },
            }}
        >
            <Stack.Screen name="Settings" component={Scr} />
            <Stack.Screen 
                name="Colors" 
                component={Scr} 
                options={{
                    cardStyle: {
                        backgroundColor: 'tomato',
                    },
                }}
                
            />
        </Stack.Navigator>
    );
}

export default connect(mapStateToProps("NAVIGATER"), mapDispatchToProps("NAVIGATER"))(SettingsStack);