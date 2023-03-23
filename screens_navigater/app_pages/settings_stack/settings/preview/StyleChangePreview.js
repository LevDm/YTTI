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

import Preview, {Phone} from "./make/Preview";

export default StyleChangePreview = ({
    appStyle,
    //setAppStyle,
    //r_setAppStyle,
    //previewAppStyle,

    previewAppStyleA,

    //previewFixed,
    //setPreviewFixed,

    splashStart,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}, props) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex]
    //console.log('changer',appStyle, previewAppStyle)
    const duration = 500
    const scale = 2

    const widthPreview = deviceWidth/2+10

    const [splashTheme, setSplashTheme] = useState(0)
    const [splashVisible, setSplashVisible] = useState(false);

    /*
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

    const [scaleValues, setScaleValues] = useState([false, false, false]);

    const pressPreview = (index) => {
        //console.log(previewAppStyle)

        //let newScaleValues = [false, false, false] 
        //newScaleValues[index] = true
        //setScaleValues(newScaleValues)

        flatListRef.current.scrollToOffset({animated: true, offset: index*widthPreview})
    }

    const longPressPreview = (index) => {
        console.log('preview long', index)

        const newScaleValues = [...scaleValues]
        newScaleValues[index] = !newScaleValues[index] 
        setScaleValues(newScaleValues)

        //flatListRef.current.scrollToOffset({animated: true, offset: index*widthPreview})
    }

    const renderItem = ({ item,index }) => {

        const inputRange = [
          (index-1) *widthPreview,
          (index)*widthPreview,
          (index+1)*widthPreview,
        ]
        
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [.75, 1, .75 ]
        })

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [.8, 1, .8 ]
          })

        const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-15 , 0, 15]
        })

        const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [-30 , 0, -30]
        })

        const zIndex = scrollX.interpolate({
            inputRange,
            outputRange: [1 , 3, 1]
        })
  
        return (
            <Animated.View
                key = {String(item+index)}
                style={{
                    height: deviceHeight/2,
                    width: widthPreview,
                    //backgroundColor: 'green',
                    zIndex: zIndex,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Animated.View
                    //key = {String(index)}
                    style={{
                        height: deviceHeight/2,
                        width: widthPreview,
                        //backgroundColor: 'blue',
                        position: 'absolute',
                        opacity: opacity,
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: [
                            {scale: scale},
                            {translateX: translateX},
                            //{translateY: translateY}
                        ]
                    }}
                >
                    <Pressable
                        onPress = {()=>{pressPreview(index)}}
                        delayLongPress={200}
                        onLongPress={()=>longPressPreview(index)}
                    >
                    {item === 'load' && 
                        <Phone
                            //key = {String('review'+item+index)} 
                            previewAppStyleA = {previewAppStyleA}
                            animatedValue = {scaleValues[index]}
                            ThemeSchema={ThemeSchema}
             
                        /> 
                    }
                    {item === 'app' && 
                        
                        <Preview
                            //key = {String('review'+item+index)} 
                            animatedValue = {scaleValues[index]}
                            ThemeSchema={ThemeSchema}

                            appStyle = {appStyle}
                            //previewAppStyle = {previewAppStyle}
                            previewAppStyleA = {previewAppStyleA}
                        />
                    }
                    {item === 'modal' && 
                        <Phone
                            //key = {String('review'+item+index)} 
                            previewAppStyleA = {previewAppStyleA} 
                            animatedValue = {scaleValues[index]}
                            ThemeSchema={ThemeSchema}
               
                        /> 
                    }
                    </Pressable>
                </Animated.View>
          </Animated.View>
          
        );
    };

    return (
        <View
            style = {{
                //flex: 1,
                width: deviceWidth,
                justifyContent :'center',
                alignItems: 'center',
                backgroundColor: Theme.basics.neutrals.quaternary,
                //borderBottomLeftRadius: appStyle.borderRadius.additional,
                //borderBottomRightRadius: appStyle.borderRadius.additional,              
                height: 50+deviceHeight/2,

            }}
        >   
            <Text
                style ={{
                    zIndex: 1,
                    left: 10,
                    top: 3,
                    color: Theme.texts.neutrals.tertiary,
                    fontWeight: 'bold',
                    opacity: 0.3,
                    position: 'absolute',
                    textAlign: 'center'
                }}
            >
                Preview{`\n`}style
            </Text>
            <Animated.FlatList
                //scrollEnabled={false}
                ref = {flatListRef}
                style={{
                    width: deviceWidth
                }}
                contentContainerStyle = {{
                    paddingHorizontal: (deviceWidth-widthPreview)/2,
                }}
                horizontal = {true}
                showsHorizontalScrollIndicator = {false}
                onScroll = {Animated.event(
                    [{nativeEvent: {contentOffset: {x: scrollX}}}],
                    {useNativeDriver: true},
                )}
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

            <View
                style = {{
                    //flex: 1,
                    width: '100%',
                    paddingHorizontal: 10,
                    height: 48,
                    //borderRadius: 20,
                    flexDirection: 'row',
                }}
            >
                <BasePressable
                    text="apply"
                    textStyle={{color: Theme.texts.neutrals.secondary}}
                    icon = {{name: 'check-bold', color: Theme.texts.neutrals.secondary}}
                    style={{flex: 1}}
                    direction={'row-reverse'}
                    onPress={()=>{splashStart()}}
                />
            </View>
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