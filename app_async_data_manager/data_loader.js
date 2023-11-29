import AsyncStorage from '@react-native-async-storage/async-storage';

import store from '../app_redux_files/store';
import dataCleaner from './data_cleaner';

import themesColorsAppList from '../app_values/Themes';

import WeatherAPI from '../weather/api'

const memoryStors = {
  ui: "storedUIConfiguration",
  user: "storedUser",
  weather: "storedWeather",
  tasks: "storedTasks"
}

const dispatchTypes = {
  appLanguage: 'SET_APP_LANGUAGE',
  style: 'SET_UI_STYLE',
  palette: 'SET_UI_PALETTE',
  composition: 'SET_UI_COMPOSITION'
}

const dataLoader = async ()  => {
  console.log('>ASYNC_LOADING_APP_DATA:')
  AsyncStorage.getItem("storedUIConfiguration").then(data => {
    //data = String(null) //hard-reset
    if (data !== String(null) && data !== null){
      console.log('>>LOAD_UI_CONFIG:')
      const uiConfiguration = JSON.parse(data)
      /*
      if(uiConfiguration.customTheme){
        console.log('>>>FINDED_CUSTOM_THEME')
        themesColorsAppList.splice(0,1, uiConfiguration.customTheme)
        //console.log(JSON.stringify(styleData.customTheme))
      }
      */
      for(const part in uiConfiguration){
        store.dispatch({type: dispatchTypes[part], value: uiConfiguration[part]})
      }
    } else {
      console.log('>>>NOT_DATA_LOADED_FOR_UI_CONFIGURATION')
    }
    store.dispatch({type: 'SET_UI_CONFIGURATION_LOAD_STATUS', value: true})
  }).catch((error) => console.log(error));


  AsyncStorage.getItem("storedUser").then(data =>{
    //data = String(null) //hard-reset
    if (data !== String(null) && data !== null){
      console.log('>>LOAD_USER_DATA:')
      const userData = JSON.parse(data)
      store.dispatch({type: 'SET_USER_DATA', value: userData})
    } else {
      console.log('>>>NOT_USER_DATA_LOADED_')
    }
  }).catch((error) => console.log(error));


  WeatherAPI()

  AsyncStorage.getItem("storedTasks").then(data =>{
    const tasksData = JSON.parse(data)
    if (data !== null){
      console.log('>>LOAD_TASKS_LIST_')
      store.dispatch({type: 'SET_TASKS_DATA', value: tasksData})
    } else {
      console.log('>>>NOT_DATA_TASKS_LOADED_'+data)
    }   
  }).catch((error) => console.log(error));
}

export default dataLoader;