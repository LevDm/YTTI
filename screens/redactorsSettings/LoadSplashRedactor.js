import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import LanguagesAppList, {languagesApp} from "../../language/language";
import ThemesColorsAppList, {themesApp} from "../../styles/ColorsApp";
import dataRedactor from "../../async_data_manager/data_redactor";
import ColorSplash from "../../componets/StyleColorSplash";

//import BasePressable from "../../componets/base/BasePressable";
//import BaseSwitch from "../../componets/base/BaseSwitch";
import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../../componets/base/BaseElements";

export default LoadSplashRedactor = ({
    appStyle,
    setAppStyle,
    r_setAppStyle,

    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    LanguageAppIndex  
}) => {

    const [loadSplash, setLoadSplash] = useState(appStyle.splachLoadShow);
    
    const loadSplashShowSetting = () =>{
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.splachLoadShow = (!loadSplash)
        //console.log(loadSplash)
        setAppStyle(newAppStyle)
        dataRedactor("storedAppStyle",newAppStyle);
        setLoadSplash(!loadSplash)
    }

    return (
    <View
        style = {{
            flexDirection: 'row',
            //backgroundColor: 'red',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 60
        }}
    >
        <Text
            style = {{color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral}}
        >
            Show: {String(loadSplash)}
        </Text>
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
                borderColor: loadSplash? ThemesColorsAppList[ThemeColorsAppIndex].sky : ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp
            }}
            colors={{
                track: { 
                    false: ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp, 
                    true: ThemesColorsAppList[ThemeColorsAppIndex].sky  
                },
                thumb: { 
                    false: ThemesColorsAppList[ThemeColorsAppIndex].symbolLight, 
                    true: ThemesColorsAppList[ThemeColorsAppIndex].symbolLight  
                }
            }}
            primeValue={loadSplash}
            onChange={loadSplashShowSetting}
        />
    </View>
    )
}

const staticStyles = StyleSheet.create({
    
});