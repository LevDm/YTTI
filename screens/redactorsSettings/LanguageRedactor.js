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
//import BaseCheckBox from "../../componets/base/BaseCheckBox";

import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../../general_components/base_components/BaseElements";

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
    LanguageAppIndex  
}) => {
    const getGroup = (type) => {
        let group = []
        for (let i of languagesApp){
            let check = false
            if(type === i){check = true}
            group.push(check)
        }
        return group
    };
    const [checkGroup, setCheckGroup] = useState(getGroup(LanguagesAppList[LanguageAppIndex].language));

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
        style = {[{}]}
    >
        {languagesApp.map((item, index)=>{
            return(
                <BaseCheckBox
                    key = {item+index}
                    style = {{
                        borderRadius: appStyle.borderRadius.additional,
                        marginVertical: 5
                    }}
                    //rippleColor = {ThemesColorsAppList[ThemeColorsAppIndex].shadowWhite0}
                    Item = {<Text>{item.toUpperCase()}</Text>}
                    Check = {checkGroup[index]}
                    onPress = {()=>{languageSetting(item)}}
                    BoxBorderRadius = {appStyle.borderRadius.additional}
                    ColorsChange = {{true: ThemesColorsAppList[ThemeColorsAppIndex].sky, false: ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp}}
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
});