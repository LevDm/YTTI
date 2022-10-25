import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import languagesAppList, {languagesApp}  from "../../../../../app_values/Languages";
import themesColorsAppList, {themesApp} from "../../../../../app_values/Themes";
import dataRedactor from "../../../../../async_data_manager/data_redactor";

import { 
    BasePressable,
    BaseBox,
    BaseSwitch 
} from "../../../../../general_components/base_components/BaseElements";

export default LoadSplashRedactor = ({
    appStyle,
    setAppStyle,
    r_setAppStyle,

    setPreviewAppStyle,
    getNewAppStyleObject,

    getNewAppConfigObject,
    appConfig,
    r_setAppConfig,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {

    const [loadSplash, setLoadSplash] = useState(appConfig.splachScreenShow);
    
    const loadSplashShowSetting = () =>{
        //let newAppStyle = getNewAppStyleObject('currentStyle');
        //newAppStyle.splachLoadShow = (!loadSplash)
        //setAppStyle(newAppStyle)
        //dataRedactor("storedAppStyle", newAppStyle);
        //r_setAppStyle(newAppStyle)
        //setLoadSplash(!loadSplash)

        let newAppConfig = getNewAppConfigObject();
        newAppConfig.splachScreenShow = (!loadSplash);
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);
    }

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
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
        <Text style = {[staticStyles.text, staticStyles.switchText, {color: Theme.texts.neutrals.secondary}]}>
            {Language.show} {Language.showState[`${loadSplash}`]}
        </Text>
        <View style={[staticStyles.verticalLine, {backgroundColor: Theme.icons.accents.tertiary}]}/>
        <BaseSwitch
            size={24}
            style = {{
                right: 20,
                height: '100%'
            }}
            trackStyle={{
                borderRadius: appStyle.borderRadius.additional
            }}
            thumbStyle = {{
                borderRadius: appStyle.borderRadius.additional,
                borderWidth: 3,
                borderColor: Theme.icons.accents[loadSplash?"primary" : "quaternary"],
            }}
            colors={{
                track: { 
                    false: Theme.icons.accents.quaternary, 
                    true: Theme.icons.accents.primary  
                },
                thumb: { 
                    false: Theme.icons.accents.quaternary, 
                    true: Theme.icons.accents.primary, 
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
    },
    switchText: {
        textAlign: 'justify', 
        width: '70%',
    },
    verticalLine: {
        height: 45,
        width: 1.5,
        marginRight: 10
    }
});