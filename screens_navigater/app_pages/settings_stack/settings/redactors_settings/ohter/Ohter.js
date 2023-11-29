import React, { useState, useRef, useEffect } from "react";

import { 
    StyleSheet, 
    Text, 
    Modal,
    Pressable, 
    ScrollView,
    FlatList, 
    SectionList, 
    View,Button, 
    Dimensions, 
    Switch, 
    ActivityIndicator,
    Vibration
} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Application from 'expo-application';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';

import Reanimated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    useDerivedValue,
    runOnJS,
    cancelAnimation,
    interpolate
} from 'react-native-reanimated';


import commonStaticStyles, { SwitchField, BoxsField } from "../CommonElements";

//const borderRadiusValues = {min: 0, max: 32, step: 1}
//import { borderRadiusValues } from "../../../../../app_values/AppDefault";

import { modalsHorizontalProximity } from "../../../../../../app_values/AppDefault";

import QRCode from 'react-native-qrcode-svg';



export default Info = (props) => {
    const {
        Theme,
        r_uiStyle,
    } = props

    return (
        <>
        <AppInfo {...props} />   
        <QRSelector {...props}/>  
        </>
    )
}

const AppInfo = (props) => {
    const {
        Theme,
        r_uiStyle,
    } = props

    return (
        <View 
            style={{
                //flex: 1, //-headerHeight-selectorLineHeight
                width: '100%',
                alignItems: 'center',
                //backgroundColor: 'red',
                justifyContent: 'space-between',
                paddingHorizontal: 8,
                flexDirection: 'row'
            }}
        >   
            <MaskedView
                style={{height: 25, width: 100, flexDirection: 'row'}}
                maskElement={
                <View
                    style={{
                        // Transparent background because mask is based off alpha channel.
                        backgroundColor: 'transparent',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                >
                    <Ionicons name="logo-react" size={20} color="black" />
                    <Text 
                        style = {[{
                            //color: 'transparent',//,
                            fontSize: 20,
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            letterSpacing: 1,
                            fontVariant: ['small-caps'],
                            opacity: .5,
                            marginBottom: 2
                        }]}
                    >
                        F1F<Text style={{fontSize: 16, left: -10}}>.GUI's</Text>
                    </Text>
                </View>}
            >
            {/* COLORS */}
            <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}

                style ={{
                    flex: 1
                }}
                colors = {['#06bcee','#f010f0']}
            />
            </MaskedView>

            <Text 
                style = {[{
                    //color: 'transparent',//,
                    //backgroundColor: 'blue',
                    fontSize: 20,
                    height: 25,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    //bottom: 25,
                    letterSpacing: 1.2,
                    fontVariant: ['small-caps'],
                    color: Theme.texts.neutrals.secondary,
                    verticalAlign: 'middle'
                }]}
            >
                YTTI {Application.nativeApplicationVersion}
            </Text>
        </View>
    )
}


import * as Brightness from 'expo-brightness';

const QRSelector = (props) => {
    const {
        Theme,
        workTime = 7000,
        changeHideWindow,
        setLoadedDesign
    } = props

    const [qrState, setQRState] = useState(null)

    const progress = useSharedValue(0)
    const showProgress = useSharedValue(0)

    const [permissionResponse, requestPermission] = Brightness.usePermissions();

    const hightLight = () => {
        //const { status } = Brightness.requestPermissionsAsync();
        if(permissionResponse.status === 'granted') {
            Brightness.setBrightnessAsync(0.9);
            //android Brightness.setSystemBrightnessAsync(1);
        } else {
            requestPermission()
        }
        //console.log('hightLight')
        //console.log(permissionResponse, requestPermission)
    }

    const endHightLight = async () => {
        //console.log('end hightLight')
        Brightness.restoreSystemBrightnessAsync()
    }

    const timer = useRef()

    const startProgress = () => {
        changeHideWindow()
        hightLight()
        progress.value = withTiming(1.05, {duration: workTime})
        showProgress.value = 1
        timer.current = setTimeout(endProgrss, workTime)
    }

    const endProgrss = (changeHide = true) => {
        console.log('endProgrss', 'changeHide =', changeHide)
        setQRState(null)
        endHightLight()
        progress.value = 0
        showProgress.value = 0 
        if(changeHide){
            changeHideWindow()
        }
    }

    const progressStyle = useAnimatedStyle(()=>({
        width: interpolate(
            progress.value,
            [0, 1],
            [0, 200]
        ),
    }))


    const progressBarStyle = useAnimatedStyle(()=>({
        opacity: withTiming(showProgress.value)
    }))

    //myQR
    const callQR = () => {
        setQRState('myQR')
        startProgress()
    }

    //scan
    const callScan = () => {
        setQRState('scan')
        startProgress()
    }

    const fineScan = (codeData) => {
        const {
            type, 
            data 
        } = codeData
        Vibration.vibrate([12,24,36,24])
        clearTimeout(timer.current)

        const isAccepted = setLoadedDesign(data)
        
        if(isAccepted !== undefined){
            endProgrss(false)
            setTimeout(changeHideWindow, 1000) 
        }
    }

    const Language = useLanguage().SettingsScreen.Redactors.info

    const BUTTON_SIZE = 150

    return (
        <View
            style={{
                flex: 1,
                //backgroundColor: '#aaa',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row', 

            }}
        >
            <View 
                style={{
                    height: BUTTON_SIZE,
                    width: BUTTON_SIZE,
                    backgroundColor: 'transparent',
                    borderRadius: 16, 
                    overflow: 'hidden'
                }}
            >
            <Pressable
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={callQR}
                android_ripple={{
                    color: 'grey',
                }}
            >
                <Text
                    style={{
                        color: Theme.texts.neutrals.secondary,
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 'bold'
                    }}
                >
                    <MaterialCommunityIcons name="qrcode" size={48}/>
                    {`\n`}
                    {Language.userQR}
                </Text>
            </Pressable>
            </View>
            <View 
                style={{
                    height: BUTTON_SIZE,
                    width: BUTTON_SIZE,
                    backgroundColor: 'transparent',
                    borderRadius: 16, 
                    overflow: 'hidden'
                }}
            >
            <Pressable
                style={{
                    flex: 1,
                    //backgroundColor: 'green',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={callScan}
                android_ripple={{
                    color: 'grey'
                }}
            >
                <Text
                    style={{
                        color: Theme.texts.neutrals.secondary,
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 'bold'
                    }}
                >
                    <MaterialCommunityIcons name="qrcode-scan" size={48}/> 
                    {`\n`}
                    {Language.scanQR}
                </Text>
            </Pressable>
            </View>
            <Modal
                visible={qrState !== null}
                animationType = {'fade'}
                transparent= {true}
                statusBarTranslucent = {true}
                
            >
                <View
                    style={[StyleSheet.absoluteFill, {
                        backgroundColor: 'black',
                        opacity: 0.5
                    }]}
                />
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            //backgroundColor: 'grey',
                            width: 360,
                            height: 380
                        }}
                    >
                        <View
                            style={{
                                //position: 'absolute',
                                height: 20,
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Reanimated.View
                                style={[progressBarStyle, {
                                    height: 12,
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    width: 200,
                                    backgroundColor: Theme.icons.neutrals.tertiary
                                }]}
                            >
                                <Reanimated.View 
                                    style={[progressStyle, {
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: Theme.icons.accents.secondary,
                                        left: 0,
                                    }]}
                                />
                            </Reanimated.View>
                        </View>
                        {qrState === 'myQR' && 
                        <QRGenerator 
                            {...props}
                        />
                        }
                        {qrState === 'scan' && 
                        <QRScaner 
                            fineScan={fineScan}
                            closeScaner = {endProgrss}
                            {...props}
                        />
                        }
                    </View>
                </View>
            </Modal>
        </View>
    )
}


const QRGenerator = (props) => {
    const {
        getCurrentDesign,
    } = props

    const stringDesign = getCurrentDesign()
    //console.log("stringDesign", 'length:' ,strintDesign.length, strintDesign)

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 16,
                overflow: 'hidden'
            }}
        >
            <QRCode
                value={stringDesign}
                size={360}
                quietZone={16}
                ecl={'L'} //byte-code: 2953 max length
            />
        </View>
    )
}

import { BarCodeScanner } from 'expo-barcode-scanner';
import useLanguage from "../../../../../../app_hooks/useLanguage";



const QRScaner = (props) => {
    const {
        fineScan,
        closeScaner,
        Theme,
    } = props

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = (codeData) => {
        const {
            type, 
            data 
        } = codeData
        setScanned(true);
        //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        fineScan(codeData)
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View
            style={{
                height: 360,
                width: 360,
                backgroundColor: 'white',
                borderRadius: 16,
                overflow: 'hidden'
            }}
        >
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={[{
                    position: 'absolute',
                    top: 0,
                    width: 360,
                    height: 360*1.333,
                }]}
            />
            {scanned && 
            <View
                style={{
                    flexDirection: 'row',
                    height: 40,
                    width: '100%',
                    //backgroundColor: 'red'
                }}
            >
                <Pressable
                    style={{
                        flex: 3, 
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={() => {setScanned(false)}} 
                    android_ripple={{
                        color: Theme.basics.accents.secondary,
                    }}
                >
                    <View 
                        style={[StyleSheet.absoluteFill, {
                            backgroundColor: Theme.basics.accents.tertiary,
                            opacity: 0.7
                        }]}
                    />
                    <Text
                        style={{
                            color: Theme.texts.neutrals.primary
                        }}
                    >
                        Tap to Scan Again
                    </Text>
                </Pressable>
                <Pressable
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => {closeScaner()}} 
                    android_ripple={{
                        color: Theme.basics.accents.secondary,
                    }}
                >
                    <View 
                        style={[StyleSheet.absoluteFill, {
                            backgroundColor: Theme.basics.accents.tertiary,
                            opacity: 0.7
                        }]}
                    />
                    <Text
                        style={{
                            color: Theme.texts.neutrals.primary
                        }}
                    >
                        Close
                    </Text>
                </Pressable>
            </View>

            
            }
        </View>
    )
}


const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});
