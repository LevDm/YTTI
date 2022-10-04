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

import { BasePressable, BaseSwitch, BaseCheckBox } from "../../../../../general_components/base_components/BaseElements";

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
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.themes

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
        cityDefinition(coords)
    }

    const cityDefinition = async (coords) => {
        const locationInfo = {
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
        setIpLocationMsg({code: 1, msg: 'all information received'})
        setIpLocation(locationInfo)
    }

    const getLocationIp = async () => {
        const connected = getNetConnectInfo()
        //console.log(connected)
        //setNetConnectInfo(connected)
        if(connected){
            ipLocationRequire()
        }
        
    }
    const [ modalVisible, setModalVisible ] = useState(false)
    const modalVis = () => {
        setModalVisible(true)
    }
    const onShow = () => {
        console.log('modal show')
        const connected = getNetConnectInfo()
        if(connected && !ipLocation){
            ipLocationRequire()
        }
    }
    
    const outsideModalPress = () =>{
        setModalVisible(false)
    }

    const ipSelected = () => {
        console.log('select ip')
    }

    const deviceSelected = () => {
        console.log('select device')
        if(deviceLocation == null && deviceLocationMsg.code === 0){
            getLocationDevice()
        } 
    }

    return (<>
        <Text>
            location state: {deviceLocationMsg.msg} {'\n'}
            city: {deviceLocation? deviceLocation.city : 'none' } {'\n'}
            lat: {deviceLocation? deviceLocation.coords.lat : 'none'} {'\n'}
            lon: {deviceLocation? deviceLocation.coords.lon : 'none'}
        </Text>
        <BasePressable
            type="t"
            text="get location device"
            onPress={getLocationDevice}
        />
        <Text>
            net state: {`${netConnectInfo}`}
        </Text>
        <Text>
            state: {ipLocationMsg.msg} {'\n'}
            city: {ipLocation? ipLocation.city : 'none' } {'\n'}
            lat: {ipLocation? ipLocation.coords.lat : 'none'} {'\n'}
            lon: {ipLocation? ipLocation.coords.lon : 'none'}
        </Text>
        <BasePressable
            type="t"
            text="get location ip"
            onPress={getLocationIp}
        />
        <BasePressable
            type="t"
            text="modal"
            onPress={modalVis}
        />

        
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
                backgroundColor: Thema.modals.ground,
                borderTopLeftRadius: appStyle.borderRadius.additional,
                borderTopRightRadius: appStyle.borderRadius.additional,
                borderWidth: appStyle.modals.outline? 1 : 0,
                borderColor: Thema.modals.thumb,
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
                <Text>
                    Adding a location
                </Text>
                
                <View
                    style = {{
                        flex: 1,
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}
                >
                    <Pressable
                        style = {{
                            width: '40%',
                            height: 150,
                            borderRadius: 20,
                            backgroundColor: 'red',
                            //justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={ipSelected}
                    >
                        <Text>
                            network location
                        </Text>
                        <Text
                            style = {{
                                marginTop: 20
                            }}
                        >
                            city: {ipLocation? ipLocation.city : 'none' } {'\n'}
                            lat: {ipLocation? ipLocation.coords.lat : 'none'} {'\n'}
                            lon: {ipLocation? ipLocation.coords.lon : 'none'}
                        </Text>

                        {ipLocationMsg.code != 1 &&
                        <Reanimated.View
                            style = {{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: '80%',
                                borderRadius: 20,
                                backgroundColor: 'blue',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {!netConnectInfo &&
                            <MaterialCommunityIcons name="wifi-remove" size={40} color="black" />
                            }
                            {netConnectInfo &&
                            <Text
                                style={{
                                    textAlign: 'center'
                                }}
                            >
                                {`${ipLocationMsg.msg}`}
                            </Text>
                            }
                        </Reanimated.View>
                        }
                    </Pressable>
                    <Pressable
                        style = {{
                            width: '40%',
                            height: 150,
                            borderRadius: 20,
                            backgroundColor: 'red',
                            //justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={deviceSelected}
                    >
                        <Text>
                            device location
                        </Text>
                        <Text
                            style = {{
                                marginTop: 20
                            }}
                        >
                            city: {deviceLocation? deviceLocation.city : 'none' } {'\n'}
                            lat: {deviceLocation? deviceLocation.coords.lat : 'none'} {'\n'}
                            lon: {deviceLocation? deviceLocation.coords.lon : 'none'}
                        </Text>

                        {deviceLocationMsg.code != 1 &&
                        <Reanimated.View
                            style = {{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: '80%',
                                borderRadius: 20,
                                backgroundColor: 'blue',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {!netConnectInfo &&
                            <MaterialCommunityIcons name="wifi-remove" size={40} color="black" />
                            }
                            {netConnectInfo &&
                            <Text
                                style={{
                                    textAlign: 'center'
                                }}
                            >
                                {`${deviceLocationMsg.msg}`}
                            </Text>
                            }
                        </Reanimated.View>
                        }
                    </Pressable>
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
});