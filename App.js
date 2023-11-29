import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppState, StyleSheet, SafeAreaView, View, Text, Appearance, Dimensions } from 'react-native';

import * as SplashScreen from 'expo-splash-screen';

import { Provider, useSelector } from 'react-redux';
import store from './app_redux_files/store';

import dataLoader from './app_async_data_manager/data_loader';

import SplashY from './screens_navigater/app_loadSplash/SplashY';

import * as Font from 'expo-font';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import AppDrawer from "./screens_navigater/AppDrawer";

import 'react-native-gesture-handler';
import UIConfigurationProvider from './screens_navigater/app_pages/settings_stack/UIConfigurationProvider';

const start = new Date().getTime()
SplashScreen.preventAutoHideAsync();


function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}


export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);

  const readyData = useRef(false)

  store.subscribe(() => {
    const rstore = store.getState();
    if(rstore.uiConfigurationLoadStatus){
      if(!readyData.current){starting()}
    }
  })

  const starting = async () => {
    console.log('>APP_ALL_DATA_LOADED_'+ (new Date().getTime() - start) + 'ms' )
    setAppIsReady(true)
    readyData.current = true
  }

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

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if ( appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      }

      if(nextAppState == 'background' ){

      }

      appState.current = nextAppState;

      console.log('>APP_STATE_' + String(appState.current).toUpperCase());

    })

    return () => {
      subscription.remove();
    }
  }, [])

  console.log('==================================================< APP')
  return (
    <>
    {true && !appIsReady && 
    <SplashY 
      onLayout = {onLayoutSplash}
    />}
    {appIsReady && //false &&
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

