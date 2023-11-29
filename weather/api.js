import AsyncStorage from '@react-native-async-storage/async-storage';

import store from '../app_redux_files/store';

import { WEATHER_API_KEY } from "react-native-dotenv"

export default WeatherAPI = async (params) => {
  const UPDATE_FREQUENCY = 2 //hours 8
  const DATA_VOLUME = 23

  const {
    requestLanguage,
    locationInfo,
    load = true
  } = params ?? {requestLanguage: undefined, locationInfo: undefined}




  let update = false
  const weatherData = {}
  let loadLocations = []
  let loadLangLetter = store.getState().weatherConfig.requestLanguage

  if(load){
    await AsyncStorage.getItem("storedWeather").then(data =>{
      if (data != null && data != 'null'){
        console.log('>>LOAD_WEATHER:')
        const loadData = JSON.parse(data);
        loadLocations = loadData.config?.locationInfo
        loadLangLetter = loadData.config?.requestLanguage

        const date =  new Date()
        const time = date.getTime()/1000
        const hour = date.getHours()
        const day = date.getDate()
        
        for(const cityKey in loadData){
          if(cityKey == 'config'){continue}

          const weatherObjectInfo = loadData[cityKey]
          const newData = []

          if(weatherObjectInfo.requestTime[0] <= time && time < Math.min(weatherObjectInfo.requestTime[0]+3600*UPDATE_FREQUENCY, weatherObjectInfo.requestTime[1])){
            console.log('>>>WEATHER_AGE_TRUE_FOR_CITY_'+weatherObjectInfo.locationInfo.city)
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
            console.log('>>>WEATHER_AGE_FALSE_FOR_CITY_'+weatherObjectInfo.locationInfo.city)
            update = true;
          }
        }
      } else {
        console.log('>>>NOT_DATA_WEATHER_LOADED_'+data)
      }
    }).catch((error) => console.log(error));
  }


  const locations = locationInfo?? loadLocations
  const letter = requestLanguage?? loadLangLetter

  const weatherConfig = {
    requestLanguage: letter,
    locationInfo: locations
  }


  if((locations.filter((item)=>item.used == true)).length != Object.keys(weatherData).length )(update = true)
  
  
  if(update){
    for(const location of locations){
      if(!location.used){continue}
      const API_WEATHER_URL = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.lat}&lon=${location.coords.lon}&lang=${letter}&exclude=current,daily&units=metric&appid=${WEATHER_API_KEY}`)
      //Constants.manifest.extra.WEATHER_API_KEY
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
        requestLanguage: letter
      }
      console.log('>>>WEATHER_UPDATE_FOR_CITY_'+location.city)
      weatherData[location.city] = resultWeatherObjectInfo
    }

    const savedWeather = {
      config: weatherConfig,
      ...weatherData
    }
    
    await AsyncStorage.setItem("storedWeather", JSON.stringify(savedWeather)).then(() => {
      console.log('>>>UPDATE_WEATHER_SAVED')
    }).catch((error) => console.log(error));
  }

  store.dispatch({type: 'SET_WEATHER_CONFIG', value: weatherConfig})
  store.dispatch({type: 'SET_WEATHER_DATA', value: Object.keys(weatherData).length > 0? weatherData : undefined})
  return weatherData;
}




export const updateWeatherConfig = (config) => {
  const r_store = store.getState()

  const storeWeatherData = r_store.weatherData

  //console.log('config', config)
  //console.log(' storeWeatherData',  storeWeatherData)

  const newWeatherData = {}

  for(const location of config.locationInfo){
    if(storeWeatherData && storeWeatherData[location.city]){
      newWeatherData[location.city] = storeWeatherData[location.city]
    }
  }

  const savedWeather = {
    config: config,
    ...newWeatherData
  }

  AsyncStorage.setItem("storedWeather", JSON.stringify(savedWeather)).then(() => {
    console.log('>>>UPDATE_WEATHER_CONFIG')
  }).catch((error) => console.log(error));
  
  store.dispatch({type: 'SET_WEATHER_CONFIG', value: config})
  store.dispatch({type: 'SET_WEATHER_DATA', value: Object.keys(newWeatherData).length > 0? newWeatherData : undefined})
}