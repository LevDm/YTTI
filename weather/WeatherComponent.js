import React, {useState, useEffect, useRef, memo} from "react";

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

import Reanimated, { FadeOut, useAnimatedStyle } from "react-native-reanimated";

import { connect, useSelector } from 'react-redux';
import store from "../app_redux_files/store";
import mapStateToProps from "../app_redux_files/stateToProps";
import mapDispatchToProps from "../app_redux_files/dispatchToProps";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';


import WeatherItem from "./WeatherItem";

import * as Location from 'expo-location';

import { LinearGradient } from "expo-linear-gradient";
import { ImageComponent } from "react-native";


import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import useLanguage from "../app_hooks/useLanguage";

const RPressable = Reanimated.createAnimatedComponent(Pressable);

const DrawerLoader = (props) => {
  const {
    size, 
    bc,
    fc
  } = props

  return (
    <ContentLoader 
      speed={1}
      width={280}
      height={400}
      viewBox="0 0 280 400"
      backgroundColor={bc.value}
      foregroundColor={fc.value}
    >
      <Rect x="12" y="48" rx="12" ry="12" width="256" height="340" /> 
      <Rect x="48" y="12" rx="12" ry="12" width="220" height="24" />
    </ContentLoader>
  )
}

const RectLoader = (props) => {
  const {
    size, 
    bc,
    fc
  } = props
  
  return (
  <ContentLoader 
    speed={1}
    width={size.w}
    height={size.h}
    viewBox="0 0 300 400"
    backgroundColor={bc.value}
    foregroundColor={fc.value}
  >
    <Rect x="0" y="0" rx="0" ry="0" width="300" height="400"/> 
  </ContentLoader>
)}


const WeatherComponent = memo((props) => {
  const {
    uiStyle,
    uiTheme,
    uiComposition,

    componentSize,


    weatherData,
    weatherConfig: {
      locationInfo: locations
    },

  } = props

  //const weatherData = useSelector(state=>state.weatherData) //useWeatherData() //r_weatherData //
  //const locations = useSelector(state=>state.weatherConfig.locationInfo) //useWeatherLocations() //r_weatherConfig//
  const selectCity = locations[0]?.city


  const {
    h: componentHeight, 
    w: componentWidht
  } = componentSize


  const {
    basics: {
      neutrals: {
        primary: basicNP,
        secondary: basicNS,
        tertiary: basicNT,
      },
      accents: {
        primary: basicAP,
        secondary: basicAS,
        tertiary: basicAT,
        quaternary: basicAQ
      }
    },
    texts: {
      neutrals: {
        primary: textNP,
        secondary: textNS,
        tertiary: textNT,
      },
      accents: {
        primary: textAP,
        secondary: textAS,
        tertiary: textAT,
      }
    },
    icons: {
      neutrals: {
        primary: iconNP,
        secondary: iconNS,
        tertiary: iconNT,
      },
      accents: {
        primary: iconAP,
        secondary: iconAS,
        tertiary: iconAT,
      }
    },
    specials: {
      separator
    }
  } = uiTheme

  const {
    borderRadius:{
      secondary: addRadius
    }
  } = uiStyle

  const textColorAP = useAnimatedStyle(()=>({
    color: textAP.value
  }))

  const textColorAT = useAnimatedStyle(()=>({
    color: textAT.value
  }))

  const textColorNP = useAnimatedStyle(()=>({
    color: textNP.value
  }))

  const textColorNS = useAnimatedStyle(()=>({
    color: textNS.value
  }))

  const textColorNT = useAnimatedStyle(()=>({
    color: textNT.value
  }))
  const iconColorNP = useAnimatedStyle(()=>({
    color: iconNP.value
  })) 

  const iconColorNS = useAnimatedStyle(()=>({
    color: iconNS.value
  })) 

  const iconColorAP = useAnimatedStyle(()=>({
    color: iconAP.value
  })) 

  const iconColorAT = useAnimatedStyle(()=>({
    color: iconAT.value
  })) 

  const separatorColor = useAnimatedStyle(()=>({
    color: separator.value
  })) 

  const ripleProps = useAnimatedStyle(()=>({
    color: `${textAT.value}20`,
    borderless: true,
    foreground: false
  }))

  const borderStyle = useAnimatedStyle(()=>({
    borderRadius: addRadius.value
  })) 
  

  


  const {
    type = 'full'
  } = props

  console.log('#', selectCity, type)


  const NetInfoIcon = () => {
    const networkCheck = useNetInfo().isConnected
    if(networkCheck){return null}
    return <MaterialCommunityIcons name={networkCheck == null? "wifi-sync" : "wifi-alert"} size={32}/>
  }

  const LoadIndicator = (props) => {
    const {
      type,
      children
    } = props

    if(weatherData && selectCity){
      return React.cloneElement(children, {
        city: selectCity,
        data: weatherData,
        locs: locations
      })
    }
    
    return (
      <Reanimated.View
        exiting={FadeOut}
        style = {{alignItems: 'center', justifyContent: 'center'}}
      >
        {type == 'rect' && 
          <RectLoader size={componentSize} bc={basicAS} fc={basicNS}/>
        }
        {type == 'drawer' && 
        <DrawerLoader 
          size = {{h: componentHeight-30, width: componentWidht}}
          bc={basicNT}
          fc={basicAT}
        />}

        <Reanimated.Text
          style={[
            type == 'rect'? textColorNP : textColorAP,
            {
              position: 'absolute',
              width: 33,
              textAlign: 'center'
            }
          ]}
        >
          {(selectCity == undefined) && <MaterialCommunityIcons name="map-marker-alert-outline" size={32}/>}
          <NetInfoIcon />
        </Reanimated.Text>
      </Reanimated.View>
    )
  }


  const ListComponent = (lprops) => {
    const {
      data, //weatherData[selectCity].weather.hourly[0]
      city, //selectCity
    } = lprops
    return (
        <>
          <View 
            style = {{
              alignItems: 'center',
              justifyContent: 'center',
              height: 20,
              marginTop: 4,
              marginLeft: 16
              //left: 80
            }}
          > 
            <Reanimated.Text 
              style = {[textColorNP, {
                fontSize: 13, 
                fontWeight: '500', 
                fontVariant: ['small-caps'], 
                paddingHorizontal: 3,
              }]}
            >
              {city.toLowerCase()}
            </Reanimated.Text>
          </View>
          <WeatherItem 
            item = {data[city].weather.hourly[0]} 
            elements = {"full_list"} 
            //{...props}

            size={{
              h: componentHeight-24,
              w: componentWidht
            }}

            {...props}
          />
        </>
    )
  }


  const DrawerComponent = (lprops) => {
    const {
      city,
      locs,
      data,
    } = lprops


    const [selectCityIndex, setSelectCityIndex] = useState(0)

    const showingCity = locs[selectCityIndex].city ?? city

    return (
      <>
      <View style = {{justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 24}}>
        <Reanimated.Text style={iconColorAT}>
          <MaterialCommunityIcons name="map-marker-radius-outline" size={24}/>
        </Reanimated.Text>
        {locs.map((item, index)=>{
          if(!item.used){return null}
          return (
            <Reanimated.View
              key={`${item.city}_${index}`}
              style={[borderStyle, {
                backgroundColor: '#00000001',
                marginLeft: 2 
              }]}
            >
            <RPressable
              onPress={()=>{if(showingCity != item.city){setSelectCityIndex(index)}}}
              animatedProps={ripleProps}
            >
              <Reanimated.Text 
                style = {[textColorAT, {
                  fontSize: 14, 
                  fontWeight: '600', 
                  fontVariant: ['small-caps'],
                  letterSpacing: 0.5, 
                  paddingHorizontal: 3,
                  textDecorationLine: showingCity == item.city? 'underline' : 'none',
                }]}
              >
                {(item.city).toLowerCase()}
              </Reanimated.Text>
            </RPressable>
            </Reanimated.View>
          )
        })}
      </View>
      <ScrollView 
        style={{
          height: componentHeight-30-24,
          width: componentWidht,
        }}
        contentContainerStyle={{
          //paddingBottom: 16,
          paddingHorizontal: 4
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {data[showingCity].weather.hourly.map((item, index)=>(
            <WeatherItem
              key = {item.key} 
              item = {item} 
              index = {index} 
              elements = {index == 0? "full" :"short"} 

              size={{
                h: 90,
                w: ((componentWidht-8)/3) * (index == 0? 2 : 1)
              }}

              {...props}
            />
          ))}
        </View>
      </ScrollView>
      <SourceInfo />
      </>
    )
  }

  if(type == 'widget'){
    return null 
  }

  if(type == 'lists'){
    
    return (
      <View
        style = {{
          flex: 1,
        }}
      >
        <Reanimated.Text style={[iconColorNP, {position: 'absolute', zIndex: 1, top: 4, left: 16}]}>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={20}/>
        </Reanimated.Text>
        <LoadIndicator type='rect'>
          <ListComponent />
        </LoadIndicator>
      </View>
    )
  }

  const Header = () => {
    const Language = useLanguage().Weather
    return (
      <Reanimated.Text 
        style = {[textColorAP, {
          fontSize: 18, 
          fontWeight: 'bold', 
          fontVariant: ['small-caps'], 
          letterSpacing: 3, 
        }]}
      >
        {Language.actualWeather}
      </Reanimated.Text>
    )
  }

  const SourceInfo = () => {
    const Language = useLanguage().Weather
    const last = (weatherData && locations.length > 0 && weatherData[selectCity]?.lastUpdate)? Math.floor((new Date().getTime()-weatherData[selectCity].lastUpdate)/(60*1000)) : 0
    return (
      <View
        style = {{
          //position: 'absolute',
          bottom: 0,
          height: 16,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingHorizontal: 6,
          paddingBottom: 3,
        }}
      >
        <Reanimated.Text
          style={[textColorNT, {
            fontSize: 8,
          }]}
        >
          {Language.lastUpdate}{`(`}{weatherData[selectCity].requestLanguage}{`)`} {last < 60? last : Math.floor(last/60)} {Language[last < 60? 'min' : 'hour']} {Language.ago}
        </Reanimated.Text>
        <Reanimated.Text
          style={[textColorNT, {
            fontSize: 8,
          }]}
        >
          {Language.dataSource}: OpenWeather
        </Reanimated.Text>
      </View>
    )
  }

  //props.type = 'full'
  return (
    <View
      style = {[styles.base,]}
    >
      <View style = {{flexDirection: 'row',alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, height: 30}}>
        <Reanimated.Text style={iconColorAP}>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={24}/>
        </Reanimated.Text>
        <Header />
      </View>

      <LoadIndicator type='drawer'>
        <DrawerComponent />
      </LoadIndicator>
    </View>
  )
}, 
  (prev, next)=>{
    return weatherDataEqual(prev.weatherData, next.weatherData) && weatherLocationsEqual(prev.weatherConfig.locationInfo, next.weatherConfig.locationInfo)
  }
)
export default connect(mapStateToProps("WEATHER"))(WeatherComponent); //mapDispatchToProps("WEATHER_C")


const weatherDataEqual = (obj_1, obj_2) => {
  let answer
  for(const key in obj_1){
    if(obj_1[key]?.lastUpdate == obj_2[key]?.lastUpdate){         
      answer = (answer == undefined? true : (answer && true))
    }
  }
  return answer?? false
}

const weatherLocationsEqual = (obj_1, obj_2) => {
  let answer
  let i = 0
  for(const loc of obj_1){
    if(JSON.stringify(loc?.coords) == JSON.stringify(obj_2[i]?.coords)){
      answer = (answer == undefined? true : (answer && true))
    }
    i += 1;
  }
  return answer?? false
}


const styles = StyleSheet.create({
  base: {
    flex: 1,
    justifyContent: 'flex-start',

  },
})