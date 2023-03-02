import AsyncStorage from '@react-native-async-storage/async-storage';

import store from '../redux_files/store';
import dataCleaner from './data_cleaner';

import themesColorsAppList from '../app_values/Themes';

const dataLoader = ()  => {
  console.log('>ASYNC_LOADING_APP_DATA>')
  AsyncStorage.getItem("storedTasks").then(data =>{
    //console.log(JSON.parse(data))
    let jsonData = JSON.parse(data)
    if (data !== null){
      //if (jsonData.length <= 2){jsonData = baseTasksList}
      console.log('>>LOAD_TASKS_LIST_LENGTH_'+(jsonData.length))
      store.dispatch({type: 'SET_TASKS_LIST_APP', value: jsonData})
      store.dispatch({type: 'SET_LOAD_STATUS_TASKS_APP', value: true})
    } else {
      store.dispatch({type: 'SET_LOAD_STATUS_TASKS_APP', value: true})
      console.log('>>NOT_DATA_TASKS_LOAD_'+data)
    }   
  }).catch((error) => console.log(error));

  AsyncStorage.getItem("storedLanguageSettings").then(data =>{
    if (data !== null){
      console.log('>>LOAD_LANGUAGE_'+JSON.parse(data))
      store.dispatch({type: 'SET_LANGUAGE_APP', value: JSON.parse(data)})
      store.dispatch({type: 'SET_LOAD_STATUS_LANGUAGE_APP', value: true})
    } else {
      console.log('>>NOT_DATA_LANGUGE_LOAD_'+data)
      store.dispatch({type: 'SET_LOAD_STATUS_LANGUAGE_APP', value: true})
    }
  }).catch((error) => console.log(error));

  AsyncStorage.getItem("storedAppStyle").then(data =>{
    //data = String(null) //hard-reset
    if (data !== String(null) && data !== null){
      console.log('>>LOAD_STYLE')
      let styleData = JSON.parse(data)
      console.log(styleData)
      
      if(styleData.customTheme){
        console.log('>>FINDED_CUSTOM_THEME')
        themesColorsAppList.splice(0,1, styleData.customTheme)
        console.log(JSON.stringify(styleData.customTheme))
      }

      store.dispatch({type: 'SET_STYLE_APP', value: styleData})
      store.dispatch({type: 'SET_LOAD_STATUS_STYLE_APP', value: true})
    } else {
      console.log('>>NOT_DATA_STYLE_LOAD_'+data)
      store.dispatch({type: 'SET_LOAD_STATUS_STYLE_APP', value: true})
    }
  }).catch((error) => console.log(error));
  

  AsyncStorage.getItem("storedAppConfig").then(data =>{
    //data = String(null) //hard-reset
    if (data !== String(null) && data !== null){
      console.log('>>LOAD_CONFIG')
      let configData = JSON.parse(data)
      console.log(configData)
      store.dispatch({type: 'SET_CONFIG_APP', value: configData})
      store.dispatch({type: 'SET_LOAD_STATUS_CONFIG_APP', value: true})
    } else {
      console.log('>>NOT_DATA_CONFIG_LOAD_'+data)
      store.dispatch({type: 'SET_LOAD_STATUS_CONFIG_APP', value: true})
    }
  }).catch((error) => console.log(error));
}

export default dataLoader;