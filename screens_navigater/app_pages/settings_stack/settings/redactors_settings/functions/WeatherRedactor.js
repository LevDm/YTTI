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

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";

import dataRedactor from "../../../../../../app_async_data_manager/data_redactor";

import { 
    BasePressable, 
    BaseSwitch, 
    BaseBox,
    BaseModal 
} from "../../../../../../general_components/base_components/BaseElements";

import SkiaViewDisign from "../../../../../../general_components/base_components/SkiaViewDisign";

import commonStaticStyles, { SwitchField, BoxsField, ripple } from "../CommonElements";

import { weatherTypes } from "../../../../../../app_values/AppDefault";

import DraggableFlatList, {ScaleDecorator,} from "react-native-draggable-flatlist";

import { WeatherAPI } from "../../../../../../app_async_data_manager/data_loader";

import { listsHorizontalProximity, WEATHER_API_KEY } from "../../../../../../app_values/AppDefault";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const horizontalProximity = listsHorizontalProximity['true']

export default WeatherRedactor = ({
    appStyle,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex, 

    appConfig,
    r_setAppConfig,
    //getNewAppConfigObject,
    
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
            used: true,
            coords: coords,
            city: null
        };
        const lang = languagesAppList[LanguageAppIndex].language

        setDvcLocationMsg({code: 0.5, msg: 'request definition city'})
        const API_CITY_URL = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&lang=${lang}&appid=${WEATHER_API_KEY}`);//Constants.manifest.extra.WEATHER_API_KEY
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
            used: true,
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
        const newAppConfig = JSON.parse(JSON.stringify(appConfig));
        //let newAppConfig = getNewAppConfigObject();

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

        //const sub = []
        //for(let item of newAppConfig.weather.locationInfo){ item.used? sub.push(item.city) : null}
        //newAppConfig.weather.locationSubsequence = sub

        //LOAD || UPDATE DATA WEATHER
        WeatherAPI(newAppConfig)

        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        //setCheckGroup(getGroup(-1, true))
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


    const [ modalVisible, setModalVisible ] = useState(false);
    const [openedModal, setOpenedModal] = useState({callindex: -1, type: ''})


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
    
    const outsideModalPress = () =>{
        setModalVisible(false)
    }

    

    const settingLocaion = (index, value) => {
        //console.log('setting for', index, !checkGroup[index])
        //const newGroup = getGroup(index)
        const newAppConfig = JSON.parse(JSON.stringify(appConfig));
        //let newAppConfig = getNewAppConfigObject();
        //for(let i = 0; i < checkGroup.length; i++){
        //    newAppConfig.weather.locationInfo[i].used = newGroup[i];
        //}
        newAppConfig.weather.locationInfo[index].used = value

        //const sub = []
        //for(let item of newAppConfig.weather.locationInfo){ item.used? sub.push(item.city) : null}
        //newAppConfig.weather.locationSubsequence = sub

        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        //setCheckGroup(newGroup)
    }

    const openModal = (type, index) => {
        //types = ['add', 'replace']
        console.log('modal open', type, index)
        setOpenedModal({callindex: index, type: type})
        setModalVisible(true)
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
        //let newAppConfig = getNewAppConfigObject();
        const newAppConfig = JSON.parse(JSON.stringify(appConfig));
        newAppConfig.weather.type = type
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        //setCheckBoxGroup(getCheckBoxGroup(item))
    }

    const [data, setData] = useState(appConfig.weather.locationInfo);
    useEffect(()=>{
        JSON.stringify(data) != JSON.stringify(appConfig.weather.locationInfo)? setData(appConfig.weather.locationInfo) : null
    }, [appConfig])

    const endDrag = ({ data }) => {
        
        const newAppConfig = JSON.parse(JSON.stringify(appConfig));
        const sub = []
        for(let item of data){ item.used? sub.push(item.city) : null}
        newAppConfig.weather.locationSubsequence = sub
        newAppConfig.weather.locationInfo = data
        console.log('funcs', data, sub)
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);
        setData(data)
    }

    const renderItem = ({ item, getIndex, drag = undefined, isActive = false }) => {
        
        if(appConfig.weather.locationInfo.length == 0){return null}
        const useIndex = getIndex()
        const usersLocations = appConfig.weather.locationInfo
        //console.log('funcs item', item, usersLocations)
        const citys = usersLocations.map((item, index)=>item.city)
        const index = citys.indexOf(item.city) //getIndex()//Object.keys(usersLocations).indexOf(item)
        //console.log('funcs inex', index, useIndex)
        const longPress = () => {
            //console.log('funcs longpress', props)
            Vibration.vibrate([5,10])
            drag? drag() : null
        }
        return (
        <ScaleDecorator>
            <View 
                style={{
                    backgroundColor: '#00000001',
                    borderRadius: appStyle.borderRadius.additional,
                    marginLeft: 30,
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
                            borderRadius: appStyle.borderRadius.additional,
                            backgroundColor: isActive ? `${Theme.basics.neutrals.tertiary}10` : 'transparent',
                        },
                    ]}
                    android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.basics.neutrals.tertiary) : false}
                >
                <BaseBox
                    isCheckBox={true}
                    style = {{
                        flex: 4,
                        backgroundColor: 'transparent',
                        borderRadius: appStyle.borderRadius.additional,
                    }}
                    android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.icons.accents.secondary) : false}
                    Item = {<Text style = {[staticStyles.listText, {color: Theme.texts.neutrals.secondary}]}>{usersLocations[index].city}</Text>}
                    check = {usersLocations[index].used}
                    onPress = {()=>{settingLocaion(index, !usersLocations[index].used)}}
                    boxBorderRadius = {appStyle.borderRadius.additional}
                    disignType = {appStyle.selectorsDisign.checkBox}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.icons.accents.secondary,
                        secondary: Theme.icons.accents.quaternary,
                    }}
                />
                <BasePressable
                    type="i"
                    icon={{
                        name: "dots-horizontal", 
                        size: 25, 
                        color: Theme.icons.neutrals.secondary
                    }}
                    style = {{
                        flex: 1,
                        backgroundColor: 'transparent',
                        borderRadius: appStyle.borderRadius.additional,
                    }}
                    android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.icons.neutrals.secondary) : false}
                    onPress={()=>{openModal('replace', index)}}
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
                        flex: 1,
                        backgroundColor: 'transparent',
                        borderRadius: appStyle.borderRadius.additional,
                    }}
                    android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.icons.neutrals.secondary) : false}
                    onPress={()=>{editLocation('del', usersLocations[index])}}
                />}
                <MaterialCommunityIcons name="drag-horizontal-variant" size={26} color={Theme.icons.neutrals.secondary} />
                </Pressable>
            </View>
        </ScaleDecorator>
        )
    }

    return (<View style={{paddingBottom: 12}}>
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
        <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 10, marginTop: 5}]}>
            {Language.locations}
        </Text>
        <View
            style = {{
                height: 60,
            }}
        >
        <DraggableFlatList
            data={data}
            onDragEnd={endDrag}
            keyExtractor={(item) => JSON.stringify(item.coords)}
            renderItem={renderItem}
        />
        {appConfig.weather.locationInfo.length < 2 && 
            <View
                style = {{
                    height: 22,
                    paddingBottom: 10,
                    marginLeft: 30,
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
                    borderRadius: appStyle.borderRadius.additional
                }}
                styleItemContainer={{
                    justifyContent: 'flex-start',
                    paddingLeft: 3
                }}
                android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.icons.accents.secondary) : false}
                onPress={()=>{openModal('add', Math.max(appConfig.weather.locationInfo.length-1, 0))}}
            /></View>
        }
        </View>
       
        
        <BaseModal
            animationType = {'fade'}
            visible = {modalVisible}
            dimOut = {appStyle.modals.highlightMethods.dimOutDark? `${Theme.specials.dimout}25`: false} 
            gradient = {appStyle.modals.highlightMethods.gradient? Theme.basics.accents.quaternary : false}
            blur={appStyle.effects.blur}
            outPress = {outsideModalPress}
            onShow = {onShow}
            modalStyle = {{
                width: deviceWidth - (appStyle.modals.fullWidth? 0 : 2*horizontalProximity),
                left: appStyle.modals.fullWidth? 0 : horizontalProximity,
                height: 250
            }}
            style={{
                backgroundColor: Theme.basics.neutrals.quaternary,
                borderTopLeftRadius: appStyle.borderRadius.additional,
                borderTopRightRadius: appStyle.borderRadius.additional,
                borderWidth: appStyle.modals.highlightMethods.outline? 1 : 0,
                //borderStartWidth: 1,
                //borderEndWidth: 1,
                //borderLeftWidth: 0,
                //borderRightWidth: 0,
                //borderLeftWidth: appStyle.modals.highlightMethods.outline? (appStyle.modals.horizontalProximity? 1 : 0) : 0,
                //borderRightWidth: appStyle.modals.highlightMethods.outline? (appStyle.modals.horizontalProximity? 1 : 0) : 0,
                borderColor: Theme.basics.accents.tertiary,
                flex: 1,
                //width: deviceWidth-2*appStyle.modals.horizontalProximity,
            }}
            thumbStyle = {{
                backgroundColor: Theme.icons.accents.primary,
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
                <Text style = {[staticStyles.boldText, {color: Theme.texts.neutrals.secondary}]}>
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
                                width: '45%',
                                height: 150,
                                alignItems: 'center'
                            }} 
                            //appStyle.effects.shadows? staticStyles.shadow : {}]}
                        >
                            <SkiaViewDisign 
                                borderRadius = {appStyle.borderRadius.additional}
                                backgroundColor = {Theme.basics.neutrals.secondary}
                                shadowColors = {Theme.specials.shadow}
                                shadowMargin={{horizontal: 5, vertical: 5}}
                                shadowStyle = {appStyle.effects.shadows}
                                innerShadow={{
                                    used: true,
                                    borderWidth: 1
                                }}
                            />
                            <View
                                style = {{
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    padding: 5,
                                    borderRadius: appStyle.borderRadius.additional,
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
                                android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.basics.accents.secondary) : false}
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
                                    <MaterialCommunityIcons name={iconName} size={30} color={Theme.icons.neutrals.secondary} />
                                    <Text 
                                        style = {[staticStyles.boldText, {
                                            color: Theme.texts.neutrals.secondary, 
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
                                        borderRadius: appStyle.borderRadius.additional,
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
        </BaseModal> 
    </View>)
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