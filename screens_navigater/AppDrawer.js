import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, Appearance } from 'react-native';
import Constants from "expo-constants";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1

import { 
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem, 
} from '@react-navigation/drawer';

import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import { connect } from 'react-redux';
import store from "../redux_files/store";
import mapStateToProps from "../redux_files/stateToProps";
import mapDispatchToProps from "../redux_files/dispatchToProps";
import dataRedactor from '../async_data_manager/data_redactor';

import themesColorsAppList, {themesApp} from "../app_values/Themes";
import languagesAppList, {languagesApp} from "../app_values/Languages";

import Home from './app_pages/home/Home';
import Analytic from './app_pages/analytic/Analytic';
import Notes from './app_pages/notes/Notes';
import Timetable from './app_pages/timetable/Timetable';
import SettingsStack from './app_pages/settings_stack/SettingsStack';

import NavigationMenu from '../general_components/NavigationMenu';

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
            //animationTypeForReplace={"pop"}
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
                }
            }}
        >
            <Drawer.Screen name="home" component={Home} />
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

    const switching = ()=>{   
        const schemes = ['auto', 'light', 'dark'] 
        let index = schemes.indexOf(appStyle.palette.scheme)
        index = (index+1) == schemes.length? 0 : index+1
        const newAppStyle = JSON.parse(JSON.stringify(appStyle));
        newAppStyle.palette.scheme = schemes[index]
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
        <SkiaViewDisign 
            borderRadius = {appStyle.borderRadius.additional}
            backgroundColor = {Theme.basics.accents.tertiary}
            shadowColors = {Theme.specials.shadow}
            shadowMargin={{horizontal: 5, vertical: 5}}
            shadowStyle = {appStyle.effects.shadows}
            adaptiveSizeForStyle={false}
            innerShadow={{
                used: true,
                borderWidth: 2
            }}
        />

        <ColorShemeSwitch 
            scheme = {appStyle.palette.scheme}
            sizeIcon = {30}
            colorIcon ={Theme.icons.neutrals.primary}
            invertColorIcon = {Theme.icons.neutrals.quaternary}
            pressableStyle = {{

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

    const drawerHeaderHeight = 80

    //console.log(props)
    return (
        <View 
            style={{
                flex: 1,
                //width: 252,{...props} 
                backgroundColor: Theme.basics.neutrals.primary,
            }}
        >
            <View
                style={{
                    height: (statusBarHeight+3)+drawerHeaderHeight,
                    width: '100%',
                    backgroundColor: Theme.basics.accents.primary,
                    //justifyContent: 'center',
                    //alignItems: appStyle.navigationMenu.drawerPosition == 'left'? 'flex-end' : 'flex-start',
                    paddingHorizontal: 10,
                    paddingTop: (statusBarHeight+3)
                }}
            >   
                <View
                    style={{
                        flex: 1,
                        backgroundColor: Theme.basics.accents.primary,
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
                    height: 530,
                    width: '100%',
                    //backgroundColor: '#66666630'
                }}
            >
                {(appConfig.weather.type == 'panel' && appConfig.weather.locationInfo.length>0) && <WeatherComponent/>}
            </View>
            {appStyle.navigationMenu.type == 'not' && <CustomDrawerItemList {...props} />}
            {(appStyle.navigationMenu.type != 'not' && !appConfig.appFunctions.settings.used) && <LeadingToSettings {...props} /> }
   
        </View>
    )
}

function CustomDrawerItemList(props) {

    const {
        state = {
            index: 0, 
            routes: [
                {name: "home"},
                {name: "timetable"},
                {name: "notes"},
                {name: "settingsStack"},
                {name: "analytics"},
            ]
        },  
        route,
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

    return (
        <View
            style={{
                height: 5*itemSize,
                width: '100%',
            }}
        >
        {state.routes.map((route, index) => {
            const routes =  {
                tasks : {name: "home"},
                timetable: {name: "timetable"},
                notes : {name: "notes"},
                analytics : {name: "analytics"},
                settings : {name: "settingsStack"},
            }

            let current 
            let uses = new Array(Object.keys(appConfig.appFunctions).length)//['','','','']
            Object.keys(appConfig.appFunctions).map((litem, lindex)=>{
                if(appConfig.appFunctions[litem].useId == index){
                    current = litem
                } 
                if(appConfig.appFunctions[litem].used){
                    uses[appConfig.appFunctions[litem].useId] = litem
                } 
            })

            const croute = routes[current]
            const cpage = appConfig.appFunctions[current]

            if(!routes[current]){return null} 
            const cisFocused = state.routes[state.index].name === croute.name;
            const size = 30;
            const iconsNames = {focus: '', notFocus: ''}
            let screenName = ''

            switch(croute.name){
                case "home":
                    iconsNames.focus = 'home-edit';
                    iconsNames.notFocus = 'home-edit-outline';
                    screenName = Language.TasksScreen.HeaderTitle;
                    break;

                case "analytics":
                    iconsNames.focus = 'circle-slice-1';
                    iconsNames.notFocus = 'circle-outline';
                    screenName = Language.AnalyticsScreen.HeaderTitle;
                    break;

                case "settingsStack": 
                    iconsNames.focus = 'cog'; 
                    iconsNames.notFocus = 'cog-outline';
                    screenName = Language.SettingsScreen.HeaderTitle;
                    break;

                case "notes":
                    iconsNames.focus = 'note-edit'; 
                    iconsNames.notFocus = 'note-edit-outline';
                    screenName = Language.NotesScreen.HeaderTitle;
                    break;

                case "timetable":
                    iconsNames.focus = 'timetable'; 
                    iconsNames.notFocus = 'timetable';
                    screenName = Language.TimetableScreen.HeaderTitle;
                    break;

                default:
                    iconsNames.focus = "border-none-variant"
                    iconsNames.notFocus = "border-none-variant"
                    screenName = 'screenName'
            }

            return (
                <View
                    key = {`${Math.random()}`}
                    style = {{
                        backgroundColor: '#00000001',
                        alignItems: 'center',
                        //borderRadius: appStyle.borderRadius.additional
                    }}
                >
                <Pressable
                    disabled = {cisFocused}
                    onPress={()=>{
                        navigation.navigate(croute.name)
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
                        name={appStyle.navigationMenu.accentsType.filling && cisFocused? iconsNames.focus : iconsNames.notFocus} 
                        size={size} 
                        color = {appStyle.navigationMenu.accentsType.coloring && cisFocused? Theme.icons.accents.primary : Theme.icons.neutrals.secondary}
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
                                color: appStyle.navigationMenu.accentsType.coloring && cisFocused? Theme.texts.accents.primary : Theme.texts.neutrals.secondary
                            }
                        ]}
                    >
                        {screenName}
                    </Text>        
                </Pressable>    
                </View>
            )
            })}
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
