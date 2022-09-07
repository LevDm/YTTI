import React from "react";

import {Text, Pressable, Animated, ActivityIndicator, View, Image,Dimensions, StyleSheet} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemeColorsAppList from "./../../styles/ColorsApp";
const ColorsApp = ThemeColorsAppList[0]
const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const WeatherItem = ({ 
    item, 
    index,
    elements,
    LanguageStore

    }) => {

    let date = new Date(item.dt*1000)
    //let dateDay = date.toString().substring(7,21)

    let hour = date.getHours()
    hour = hour>9?hour: '0'+hour
    //console.log(hour)
    let timeItem = hour+':00'
    let dateItem = LanguageStore.Weather.today
    dateItem = date.getDate()==new Date().getDate()? dateItem : LanguageStore.Weather.morrow


    //dateDay = dateDay.substring(0,3)+(date.getMonth()+1)+dateDay.substring(2,)
    //if){dateDay = dateDay.substring(11)}

    let listDirections = LanguageStore.Weather.windFrom
    let windFrom = '?'
    if ( 337.5 <= item.wind_deg && item.wind_deg <= 360 ||
        0      <= item.wind_deg && item.wind_deg < 22.5  ) {windFrom = listDirections[0]}
    if ( 22.5  <= item.wind_deg && item.wind_deg < 67.5  ) {windFrom = listDirections[1]}
    if ( 67.5  <= item.wind_deg && item.wind_deg < 112.5 ) {windFrom = listDirections[2]}
    if ( 112.5 <= item.wind_deg && item.wind_deg < 157.5 ) {windFrom = listDirections[3]}
    if ( 157.5 <= item.wind_deg && item.wind_deg < 202.5 ) {windFrom = listDirections[4]}
    if ( 202.5 <= item.wind_deg && item.wind_deg < 247.5 ) {windFrom = listDirections[5]}
    if ( 247.5 <= item.wind_deg && item.wind_deg < 292.5 ) {windFrom = listDirections[6]}
    if ( 292.5 <= item.wind_deg && item.wind_deg < 337.5 ) {windFrom = listDirections[7]}

    let windGustSpeed = (Math.round(item.wind_speed) != Math.round(item.wind_gust) && item.wind_gust != undefined)?('-'+`${Math.round(item.wind_gust)}`):''

    let itemWind = Math.round(item.wind_speed)+windGustSpeed+LanguageStore.Weather.ms
    itemWind = Math.round(item.wind_speed) == 0? LanguageStore.Weather.calm : itemWind
        
    return (
        <View
            key={item.key} 
            style={ elements == 'list'?{ marginRight: 5, alignItems: 'center', borderRadius: 12, width: deviceWidth/3.25} : {flexDirection: 'row', justifyContent: 'space-around',alignItems: 'center', margin: 5}}
        >
            <LinearGradient
                    colors={[ColorsApp.skyUpUp, ColorsApp.skyUp]}
                    style={{
                        position: 'absolute',
                        borderRadius: 12,
                        left: 0,
                        right: 0,
                        top: 0,
                        height: elements == 'list'?195: 60,
                    }}
                />
            {elements == 'list' && <>
                
                <Text style = {{fontSize: 20, fontWeight: 'bold'}}>{timeItem}</Text>
                
            </>}

            <View style = {{alignItems: 'center'}}>
                <Text style = {{fontSize: 10}}>{elements == 'list'?dateItem: LanguageStore.Weather.now}</Text>
                <Image
                    style={{
                        width: elements == 'list'?90:70,
                        height: elements == 'list'?40:30,
                        resizeMode: 'cover',
                    }}
                    source={{uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,}}
                />
            </View>
            
            <View style = {{alignItems: 'center'}}>
                <Text style = {{fontSize: 24, fontWeight: 'bold'}}>{Math.round(item.temp)}°</Text>
                <Text style = {{fontSize: 11, fontWeight: 'bold'}}>{LanguageStore.Weather.feelsLike}: {Math.round(item.feels_like)}°</Text>
            </View>

            <View style = {{alignItems: 'flex-start'}}>
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons name="weather-windy" size={19} color="black" />
                    <Text style = {{marginLeft: 2,marginRight: 2}}>{itemWind}</Text>
                    <MaterialCommunityIcons name="compass-outline" size={15} color="black" />
                    <Text>{windFrom}</Text>
                </View>
                
                <View style = {elements == 'one'?{flexDirection: 'row', justifyContent: 'space-around'}:{}}>  
                    <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                        <MaterialCommunityIcons name="cloud-outline" size={19} color="black" />
                        <Text style = {{marginLeft: 2}}>{item.clouds}%</Text>
                    </View>
                    
                    <View style = {{flexDirection: 'row',alignItems: 'center'}}>
                        <MaterialCommunityIcons name="water-outline" size={19} color="black" />
                        <Text style = {{marginLeft: 2}}>{item.humidity}%</Text>
                    </View>   
                </View>
            </View>
        </View>
    )
}

export default WeatherItem;