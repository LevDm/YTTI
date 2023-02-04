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

import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";

import dataRedactor from "../../../../../../async_data_manager/data_redactor";

import { 
    BasePressable, 
    BaseSwitch, 
    BaseBox,
    BaseModal 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { SwitchField, BoxsField, ripple } from "../CommonElements";

import { weatherTypes } from "../../../../../../app_values/AppDefault";

import { WEATHER_API_KEY } from "../../../../../../app_values/AppDefault";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

export default WeatherRedactor = ({
    appStyle,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex, 

    appConfig,
    r_setAppConfig,
    getNewAppConfigObject,
    
}) => {
    
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.weather


    const [dvcLocation, setDvcLocation] = useState(null);
    const [dvcLocationMsg, setDvcLocationMsg] = useState({code: 0, msg: 'press for get informations'});

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

        const control = await controlLocations('dvc', coords)
        if(control){
            cityDefinition(coords)
        } else {
            const locationInfo = {
                used: false,
                coords: coords,
                city: 'not definition'
            };
            //setDeviceLocation(locationInfo)
        }
    }

    const cityDefinition = async (coords) => {
        const locationInfo = {
            from: 'dvc',
            used: false,
            coords: coords,
            city: null
        };
        const lang = languagesAppList[LanguageAppIndex].language

        setDvcLocationMsg({code: 0.5, msg: 'request definition city'})
        const API_CITY_URL = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&lang=${lang}&appid=${WEATHER_API_KEY}`);
        const dataCity = await API_CITY_URL.json();

        locationInfo.city = (dataCity.name).replace(/\u0301/g, ""); // replace removes the accent of a letter

        setDvcLocationMsg({code: 1, msg:'all information received'})
        setDvcLocation(locationInfo)
    }


    const [netLocation, setNetLocation] = useState(null);
    const [netLocationMsg, setNetLocationMsg] = useState({code: 0, msg: 'not informations'});

    const netLocationRequire = async () => {
        const locationInfo = {
            from: 'net',
            used: false,
            coords: null,
            city: null
        };

        const lang = languagesAppList[LanguageAppIndex].language

        setNetLocationMsg({code: 0.1, msg: 'request city define'})
        const API_LOCATION_URL = await fetch('http://api.sypexgeo.net/json/');
        const dataLocation = await API_LOCATION_URL.json();

        locationInfo.coords = {
            lat: dataLocation.city.lat,
            lon: dataLocation.city.lon
        }
        
        locationInfo.city = dataLocation.city[`name_${lang}`]
        
        if((locationInfo.city).length == 0){
            setNetLocationMsg({code: 0.7, msg: 'city not find - api error (accesless network)'})
        } else {
            const control = await controlLocations('net', locationInfo.coords)
            if(control){
                setNetLocationMsg({code: 1, msg: 'all information received'}) 
                setNetLocation(locationInfo) 
            }
        }
    }

    const controlLocations = async (type, coords) => {
        //types = ['net', 'dvc']
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

        appConfig.weather.locationInfo.map((item, index)=>{
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
        //setMsg({code: 0.91, msg: 'control ok'})
        return true
    }

    const [netConnectInfo, setNetConnectInfo] = useState(null)
    
    const getNetConnectInfo = async () => {
        await NetInfo.fetch().then(state => {
            setNetConnectInfo(state.isConnected)
            return state.isConnected
        });
    }

    const editLocation = (type, location) => {
        //types = ['add', 'replace']
        let newAppConfig = getNewAppConfigObject();

        if(type == 'add'){
            newAppConfig.weather.locationInfo.push(location);
        }
        if(type == 'replace'){
            newAppConfig.weather.locationInfo[openedModal.callindex] = location;
        }
        if(type == 'del'){
            let newLocations = []

            appConfig.weather.locationInfo.map((item, index)=>{
                if(item.city != location.city){
                    newLocations.push(item)
                }
            })
            newAppConfig.weather.locationInfo = newLocations;
        }

        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        setCheckGroup(getGroup(-1, true))
    }

    const selected = (type) => {
        //types = ['net', 'dvc']
        console.log('select', type)
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
        if(type == 'dvc' && (dvcLocation == null && dvcLocationMsg.code === 0)){
            getLocationDevice()
        }
        if(msg.code === 1){
            editLocation(openedModal.type, location)

            setModalVisible(false)
        }
    }
    

    const getGroup = (changeIndex = -1, updateConfig = false) => {
        let group = []
        if(checkGroup && !updateConfig){
            checkGroup.map((item, index)=>{
                if(changeIndex != -1){
                    group.push(changeIndex == index? !item : item)
                } else {
                    group.push(item)
                }
            })
        } else {
            appConfig.weather.locationInfo.map((item, index)=>{
                if(changeIndex != -1){
                    group.push(changeIndex == index? !item.used : item.used)
                } else {
                    group.push(item.used)
                }
            })
        }
        return group
    };

    const [ modalVisible, setModalVisible ] = useState(false)

    const onShow = () => {
        const connected = getNetConnectInfo()
        if(connected && !netLocation){
            netLocationRequire()
        }

        if(netLocation){
            //controlLocations('net', ipLocation.coords)
        }

        if(dvcLocation){
            //controlLocations('dvc', deviceLocation.coords)
        }
    }
    
    const outsideModalPress = () =>{
        setModalVisible(false)
    }

    const [checkGroup, setCheckGroup] = useState(getGroup())
    const [openedModal, setOpenedModal] = useState({callindex: -1, type: ''})

    const settingLocaion = (index) => {
        //console.log('setting for', index, !checkGroup[index])
        const newGroup = getGroup(index)
        let newAppConfig = getNewAppConfigObject();
        for(let i = 0; i < checkGroup.length; i++){
            newAppConfig.weather.locationInfo[i].used = newGroup[i];
        }
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        setCheckGroup(newGroup)
    }

    const openModal = (type, index) => {
        //types = ['add', 'replace']
        console.log('modal open', type, index)
        setOpenedModal({callindex: index, type: type})
        setModalVisible(true)
    }

    const [weatherUsed, setWeatherUsed] = useState(appConfig.weather.used)

    const weatherUsedSetting = () => {
        console.log('switch use weather')
        let newAppConfig = getNewAppConfigObject();
        newAppConfig.weather.used = !weatherUsed
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        setWeatherUsed(!weatherUsed)
    }

    const getCheckBoxGroup = (type) => {
        let group = []
        for (let i of weatherTypes){
            let check = false
            if(type === i){check = true}
            group.push(check)
        }
        return group
    };

    const typeSetting = (index) => {
        const type = weatherTypes[index]
        console.log('type setting', type)
        let newAppConfig = getNewAppConfigObject();
        newAppConfig.weather.type = type
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        //setCheckBoxGroup(getCheckBoxGroup(item))
    }

    return (<>
        <SwitchField
            text = {`${Language.used} ${Language.usedState[`${weatherUsed}`]}`}
            primeValue={weatherUsed}
            onChange={weatherUsedSetting}
            style={{
                //height: 60
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <BoxsField
            //  'one'>true || 'multiple'>false
            isChoiceOne={true}
            title = {Language.type}
            //  'one'>index || 'multiple'>[indexs]
            primaryValue = {weatherTypes.indexOf(appConfig.weather.type)} 
            groupSize = {weatherTypes.length}
            groupItems = {Object.values(Language.types)}         
            onPress = {(activeIndex)=>{typeSetting(activeIndex)}}          
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 10}]}>
            {Language.locations}
        </Text>
        <View
            style = {{
                flex: 1,
                height: 75,
                marginLeft: 30,
                width: '85%',
                justifyContent: 'space-between',
            }}
        >
            {[1,2].map((item, index)=>{

                let location = true
                let addNewLocation = false
                const usersLocations = appConfig.weather.locationInfo//['',]

                if(usersLocations.length == 0){
                    if(index === 0){
                        addNewLocation = true
                        location = false
                    } else if(index === 1){
                        addNewLocation = false
                        location = false
                    }
                } 

                if(usersLocations.length == 1){
                    if(index === 0){
                        addNewLocation = false
                        location = true
                    } else if(index === 1){
                        addNewLocation = true
                        location = false
                    }
                }
                
                return (
                    <View
                        key = {`user_location_${index}`}
                        style = {[{
                            flexDirection: 'row',
                            marginTop: 7,
                            height: 30,
                            width: '100%',
                            justifyContent: 'space-between',
                            //borderTopStartRadius
                            //borderStartWidth
                            //borderEndWidth
                        }, staticStyles.shadow]}
                    >   
                        {(location && !addNewLocation) &&
                        <BaseBox
                            isCheckBox={true}
                            style = {{
                                flex: 4,
                                backgroundColor: 'transparent',
                                borderRadius: appStyle.borderRadius.additional,
                            }}
                            android_ripple={ripple(Theme.icons.accents.primary)}
                            Item = {
                                <Text 
                                    style = {[staticStyles.listText, {color: Theme.texts.neutrals.secondary}]}
                                >
                                    {usersLocations[index].city}
                                </Text>
                            }
                            Check = {checkGroup[index]}
                            onPress = {()=>{settingLocaion(index)}}
                            BoxBorderRadius = {appStyle.borderRadius.additional}
                            ColorsChange = {{
                                true: Theme.icons.accents.primary, 
                                false: Theme.icons.accents.quaternary
                            }}
                        />}
                        {(location && !addNewLocation) && 
                        <BasePressable
                            type="i"
                            icon={{
                                name: "dots-horizontal", 
                                size: 25, 
                                color: Theme.icons.accents.primary
                            }}
                            style = {{
                                flex: 1,
                                backgroundColor: 'transparent',
                                borderRadius: appStyle.borderRadius.additional,
                            }}
                            android_ripple={ripple(Theme.icons.accents.primary)}
                            onPress={()=>{openModal('replace', index)}}
                        />}
                        {((location && !addNewLocation) && true) && 
                        <BasePressable
                            type="i"
                            icon={{
                                name: "delete", 
                                size: 25, 
                                color: Theme.icons.accents.primary
                            }}
                            style = {{
                                flex: 1,
                                backgroundColor: 'transparent',
                                borderRadius: appStyle.borderRadius.additional,
                            }}
                            android_ripple={ripple(Theme.icons.accents.primary)}
                            onPress={()=>{editLocation('del', usersLocations[index])}}
                        />}
                        {(!location && addNewLocation) && 
                        <BasePressable
                            type="i"
                            icon={{
                                name: "map-marker-plus-outline", 
                                size: 25, 
                                color: Theme.icons.accents.primary
                            }}
                            style = {{
                                flex: 1,
                                backgroundColor: 'transparent',
                                
                                //borderColor: Theme.icons.accents.primary,
                                //borderWidth: 2,
                                borderRadius: appStyle.borderRadius.additional
                            }}
                            styleItemContainer={{
                                justifyContent: 'flex-start',
                                paddingLeft: 3
                                //alignItems: 'flex-start',
                            }}
                            android_ripple={ripple(Theme.icons.accents.primary)}
                            onPress={()=>{openModal('add', index)}}
                        />}
                    </View>)
                })}
        </View>
        
        <BaseModal
            animationType = {'fade'}
            visible = {modalVisible}
            dimOut = {appStyle.modals.highlightMethods.dimOutDark? Theme.specials.transparents.dim : false} 
            gradient = {appStyle.modals.highlightMethods.gradient? Theme.modals.basics.accents : false}
            outPress = {outsideModalPress}
            onShow = {onShow}
            modalStyle = {{
                width: deviceWidth - 2*appStyle.modals.horizontalProximity,
                left: appStyle.modals.horizontalProximity,
                height: 250
            }}
            style={{
                backgroundColor: Theme.modals.basics.grounds.secondary,
                borderTopLeftRadius: appStyle.borderRadius.additional,
                borderTopRightRadius: appStyle.borderRadius.additional,
                borderWidth: appStyle.modals.highlightMethods.outline? 1 : 0,
                //borderStartWidth: 1,
                //borderEndWidth: 1,
                //borderLeftWidth: 0,
                //borderRightWidth: 0,
                //borderLeftWidth: appStyle.modals.highlightMethods.outline? (appStyle.modals.horizontalProximity? 1 : 0) : 0,
                //borderRightWidth: appStyle.modals.highlightMethods.outline? (appStyle.modals.horizontalProximity? 1 : 0) : 0,
                borderColor: Theme.modals.outline,
                flex: 1,
                //width: deviceWidth-2*appStyle.modals.horizontalProximity,
            }}
            thumbStyle = {{
                backgroundColor: Theme.modals.thumb,
                width: 50
            }}
            snapHeights = {[250, 250]}
        >
           <View
                style = {{
                    flex: 1,
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text style = {[staticStyles.boldText, {color: Theme.modals.texts.neutrals.primary}]}>
                    {Language[openedModal.type]}
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

                        switch(index){
                            case 0:
                                name = Language.network
                                location = netLocation
                                messages = netLocationMsg
                                //select = ipSelected
                                iconName = "ip-outline"
                                break;
                            case 1:
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
                            style = {[{
                                width: '45%',
                                height: 150,
                                borderRadius: appStyle.borderRadius.additional,
                                backgroundColor: Theme.modals.basics.grounds.primary,
                                //justifyContent: 'center',
                                alignItems: 'center'
                            }, staticStyles.shadow]}
                        >
                            <Pressable
                                style = {{
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    //padding: 5
                                }}
                                onPress={()=>{selected(item)}}
                                android_ripple={{
                                    color: Theme.modals.basics.accents,
                                    borderless: true,
                                    foreground: false
                                }}
                            >   
                                <View
                                    style = {{
                                        padding: 5,
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'center'
                                    }}
                                >
                                    <MaterialCommunityIcons name={iconName} size={30} color={Theme.modals.icons.neutrals.primary} />
                                    <Text 
                                        style = {[staticStyles.boldText, {
                                            color: Theme.modals.texts.neutrals.primary, 
                                            textAlign: 'center',
                                        }]}
                                    >
                                        {name}
                                    </Text>
                                </View>
                                <Text
                                    style = {[staticStyles.boldText, 
                                        {
                                            color: Theme.modals.texts.neutrals.primary,
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
                                        borderRadius: appStyle.borderRadius.additional,
                                        backgroundColor: Theme.modals.basics.accents,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    {!netConnectInfo &&
                                    <MaterialCommunityIcons name="wifi-remove" size={40} color={Theme.modals.icons.neutrals.primary}/>
                                    }
                                    {netConnectInfo &&
                                    <Text
                                        style = {[staticStyles.text, 
                                            {
                                                color: Theme.modals.texts.neutrals.secondary,
                                                textAlign: 'center'
                                            }
                                        ]}
                                    >
                                        {`${messages.msg}`}
                                    </Text>
                                    }
                                </Reanimated.View>
                                }
                            </Pressable>
                        </View>)
                    })}
                </View>
            </View>
        </BaseModal> 
    </>)
} 


const staticStyles = StyleSheet.create({

    boldText: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: 'bold', 
        letterSpacing: 0.5
    },

    shadow: {
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4
    },
    ...commonStaticStyles,
});