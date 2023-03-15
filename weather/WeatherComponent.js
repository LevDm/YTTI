import React, {useState, useEffect, useRef} from "react";

import {
  Appearance,
  Text,
  Pressable, 
  Animated, 
  ActivityIndicator, 
  View, 
  Image, 
  Dimensions, 
  FlatList,
  ScrollView,
  SafeAreaView, 
  TouchableOpacity, 
  StyleSheet
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import { connect } from 'react-redux';
import store from "../redux_files/store";
import mapStateToProps from "../redux_files/stateToProps";
import mapDispatchToProps from "../redux_files/dispatchToProps";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';

import themesColorsAppList, {themesApp} from "../app_values/Themes";
import languagesAppList, {languagesApp} from "../app_values/Languages";

import { BasePressable } from "../general_components/base_components/BaseElements";
import WeatherItem from "./WeatherItem";

import * as Location from 'expo-location';

import { Transition, Transitioning } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const transition = (
    <Transition.Together>
        <Transition.In type = "fade" duration = {500}/>
        <Transition.Change/>
        <Transition.Out type = "fade" duration = {500}/>
    </Transition.Together>
)


const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

const WeatherComponent = (props) => {
  

  const [ weatherData, setWeatherData ] = useState(props.weatherData)

  const [LanguageAppIndex, setLanguageAppIndex] = useState(languagesApp.indexOf(props.appConfig.languageApp));//ThemesColorsAppList[ThemeColorsAppIndex]
  const [ThemeColorsAppIndex, setThemeColorAppIndex] = useState(themesApp.indexOf(props.appStyle.palette.theme));//LanguagesAppList[LanguageAppIndex]

  const [appStyle, setAppStyle] = useState(props.appStyle);
  const [appConfig, setAppConfig] = useState(props.appConfig);

  const [ThemeSchema, setThemeSchema] = useState(props.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : props.appStyle.palette.scheme)

  store.subscribe(() => {
    const jstore = store.getState();

    if(LanguageAppIndex != languagesApp.indexOf(jstore.appConfig.languageApp)){
        setLanguageAppIndex(languagesApp.indexOf(jstore.appConfig.languageApp))
    }

    if(ThemeColorsAppIndex != themesApp.indexOf(jstore.appStyle.palette.theme)){
        setThemeColorAppIndex(themesApp.indexOf(jstore.appStyle.palette.theme));
    }

    if(ThemeSchema != jstore.appStyle.palette.scheme){
        setThemeSchema(jstore.appStyle.palette.scheme == 'auto'? Appearance.getColorScheme() : jstore.appStyle.palette.scheme);
    }

    if (appStyle != jstore.appStyle){
        setAppStyle(jstore.appStyle);
    }

    if (appConfig != jstore.appConfig){
        setAppConfig(jstore.appConfig);
        setSelectCity(jstore.appConfig.weather.locationInfo[0].city)
    }

    if (weatherData != jstore.weatherData){
      setWeatherData(jstore.weatherData)
    }
  })

  const [listenerColorSheme, setListinerColorScheme] = useState(Appearance.getColorScheme())
    useEffect(()=>{
        if(listenerColorSheme){
            if(appStyle.palette.scheme == 'auto' && listenerColorSheme != ThemeSchema){
                console.log('drawer accept new color sheme', listenerColorSheme, 'used shema', appStyle.palette.scheme)
                setThemeSchema(listenerColorSheme)
            }
        }
    },[listenerColorSheme])
    
    Appearance.addChangeListener(({colorScheme})=>{
        setListinerColorScheme(colorScheme)
    })

  
  const Theme  = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
  const Language = languagesAppList[LanguageAppIndex].Weather
  
  const netConnectInfo = useNetInfo();

  const [selectCity, setSelectCity] = useState(props.appConfig.weather.locationInfo[0].city)

  //console.log(weatherData)

  const last = (weatherData && selectCity)? Math.floor((new Date().getTime()-weatherData[selectCity].lastUpdate)/(60*1000)) : 0

  const ripple = (color) => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
})
  
  return (
    <View
      style = {[styles.base, {opacity: 1}]}
    >
      <View style = {{flexDirection: 'row',alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10}}>
        <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color={Theme.icons.accents.primary} />
        <Text 
          style = {{
            fontSize: 18, 
            fontWeight: 'bold', 
            fontVariant: ['small-caps'], 
            letterSpacing: 3, 
            color: Theme.texts.accents.primary
          }}
        >
          {Language.actualWeather}
        </Text>
      </View>
      {!weatherData  && 
      <View style = {{alignItems: 'center'}}>
        <ActivityIndicator size={50} color={Theme.icons.accents.primary}/>
        <Text
          color = {Theme.texts.accents.primary}
        >
          {netConnectInfo?Language.loadingData:Language.netConnectError}</Text>
      </View>
      }

      {weatherData && <>
      <View style = {{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, height: 30}}>
        <MaterialCommunityIcons name="map-marker-radius-outline" size={24} color={Theme.icons.accents.tertiary} />
        {appConfig.weather.locationInfo.map((item, index)=>{
          if(!item.used){return null}
          return (
            <View
              key={`${item.city}_${index}`}
              style={{
                borderRadius: appStyle.borderRadius.additional,
                backgroundColor: '#00000001', 
              }}
            >
            <Pressable
              onPress={()=>{if(selectCity != item.city){setSelectCity(item.city)}}}
              android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.texts.neutrals.secondary ) : false}
            >
              <Text 
                style = {{
                  fontSize: 14, 
                  fontWeight: '400', 
                  fontVariant: ['small-caps'],
                  letterSpacing: 0.7, 
                  paddingHorizontal: 3,
                  textDecorationLine: selectCity == item.city? 'underline' : 'none',
                  color: Theme.texts.neutrals.secondary 
                }}
                //
              >
                {(item.city).toLowerCase()}
              </Text>
            </Pressable>
            </View>
          )
        })}
      </View>
      <View height = {290}>
        <FlatList
          data={weatherData[selectCity].weather.hourly.slice(2)}
          contentContainerStyle = {{
            paddingBottom: 15
          }}
          numColumns={3}
          showsHorizontalScrollIndicator = {true}
          ListHeaderComponent={
            <View style = {{flexDirection: 'row'}}>
              <WeatherItem 
                item = {weatherData[selectCity].weather.hourly[0]} 
                elements = {"full"} 
                //{...props}
                appStyle={appStyle}
                appConfig={appConfig}
                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
                LanguageAppIndex = {LanguageAppIndex}
              />
              <WeatherItem 
                item = {weatherData[selectCity].weather.hourly[1]} 
                elements = {"short"} 
                //{...props}
                appStyle={appStyle}
                appConfig={appConfig}
                ThemeColorsAppIndex={ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
                LanguageAppIndex = {LanguageAppIndex}
              />
            </View>
          }
          renderItem = {({ item, index }) => (
            <WeatherItem 
              item = {item} 
              index = {index} 
              elements = {"short"} 
              //{...props}
              appStyle={appStyle}
              appConfig={appConfig}
              ThemeColorsAppIndex={ThemeColorsAppIndex}
              ThemeSchema = {ThemeSchema}
              LanguageAppIndex = {LanguageAppIndex}
            />
          )}
        />
        <LinearGradient 
          style = {{
            position: 'absolute',
            bottom: 0,
            height: 20,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingHorizontal: 3,
            paddingBottom: 3,
          }}
          locations={[0,.55]}//
          colors={['transparent', Theme.basics.neutrals.primary]}
          //start={{x: 0, y: 0}}
        >
          <Text
            style={{
              fontSize: 8,
              color: Theme.texts.neutrals.tertiary,
            }}
          >
            {Language.lastUpdate}{`(`}{weatherData[selectCity].requestLanguage}{`)`} {last < 60? last : Math.floor(last/60)} {Language[last < 60? 'min' : 'hour']} {Language.ago}
          </Text>
          <Text
            style={{
              fontSize: 8,
              color: Theme.texts.neutrals.tertiary,
            }}
          >
            {Language.dataSource}: OpenWeather
          </Text>
        </LinearGradient>
      </View>
      </>}
    </View>
  );
    
}

export default connect(mapStateToProps("WEATHER_C"))(WeatherComponent); //mapDispatchToProps("WEATHER_C")

const styles = StyleSheet.create({
  base: {
    paddingTop: 5,
    //marginTop: 5,
    justifyContent: 'flex-start', 
    flexGrow: 1,
    //marginHorizontal: 5,
    zIndex: 1,
    flexDirection: "column",
    //backgroundColor: 'grey',//ColorsApp.sky,
    borderRadius: 12,
  },
})