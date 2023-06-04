import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Animated, Text,Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import languagesAppList, {languagesApp} from "../../../../../app_values/Languages";
import themesColorsAppList, {themesApp} from "../../../../../app_values/Themes";


import dataRedactor from "../../../../../app_async_data_manager/data_redactor";

import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetScrollView,
    BottomSheetVirtualizedList,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

//import BasePressable from "../componets/base/BasePressable";
import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../../../../../general_components/base_components/BaseElements";

import Constants from "expo-constants";
//import { transform } from "@motify/core/node_modules/framer-motion";

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const A_BottomSheetFlatList = Animated.createAnimatedComponent(BottomSheetFlatList)

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');
const statusBarHeight = Constants.statusBarHeight+1

import PreviewScreen from "./make/Preview_1";
import PreviewModal from "./make/Preview_2";
import PreviewDraver from "./make/Preview_3";
import Phone from "./make/Basis";
import Reanimated, { useAnimatedStyle, useSharedValue, useAnimatedScrollHandler, interpolate, Extrapolation, withTiming } from "react-native-reanimated";



const PreviewItem = (props) => {
    const {
        item,
        index,

        widthPreview,
        onPress,

        inputScrollRange,

        scrollOffset,
        scaleIndex,
        scaleValues,

        previewAppStyleA,
        previewAppPalette,

        frameColor,

        appStyle,
        appConfig,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex  
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.preview

    const durationTranslate = 450

    const accentStyle = useAnimatedStyle(()=>{
        const outputScale = [.8, .8, .8]
        outputScale[index] = 1

        const outputTranslateX = [15, 15, 15]
        for(let i = 0; i<index; i++){
            outputTranslateX[i] = 0
        }
        outputTranslateX[index] = 0
        
        //console.log(scaleIndex.value, 'SCALE')

        return {
            transform: [
                {scale: interpolate(
                    scrollOffset.value,
                    inputScrollRange,
                    outputScale,
                    {
                        extrapolateLeft: Extrapolation.CLAMP,
                        extrapolateRight: Extrapolation.CLAMP
                    }   
                )},
                
                {translateX: withTiming(scaleIndex.value == -1? 0 : 90*(index-scaleIndex.value) , {duration: durationTranslate})}
            ] 
        }
    })

    const accentZpos = useAnimatedStyle(()=>{
        const outputZ = [0, 0, 0]
        outputZ[index] = 3
        //console.log('z',outputZ, item)
        return {
            zIndex: interpolate(
                scrollOffset.value,
                inputScrollRange,
                outputZ,
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.CLAMP
                }   
            )
        }
    })

    return (
        <Reanimated.View
                key = {props.keyID}
                style={[{
                    height: deviceHeight/2,
                    width: widthPreview,
                    justifyContent: 'center',
                    alignItems: 'center',
                    //zIndex: 3-index
                }]}
            >
                <Reanimated.View
                    style={[{
                        height: deviceHeight/2,
                        width: widthPreview,
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }, accentStyle]}
                >
                    <Pressable
                        onPress = {onPress}
                        //delayLongPress={200}
                        //onLongPress={()=>longPressPreview(index)}
                    >
                    {item === 'load' && 
                        <PreviewDraver
                            index = {index}
                            frameColor={frameColor}
                            //key = {String('review'+item+index)} 
                            previewAppStyleA = {previewAppStyleA}
                            previewAppPalette = {previewAppPalette}
                            animatedValue = {scaleValues}
                            //ThemeSchema={ThemeSchema}
             
                        /> 
                    }
                    {item === 'app' && 
                        <PreviewScreen
                            index = {index}
                            animatedValue = {scaleValues}
                            frameColor={frameColor}
                            //ThemeSchema={ThemeSchema}

                            //appStyle = {appStyle}
                            previewAppStyleA = {previewAppStyleA}
                            previewAppPalette = {previewAppPalette}
                        />
                    }
                    {item === 'modal' && 
                        <PreviewModal
                            index = {index}
                            animatedValue = {scaleValues}
                            //ThemeSchema={ThemeSchema}
                            frameColor={frameColor}
                            //appStyle = {appStyle}
                            previewAppStyleA = {previewAppStyleA}
                            previewAppPalette = {previewAppPalette}  
                        /> 
                    }
                    </Pressable>
                </Reanimated.View>
          </Reanimated.View>
    )
}


export default StyleChangePreview = ({
    previewAppStyleA,
    previewAppPalette,
    frameColor = 'black',
    appStyle,
    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}, props) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.preview
    //console.log('changer',appStyle, previewAppStyle)
    const duration = 500
    const scale = 2

    const widthPreview = deviceWidth/2+10

    /*
    const [splashTheme, setSplashTheme] = useState(0)
    const [splashVisible, setSplashVisible] = useState(false);

    const splashStart = (theme, themeIndex) => {
        //if(appStyle.theme != theme){

            setSplashTheme(themeIndex);
            setSplashVisible(true);    
        //}
    }

    const splashOut = (themeIndex)=>{
        let newAppStyle = previewAppStyle
        //newAppStyle.theme = themesApp[themeIndex]

        setAppStyle(newAppStyle)
        dataRedactor("storedAppStyle",newAppStyle);
        r_setAppStyle(newAppStyle);
    }
    */

    const setNewAppStyle = () => {

    }

    const getTime = () => {
        const date = new Date()
        let hours = (date.getHours())
        hours = hours <= 9? '0'+hours : hours

        let minutes = date.getMinutes()
        minutes = minutes <= 9? '0'+minutes : minutes

        return `${hours}:${minutes}`
    }
    const listData = [ 
        'load',
        'app',
        'modal',
    ]
    const flatListRef = useRef()
    const scrollX = React.useRef(new Animated.Value(0)).current;

    //const [scaleValues, setScaleValues] = useState();
    const scaleValues = useSharedValue([false, false, false]);

    const pressPreview = (index) => {
        console.log('press preview', index)

        //let newScaleValues = [false, false, false] 
        //newScaleValues[index] = true
        //setScaleValues(newScaleValues)
        // 0 - not accent & not open
        // 1 - accent & nop open
        // 2 accent & open
        
        //scaleIndex.value = index

        if(pressCount.value.index != index ){
            pressCount.value = {index: index, count: 1}
            flatListRef.current.scrollToOffset({animated: true, offset: index*widthPreview})
        } else {
            console.log(pressCount.value)
            
            if(pressCount.value.index == index && pressCount.value.count >= 1){
                pressCount.value = {index: index, count: pressCount.value.count == 1? 2 : 1}
                
                longPressPreview(index)
            } else {
                pressCount.value.count == 2? longPressPreview(pressCount.value.index) : null
                pressCount.value = {index: index, count: 1}
                flatListRef.current.scrollToOffset({animated: true, offset: index*widthPreview})
                //scaleIndex.value = -1
            }
        }
        
    }
    const pressCount = useSharedValue({index: undefined, count: undefined})

    const longPressPreview = (index) => {
        console.log('preview long', index)
        scaleIndex.value =  scaleIndex.value == -1? index : -1
        const newScaleValues = [...scaleValues.value]
        newScaleValues[index] = !newScaleValues[index]
        scaleValues.value = newScaleValues 
        //setScaleValues(newScaleValues)

        //flatListRef.current.scrollToOffset({animated: true, offset: index*widthPreview})
    }

    const scrollOffset = useSharedValue(widthPreview)

    const accentIndex = useSharedValue(1);

    const scaleIndex = useSharedValue(-1);

    const inputScrollRange = [
            (0) *widthPreview,
            (1) *widthPreview,
            (2) *widthPreview,
        ]

    

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e, ctx) => {
            //console.log('scroll', e.contentOffset.x, inputScrollRange) 
            scrollOffset.value = (e.contentOffset.x)
            
            const newIndex = inputScrollRange.findIndex((el)=>  (el - (e.contentOffset.x)) >= -5 && (el - (e.contentOffset.x)) <= 5)    
            accentIndex.value = newIndex != -1? newIndex : accentIndex.value
            //console.log('index', accentIndex.value)
        }
    })

    const renderItem = ({ item,index }) =>  (
        <PreviewItem 
            keyID = {String(item+index)}

            item={item}
            index={index}
            onPress={()=>{pressPreview(index)}}

            widthPreview={widthPreview}
            inputScrollRange={inputScrollRange}

            frameColor={frameColor}

            scaleValues={scaleValues}
            scaleIndex={scaleIndex}
            scrollOffset={scrollOffset}

            previewAppStyleA={previewAppStyleA}
            previewAppPalette={previewAppPalette}

            appStyle={appStyle}
            appConfig={{}}
            ThemeColorsAppIndex={ThemeColorsAppIndex}
            ThemeSchema={ThemeSchema}
            LanguageAppIndex={LanguageAppIndex}
            
        /> 
    )
    

    return (
        <View
            style = {{
                //flex: 1,
                width: deviceWidth,
                justifyContent :'center',
                alignItems: 'center',
                //backgroundColor: Theme.basics.neutrals.quaternary,
                //borderBottomLeftRadius: appStyle.borderRadius.additional,
                //borderBottomRightRadius: appStyle.borderRadius.additional,              
                height: deviceHeight/2+2,

            }}
        >   
            <Reanimated.FlatList
                //scrollEnabled={false}
                ref = {flatListRef}
                style={{
                    width: deviceWidth,
                    //backgroundColor: 'red'
                }}
                contentContainerStyle = {{
                    paddingHorizontal: (deviceWidth-widthPreview)/2,
                }}
                horizontal = {true}
                showsHorizontalScrollIndicator = {false}
                onScroll = {scrollHandler}
                snapToInterval={widthPreview}

                getItemLayout={(data, index) => (
                    {length: widthPreview, offset: widthPreview * index, index: index}
                )}
                initialScrollIndex = {1}
                decelerationRate = {'fast'}
                data={listData}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                    return item + index
                }} 
            />
        </View>
    )
}

const staticStyles = StyleSheet.create({
    buttons: {
        flex: 0,
        height: 100, 
        width: 100,
        marginRight: 10,
    },
    buttonsText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontVariant: ['small-caps']
    },
});