import React, {
    useState, 
    useRef, 
    useEffect,
    useCallback, 
    useMemo
} from "react";

import {
    StyleSheet, 
    Text, 
    Pressable, 
    ScrollView,
    FlatList, 
    Animated, 
    SectionList, 
    View,
    Modal,
    Button, 
    Dimensions, 
    Vibration,
    Switch, 
    ActivityIndicator
} from 'react-native';

//import {default as Reanimated} from 'react-native-reanimated';
import Reanimated, {
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    withDelay,
    withSequence, 
    useAnimatedScrollHandler,
    useAnimatedProps, 
    cancelAnimation,
    useAnimatedRef,
    useDerivedValue,
    scrollTo,
    runOnJS,
    interpolateColor,
    interpolate,
    Extrapolate,
    runOnUI,
    Easing 
} from 'react-native-reanimated';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';

import dataRedactor from "../../../../../../app_async_data_manager/data_redactor";

import BasePressable from "../../../../../../general_components/base_components/BasePressable";
import BaseWindow from "../../../../../../general_components/base_components/BaseWindow";


import SkiaViewDisign from "../../../../../../general_components/base_components/SkiaViewDisign";

import commonStaticStyles, { SwitchField, BoxsField, ripple } from "../CommonElements";

import { weatherTypes } from "../../../../../../app_values/AppDefault";

import DraggableFlatList, {ScaleDecorator,} from "react-native-draggable-flatlist";

import  WeatherAPI, { updateWeatherConfig }  from "../../../../../../weather/api";

import { listsHorizontalProximity} from "../../../../../../app_values/AppDefault";

import { WEATHER_API_KEY } from "react-native-dotenv"

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const horizontalProximity = listsHorizontalProximity['true']

import useLanguage from "../../../../../../app_hooks/useLanguage";
import { connect, useSelector } from "react-redux";
import mapStateToProps from "../../../../../../app_redux_files/stateToProps";

const WeatherRedactor = (props) => {

    const {
        uiComposition,

        r_uiStyle,
        Theme

    } = props

    const {
        weather: {
            type,
        }
    } = uiComposition

    const weatherType = useDerivedValue(()=>(weatherTypes.indexOf(type.value)))
    
    const Language = useLanguage().SettingsScreen.Redactors.weather

    const typeSetting = (index) => {
        type.value = weatherTypes[index]
    }

    return (
        <View style={{paddingBottom: 12}}>
            <BoxsField
                //  'one'>true || 'multiple'>false
                isChoiceOne={true}
                title = {Language.type}
                //  'one'>index || 'multiple'>[indexs]
                //primaryValue = {weatherTypes.indexOf(appConfig.weather.type)}
                aValue={weatherType} 
                groupSize = {weatherTypes.length}
                groupItems = {Object.values(Language.types)}         
                onPress = {typeSetting}          
                appStyle = {r_uiStyle}
                Theme = {Theme}
            />
            <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 8, marginTop: 5}]}>
                {Language.locations}
            </Text>
            <WeatherLocationRedactor {...props}/>
        </View>
    )
} 

export default connect(mapStateToProps('WEATHER_SETTINGS'))(WeatherRedactor)


const WeatherLocationRedactor = (props) => {

    const {
        Theme,
        r_uiStyle,

        r_setWeatherConfig,
        weatherConfig,
    } = props

    //const weatherConfig = useSelector((state)=>state.weatherConfig)

    const {
        locationInfo,
        requestLanguage,
    } = weatherConfig

    const [locations, setLocations] = useState(locationInfo);
    const [callModal, setCallModal] = useState({callindex: -1, type: '', visible: false})

    const setLocationInfo = (newValue) => {
        const copy = JSON.parse(JSON.stringify(weatherConfig))
        //copy.updated = true
        copy.locationInfo = newValue
        //r_setWeatherConfig(copy)

        updateWeatherConfig(copy)

        setLocations(newValue)
    }

    const deleteLocation = (location) => {
        const newLocations = []
        locations.map((item, index)=>{
            if(item.city != location){
                newLocations.push(item)
            }
        })
        setLocationInfo(newLocations);
        
    }

    
    const outsideModalPress = () =>{
        setCallModal({callindex: -1, type: '', visible: false})
    }


    const openModal = (type, city) => {
        const index = city? (locations).findIndex((item)=>item.city == city) : Math.max((locations).length-1, 0)
        setCallModal({callindex: index, type: type, visible: true})
    }
   

    const endDrag = ({ data }) => {
        setLocationInfo(data)
    }


    const renderItem = ({ item, drag = undefined, isActive = false }) => {
        const longPress = () => {
            Vibration.vibrate([5,10])
            drag? drag() : null
        }
        return (
        <ScaleDecorator>
            <View 
                style={{
                    backgroundColor: '#00000001',
                    borderRadius: r_uiStyle.borderRadius.secondary,
                    marginLeft: 16,
                    width: '85%',
                }}
            >
                <Pressable
                    delayLongPress={300}
                    onLongPress={longPress}
                    disabled={isActive}
                    style={[
                        { 
                            height: 30,
                            //marginLeft: 30,
                            //width: '85%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            borderRadius: r_uiStyle.borderRadius.secondary,
                            backgroundColor: isActive ? `${Theme.basics.neutrals.tertiary}10` : 'transparent',
                        },
                    ]}
                    android_ripple={ripple(Theme.basics.neutrals.tertiary)}
                >
                <Text style = {[staticStyles.listText, {color: Theme.texts.neutrals.secondary}]}>{item.city}</Text>
                <View
                    style={{
                        width: 120,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}
                >
                    <BasePressable
                        type="i"
                        icon={{
                            name: "dots-horizontal", 
                            size: 25, 
                            color: Theme.icons.neutrals.secondary
                        }}
                        style = {{
                            //flex: 1,
                            backgroundColor: 'transparent',
                            borderRadius: r_uiStyle.borderRadius.secondary,
                        }}
                        android_ripple={ripple(Theme.icons.neutrals.secondary)}
                        onPress={()=>{openModal('replace', item.city)}}
                    />
                    {true && 
                    <BasePressable
                        type="i"
                        icon={{
                            name: "delete", 
                            size: 20, 
                            color: Theme.icons.neutrals.secondary
                        }}
                        style = {{
                            //flex: 1,
                            backgroundColor: 'transparent',
                            borderRadius: r_uiStyle.borderRadius.secondary,
                        }}
                        android_ripple={ripple(Theme.icons.neutrals.secondary)}
                        onPress={()=>{deleteLocation(item.city)}}
                    />}
                    <MaterialCommunityIcons name="drag-horizontal-variant" size={26} color={Theme.icons.neutrals.secondary} />
                </View>
                </Pressable>
            </View>
        </ScaleDecorator>
        )
    }


    const renderModal = () => {

        const Language =  useLanguage().SettingsScreen.Redactors.weather

        const [dvcLocation, setDvcLocation] = useState(null)
        const [dvcLocationMsg, setDvcLocationMsg] = useState({code: 0, msg: 'press for get informations'})

        const [netLocation, setNetLocation] = useState(null)
        const [netLocationMsg, setNetLocationMsg] = useState({code: 0, msg: 'not informations'})

        const [netConnectInfo, setNetConnectInfo] = useState(null)
        const getNetConnectInfo = async () => {
            await NetInfo.fetch().then(state => {
                setNetConnectInfo(state.isConnected)
                return state.isConnected
            });
        }


        const getLocationDevice = async () => {
            setDvcLocationMsg({code: 0.1, msg:'waiting premission'})
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setDvcLocationMsg({code: 0.2, msg: 'Permission to access location was denied'});
                return;
            }
    
            setDvcLocationMsg({code: 0.3, msg: 'waiting for geolocation or aswer'})
            const location = await Location.getCurrentPositionAsync({});
    
            setDvcLocationMsg({code: 0.4, msg: 'finded location'})
            const coords = {lat: location.coords.latitude, lon: location.coords.longitude}
    
            const control = controlLocations('dvc', coords)
            if(control){
                cityDefinition(coords)
            }
        }

    
        const cityDefinition = async (coords) => {
            const locationInfo = {
                from: 'dvc',
                used: true,
                coords: coords,
                city: null
            }

            setDvcLocationMsg({code: 0.5, msg: 'request definition city'})
            const API_CITY_URL = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&lang=${requestLanguage}&appid=${WEATHER_API_KEY}`);//Constants.manifest.extra.WEATHER_API_KEY
            const dataCity = await API_CITY_URL.json();
            
            locationInfo.city = (dataCity.name).replace(/\u0301/g, ""); // replace removes the accent of a letter
    
            setDvcLocationMsg({code: 1, msg:'all information received'})
            setDvcLocation(locationInfo)
        }

    
        const netLocationRequire = async () => {
            const locationInfo = {
                from: 'net',
                used: true,
                coords: null,
                city: null
            }

            setNetLocationMsg({code: 0.1, msg: 'request city define'})
            const API_LOCATION_URL = await fetch('http://api.sypexgeo.net/json/');
            const dataLocation = await API_LOCATION_URL.json();
    
            locationInfo.coords = {
                lat: dataLocation.city.lat,
                lon: dataLocation.city.lon
            }
            
            locationInfo.city = dataLocation.city[`name_${requestLanguage}`]
            
            if((locationInfo.city).length == 0){
                setNetLocationMsg({code: 0.7, msg: 'city not find - api error (accesless network)'})
            } else {
                const control = controlLocations('net', locationInfo.coords)
                if(control){
                    setNetLocationMsg({code: 1, msg: 'all information received'}) 
                    setNetLocation(locationInfo) 
                }
            }
        }
    

        const controlLocations = (type, coords) => {
            let coordsError = false
            let setMsg 
            switch(type){
                case 'net':
                    setMsg = setNetLocationMsg
                    break;
                case 'dvc':
                    setMsg = setDvcLocationMsg
                    break;
            }
    
            (locations).map((item, index)=>{
                if(Math.abs(item.coords.lat - coords.lat) < 0.05 ){
                    coordsError = true
                }
                if(Math.abs(item.coords.lon - coords.lon) < 0.05 ){
                    coordsError = true
                }
            })
    
            if(coordsError){
                setMsg({code: 0.9, msg: 'this location matches one of yours'})
                return false
            }
            return true
        }
    
        
        const onShow = () => {
            const connected = getNetConnectInfo()
            if(connected && !netLocation){
                netLocationRequire()
            }
    
            if(netLocation){
                controlLocations('net', netLocation.coords)
            }
    
            if(dvcLocation){
                controlLocations('dvc', dvcLocation.coords)
            }
        }


        const editLocation = (type, location) => {
            const newLocations = JSON.parse(JSON.stringify(locations))
            if(type == 'add'){
                newLocations.push(location);
            }
            if(type == 'replace'){
                newLocations[callModal.callindex] = location;
            }
            //### LOAD || UPDATE DATA WEATHER
            //appLanguage.letter
            WeatherAPI({requestLanguage: requestLanguage, locationInfo: newLocations}) 
            setLocations(newLocations)
            //setLocationInfo(newLocations)
        }


        const selected = (type) => {
            let msg
            let location
            switch(type){
                case 'net':
                    msg = netLocationMsg
                    location = netLocation
                    break;
                case 'dvc':
                    msg = dvcLocationMsg
                    location = dvcLocation
                    break;
            }
            console.log('select', type, msg.code, location)

            if(type == 'dvc' && (dvcLocation == null && dvcLocationMsg.code <= 0.4)){
                getLocationDevice()
            }
            if(msg.code === 1){
                editLocation(callModal.type, location)
                outsideModalPress()
            }
        }
    

        return (
            <BaseWindow
                visible = {callModal.visible}

                outPress = {outsideModalPress}
                onShow = {onShow}

                modalStyle = {{
                    height: 240,
                    marginHorizontal: r_uiStyle.modals.proximity.h?? 0,
                    borderTopLeftRadius: r_uiStyle.borderRadius.secondary,
                    borderTopRightRadius: r_uiStyle.borderRadius.secondary,
                }}

                blur={r_uiStyle.effects.blur}
                highlight = {r_uiStyle.modals.highlight}
                colors={{
                    bg: Theme.basics.neutrals.quaternary,
                    accent: Theme.basics.accents.tertiary,
                    dimout: Theme.specials.dimout,
                }}
            > 
                <View
                    style = {{
                        flex: 1,
                        paddingHorizontal: 10,
                        paddingTop: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text style = {[staticStyles.boldText, {color: Theme.texts.neutrals.secondary}]}>
                        {Language[callModal.type]}
                    </Text>
                    <View
                        style = {{
                            marginTop: 15,
                            flex: 1,
                            width: '100%',
                            height: 160,
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        }}
                    >   
                        {['net','dvc'].map((item, index)=>{

                            let name
                            let location
                            let messages
                            //let select
                            let iconName

                            let type

                            switch(index){
                                case 0:
                                    type = 'net'
                                    name = Language.network
                                    location = netLocation
                                    messages = netLocationMsg
                                    //select = ipSelected
                                    iconName = "ip-outline"
                                    break;
                                case 1:
                                    type = 'dvc'
                                    name = Language.device
                                    location = dvcLocation
                                    messages = dvcLocationMsg
                                    //select = deviceSelected
                                    iconName = "cellphone-marker"
                                    break;
                            }

                            return (
                            <View
                                key={`location_area_modal_${item}`}
                                style = {{
                                    width: 160,
                                    height: 160,
                                    alignItems: 'center'
                                }} 
                                //appStyle.effects.shadows? staticStyles.shadow : {}]}
                            >
                                {/* 
                                <SkiaViewDisign 
                                    borderRadius = {r_uiStyle.borderRadius.secondary}
                                    backgroundColor = {Theme.basics.neutrals.secondary}
                                    shadowColors = {Theme.specials.shadow}
                                    shadowMargin={{horizontal: 5, vertical: 5}}
                                    shadowStyle = {r_uiStyle.effects.shadows}
                                    innerShadow={{
                                        used: true,
                                        borderWidth: 1
                                    }}
                                    initSize={{
                                        height: 160,
                                        width: 160
                                    }}
                                />*/}
                                <View
                                    style = {{
                                        width: 150,
                                        height: 150,
                                        alignItems: 'center',
                                        //justifyContent: 'center',
                                        margin: 5,
                                        borderRadius: r_uiStyle.borderRadius.secondary,
                                        backgroundColor: '#00000001',
                                    }}
                                >
                                
                                <Pressable
                                    style = {{
                                        width: '100%',
                                        height: '100%',
                                        alignItems: 'center',
                                        //padding: 5
                                    }}
                                    onPress={()=>{selected(item)}}
                                    android_ripple={ripple(Theme.basics.accents.secondary)}
                                >   
                                    <View
                                        style = {{
                                            padding: 5,
                                            paddingHorizontal: 12,
                                            width: '100%',
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <MaterialCommunityIcons name={iconName} size={24} color={Theme.icons.neutrals.secondary} />
                                        <Text 
                                            style = {[staticStyles.boldText, {
                                                color: Theme.texts.neutrals.secondary, 
                                                fontSize: 14,
                                                textAlign: 'center',
                                            }]}
                                        >
                                            {name}
                                        </Text>
                                    </View>
                                    <Text
                                        style = {[staticStyles.boldText, 
                                            {
                                                color: Theme.texts.neutrals.secondary,
                                                marginTop: 20,
                                                padding: 5
                                            }
                                        ]}
                                    >
                                        {location? location.city : 'none'}
                                    </Text>
                                    {messages.code != 1 &&
                                    <Reanimated.View
                                        style = {{
                                            position: 'absolute',
                                            bottom: 0,
                                            width: '100%',
                                            height: '65%',
                                            borderRadius: r_uiStyle.borderRadius.secondary,
                                            borderTopLeftRadius: 0,
                                            borderTopRightRadius: 0,
                                            backgroundColor: Theme.basics.accents.secondary,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {!netConnectInfo &&
                                        <MaterialCommunityIcons name="wifi-remove" size={40} color={Theme.icons.neutrals.primary}/>
                                        }
                                        {netConnectInfo &&
                                        <Text
                                            style = {[staticStyles.text, 
                                                {
                                                    color: Theme.texts.neutrals.primary,
                                                    textAlign: 'center'
                                                }
                                            ]}
                                        >
                                            {Language.gettingState[type][`${messages.code}`]}
                                        </Text>
                                        }
                                    </Reanimated.View>
                                    }
                                </Pressable>
                                </View>
                            </View>)
                        })}
                    </View>
                </View>
            </BaseWindow>
        )
    }

    return ( 
        <>
            <View
                style = {{
                    height: 60,
                }}
            >
                <DraggableFlatList
                    data={locations}
                    onDragEnd={endDrag}
                    keyExtractor={(item) => JSON.stringify(item.coords)}
                    renderItem={renderItem}
                />
                {locations.length < 2 && 
                    <View
                        style = {{
                            height: 30,
                            paddingBottom: 10,
                            marginLeft: 16,
                            width: '85%',
                            justifyContent: 'space-between',
                        }}
                    >
                    <BasePressable
                        type="i"
                        icon={{
                            name: "map-marker-plus-outline", 
                            size: 20, 
                            color: Theme.icons.accents.secondary
                        }}
                        style = {{
                            flex: 1,
                            backgroundColor: 'transparent',
                            borderRadius: r_uiStyle.borderRadius.secondary
                        }}
                        styleItemContainer={{
                            justifyContent: 'flex-start',
                            paddingLeft: 3
                        }}
                        android_ripple={ripple(Theme.icons.accents.secondary)}
                        onPress={()=>{openModal('add')}}
                    /></View>
                }
            </View>
            {renderModal()}
        </>
    )
}

const staticStyles = StyleSheet.create({
    boldText: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: 'bold', 
        letterSpacing: 0.5
    },
    ...commonStaticStyles,
});