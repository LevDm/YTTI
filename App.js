import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppState, StyleSheet, SafeAreaView, View, Appearance } from 'react-native';

//import Tabs from './screens/Navigater';

//import GestureHandlerRootView from 'react-native-gesture-handler';

//"react-native":"https://github.com/expo/react-native/archive/sdk-43.0.0.tar.gz",

//import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
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

import 'react-native-gesture-handler';

//import AppStack from './screens_navigater/AppStack'

import AppDrawer from "./screens_navigater/AppDrawer"
const start = new Date().getTime()
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loadStatusTasks, setLoadStatusTasks] = useState(false);
  const [loadStatusStyle, setLoadStatusStyle] = useState(false);
  const [loadStatusConfig, setLoadStatusConfig] = useState(false);

  const [appStyle, setAppStyle] = useState(store.getState().appStyle);

  const [appConfig, setAppConfig] = useState(store.getState().appConfig);

  const [splashStart, setSplashStart] = useState(false);
  
  const [appIsReady, setAppIsReady] = useState(false);

  store.subscribe(() => {
    const jstore = store.getState();

    if (jstore.loadStatusTasks) {
      if (!loadStatusTasks){setLoadStatusTasks(true)}
    }
   

    if (jstore.loadStatusStyle) {
      if (!loadStatusStyle){
        setLoadStatusStyle(true);
        //console.log(jstore.appStyle);
        setAppStyle(jstore.appStyle);
        setThemeSchema(jstore.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.palette.scheme)
      }
    }

    if (jstore.loadStatusConfig) {
      if (!loadStatusConfig){setLoadStatusConfig(true)}
    }

    if (appStyle != jstore.appStyle) {
      setAppStyle(jstore.appStyle);
      setThemeSchema(jstore.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.palette.scheme)
    }
  })

  const [ThemeSchema, setThemeSchema] = useState(appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : appStyle.palette.scheme)
 
  const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
    useEffect(()=>{
        if(listenerColorSheme){
            if(appStyle.palette.scheme == 'auto' && listenerColorSheme != ThemeSchema){
                console.log('app accept new color sheme', listenerColorSheme, 'used shema', appStyle.palette.scheme)
                setThemeSchema(listenerColorSheme)
            }
        }
    },[listenerColorSheme])
    
    Appearance.addChangeListener(({colorScheme})=>{
        setListinerColorScheme(colorScheme)
    })

  const finish = () => {
    console.log('>WAIT_LOAD')
  }


  useEffect(() => {
    if((loadStatusTasks && loadStatusConfig && loadStatusStyle ) && !appIsReady){
      console.log('>APP_ALL_DATA_LOADED_' + (new Date().getTime() - start) + 'ms' )
      setAppIsReady(true)
    }
  }, [loadStatusTasks, loadStatusConfig, loadStatusStyle]);
  

  useEffect(() => {
    async function prepare() {
      try {
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

  const styleStatusBar = appStyle.palette.statusBar//(themesColorsAppList[themesApp.indexOf(appStyle.palette.theme)][ThemeSchema]).statusBar
  //console.log('styleStatusBar', styleStatusBar)
  
  const [splashVisible, setSplashVisible] = useState(true)

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      
      const startApp = await SplashScreen.hideAsync();
      if(startApp){ 
        appConfig.splash.show? setSplashStart(true) : null
        console.log('>APP_READY_AND_RUNNING_'+ (new Date().getTime() - start) + 'ms' )
      };
    }
  }, [appIsReady]);

  useEffect(() => {
    if(!splashVisible){
      console.log('>SPLASH_OUT_|_RUNNING_FULL_TIME_'+ (new Date().getTime() - start) + 'ms' )
    }
  },[splashVisible])

  useEffect(() => {
    if(splashStart){
      console.log('>SPLASH_OPEN_'+ (new Date().getTime() - start) + 'ms' )
    }
  },[splashStart])
  
  const splashOut = () => {
    setSplashVisible(false)
  } 



  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if ( appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      }

      if(nextAppState == 'background' ){

      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      
      console.log('>APP_STATE_' + String(appState.current).toUpperCase());

    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(()=>{
    if(appIsReady && appStateVisible == 'active'){
    }
  }, [appIsReady, appStateVisible])

  
  if (!appIsReady) {
    return null;
  }
  return (
    <Provider store = {store}>
    <View style = {staticStyles.AppContainer} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <AppDrawer/>
      </NavigationContainer>
      <StatusBar 
        style={styleStatusBar}
        hidden = {false}
        animated={true}
      />
      {(appConfig.splash.show && splashVisible) && <SplashY splashStart={splashStart} splashOut={splashOut}/>}
    </View>
    </Provider>
  );  
}

const staticStyles = StyleSheet.create({
  AppContainer: {
    flex: 1,
    
  }
})
