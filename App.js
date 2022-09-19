import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppState, StyleSheet, SafeAreaView, View } from 'react-native';

import Tabs from './screens/Navigater';

//"react-native":"https://github.com/expo/react-native/archive/sdk-43.0.0.tar.gz",

import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
//import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-redux';
import store from './redux_files/store';

import dataLoader from './async_data_manager/data_loader';


import ThemesColorsAppList, {themesApp} from './styles/ColorsApp';

import Splash from './screens_navigater/app_loadSplash/Splash';
import SplashY from './screens_navigater/app_loadSplash/SplashY';

import 'react-native-gesture-handler';

import AppStack from './screens_navigater/AppStack'

import AppDrawer from "./screens_navigater/AppDrawer"

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [ready, setReady] = useState(false);

  const [loadStatusTasks, setLoadStatusTasks] = useState(false);
  const [loadStatusLanguage, setLoadStatusLanguage] = useState(false);
  const [loadStatusStyle, setLoadStatusStyle] = useState(false);
  const [loadStatusConfig, setLoadStatusConfig] = useState(false);

  const [appStyle, setAppStyle] = useState(store.getState().appStyle);

  const [appConfig, setAppConfig] = useState(store.getState().appConfig);

  const [helloModalVisible, setHelloModalVisible] = useState(false);

  const [appTheme, setAppTheme] = useState(store.getState().appStyle.theme);

  const [statusBar, setStatusBar] = useState(store.getState().appStyle.statusBar);//useState({hidden:false})
  
  const [appIsReady, setAppIsReady] = useState(false);

  store.subscribe(() => {
    let jstore = store.getState();

    if (jstore.loadStatusTasks) {
      if (!loadStatusTasks){setLoadStatusTasks(true)}
    }
    
    if (jstore.loadStatusLanguage) {
      if (!loadStatusLanguage){setLoadStatusLanguage(true)}
    }  

    if (jstore.loadStatusStyle) {
      if (!loadStatusStyle){setLoadStatusStyle(true)}
    }

    if (jstore.loadStatusConfig) {
      if (!loadStatusConfig){setLoadStatusConfig(true)}
    }

    if (appStyle != jstore.appStyle) {
      setAppStyle(jstore.appStyle);
    }
  })
 
  

  const finish = () => {
    console.log('>WAIT_LOAD')
  }

  /*
  if (!ready) {
    return (
      <AppLoading 
        startAsync = {dataLoader}
        onFinish = {finish}
        onError = {console.warn}
      />
    )
  }
  */

  useEffect(() => {
    if(loadStatusTasks && loadStatusLanguage && loadStatusConfig && loadStatusStyle && !appIsReady){
    //if(loadStatusTasks && loadStatusLanguage && loadStatusConfig && loadStatusStyle && !ready){
      console.log('>APP_READY_AND_RUNNING')
      
      if(appStyle.splachLoadShow){ setHelloModalVisible(true) };
      //setReady(true);
      setAppIsReady(true)
    }
  }, [loadStatusTasks, loadStatusLanguage, loadStatusConfig, loadStatusStyle]);
  

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

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const styleStatusBar = ThemesColorsAppList[themesApp.indexOf(appStyle.theme)].statusBar

  return (
    <Provider store = {store}>
    <View style = {staticStyles.AppContainer} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <AppDrawer/>
      </NavigationContainer>
      <StatusBar 
        style={styleStatusBar? styleStatusBar : 'auto'} 
        hidden = {false}
        animated={true}
      />
      {helloModalVisible && <SplashY setSplashOut={setHelloModalVisible}/>}
    </View>  
    </Provider>
  );  
}

const staticStyles = StyleSheet.create({
  AppContainer: {
    flex: 1,
    
  }
})
