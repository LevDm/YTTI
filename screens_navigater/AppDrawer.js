import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, Appearance } from 'react-native';
import Constants from "expo-constants";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1

import { 
    createDrawerNavigator,
} from '@react-navigation/drawer';

import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import { connect } from 'react-redux';
import store from "../app_redux_files/store";
import mapStateToProps from "../app_redux_files/stateToProps";
import mapDispatchToProps from "../app_redux_files/dispatchToProps";
import dataRedactor from '../app_async_data_manager/data_redactor';

import themesColorsAppList, {themesApp} from "../app_values/Themes";
import languagesAppList, {languagesApp} from "../app_values/Languages";

import Tasks from './app_pages/tasks/Tasks';
import Analytic from './app_pages/analytic/Analytic';
import Notes from './app_pages/notes/Notes';
import Timetable from './app_pages/timetable/Timetable';
import SettingsStack from './app_pages/settings_stack/SettingsStack';

import NavigationMenu from '../general_components/navigation_menu/NavigationMenu';
import DrawerItemList from '../general_components/navigation_menu/Drawer';

import Reanimated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const Drawer = createDrawerNavigator();


function AppDrawer(props) {

    const {
        r_setAppStyle,
    } = props

    const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
    const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.palette.theme));//LanguagesAppList[LanguageAppIndex]

    const [appStyle, setAppStyle] = useState(props.appStyle);
    const [appConfig, setAppConfig] = useState(props.appConfig);
    const [hideMenu, setHideMenu] = useState(props.hideMenu);

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

        if (appStyle != jstore.appStyle){
            setAppStyle(jstore.appStyle);
        }

        if (appConfig != jstore.appConfig){
            setAppConfig(jstore.appConfig);
        }

        if(hideMenu != jstore.hideMenu){
            setHideMenu(jstore.hideMenu)
        }

    })
    
    const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
    useEffect(()=>{
        if(listenerColorSheme){
            if(appStyle.palette.scheme == 'auto' && listenerColorSheme != ThemeSchema){
                console.log('drawer accept new color sheme', listenerColorSheme, 'used shema', appStyle.palette.scheme)
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
        
        <Drawer.Navigator 
            //useLegacyImplementation
            //detachInactiveScreens={false}
            initialRouteName={
                appConfig.screenSubsequence[0]? 
                    (appConfig.screenSubsequence[0] == "settings"? appConfig.screenSubsequence[0]+'Stack' : appConfig.screenSubsequence[0]) 
                : 
                    "settingsStack"
            }
            drawerContent={(props) => 
                <CustomDrawerContent {...props}
                    appStyle={appStyle}
                    r_setAppStyle={r_setAppStyle}
                    appConfig={appConfig}

                    ThemeColorsAppIndex={ThemeColorsAppIndex}
                    ThemeSchema={ThemeSchema}
                    LanguageAppIndex={LanguageAppIndex}
                     
                />
            }
            screenOptions = {{
                swipeEnabled: (appStyle.navigationMenu.type == 'not' || (appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0)), 
                drawerPosition: appStyle.navigationMenu.drawerPosition,// === 'left'? 'left' : 'right',
                swipeEdgeWidth: deviceWidth/2,
                overlayColor:`${Theme.specials.dimout}40`,
                header: ({ navigation, route }) => {
                    return (
                    <NavigationMenu
                        keyID={String(Math.random())}
                        state = {navigation.getState()}
                        route = {route}  
                        navigation = {navigation}

                        hideMenu = {hideMenu}

                        appStyle={appStyle}
                        appConfig={appConfig}

                        ThemeColorsAppIndex={ThemeColorsAppIndex}
                        ThemeSchema={ThemeSchema}
                        LanguageAppIndex={LanguageAppIndex}
                    />
                  );
                },
                sceneContainerStyle: {
                    backgroundColor: Theme.basics.neutrals.primary
                },
            }}
            
            
        >
            <Drawer.Screen name="tasks" component={Tasks} />
            <Drawer.Screen name="timetable" component={Timetable} />
            <Drawer.Screen name="analytics" component={Analytic} />
            <Drawer.Screen name="notes" component={Notes} />
            <Drawer.Screen name="settingsStack" component={SettingsStack} options={{swipeEnabled: false}}/>
        </Drawer.Navigator>
    );
}
import ColorShemeSwitch from '../general_components/ColorShemeSwitch';
import SkiaViewDisign from '../general_components/base_components/SkiaViewDisign';
function SchemeSwitch (props) {
    const {
        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        r_setAppStyle,
        LanguageAppIndex,
    }= props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const switching = (scheme)=>{   
        const newAppStyle = JSON.parse(JSON.stringify(appStyle));
        newAppStyle.palette.scheme = scheme
        r_setAppStyle(newAppStyle);
        dataRedactor("storedAppStyle",newAppStyle);
    }

    return(
        <View
            style = {{
                //borderRadius: appStyle.borderRadius.additional,
                //backgroundColor: Theme.basics.accents.quaternary,
                height: 54,
                width: 54,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
        <ColorShemeSwitch 
            scheme = {ThemeSchema}
            sizeIcon = {32}
            colorIcon ={appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}
            invertColorIcon = {Theme.icons.neutrals.quaternary}
            pressableStyle = {{
                flex: 1
            }}
            switching = {switching}
        />
        </View>
    )
}

import WeatherComponent from '../weather/WeatherComponent';

function CustomDrawerContent(props) {

    const {
        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    }= props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    const drawerHeaderHeight = 77

    //console.log(props)
    return (
        <View 
            style={{
                flex: 1,
                //width: 252,{...props} 
                paddingBottom: 50,
                backgroundColor: Theme.basics.neutrals.primary,
            }}
        >
            <View
                style={{
                    height: (statusBarHeight+3)+drawerHeaderHeight,
                    width: '100%',
                    backgroundColor: appStyle.lists.invertColorsHeader? Theme.basics.neutrals.secondary : Theme.basics.accents.primary,
                    //justifyContent: 'center',
                    //alignItems: appStyle.navigationMenu.drawerPosition == 'left'? 'flex-end' : 'flex-start',
                    paddingHorizontal: 10,
                    paddingTop: (statusBarHeight+3)
                }}
            >   
                <View
                    style={{
                        flex: 1,
                        //backgroundColor: Theme.basics.accents.primary,
                        justifyContent: 'center',
                        alignItems: appStyle.navigationMenu.drawerPosition == 'left'? 'flex-end' : 'flex-start',
                        //paddingHorizontal: 10
                    }}
                >  
                    <SchemeSwitch {...props}/>
                </View>

            </View>

            <View
                style={{
                    height: 430,
                    width: '100%',
                    //backgroundColor: '#66666630'
                }}
            >
                {(appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0) && <WeatherComponent/>}
            </View>
            {appStyle.navigationMenu.type == 'not' && <DrawerItemList {...props} />}
            {(!appConfig.appFunctions.settings.used) && <LeadingToSettings {...props} /> }
   
        </View>
    )
}



function LeadingToSettings(props){
    const {
        navigation, 
    
        appStyle,
        appConfig,

        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    const ripple = (color) => ({
        color: `${color}20`,
        borderless: true,
        foreground: false
    })

    const itemSize = 40
    const size = 30

    return (
        <View
            style = {{
                backgroundColor: '#00000001',
                alignItems: 'center',
            }}
        >
            <Pressable
                onPress={()=>{
                    navigation.navigate("settingsStack")
                }}
                style={[{
                        paddingHorizontal: 20,
                        height: itemSize,
                        width: '100%', 
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        //backgroundColor: 'red'
                    }
                ]}
                android_ripple = {appStyle.effects.ripple == 'all'? ripple(Theme.icons.accents.primary) : false}
            >
                <MaterialCommunityIcons 
                    name={"cog"} 
                    size={size} 
                    color = {Theme.icons.neutrals.secondary}
                />
    
                <Text
                    style = {[
                        {
                            fontSize: 14,
                            marginLeft: 10,
                            //width: '100%',
                            textAlign: 'center',
                            fontVariant: ['small-caps'],
                            fontWeight: '600',
                            color: Theme.texts.neutrals.secondary
                        }
                    ]}
                >
                    {Language.SettingsScreen.HeaderTitle}
                </Text>        
            </Pressable>    
        </View>
    )
}
 

export default connect(mapStateToProps("NAVIGATER"), mapDispatchToProps("NAVIGATER"))(AppDrawer);
