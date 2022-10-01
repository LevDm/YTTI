import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';

import themesColorsAppList, {themesApp} from "../../../../../app_values/Themes";
import languagesAppList, { languagesApp } from "../../../../../app_values/Languages";

import { BasePressable } from "../../../../../general_components/base_components/BaseElements";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

export default WeatherRedactor = ({
    appStyle,
    previewAppStyle,
    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex, 

    appConfig,
    r_setAppConfig,
    getNewAppConfigObject,
    
}) => {
    
    const Thema = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.themes

    //const [ location, setLocation ] = useState(null)
    const [coords, setCoords] = useState(null);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const getLocationDevice = async () => {
        
        console.log('async loaded');
    
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log(status)
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setCoords({lat: location.coords.latitude, lon: location.coords.longitude})
        console.log(location)
    }

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = 'Finded'; 
    }
    
    const [ipLocation, setIpLocation] = useState(null);
    const [netConnectInfo, setNetConnectInfo] = useState(null)

    const getNetConnectInfo = async () => {
        await NetInfo.fetch().then(state => {
            console.log('Connection type', state.type);
            console.log('Is connected?', state.isConnected);
            setNetConnectInfo(state.isConnected)
            return state.isConnected
        });
    }

    const ipLocationRequire = async () => {

        const locationIP = {
            country: undefined,
            area: undefined,
            city: undefined,
            coordinats: undefined
        };

        const API_LOCATION_URL = await fetch('http://api.sypexgeo.net/json/');
        const dataLocation = await API_LOCATION_URL.json();

        locationIP.country = [
            dataLocation.country.name_en,
            dataLocation.country.name_ru
        ];
        locationIP.area = [
            dataLocation.region.name_en,
            dataLocation.region.name_ru
        ];
        locationIP.city = [
            dataLocation.city.name_en,
            dataLocation.city.name_ru
        ];
        locationIP.coordinats = {
            lat: dataLocation.city.lat,
            lon: dataLocation.city.lon
        };
        setIpLocation(locationIP)
    }

    const getLocationIp = async () => {
        const connected = getNetConnectInfo()
        //console.log(connected)
        //setNetConnectInfo(connected)
        if(connected){
            ipLocationRequire()
        }
        
    }

    return (<>
        <Text>
            location state: {text} {'\n'}
            lat: {coords? coords.lat : 'none'} {'\n'}
            lon: {coords? coords.lon : 'none'}
        </Text>
        <BasePressable
            type="t"
            text="get location device"
            onPress={getLocationDevice}
        />
        <Text>
            net state: {`${netConnectInfo}`} {'\n'}
            city: {ipLocation? ipLocation.city[0] : 'none' } {'\n'}
            lat: {ipLocation? ipLocation.coordinats.lat : 'none'} {'\n'}
            lon: {ipLocation? ipLocation.coordinats.lon : 'none'}
        </Text>
        <BasePressable
            type="t"
            text="get location ip"
            onPress={getLocationIp}
        />
    </>)
}

const staticStyles = StyleSheet.create({
    text: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
});