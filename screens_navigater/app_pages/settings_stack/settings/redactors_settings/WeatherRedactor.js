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

import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';

import themesColorsAppList, {themesApp} from "../../../../../app_values/Themes";
import languagesAppList, { languagesApp } from "../../../../../app_values/Languages";

import dataRedactor from "../../../../../async_data_manager/data_redactor";

import { 
    BasePressable, 
    BaseSwitch, 
    BaseBox 
} from "../../../../../general_components/base_components/BaseElements";

import { weatherTypes } from "../../../../../app_values/AppDefault";

import { WEATHER_API_KEY } from "../../../../../app_values/AppDefault"

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
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.weather

    //const [ location, setLocation ] = useState(null)
    //const [coords, setCoords] = useState(null);
    const [deviceLocation, setDeviceLocation] = useState(null);

    const [deviceLocationMsg, setDeviceLocationMsg] = useState({code: 0, msg: 'press for get informations'});


    const getLocationDevice = async () => {

        setDeviceLocationMsg({code: 0.1, msg:'waiting premission'})
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setDeviceLocationMsg({code: 0.2, msg: 'Permission to access location was denied'});
            return;
        }

        setDeviceLocationMsg({code: 0.3, msg: 'waiting for geolocation or aswer'})
        const location = await Location.getCurrentPositionAsync({});

        setDeviceLocationMsg({code: 0.4, msg: 'finded location'})
        const coords = {lat: location.coords.latitude, lon: location.coords.longitude}

        const control = await controlDeviceLocations(coords)
        if(control){
            cityDefinition(coords)
        } else {
            const locationInfo = {
                used: false,
                coords: coords,
                //utc: undefined,
                //country: undefined,
                city: 'not definition'
            };
            setDeviceLocation(locationInfo)
        }
    }

    const cityDefinition = async (coords) => {
        const locationInfo = {
            used: false,
            coords: coords,
            //utc: undefined,
            //country: undefined,
            city: null
        };
        const lang = languagesAppList[LanguageAppIndex].language

        setDeviceLocationMsg({code: 0.5, msg: 'request definition city'})
        const API_CITY_URL = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&lang=${lang}&appid=${WEATHER_API_KEY}`);
        const dataCity = await API_CITY_URL.json();

        //console.log(dataCity)

        locationInfo.city = (dataCity.name).replace(/\u0301/g, ""); // replace removes the accent of a letter
        //locationInfo.country = dataCity.sys.country;
        //locationInfo.utc = dataCity.timezone/3600;

        console.log('device location ok -> auto add')
        if(modalType.type === 'replace'){
            //replaceNewLocation(deviceLocation)
        } else if(modalType.type === 'add'){
            //addNewLocation(deviceLocation)
        }
         
        setDeviceLocationMsg({code: 1, msg:'all information received'})
        setDeviceLocation(locationInfo)
    }
    
    const [ipLocation, setIpLocation] = useState(null);
    const [ipLocationMsg, setIpLocationMsg] = useState({code: 0, msg: 'not informations'});

    const [netConnectInfo, setNetConnectInfo] = useState(null)

    const getNetConnectInfo = async () => {
        await NetInfo.fetch().then(state => {
            //console.log('Connection type', state.type);
            //console.log('Is connected?', state.isConnected);
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
        const locationInfo = {
            used: false,
            coords: null,
            //utc: undefined,
            //country: undefined,
            city: null
        };

        const lang = languagesAppList[LanguageAppIndex].language

        setIpLocationMsg({code: 0.1, msg: 'request city define'})
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


        locationInfo.coords = {
            lat: dataLocation.city.lat,
            lon: dataLocation.city.lon
        }
        
        locationInfo.city = dataLocation.city[`name_${lang}`]
        //console.log('wtf', locationInfo.city,(locationInfo.city).length == 0)
        if((locationInfo.city).length == 0){
            //locationInfo.city = 'city not find'
            //console.log('err ip', locationInfo)
            setIpLocationMsg({code: 0.7, msg: 'city not find - api error'})
        } else {
            const control = await controlIpLocations(locationInfo.coords)
            if(control){
                setIpLocationMsg({code: 1, msg: 'all information received'})  
            }
        }
        
        setIpLocation(locationInfo)
    }

    const [ modalVisible, setModalVisible ] = useState(false)

    const onShow = () => {
        //console.log('modal show')
        const connected = getNetConnectInfo()
        if(connected && !ipLocation){
            ipLocationRequire()
        }
    }
    
    const outsideModalPress = () =>{
        setModalVisible(false)
    }

    const addNewLocation = (location) => {
        let newAppConfig = getNewAppConfigObject();
        newAppConfig.weather.locationInfo.push(location);
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        setCheckGroup(getGroup(-1, true))
    }

    const replaceNewLocation = (location) => {
        let newAppConfig = getNewAppConfigObject();
        newAppConfig.weather.locationInfo[modalType.callindex] = location;
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        setCheckGroup(getGroup(-1, true))
    }

    const ipSelected = () => {
        console.log('select ip')
        if(ipLocationMsg.code === 1){
            console.log('location ip ok')
            if(modalType.type === 'replace'){
                replaceNewLocation(ipLocation)
            } else if(modalType.type === 'add'){
                addNewLocation(ipLocation)
            }
        }

    }

    const deviceSelected = () => {
        console.log('select device')
        if(deviceLocation == null && deviceLocationMsg.code === 0){
            getLocationDevice()
        }
        if(deviceLocationMsg.code === 1){
            console.log('location device ok')
            if(modalType.type === 'replace'){
                replaceNewLocation(deviceLocation)
            } else if(modalType.type === 'add'){
                addNewLocation(deviceLocation)
            }
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
    
    const [checkGroup, setCheckGroup] = useState(getGroup())
    const [modalType, setModalType] = useState({callindex: -1, type: ''})

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

    const replaceLocation = (index) => {
        console.log('replace', index)
        setModalType({callindex: index, type: 'replace'})
        setModalVisible(true)
    }

    const addLocation = (index) => {
        console.log('add', index)
        setModalType({callindex: index, type: 'add'})
        setModalVisible(true)
    }

    const controlIpLocations = async (ipCoords) => {
        let ipCoordsError = false
        appConfig.weather.locationInfo.map((item, index)=>{
            if(Math.abs(item.coords.lat - ipCoords.lat) < 0.05 ){
                ipCoordsError = true
            }
            if(Math.abs(item.coords.lon - ipCoords.lon) < 0.05 ){
                ipCoordsError = true
            } 
        })
        if(ipCoordsError){
            setIpLocationMsg({code: 0.12, msg: 'this location matches one of yours'})
            return false
        }
        return true
    }

    const controlDeviceLocations = async (dvcCoords) => {
        let dvcCoordsError = false
        appConfig.weather.locationInfo.map((item, index)=>{
            if(Math.abs(item.coords.lat - dvcCoords.lat) < 0.05 ){
                dvcCoordsError = true
            }
            if(Math.abs(item.coords.lon - dvcCoords.lon) < 0.05 ){
                dvcCoordsError = true
            }
        })
        if(dvcCoordsError){
            setDeviceLocationMsg({code: 0.12, msg: 'this location matches one of yours'})
            return false
        }
        return true
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

    const [checkBoxGroup, setCheckBoxGroup] = useState(getCheckBoxGroup(appConfig.weather.type));

    const typeSetting = (item, index) => {
        console.log('type setting', item)
        let newAppConfig = getNewAppConfigObject();
        newAppConfig.weather.type = item
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        setCheckBoxGroup(getCheckBoxGroup(item))
    }

    const deleteLocation = (location, delIndex)=>{
        let newLocations = []
        appConfig.weather.locationInfo.map((item, index)=>{
           index != delIndex? newLocations.push(item) : null
        })
        let newAppConfig = getNewAppConfigObject();
        newAppConfig.weather.locationInfo= newLocations;
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        setCheckGroup(getGroup(-1, true))
    }

    return (<>
        <View
            style = {{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 60
            }}
        >
            <Text style = {[staticStyles.text, staticStyles.switchText, {color: Thema.texts.neutrals.secondary}]}>
                {Language.used} {Language.usedState[`${weatherUsed}`]}
            </Text>
            <View style={[staticStyles.verticalLine, {backgroundColor: Thema.icons.accents.tertiary}]}/>
            <BaseSwitch
                size={24}
                style = {{
                    right: 20
                }}
                trackStyle={{
                    borderRadius: appStyle.borderRadius.additional
                }}
                thumbStyle = {{
                    borderRadius: appStyle.borderRadius.additional,
                    borderWidth: 3,
                    borderColor: Thema.icons.accents[weatherUsed?"primary" : "quaternary"],
                }}
                colors={{
                    track: { 
                        false: Thema.icons.accents.quaternary, 
                        true: Thema.icons.accents.primary  
                    },
                    thumb: { 
                        false: Thema.icons.accents.quaternary, 
                        true: Thema.icons.accents.primary, 
                    }
                }}
                primeValue={weatherUsed}
                onChange={weatherUsedSetting}
            />
        </View>
        
        <Text style = {[staticStyles.text, {color: Thema.texts.neutrals.secondary}]}>
            {Language.type}
        </Text>
        <View 
            style = {[{
                marginLeft: 20,
                width: '60%'
            }]}
        >
            {weatherTypes.map((item, index)=>{
                return(
                    <BaseBox
                        key = {item+index}
                        style = {{
                            borderRadius: appStyle.borderRadius.additional,
                            backgroundColor: 'transparent'
                        }}
                        android_ripple={{
                            color: Thema.icons.accents.primary,
                            borderless: true,
                            foreground: false
                        }}
                        Item = {<Text style = {[staticStyles.listText, {color: Thema.texts.neutrals.secondary}]}>{Language.types[item]}</Text>}
                        Check = {checkBoxGroup[index]}
                        onPress = {()=>{typeSetting(item, index)}}
                        BoxBorderRadius = {appStyle.borderRadius.additional}
                        ColorsChange = {{true: Thema.icons.accents.primary, false: Thema.icons.accents.quaternary}}
                    />
                )
            })}
        </View>

        <Text style = {[staticStyles.text, {color: Thema.texts.neutrals.secondary}]}>
            {Language.locations}
        </Text>
        <View
            style = {{
                flex: 1,
                height: 75,
                marginLeft: 20,
                width: '60%',
                justifyContent: 'space-between',
                //backgroundColor: 'green',

            }}
        >
            {[1,2].map((item, index)=>{

                let location = true
                let addNewLocation = false
                const usersLocations = appConfig.weather.locationInfo//['',]
                //console.log(appConfig.weather)
                //console.log('usersLocations', usersLocations, usersLocations.length)

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

                //console.log(checkGroup)
                
                return (
                    <View
                        key = {`user_location_${index}`}
                        style = {[{
                            //flex: 1, 
                            flexDirection: 'row',
                            marginTop: 7,
                            height: 30,
                            width: '100%',
                            //paddingHorizontal: 10,
                            //backgroundColor: Thema.basics.neutrals.primary,
                            //borderRadius: appStyle.borderRadius.additional
                        }, staticStyles.shadow]}
                    >   
                        {(location && !addNewLocation) &&
                        <BaseBox
                            isCheckBox={true}
                            style = {{
                                flex: 3,
                                backgroundColor: 'transparent',
                                borderRadius: appStyle.borderRadius.additional,
                                //borderTopRightRadius: 0,
                                //borderBottomRightRadius: 0,
                            }}
                            android_ripple={{
                                color: Thema.icons.accents.primary,
                                borderless: true,
                                foreground: false
                            }}
                            Item = {
                                <Text 
                                    style = {[staticStyles.listText, {color: Thema.texts.neutrals.secondary}]}
                                >
                                    {usersLocations[index].city}
                                </Text>
                            }
                            Check = {checkGroup[index]}
                            onPress = {()=>{settingLocaion(index)}}
                            BoxBorderRadius = {appStyle.borderRadius.additional}
                            ColorsChange = {{
                                true: Thema.icons.accents.primary, 
                                false: `${Thema.icons.accents.quaternary}00`
                            }}
                        />}
                        {(location && !addNewLocation) && 
                        <BasePressable
                            type="i"
                            icon={{
                                name: "dots-horizontal", 
                                size: 25, 
                                color: Thema.icons.accents.primary
                            }}
                            style = {{
                                flex: 1,
                                backgroundColor: 'transparent',
                                borderRadius: appStyle.borderRadius.additional,
                                //borderTopLeftRadius: 0,
                                //borderBottomLeftRadius: 0,
                            }}
                            android_ripple={{
                                color: Thema.icons.accents.primary,
                                borderless: true,
                                foreground: false,
                                //radius: 15
                            }}
                            onPress={()=>{replaceLocation(index)}}
                        />}
                        {(!location && addNewLocation) && 
                        <BasePressable
                            type="i"
                            icon={{
                                name: "map-marker-plus-outline", 
                                size: 25, 
                                color: Thema.icons.neutrals.primary
                            }}
                            style = {{
                                flex: 1,
                                backgroundColor: Thema.icons.accents.primary,
                                borderRadius: appStyle.borderRadius.additional
                            }}
                            android_ripple={{
                                color: Thema.icons.neutrals.primary,
                                borderless: true,
                                foreground: false
                            }}
                            onPress={()=>{addLocation(index)}}
                        />}

                        {((location && !addNewLocation) && true) && 
                        <BasePressable
                            type="t"
                            text="del"
                            style = {{
                                flex: 1,
                                backgroundColor: 'transparent',
                                borderRadius: appStyle.borderRadius.additional,
                                //borderTopLeftRadius: 0,
                                //borderBottomLeftRadius: 0,
                            }}
                            android_ripple={{
                                color: Thema.icons.accents.primary,
                                borderless: true,
                                foreground: false,
                                //radius: 15
                            }}
                            onPress={()=>{deleteLocation(item, index)}}
                        />}

                        </View>
                        )
                    })}
        </View>
        
        <BaseModal
            animationType = {'fade'}
            visible = {modalVisible}
            dimOut = {appStyle.modals.dimOut}
            outPress = {outsideModalPress}
            onShow = {onShow}
            modalStyle = {{
                width: deviceWidth-2*appStyle.modals.horizontalProximity,
                left: appStyle.modals.horizontalProximity,
                height: 250
            }}
            style={{
                backgroundColor: Thema.modals.basics.ground.primary,
                borderTopLeftRadius: appStyle.borderRadius.additional,
                borderTopRightRadius: appStyle.borderRadius.additional,
                borderWidth: appStyle.modals.outline? 1 : 0,
                borderColor: Thema.modals.outline,
                flex: 1,
                //width: deviceWidth-2*appStyle.modals.horizontalProximity,
            }}
            thumbStyle = {{
                backgroundColor: Thema.modals.thumb,
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
                <Text style = {[staticStyles.boldText, {color: Thema.modals.texts.primary}]}>
                    {Language[modalType.type]}
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
                    {['network','device'].map((item, index)=>{

                        let name
                        let location
                        let messages
                        let select

                        switch(index){
                            case 0:
                                name = Language.network
                                location = ipLocation
                                messages = ipLocationMsg
                                select = ipSelected
                                break;
                            case 1:
                                name = Language.device
                                location = deviceLocation
                                messages = deviceLocationMsg
                                select = deviceSelected
                                break;
                        }

                        console.log('modal loc', location)

                        return (
                        <View
                            key={`location_area_modal_${item}`}
                            style = {[{
                                width: '45%',
                                height: 150,
                                borderRadius: 20,
                                backgroundColor: Thema.modals.basics.ground.secondary,
                                //justifyContent: 'center',
                                alignItems: 'center'
                            }, staticStyles.shadow]}
                        >
                        <Pressable
                            style = {{
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                padding: 5
                            }}
                            onPress={select}
                            android_ripple={{
                                color: Thema.modals.basics.ground.tertiary,
                                borderless: true,
                                foreground: false
                            }}
                        >
                            <Text style = {[staticStyles.text, {color: Thema.modals.texts.primary, textAlign: 'center'}]}>
                                {name}
                            </Text>
                            <Text
                                style = {[staticStyles.boldText, 
                                    {
                                        color: Thema.modals.texts.primary,
                                        marginTop: 20
                                    }
                                ]}
                            >
                                {location? location.city : 'none'}
                            </Text>

                            {messages.code != 1 &&
                            <Reanimated.View
                                style = {{
                                    position: 'absolute',
                                    bottom: 5,
                                    width: '100%',
                                    height: '65%',
                                    borderRadius: 20,
                                    backgroundColor: Thema.modals.basics.ground.tertiary,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                {!netConnectInfo &&
                                <MaterialCommunityIcons name="wifi-remove" size={40} color={Thema.modals.icons.primary}/>
                                }
                                {netConnectInfo &&
                                <Text
                                    style = {[staticStyles.text, 
                                        {
                                            color: Thema.modals.texts.secondary,
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
                        </View>
                        )
                    })}
                </View>
            </View>
        </BaseModal> 
    </>)
}

const BaseModal = ({
    animationType,
    visible,
    transparent,
    onShow,

    outPress,

    style,
    modalStyle,
    thumbStyle,
    snapHeights,
    dimOut,

    children
}) => {
    /*
    const {
        animationType,
        visible,
        transparent,
        outPress,
        onShow,
        style,
        modalStyle,
        thumbStyle,
        snapHeights,
        dimOut,
    } = props
    */
    //console.log(props)
    // ref
    const bottomSheetModalRef = useRef();
    const bottomSheetRef = useRef(BottomSheet);
    // variables
    const snapPoints = useMemo(() => snapHeights? snapHeights : [100, 100], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleDismissModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    useEffect(()=>{
        //console.log(visible)
        visible? handlePresentModalPress() : handleDismissModalPress()
    },[visible])

    //const [sheetState, setSheetState] = useState(0)

    const handleSheetChanges = useCallback((index) => {
        //console.log('handleSheetChanges', index);
        //setSheetState(index)
        index === -1? outPress() : null
    }, []);
    
    
    const outsidePress = () => {
        handleDismissModalPress()
        //outPress()
    }

    return (     
        <Modal
            visible={visible}
            animationType = {animationType}
            transparent= {true}
            statusBarTranslucent = {true}
            onShow={onShow}
        >   
            <Pressable
                flex = {1}
                style={{
                    backgroundColor: dimOut? '#00000025' : 'transparent'
                }}
                onPress={outsidePress}
            />
            {/**/}
            <View
                style = {[{
                    minHeight: 100,
                    position: 'absolute',
                    bottom: 0,
                    width: deviceWidth,
                }, modalStyle]}
            >   
                <GestureHandlerRootView style={{flex:1}}>
                <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    enablePanDownToClose={true}
                    overDragResistanceFactor={0}
                    style={{
                        //backgroundColor: '#00ff0030',
                    }}
                    backgroundStyle={[{
                        //backgroundColor: '#ff000030'
                    }, style]}
                    handleStyle={{
                        //backgroundColor: '#0000ff30'
                    }}
                    handleIndicatorStyle={[{
                        //backgroundColor: '#ffff00a0'
                    }, thumbStyle]}
                >
                    <BottomSheetScrollView style={{flex: 1,}}>
                        {children}
                    </BottomSheetScrollView>
                </BottomSheetModal>
                </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </View>
        </Modal>
    )
} 


const staticStyles = StyleSheet.create({
    text: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    boldText: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: 'bold', 
        letterSpacing: 0.5
    },
    signaturesText: {
        //fontVariant: ['small-caps'],
        fontWeight: '400',
        fontSize: 12,
    },
    listText: {
        marginLeft: 5,
        fontSize: 14, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    switchText: {
        textAlign: 'justify', 
        width: '70%',
    },
    verticalLine: {
        height: 45,
        width: 1.5,
        marginRight: 10
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
});