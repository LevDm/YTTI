import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

//import LanguagesAppList, {languagesApp} from "../../../../../language/language";
//import ThemesColorsAppList, {themesApp} from "../../../../../styles/ColorsApp";
import dataRedactor from "../../../../../async_data_manager/data_redactor";

import themesColorsAppList, {themesApp} from "../../../../../app_values/Themes";
import languagesAppList, { languagesApp } from "../../../../../app_values/Languages";

import { 
    BasePressable,
    BaseBox,
    BaseSwitch 
} from "../../../../../general_components/base_components/BaseElements";

export default LanguageRedactor = ({
    appStyle,
    setAppStyle,

    appConfig,
    r_setAppConfig,

    r_setLanguageApp,
    getNewAppStyleObject,
    getNewAppConfigObject,
    LanguageStore,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {

    const Thema = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.languages

    const getGroup = (type) => {
        let group = []
        for (let i of languagesApp){
            let check = false
            if(type === i){check = true}
            group.push(check)
        }
        return group
    };
    const [checkGroup, setCheckGroup] = useState(getGroup(appConfig.languageApp));

    const languageSetting = (languageAbriviature) => {
        setCheckGroup(getGroup(languageAbriviature));

        //let newLanguageApp = languageAbriviature//LanguageStor[Languages.indexOf(languageAbriviature)] 
        //r_setLanguageApp(newLanguageApp);
        //dataRedactor("storedLanguageSettings",newLanguageApp);

        let newAppConfig = getNewAppConfigObject();
        //console.log('this',newAppConfig)
        newAppConfig.languageApp = languageAbriviature;
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);
    };

    

    
    return (<>
    <View 
        style = {[{
            marginLeft: 20,
            width: "80%"
        }]}
    >
        {languagesApp.map((item, index)=>{
            return(
                <BaseBox
                    key = {item+index}
                    style = {{
                        height: 40,
                        borderRadius: appStyle.borderRadius.additional,
                        backgroundColor: 'transparent'
                    }}
                    android_ripple={{
                        color: Thema.icons.accents.primary,
                        borderless: true,
                        foreground: false
                    }}
                    Item = {
                        <Text 
                            style = {[staticStyles.listText, {color: Thema.texts.neutrals.secondary}]}
                            numberOfLines={2}
                        >
                            {languagesAppList[index].SettingsScreen.Redactors.languages.thisLanguage}
                        </Text>
                    }
                    Check = {checkGroup[index]}
                    onPress = {()=>{languageSetting(item)}}
                    BoxBorderRadius = {appStyle.borderRadius.additional}
                    ColorsChange = {{true: Thema.icons.accents.primary, false: Thema.icons.accents.quaternary}}
                />
            )
        })}
    </View>
    </>)
}

const staticStyles = StyleSheet.create({
    languageSelector: {
        flexDirection: 'row',
        alignItems : 'center',
        
    },
    listText: {
        marginLeft: 5,
        fontSize: 14, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5,
        //textAlign: 'justify',
        width: '85%'
    },
});