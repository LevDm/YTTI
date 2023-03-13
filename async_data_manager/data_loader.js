import AsyncStorage from '@react-native-async-storage/async-storage';

import store from '../redux_files/store';
import dataCleaner from './data_cleaner';

import themesColorsAppList from '../app_values/Themes';

const dataLoader = ()  => {
  console.log('>ASYNC_LOADING_APP_DATA>')

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
      if(configData.weather.type != 'off'){WeatherAPI(configData)}
    } else {
      console.log('>>NOT_DATA_CONFIG_LOAD_'+data)
      store.dispatch({type: 'SET_LOAD_STATUS_CONFIG_APP', value: true})
    }
  }).catch((error) => console.log(error));
  
  
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
}

export default dataLoader;


import Constants from 'expo-constants';

const WeatherAPI = async (appConfig, load = true) => {
  const UPDATE_FREQUENCY = 1 //hours 8
  const DATA_VOLUME = 23
  const {
    languageApp,
    weather: { locationInfo },
  } = appConfig
  let update = false
  const weatherData = {}

  if(load){
    await AsyncStorage.getItem("storedWeather").then(data =>{
      if (data != null && data != 'null'){
        
        
        const loadData = JSON.parse(data);
        const date =  new Date()
        const time = date.getTime()/1000
        const hour = date.getHours()
        const day = date.getDate()
        console.log('>>LOAD_WEATHER')
        for(const cityKey in loadData){
          const weatherObjectInfo = loadData[cityKey]
          const newData = []

          if(weatherObjectInfo.requestTime[0] <= time && time < Math.min(weatherObjectInfo.requestTime[0]+3600*UPDATE_FREQUENCY, weatherObjectInfo.requestTime[1])){
            console.log('>>>WEATHER_AGE_TRUE_'+weatherObjectInfo.locationInfo.city)
            update = false; //
            for(let i = 0; i < DATA_VOLUME; i++){
              const dateHourlyDay = new Date(weatherObjectInfo.weather.hourly[i].dt*1000)
              if(dateHourlyDay.getDate() == day && dateHourlyDay.getHours() >= hour){
                newData.push(weatherObjectInfo.weather.hourly[i])
              } else {
                if(dateHourlyDay.getDate() > day){newData.push(weatherObjectInfo.weather.hourly[i])}
              }
            }

            //location.weather.hourly = n
            const resultWeatherObjectInfo = {
              locationInfo: weatherObjectInfo.locationInfo,
              weather: {
                hourly: newData,
                alerts: weatherObjectInfo.weather.alerts
              },
              requestTime: weatherObjectInfo.requestTime,
              lastUpdate: weatherObjectInfo.lastUpdate,
              requestLanguage: weatherObjectInfo.requestLanguage
            }
            weatherData[cityKey] = resultWeatherObjectInfo
          } else {
            console.log('>>>WEATHER_AGE_FALSE_'+weatherObjectInfo.locationInfo.city)
            update = true;
          }
        }
      } else {
        console.log('>>NOT_DATA_WEATHER_LOAD_'+data)
      }
      //console.log((locationInfo.filter((item)=>item.used == true)).length, Object.keys(weatherData).length )
      if((locationInfo.filter((item)=>item.used == true)).length != Object.keys(weatherData).length )(update = true)
    }).catch((error) => console.log(error));
  }

  if(update){
    for(const location of locationInfo){
      if(!location.used){continue}
      const API_WEATHER_URL = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.lat}&lon=${location.coords.lon}&lang=${languageApp}&exclude=current,daily&units=metric&appid=${Constants.manifest.extra.WEATHER_API_KEY}`)
      const dataWeather = await API_WEATHER_URL.json();
      
      const weatherInfo = {
        alerts: undefined,
        hourly: undefined,
      }

      const requestTime = [];
      const newHourly = [];
      for(let i = 0; i < DATA_VOLUME; i++){
        dataWeather.hourly[i].key = i+1
        newHourly.push(dataWeather.hourly[i])
        if(i == 0 || i == DATA_VOLUME-1){requestTime.push(dataWeather.hourly[i].dt)}
      }

      weatherInfo.alerts = dataWeather.alerts;
      weatherInfo.hourly = newHourly;
      //console.log(weatherInfo);

      const resultWeatherObjectInfo = {
        locationInfo: location,
        weather: weatherInfo,
        requestTime: requestTime,
        lastUpdate: new Date().getTime(),
        requestLanguage: languageApp
      }
      console.log('>>>WEATHER_UPDATE_'+location.city)
      weatherData[location.city] = resultWeatherObjectInfo
    }
    
    await AsyncStorage.setItem("storedWeather", JSON.stringify(weatherData)).then(() => {
      console.log('>>WEATHER_SAVE')
      
    }).catch((error) => console.log(error));
  }

  //console.log(weatherData)
  store.dispatch({type: 'SET_WEATHER_DATA', value: weatherData})
  return weatherData;
}