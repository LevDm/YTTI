import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Animated, Text,Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import LanguagesAppList, {languagesApp} from "../language/language";
import ThemesColorsAppList, {themesApp} from "../styles/ColorsApp";
import dataRedactor from "../async_data_manager/data_redactor";
import ColorSplash from "../componets/StyleColorSplash";

//import BasePressable from "../componets/base/BasePressable";
import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../general_components/base_components/BaseElements";

import Constants from "expo-constants";
import { transform } from "@motify/core/node_modules/framer-motion";


const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

import Preview, {Phone} from "./Preview";

export default StyleChangePreview = ({
    appStyle,
    setAppStyle,
    r_setAppStyle,

    previewAppStyle,

    previewFixed,
    setPreviewFixed,

    splashStart,

    ThemeColorsAppIndex,
    LanguageAppIndex  
}, props) => {
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
        //console.log(index)
        let newScaleValues = [false, false, false] 
        newScaleValues[index] = true
        setScaleValues(newScaleValues)

        flatListRef.current.scrollToOffset({animated: true, offset: index*widthPreview})
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
                    
                    {item === 'load' && 
                        <Phone
                            //key = {String('review'+item+index)} 
                            animatedValue = {scaleValues[index]}
                            onPress = {()=>{pressPreview(index)}}
                        /> 
                    }
                    {item === 'app' && 
                    
                        <Preview
                            //key = {String('review'+item+index)} 
                            animatedValue = {scaleValues[index]}
                            onPress = {()=>{pressPreview(index)}}

                            appStyle = {appStyle}
                            previewAppStyle = {previewAppStyle}
                        />
                    }
                    {item === 'modal' && 
                        <Phone
                            //key = {String('review'+item+index)}  
                            animatedValue = {scaleValues[index]}
                            onPress = {()=>{pressPreview(index)}}
                        /> 
                    }
                </Animated.View>
          </Animated.View>
          
        );
    };

    return (
        <>
        <View
            style = {{
                flex: 1,
                justifyContent :'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderBottomLeftRadius: appStyle.borderRadius.basic,
                borderBottomRightRadius: appStyle.borderRadius.basic,               
                height: 50+deviceHeight/2,

            }}
        >   
            <Text
                style ={{
                    zIndex: 1,
                    left: 10,
                    top: 3,
                    fontWeight: 'bold',
                    opacity: 0.3,
                    position: 'absolute',
                    textAlign: 'center'
                }}
            >
                Preview{`\n`}style
            </Text>
            
            <Animated.FlatList
                ref = {flatListRef}
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
                    //backgroundColor: 'grey'
                }}
            >
                <BasePressable
                    text="apply"
                    icon = {{name: 'check-outline'}}
                    style={{flex: 1}}
                    onPress={()=>{splashStart(themesApp.indexOf(previewAppStyle.theme))}}
                />
                <BasePressable
                    text={previewFixed? "unfixed" : "fixed"}
                    style={{flex: 1}}
                    icon = {{name: `pin${previewFixed? '-off' : ''}-outline`}}
                    onPress={()=>{setPreviewFixed(!previewFixed)}}
                />
            </View>
        </View>
        {/* 
        <ColorSplash
            theme={splashTheme}
            splashVisible = {splashVisible} 
            setSplashVisible = {setSplashVisible} 
            splashOut = {splashOut}
        />
        */}
        </>
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