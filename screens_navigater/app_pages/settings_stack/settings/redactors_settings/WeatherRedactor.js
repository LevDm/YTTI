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

import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import GestureHandlerRootView from 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';

import themesColorsAppList, {themesApp} from "../../../../../app_values/Themes";
import languagesAppList, { languagesApp } from "../../../../../app_values/Languages";

import { BasePressable, BaseSwitch, BaseCheckBox } from "../../../../../general_components/base_components/BaseElements";

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

        let location = null
        location = await Location.getCurrentPositionAsync({});
        console.log('(')
        setLocation(location);
        setCoords({lat: location.coords.latitude, lon: location.coords.longitude})
        
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
    const [ modalVisible, setModalVisible ] = useState(false)
    const modalVis = () => {
        setModalVisible(true)
    }
    
    const outsideModalPress = () =>{
        setModalVisible(false)
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
        <BasePressable
            type="t"
            text="modal"
            onPress={modalVis}
        />

        
        <BaseModal
            animationType = {'slide'}
            visible = {modalVisible}
            transparent= {true}
            outPress = {outsideModalPress}
            modalStyle = {{
                width: deviceWidth-10,
                left: 5,

            }}
            style={{
                backgroundColor: Thema.basics.accents.primary,
                borderTopLeftRadius: appStyle.borderRadius.additional,
                borderTopRightRadius: appStyle.borderRadius.additional,
                padding: 10,
                width: deviceWidth-10,
                marginHorizontal: 0
            }}
        >
            <Text>add</Text>
        </BaseModal> 
    </>)
}

const BaseModal = (props) => {
    const {
        animationType,
        visible,
        transparent,
        outPress,
        style,
        modalStyle
    } = props
    
    // ref
    const bottomSheetModalRef = useRef();
    const bottomSheetRef = useRef(BottomSheet);
    // variables
    const snapPoints = useMemo(() => [300, 300], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleDismissModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    useEffect(()=>{
        console.log(visible)
        visible? handlePresentModalPress() : handleDismissModalPress()
    },[visible])

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        index === -1? outPress() : null
    }, []);

    const BodyC = gestureHandlerRootHOC(()=>(
        
            
                <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    enablePanDownToClose={true}
                    style={{
                        backgroundColor: '#00ff0030'
                    }}
                    backgroundStyle={[{
                        backgroundColor: '#ff000030'
                    }, style]}
                    handleStyle={{
                        backgroundColor: '#0000ff30'
                    }}
                    handleIndicatorStyle={{
                        backgroundColor: '#ffff00a0'
                    }}
                >
                    <View style={{flex: 1,}}>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                        <Text>Awesome 🎉</Text>
                    </View>
                </BottomSheetModal>
                </BottomSheetModalProvider>
            
    ))

    return (     
        <Modal
            visible={visible}
            animationType = {animationType}
            transparent= {transparent}
        >   
             
            <Pressable
                flex = {1}
                style={{backgroundColor: '#00000030'}}
                onPress={outPress}
            />
            {/**/}
            <View
                style = {[{
                    minHeight: 300,
                    position: 'absolute',
                    bottom: 0,
                    width: deviceWidth,
                }, modalStyle]}
            >
                <BodyC/>
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