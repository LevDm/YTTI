import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppState, StyleSheet, SafeAreaView, View, Text, Appearance, Dimensions } from 'react-native';
import Constants from "expo-constants";

//import Tabs from './screens/Navigater';

//import GestureHandlerRootView from 'react-native-gesture-handler';

//"react-native":"https://github.com/expo/react-native/archive/sdk-43.0.0.tar.gz",

//import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
//import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-redux';
import store from './app_redux_files/store';

import dataLoader from './app_async_data_manager/data_loader';

import AsyncStorage from '@react-native-async-storage/async-storage';

//import ThemesColorsAppList, {themesApp} from './styles/ColorsApp';
import themesColorsAppList, {themesApp} from './app_values/Themes';

//import Splash from './screens_navigater/app_loadSplash/Splash';
import SplashY from './screens_navigater/app_loadSplash/SplashY';

import * as Font from 'expo-font';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

//import GestureHandlerRootView from 'react-native-gesture-handler';

//import AppStack from './screens_navigater/AppStack'

import AppDrawer from "./screens_navigater/AppDrawer";
import { cancelAnimation, useSharedValue } from 'react-native-reanimated';

const navigationBarHeight = Dimensions.get('screen').height - (Dimensions.get('window').height + Constants.statusBarHeight);

//console.log('NAV BAR HEGHT ', navigationBarHeight)

//NavigationBar.setPositionAsync('relative');
//NavigationBar.setBackgroundColorAsync("grey");
import Settings from './screens_navigater/app_pages/settings_stack/settings/Settings';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import UIConfigurationProvider from './screens_navigater/app_pages/settings_stack/UIConfigurationProvider';
const start = new Date().getTime()
SplashScreen.preventAutoHideAsync();


function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}


export default function App() {

  const [appStyle, setAppStyle] = useState(store.getState().appStyle);
  //console.log('appStyle', appStyle)
  const [appConfig, setAppConfig] = useState(store.getState().appConfig);

  const [appIsReady, setAppIsReady] = useState(false);

  const readyData = useRef(false)

  store.subscribe(() => {
    const jstore = store.getState();
    if(jstore.loadStatusStyle && jstore.loadStatusConfig){
      if(!readyData.current){starting()}
      /* 
      if (JSON.stringify(appStyle) != JSON.stringify(jstore.appStyle)){
        console.log('appStyle != jstore.appStyle')
        setAppStyle(jstore.appStyle);
        //aStyle.value=jstore.appStyle
      }
      */
    }
  })


  const starting = async () => {
    console.log('>APP_ALL_DATA_LOADED_'+ (new Date().getTime() - start) + 'ms' )
    setAppIsReady(true)
    readyData.current = true
  }
  /* 

  const listenerColorSheme = Appearance.getColorScheme()
  const ThemeSchema = listenerColorSheme? appStyle.palette.scheme == 'auto'? listenerColorSheme : appStyle.palette.scheme : ThemeSchema
  const ThemeColorsAppIndex = themesApp.indexOf(appStyle.palette.theme)
  const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
  
  const styleStatusBar = appStyle.palette.statusBar
  
  const aTheme = useSharedValue()
  const aStyle = useSharedValue()
  */
  const finish = () => {
    console.log('>APP_WAIT_DATA_LOAD')
  }


  useEffect(() => {
    async function prepare() {
      try {
        const fontAssets = cacheFonts([MaterialCommunityIcons.font]);
        await Promise.all([...fontAssets]);
        dataLoader()
      } catch (e) {
        console.warn(e);
      } finally {
        finish()
        //setAppIsReady(true);
      }
    }
    prepare();
  }, []);


  const onLayoutSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
    console.log('>HIDE_STATIC_SPLASH_SCREEN_'+ (new Date().getTime() - start) + 'ms' )
  }, []);
  
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      console.log('>APP_FINISHED_LAUNCH_'+ (new Date().getTime() - start) + 'ms' )
    }
  }, [appIsReady]);

  
  const appState = useRef(AppState.currentState);
  //const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if ( appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      }

      if(nextAppState == 'background' ){

      }

      appState.current = nextAppState;
      //setAppStateVisible(appState.current);
      
      console.log('>APP_STATE_' + String(appState.current).toUpperCase());

    });

    return () => {
      subscription.remove();
    };
  }, []);

  
  return (
    <>
    {!appIsReady && 
    <SplashY 
      onLayout = {onLayoutSplash}
    />}
    {appIsReady && 
    <Provider store = {store}> 
    <View 
      style = {staticStyles.AppContainer} 
      onLayout={onLayoutRootView}
    >
      <UIConfigurationProvider>
        <AppDrawer/>
      </UIConfigurationProvider>
    </View>
    </Provider>} 
    </>
  )
}

const staticStyles = StyleSheet.create({
  AppContainer: {
    flex: 1,
  }
})

