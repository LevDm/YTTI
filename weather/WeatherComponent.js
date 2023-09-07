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

import Reanimated, { FadeOut, useAnimatedStyle } from "react-native-reanimated";

import { connect } from 'react-redux';
import store from "../app_redux_files/store";
import mapStateToProps from "../app_redux_files/stateToProps";
import mapDispatchToProps from "../app_redux_files/dispatchToProps";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';

import themesColorsAppList, {themesApp} from "../app_values/Themes";
import languagesAppList, {languagesApp} from "../app_values/Languages";

import { BasePressable } from "../general_components/base_components/BaseElements";
import WeatherItem from "./WeatherItem";

import * as Location from 'expo-location';

import { LinearGradient } from "expo-linear-gradient";
import { ImageComponent } from "react-native";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const RPressable = Reanimated.createAnimatedComponent(Pressable);

const DrawerLoader = (props) => {
  const {
    size, 
    bc,
    fc
  } = props

  return (
    <ContentLoader 
      speed={2}
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
    speed={2}
    width={size.w}
    height={size.h}
    viewBox="0 0 300 400"
    backgroundColor={bc.value}
    foregroundColor={fc.value}
  >
    <Rect x="0" y="0" rx="0" ry="0" width="300" height="400"/> 
  </ContentLoader>
)}

const WeatherComponent = (props) => {

  const {
    uiStyle,
    uiTheme,
    uiComposition,

    componentSize
  } = props

  const {
    h: componentHeight, 
    w: componentWidht
  } = componentSize

  //console.log('wather component', componentSize)

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
      additional: addRadius
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
  
  

  const [selectCity, setSelectCity] = useState(props.appConfig.weather.locationInfo[0].city)

  const last = (weatherData && selectCity && weatherData[selectCity]?.lastUpdate)? Math.floor((new Date().getTime()-weatherData[selectCity].lastUpdate)/(60*1000)) : 0

  const {
    type = 'full'
  } = props

  //console.log(weatherData)

  
  const networkCheck = useNetInfo();

  const locationsCheck = appConfig.weather.locationInfo.length > 0

  const LoadIndicator = (type) => {

    const title = locationsCheck? 
                    networkCheck? 
                      'load data'//Language.loadingData 
                      : 'no network connect' //Language.netConnectError 
                  : 'none location'

    return (
      <Reanimated.View
        exiting={FadeOut}
        style = {{alignItems: 'center', justifyContent: 'center'}}
      >
        {type == 'rect' && 
          <RectLoader size={componentSize} bc={basicAQ} fc={basicNS}/>
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
          {(!locationsCheck) && <MaterialCommunityIcons name="map-marker-alert-outline" size={32}/>}
          {(!networkCheck) && <MaterialCommunityIcons name="wifi-alert" size={32}/>}
        </Reanimated.Text>
      </Reanimated.View>
    )
  }

  if(type == 'widget'){
    const localCity = (appConfig.weather.locationInfo[0].city)
    return null 
  }

  if(type == 'lists'){
    const localCity = (appConfig.weather.locationInfo[0].city)
    return (
      <View
        style = {{
          flex: 1,
          //backgroundColor: 'blue',
          borderRadius: appStyle.borderRadius.basic
        }}
      >
        <Reanimated.Text style={[iconColorNP, {position: 'absolute', zIndex: 1, top: 4, left: 16}]}>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={20}/>
        </Reanimated.Text>

        {!weatherData &&  LoadIndicator('rect')}

        {weatherData && 
         <>
          <View 
            style = {{
              alignItems: 'center',
              justifyContent: 'center',
              height: 20,
              marginTop: 4,
              marginLeft: 24
              //left: 80
            }}
          > 
            <Reanimated.Text 
              style = {[textColorNP, {
                fontSize: 12, 
                fontWeight: '400', 
                fontVariant: ['small-caps'],
                letterSpacing: 0.7, 
                paddingHorizontal: 3,
              }]}
            >
              {localCity.toLowerCase()}
            </Reanimated.Text>
          </View>
          <WeatherItem 
            item = {weatherData[localCity].weather.hourly[0]} 
            elements = {"full_list"} 
            //{...props}

            size={{
              h: componentHeight-24,
              w: componentWidht
            }}

            {...props}

            appStyle={appStyle}
            appConfig={appConfig}
            ThemeColorsAppIndex={ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
            LanguageAppIndex = {LanguageAppIndex}
          />
        </>}
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
      </View>

      {!weatherData && LoadIndicator('drawer')}

      {weatherData && 
      <>
      <View style = {{justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 24}}>
        <Reanimated.Text style={iconColorAT}>
          <MaterialCommunityIcons name="map-marker-radius-outline" size={24}/>
        </Reanimated.Text>
        {appConfig.weather.locationInfo.map((item, index)=>{
          if(!item.used){return null}
          return (
            <Reanimated.View
              key={`${item.city}_${index}`}
              style={[borderStyle, {
                backgroundColor: '#00000001',
                marginLeft: 6 
              }]}
            >
            <RPressable
              onPress={()=>{if(selectCity != item.city){setSelectCity(item.city)}}}
              animatedProps={ripleProps}
            >
              <Reanimated.Text 
                style = {[textColorAT, {
                  fontSize: 14, 
                  fontWeight: '400', 
                  fontVariant: ['small-caps'],
                  letterSpacing: 0.5, 
                  paddingHorizontal: 3,
                  textDecorationLine: selectCity == item.city? 'underline' : 'none',
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
          {weatherData[selectCity].weather.hourly.map((item, index)=>(
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
              appStyle={appStyle}
              appConfig={appConfig}
              ThemeColorsAppIndex={ThemeColorsAppIndex}
              ThemeSchema = {ThemeSchema}
              LanguageAppIndex = {LanguageAppIndex}
            />
          ))}
        </View>
      </ScrollView>
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
      </>}
    </View>
  );
    
}

export default connect(mapStateToProps("WEATHER_C"))(WeatherComponent); //mapDispatchToProps("WEATHER_C")

const styles = StyleSheet.create({
  base: {
    flex: 1,
    justifyContent: 'flex-start',

  },
})