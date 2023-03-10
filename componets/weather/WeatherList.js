import React, {useState, useRef} from "react";

import {Text, Pressable, Animated, ActivityIndicator, View, Image, Dimensions, FlatList, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native';
import { Ionicons } from "@expo/vector-icons";


import AsyncStorage from '@react-native-async-storage/async-storage';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import themeColorsAppList from "../../app_values/Themes";
const ColorsApp = themeColorsAppList[1]
import { BasePressable } from "../../general_components/base_components/BaseElements";
import WeatherItem from "./WeatherItem";

import * as Location from 'expo-location';

import { Transition, Transitioning } from "react-native-reanimated";

const transition = (
    <Transition.Together>
        <Transition.In type = "fade" duration = {500}/>
        <Transition.Change/>
        <Transition.Out type = "fade" duration = {500}/>
    </Transition.Together>
)


const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const WeatherList = ({LanguageStore}) => {

  const ref = React.useRef();

  const [locationAndWeather, setLocationAndWeather] = useState(null)

  const clearStore = () => {
    AsyncStorage.setItem("locationAndWeather", JSON.stringify(null)).then(() => {
        console.log('clear')
    }).catch((error) => console.log(error));
  }
  

  const autoGetLocationAndWeather = async () => {
    console.log('async loaded');


    
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status)
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    /*!
    const location = await Location.getCurrentPositionAsync({});
    //setLocation(location);
    const coordinats = {lat: location.coords.latitude, lon: location.coords.longitude}
    console.log(location)
    //
    
    */
    
    const locationIP = {
      country: undefined,
      area: undefined,
      city: undefined,
      coordinats: undefined
    };
    //API 
    const API_LOCATION_URL = await fetch('http://api.sypexgeo.net/json/');
    const dataLocation = await API_LOCATION_URL.json();

    locationIP.country = [dataLocation.country.name_en,dataLocation.country.name_ru];
    locationIP.area = [dataLocation.region.name_en,dataLocation.region.name_ru];
    locationIP.city = [dataLocation.city.name_en,dataLocation.city.name_ru];
    locationIP.coordinats = {lat: 56.9047384,lon: 59.9442673};//{lat: dataLocation.city.lat,lon: dataLocation.city.lon};

    //GEO
    //! locationIP.coordinats = coordinats;
    
    // API FROM OPEN WEATHER
    const API_KEY = 'e2b94f1a4a4231151132fbd1a15e1633';
    const language = LanguageStore.Store;

    const locationInfo = {
      coord: undefined,
      utc: undefined,
      country: undefined,
      city: undefined 
    };
    
    const API_CITY_URL = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${locationIP.coordinats.lat}&lon=${locationIP.coordinats.lon}&lang=${language}&appid=${API_KEY}`);
    const dataCity = await API_CITY_URL.json();

    locationInfo.coord = dataCity.coord;
    locationInfo.city = dataCity.name;
    locationInfo.country = dataCity.sys.country;
    locationInfo.utc = dataCity.timezone/3600;
    //console.log(locationInfo);
 

    const weatherInfo = {
      alerts: undefined,
      hourly: undefined,
    };

    const API_WEATHER_URL = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${locationIP.coordinats.lat}&lon=${locationIP.coordinats.lon}&lang=${language}&exclude=current,daily&units=metric&appid=${API_KEY}`)
    const dataWeather = await API_WEATHER_URL.json();

    let requestTime = [];
    let newHourly = [];
    for(let i = 0; i < 24; i++){
      dataWeather.hourly[i].key = i+1
      newHourly.push(dataWeather.hourly[i])
      if(i == 0 || i == 23){requestTime.push(dataWeather.hourly[i].dt)}
    }

    weatherInfo.alerts = dataWeather.alerts;
    weatherInfo.hourly = newHourly;
    //console.log(weatherInfo);

    const resultRequst = {
      locationInfo: locationInfo,
      weather: weatherInfo,
      requestTime: requestTime
    };

    setLocationAndWeather(resultRequst);
    settingLocationAndWeather(resultRequst);
    return resultRequst;
  };

  const [netConnectInfo, setNetConnectInfo] = useState(null)

  const getNetConnectInfo = async () => {
    await NetInfo.fetch().then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
        setNetConnectInfo(state.isConnected)
    });
  }

  
  const gettingLocationAndWeather = async () => {
    await AsyncStorage.getItem("locationAndWeather").then(data =>{
      let upload = true
      let loadData;
      if (data != null && data != 'null'){
        //console.log('>>LOAD_LANGUAGE_'+JSON.parse(data))
        //store.dispatch({type: 'SET_LANGUAGE_APP', value: JSON.parse(data)})
        //store.dispatch({type: 'SET_LOAD_STATUS_LANGUAGE_APP', value: true})
        console.log('async get')
        loadData = JSON.parse(data);
        //console.log(loadData.requestTime)

        //locationAndWeather == null?setLocationAndWeather(JSON.parse(data)): locationAndWeather
        //return true
        //requstTime
        if(locationAndWeather == null){
          
          let date =  new Date()
          let time = date.getTime()/1000
          let hour = date.getHours()
          let day = date.getDate()
          let newActualHourly = []
          if(loadData.requestTime[0] <= time && time < loadData.requestTime[1]-3600*12){
            console.log('time is ok')
            upload = false; //
            for(let i = 0; i < 24; i++){
              let dateHourlyDay = new Date(loadData.weather.hourly[i].dt*1000)
              if(dateHourlyDay.getDate() == day){
                if(dateHourlyDay.getHours() >= hour){
                  newActualHourly.push(loadData.weather.hourly[i])
                }
              } else {
                    if(dateHourlyDay.getDate() > day){newActualHourly.push(loadData.weather.hourly[i])}
                }
            }
            loadData.weather.hourly = newActualHourly
          } 
          else {
            console.log('time is no')
          }
          //console.log(newActualHourly.length)
          //loadData.weather.hourly
        }
      } 
      //else {
        //console.log('>>NOT_DATA_LOAD_'+data)
       // settingLocationAndWeather();
        //locationAndWeather == null?autoGetLocationAndWeather(): locationAndWeather
        //return false
      //}

      upload?(locationAndWeather == null?autoGetLocationAndWeather(): locationAndWeather): setLocationAndWeather(loadData)
    }).catch((error) => console.log(error));
  }

  const settingLocationAndWeather = async (data) => {
    //const newData = autoGetLocationAndWeather();
    //setLocationAndWeather(newData) 
    AsyncStorage.setItem("locationAndWeather", JSON.stringify(data)).then(() => {
      console.log('async set')
    }).catch((error) => console.log(error));
  }

  //locationAndWeather == null?autoGetLocationAndWeather(): locationAndWeather
  //console.log(locationAndWeather)

  
  //clearStore()
  netConnectInfo == null?getNetConnectInfo(): netConnectInfo
  //console.log(netConnectInfo)
  //if(netConnect()){console.log(netConnect())}
  locationAndWeather == null && netConnectInfo?gettingLocationAndWeather(): locationAndWeather
  if(locationAndWeather != null && !gettingLocationAndWeather){
    settingLocationAndWeather()
  }
  
  const [weatherListVisible, setWeatherListVisible] = useState(false)

  const animate_state = {start: 0, end: 100}
  const value = useRef(new Animated.Value(animate_state.start)).current
    
  const Animate = () => { 
    Animated.timing(value, { toValue: animate_state.end, useNativeDriver: true, duration: 400 }).start(() =>{
      setWeatherListVisible(!weatherListVisible)
      Animated.timing(value, { toValue: animate_state.start, useNativeDriver: true, duration: 600 }).start()
    })
  }
    
  const inputRange = [animate_state.start, animate_state.end]
  const opacity = value.interpolate({ inputRange, outputRange: [1, 0]})

  return (
    <Transitioning.View
      ref = {ref}
      transition = {transition} 
      style = {[styles.base, {opacity: 1}]}
    >
      {locationAndWeather == null && 
      <View style = {{alignItems: 'center'}}>
        <ActivityIndicator size={50} color={ColorsApp.symbolDark}/>
        <Text>{netConnectInfo?LanguageStore.Weather.loadingData:LanguageStore.Weather.netConnectError}</Text>
      </View>
      }
      {locationAndWeather != null && <>
      <View style = {{justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center'}}>
          <View style = {{flexDirection: 'row',alignItems: 'center'}}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="black" />
            <Text style = {{fontSize: 18, fontWeight: 'bold'}}>{LanguageStore.Weather.actualWeather}</Text>
          </View>
          <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="map-marker-radius-outline" size={20} color="black" />
              <Text style = {{fontSize: 10}}>{locationAndWeather.locationInfo.city} {locationAndWeather.locationInfo.country}</Text>
          </View>
      </View>


      {!weatherListVisible && 
      <View>
        <WeatherItem item = {locationAndWeather.weather.hourly[0]} index = {'0'} elements = {"one"} LanguageStore = {LanguageStore}/>
      </View>
      }

      {weatherListVisible && 
      <View height = {200} paddingLeft = {5} marginTop = {5}>
        <FlatList
          data={locationAndWeather.weather.hourly}
          horizontal = {true}
          showsHorizontalScrollIndicator = {true}
          renderItem = {({ item, index }) => (<WeatherItem item = {item} index = {index} elements = {"list"} LanguageStore = {LanguageStore}/>)}
        />
      </View>
      }

      <BasePressable
        type = {"i"}
        icon = {{name: weatherListVisible? "chevron-up":"chevron-down", size: 28}}
        style = {{marginTop: 10}}
        onPress = {() => {
          //Animate();
          ref.current.animateNextTransition();
          setWeatherListVisible(!weatherListVisible)
        }}
      />
      </>}
    </Transitioning.View>
  );
    
}

export default WeatherList;

const styles = StyleSheet.create({
  base: {
    paddingTop: 5,
    marginTop: 5,
    justifyContent: 'center', 
    flexGrow: 1,
    marginHorizontal: 5,
    zIndex: 1,
    flexDirection: "column",
    backgroundColor: ColorsApp.sky,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4, 
  },
})