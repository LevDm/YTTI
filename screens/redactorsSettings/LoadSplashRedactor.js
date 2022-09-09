import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import languagesAppList, {languagesApp}  from "../../Languages";
import themesColorsAppList, {themesApp} from "../../Themes";
import dataRedactor from "../../async_data_manager/data_redactor";

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
        setAppStyle(newAppStyle)
        dataRedactor("storedAppStyle",newAppStyle);
        setLoadSplash(!loadSplash)
    }

    const Thema = themesColorsAppList[ThemeColorsAppIndex]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.loadAnimation

    return (
    <View
        style = {{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 60
        }}
    >
        <Text
            style = {[staticStyles.text, {color: Thema.neutrals.secondary, width: '70%', textAlign: 'justify'}]}
        >
            {Language.show} {Language.showState[`${loadSplash}`]}
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
                borderColor:  loadSplash? Thema.accents.primary : Thema.accents.quaternary
            }}
            colors={{
                track: { 
                    false: Thema.accents.quaternary, 
                    true: Thema.accents.primary  
                },
                thumb: { 
                    false: Thema.icons.neutrals.primary, 
                    true: Thema.icons.neutrals.primary,  
                }
            }}
            primeValue={loadSplash}
            onChange={loadSplashShowSetting}
        />
    </View>
    )
}

const staticStyles = StyleSheet.create({
    text: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    signaturesText: {
        //fontVariant: ['small-caps'],
        fontWeight: '400',
        fontSize: 12,
    }
});