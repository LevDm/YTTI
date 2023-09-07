import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, Appearance,TouchableOpacity } from 'react-native';
import Constants from "expo-constants";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('screen');
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
    useDerivedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    useAnimatedReaction,
    runOnJS
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
const RDrawerLayout = Reanimated.createAnimatedComponent(DrawerLayout)

import CustomDrawer from './app_pages/CustomDrawer';

function AppDrawer(props) {
    const {
        openSettingsWindow,
        updateFullTheme,
        aTheme,
        aStyle,
        uiStyle,
        uiTheme,
        uiScheme,
        uiCompositions,
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
    const handleDrawerSlide = (status) => {
        // outputs a value between 0 and 1
        console.log(status);
      };

    const openSettings = () => {
        closeDrawer()
        openSettingsWindow()
    }
    
    const renderDrawer = () => {
        return (
            <CustomDrawerContent {...props}
                appStyle={appStyle}
                //r_setAppStyle={r_setAppStyle}
                appConfig={appConfig}

                openSettings={openSettings}
                screenOpen={screenOpen}

                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema={ThemeSchema}
                LanguageAppIndex={LanguageAppIndex}
                
            />
        )
      }

    const refDr = useRef()
    const navigationRef = useNavigationContainerRef()


    const drawer = useSharedValue('close')
    const openDrawer = () => {
        drawer.value = 'open'
        //refDr.current.openDrawer()
    }

    const closeDrawer = () => {
        drawer.value = 'close'
    }


    const screenOpen = (screenName) => {
        const screenCheck = "tasks" || "timetable" || "analytics" || 'notes'
        if(navigationRef.isReady() && screenCheck){
            const route = navigationRef.getCurrentRoute();
            if(route.name != screenName){
                navigationRef.navigate(screenName)
            }
            //refDr.current.closeDrawer()
            closeDrawer()
        }
        
        return screenCheck
    }

    const {
        navigationMenu:{
            drawerPosition,
            type
        }
    } = uiStyle

    const {
        basics: {neutrals: {primary}},
        specials: {
            dimout
        }
    } = uiTheme

    const overlay = useDerivedValue(()=>`${dimout.value}60`)

    const enabledDrawer = useDerivedValue(()=>{
        return type.value == 'not' || (appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0) 
    })

    const bg = useAnimatedStyle(()=>({
        backgroundColor: primary.value
    }))
    
    //console.log('DRAWER')
    return (
        <Reanimated.View flex={1} style={bg}>
        <CustomDrawer
            stateVisible = {drawer}
            drawerWidth={280}
            edgeWidth = {deviceWidth/2}
            drawerType="front"
            renderNavigationView={renderDrawer}
            aDrawerPosition={drawerPosition}
            aOverlayColor={overlay}
            aEnabledDrawer={enabledDrawer}
        >
        <NavigationContainer ref={navigationRef}>    
        <Tab.Navigator
            sceneContainerStyle={{backgroundColor: 'transparent'}}
            initialRouteName={
                appConfig.screenSubsequence[0]? 
                    (appConfig.screenSubsequence[0] == "settings"? appConfig.screenSubsequence[0]+'Stack' : appConfig.screenSubsequence[0]) 
                : 
                    "settingsStack"
            }
            tabBar = {props => 
                <NavigationMenu
                    keyID={String(Math.random())}

                    uiStyle={uiStyle}
                    uiTheme={uiTheme}
                    uiCompositions = {uiCompositions}

                    appStyle={appStyle}
                    appConfig={appConfig}

                    ThemeColorsAppIndex={ThemeColorsAppIndex}
                    ThemeSchema={ThemeSchema}
                    LanguageAppIndex={LanguageAppIndex}
                    
                    {...props}
                />
            }
            screenOptions = {{
                headerShown: false
            }}
        >
            <Tab.Screen 
                name="tasks" 
                //component={Tasks}
            > 
                {(props)=> 
                <Tasks 
                    {...props} 
                    openSettingsWindow = {openSettingsWindow}
                    aTheme={aTheme}
                    aStyle={aStyle}
                />}
            </Tab.Screen>
            <Tab.Screen 
                name="timetable" 
                //component={Timetable} 
            >
                {(props)=><Timetable 
                    {...props} 
                    openDrawer={openDrawer}

                    openSettingsWindow = {openSettingsWindow}
                    uiStyle={uiStyle}
                    uiTheme={uiTheme}
                    uiCompositions = {uiCompositions}
                />}
            </Tab.Screen>
            <Tab.Screen name="analytics" component={Analytic} />
            <Tab.Screen name="notes" component={Notes} />
        </Tab.Navigator>
        </NavigationContainer>
        </CustomDrawer>
        </Reanimated.View>
    )
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

        uiStyle,
        uiTheme,
        uiScheme,
        updateFullTheme,
    }= props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const {
        lists: {
            invertColorsHeader
        },
        palette: {
            scheme
        }
    } = uiStyle

    const {
        icons: {
            neutrals: {
                primary: iconNP,
                secondary: iconNS,
                quaternary: iconNQ
            }
        }
    } = uiTheme

    const switching = (scheme)=>{   
        //const newAppStyle = JSON.parse(JSON.stringify(appStyle));
        //newAppStyle.palette.scheme = scheme
        //r_setAppStyle(newAppStyle);
        //dataRedactor("storedAppStyle",newAppStyle);

        updateFullTheme('current', scheme)
    }

    const colorPrimaryIcon = useDerivedValue(()=>invertColorsHeader.value? iconNS.value : iconNP.value)
    const colorSecondaryIcon = useDerivedValue(()=>iconNQ.value)

    return(
        <View
            style = {{
                //borderRadius: appStyle.borderRadius.additional,
                //backgroundColor: Theme.basics.accents.quaternary,
                height: 54,
                width: 54,
                justifyContent: 'center',
                alignItems: 'center',
                //backgroundColor: 'blue'
            }}
        >
        <ColorShemeSwitch
            aStyleScheme = {scheme}
            aScheme = {uiScheme}
            aColorPrimaryIcon = {colorPrimaryIcon}
            aColorSecondaryIcon = {colorSecondaryIcon}
        
            scheme = {ThemeSchema}
            sizeIcon = {32}
            colorIcon ={appStyle.lists.invertColorsHeader? Theme.texts.neutrals.secondary : Theme.texts.neutrals.primary}
            invertColorIcon = {Theme.icons.neutrals.quaternary}
            switching = {switching}
        />
        </View>
    )
}

import WeatherComponent from '../weather/WeatherComponent';
import { useRef } from 'react';

function CustomDrawerContent(props) {

    const {

        uiStyle,
        uiTheme,
        uiScheme,
        uiCompositions,

        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    }= props
    //console.log('DRAVER VIEW')

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    const drawerHeaderHeight = 77

    const {
        navigationMenu: {
            drawerPosition
        },
        lists:{
            invertColorsHeader
        }
    } = uiStyle

    const {
        basics: {
            neutrals: {
                primary: basicNP,
                secondary: basicNS,
            },
            accents: {
                primary: basicAP,
            }
        }
    } = uiTheme

    const panelBG = useAnimatedStyle(()=>({
        backgroundColor: basicNP.value
    }))

    const panelHeaderBG = useAnimatedStyle(()=>({
        backgroundColor: invertColorsHeader.value? basicNS.value : basicAP.value
    }))

    const schemeSwitchStyle = useAnimatedStyle(()=>(
        drawerPosition.value == 'left'? {
            right: 10,
        } : {
            left: 10
        }
    ))

    //console.log(props)
    return (
        <Reanimated.View 
            style={[panelBG, {
                flex: 1,
                paddingBottom: 60,
            }]}
        >
            <Reanimated.View
                style={[panelHeaderBG, {
                    height: (statusBarHeight+3)+drawerHeaderHeight,
                    width: '100%',
                    paddingHorizontal: 10,
                    paddingTop: (statusBarHeight+3)
                }]}
            >   
                <Reanimated.View
                    style={[schemeSwitchStyle, {
                        position: 'absolute',
                        bottom: 10,
                        //backgroundColor: 'red',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}
                >  
                    <SchemeSwitch {...props}/>
                </Reanimated.View>
            </Reanimated.View>

            <DrawerWeather {...props} />
            
            <DrawerMenu {...props} />
            <LeadingToSettings {...props} />
        </Reanimated.View>
    )
}

const DrawerWeather = (props) => {
    const {
        appConfig
    } = props

    return (
        <View
            style={{
                height: 430,
                width: '100%',
                //backgroundColor: '#66666630'
            }}
        >
            {(appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0) && <></>}
            <WeatherComponent componentSize={{h: 430, w: 280}} {...props}/>
        </View>
    )
    
}

//<DrawerItemList {...props} />
const RPressable = Reanimated.createAnimatedComponent(Pressable)

const ITEM_MENU_HEIGHT = 40
const ITEM_ICON_SIZE = 30

import { getNavigateItems } from '../general_components/navigation_menu/tools';

const DrawerMenu = (props) => {
    const {
        state = {
            index: 0, 
            routes: [
                {name: "tasks"},
                {name: "timetable"},
                {name: "notes"},
                //{name: "settingsStack"},
                {name: "analytics"},
            ]
        },  
        //route,
        //navigation, 
        screenOpen,
        appStyle,
        appConfig,

        uiStyle,
        uiTheme,
        uiScheme,
        uiCompositions,
    
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props
    
    const {
        texts: {
            neutrals: {
                secondary: textNS
            }
        },
        icons: {
            neutrals: {
                secondary: iconNS
            }
        },
    } = uiTheme

    const {
        navigationMenu: {
            type
        }
    } = uiStyle

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    const [hideDrawerMenu, setHideDrawerMenu] = useState(type.value != 'not')

    useAnimatedReaction(()=>type.value != 'not', (newValue)=>{runOnJS(setHideDrawerMenu)(newValue)})

    if(hideDrawerMenu){return null}
    return (
        <View
            style={{
                height: 4*ITEM_MENU_HEIGHT,
                width: '100%',
            }}
        >
        {getNavigateItems({
                //state: state,
                LanguageAppIndex: LanguageAppIndex,
                appConfig: appConfig
            })
        .map((item, index) => (
            <ItemMenuDrawer
                key = {item.routeName+"_menu_item"} 
                keyID = {item.routeName+"_menu_item"} 
                title = {item.screenTItle}
                icon = {item.iconFocus[false]}
                onPress = {()=>{screenOpen(item.routeName)}}

                uiTheme={uiTheme}
                uiStyle={uiStyle}
            />
        ))}
        </View>
    )
}


const ItemMenuDrawer = (props) => {
    const {
        title,
        icon,
        keyID = "menu_item",
        uiStyle,
        uiTheme,
        uiScheme,

        onPress
    } = props

    const {
        texts: {
            neutrals: {
                secondary: textNS
            }
        },
        icons: {
            neutrals: {
                secondary: iconNS
            }
        },
    } = uiTheme

    const {
        navigationMenu: {
            type
        }
    } = uiStyle

    const iconColor = useAnimatedStyle(()=>({
        color: iconNS.value
    }))

    const textColor = useAnimatedStyle(()=>({
        color: textNS.value
    }))

    const rippleProps = useAnimatedProps(()=>({
        android_ripple: {
            color: `${iconNS.value}20`,
            borderless: false,
            foreground: false
        }
    }))

    return (
        <View
            key = {keyID}
            style = {{
                backgroundColor: '#00000001',
                alignItems: 'center',
            }}
        >
            <RPressable
                onPress={onPress}
                style={[{
                    paddingHorizontal: 20,
                    height: ITEM_MENU_HEIGHT,
                    width: '100%', 
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                }]}
                animatedProps={rippleProps}
            >
                <Reanimated.Text style={iconColor}>
                    <MaterialCommunityIcons 
                        name={icon} //Focus[appStyle.navigationMenu.accentsType.filling && isFocused]
                        size={ITEM_ICON_SIZE} 
                    />
                </Reanimated.Text>
                <Reanimated.Text
                    style = {[textColor, {
                        fontSize: 14,
                        marginLeft: 12,
                        textAlign: 'center',
                        fontVariant: ['small-caps'],
                        fontWeight: '600',
                    }]}
                >
                    {title}
                </Reanimated.Text>        
            </RPressable>    
        </View>
    )
}


function LeadingToSettings(props){
    const {
        navigation, 
    
        appStyle,
        appConfig,

        uiTheme,
        uiStyle,

        openSettings,

        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex,
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]

    return (
        <ItemMenuDrawer 
            title = {Language.SettingsScreen.HeaderTitle}
            icon = {"cog-outline"}
            onPress = {()=>{openSettings()}}

            uiTheme={uiTheme}
            uiStyle={uiStyle}
        />
    )
}
 

export default connect(mapStateToProps("NAVIGATER"), mapDispatchToProps("NAVIGATER"))(AppDrawer);
