import React, { useState, useEffect, memo } from 'react';
import { View, Text, Pressable, Dimensions, Appearance,TouchableOpacity, useWindowDimensions } from 'react-native';

import useSizes from '../app_hooks/useSizes';

import Tasks from './app_pages/tasks/Tasks';
import Analytic from './app_pages/analytic/Analytic';
import Notes from './app_pages/notes/Notes';
import Timetable from './app_pages/timetable/Timetable';

import NavigationMenu from '../general_components/navigation_menu/NavigationMenu';
import DrawerItemList from '../general_components/navigation_menu/Drawer';

import Reanimated, {
    useSharedValue,
    useDerivedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    useAnimatedReaction,
    runOnJS,
    Layout
} from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import CustomDrawer from './app_pages/CustomDrawer';

const AppDrawer = (props) => {
    const {
        openSettingsWindow,
        updateFullTheme,
        uiStyle,
        uiTheme,
        uiScheme,
        uiComposition,

        //appLanguage,
        //r_uiStyle,
        //r_uiPalette,
        //r_uiComposition,
    } = props

    const openSettings = () => {
        closeDrawer()
        openSettingsWindow()
    }
    
    const renderDrawer = () => {
        return (
            <CustomDrawerContent 
                openSettings={openSettings}
                screenOpen={screenOpen}
                {...props}
            />
        )
    }

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
        console.log("screenOpen", screenName)
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
            pos: {dx: drawerPosition},
            type: navigaterType
        }
    } = uiStyle

    const {
        weather: {
            type: weatherType
        }
    } = uiComposition

    const {
        basics: {neutrals: {primary}},
        specials: {
            dimout
        }
    } = uiTheme

    const overlay = useDerivedValue(()=>`${dimout.value}60`)

    const enabledDrawer = useDerivedValue(()=>{
        return navigaterType.value == 'type_2' || weatherType.value == 'panel'
    })
    
    const bg = useAnimatedStyle(()=>({
        backgroundColor: primary.value
    }))

    const initialRouteName = Object.keys(uiComposition.appFunctions)[Object.values(uiComposition.appFunctions).findIndex((item)=>item.useId.value == 0)]
    
    console.log('DRAWER', initialRouteName)

    const {height, width} = useSizes()

    return (
        <Reanimated.View flex={1} style={bg}>
        <CustomDrawer
            stateVisible = {drawer}
            drawerWidth={280}
            edgeWidth = {width/4}
            drawerType="front"
            renderNavigationView={renderDrawer}
            aDrawerPosition={drawerPosition}
            aOverlayColor={overlay}
            aEnabledDrawer={enabledDrawer}
        >
            <NavigationContainer ref={navigationRef}>    
            <Tab.Navigator
                sceneContainerStyle={{backgroundColor: 'transparent'}}
                initialRouteName={initialRouteName}
                tabBar = {lprops => 
                    <NavigationMenu
                        {...lprops}
                        {...props}
                    />
                }
                screenOptions = {{
                    headerShown: false
                }}
            >
                <Tab.Screen 
                    name="tasks" 
                > 
                    {(lprops)=> 
                    <Tasks 
                        {...lprops}
                        openDrawer={openDrawer}
                        {...props} 
                    />}
                </Tab.Screen>
                <Tab.Screen 
                    name="timetable"
                >
                    {(lprops)=><Timetable 
                        {...lprops} 
                        openDrawer={openDrawer}
                        {...props}
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
export default AppDrawer //connect(mapStateToProps("NAVIGATER"), mapDispatchToProps("NAVIGATER"))(AppDrawer);

import ColorShemeSwitch from '../general_components/ColorShemeSwitch';
import SkiaViewDisign from '../general_components/base_components/SkiaViewDisign';
function SchemeSwitch (props) {
    const {
        uiStyle,
        uiTheme,
        uiScheme,
        updateFullTheme,
    }= props

    const {
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

        updateFullTheme('current', scheme, false)
    }

    const colorPrimaryIcon = useDerivedValue(()=>iconNP.value)
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
        
            sizeIcon = {32}
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
        uiComposition,
    }= props


    const drawerHeaderHeight = 77

    const {
        navigationMenu: {
            pos: {dx: drawerPosition}
        },
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
        backgroundColor: basicAP.value
    }))

    const schemeSwitchStyle = useAnimatedStyle(()=>(
        drawerPosition.value == 0? {
            right: 10,
        } : {
            left: 10
        }
    ))

    const {osHeights: {statusBar}} = useSizes()

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
                    height: (statusBar+3)+drawerHeaderHeight,
                    width: '100%',
                    paddingHorizontal: 10,
                    paddingTop: (statusBar+3)
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
            <DrawerNavigator {...props} />
            
        </Reanimated.View>
    )
}

const DrawerWeather = (props) => {
    const {
        uiComposition
    } = props

    const {
        weather: {
            type
        }
    } = uiComposition

    const [show, setShow] = useState(type.value == 'panel')
    useAnimatedReaction(()=>type.value == 'panel', (newValue)=>{runOnJS(setShow)(newValue)})

    //console.log('DrawerWeather')
    return (
        <View
            style={{
                height: 430,
                width: '100%',
                //backgroundColor: '#66666630'
            }}
        >
            {show && <WeatherComponent componentSize={{h: 430, w: 280}} {...props}/>}
        </View>
    )
    
}

//<DrawerItemList {...props} />
const RPressable = Reanimated.createAnimatedComponent(Pressable)

const ITEM_MENU_HEIGHT = 40
const ITEM_ICON_SIZE = 30
import DrawerMenu, { ItemMenuDrawer } from '../general_components/navigation_menu/Drawer';

const DrawerNavigator = (props) => {
    const {
        screenOpen,

        uiStyle,
        uiTheme,
        uiScheme,
        uiCompositions,
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

    const [hideDrawerMenu, setHideDrawerMenu] = useState(type.value != 'type_2')

    useAnimatedReaction(()=>type.value != 'type_2', (newValue)=>{runOnJS(setHideDrawerMenu)(newValue)})

    //if(hideDrawerMenu){return null}
    return (
        <Reanimated.View
            style={{
                //height: (4+1)*ITEM_MENU_HEIGHT,
                width: '100%',
            }}
            //layout={Layout}
        >
            {!hideDrawerMenu && <DrawerMenu {...props}/>}
            <LeadingToSettings {...props} />
        </Reanimated.View>
    )
}

function LeadingToSettings(props){
    const {
        uiTheme,
        uiStyle,

        openSettings,
    } = props

    return (
        <ItemMenuDrawer 
            title = {'SettingsScreen'}
            icon = {"cog-outline"}
            onPress = {openSettings}

            uiTheme={uiTheme}
            uiStyle={uiStyle}
        />
    )
}
 

