import React, {useState, useRef, useEffect} from "react";

import { 
    StyleSheet, 
    Text, 
    Pressable, 
    ScrollView,
    FlatList, 
    SectionList,
    Modal, 
    View,
    Button, 
    Dimensions, 
    Switch, 
    ActivityIndicator, 
    TextInput,
    Keyboard
} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

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
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors

    const getGroup = (changeIndex = -1) => {
        let group = []
        if(checkGroup){
            checkGroup.map((item, index)=>{
                if(changeIndex != -1){
                    group.push(changeIndex == index? !item : item)
                } else {
                    group.push(item)
                }
            })
        } else {
            Object.keys(appConfig.appFunctions).map((item, index)=>{
                let value = appConfig.appFunctions[item]
                if(changeIndex != -1){
                    group.push(changeIndex == index? !value : value)
                } else {
                    group.push(value)
                }
            })
        }
        return group
    };

    const [checkGroup, setCheckGroup] = useState(getGroup())

    const settingFunctions = (index) => {
        const newGroup = getGroup(index)
        const newAppConfig = getNewAppConfigObject();
        Object.keys(newAppConfig.appFunctions).map((item, index)=>{
            newAppConfig.appFunctions[item] = newGroup[index]
        })

        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        setCheckGroup(newGroup)
    }


    return (<>
        <Text style = {[staticStyles.text, {color: Thema.texts.neutrals.secondary}]}>
            Funcs
        </Text>
        <View
            style = {{
                //flex: 1,
                //height: 94,
                marginLeft: 20,
                width: '60%',
                //justifyContent: 'space-between',
            }}
        >
            {Object.keys(appConfig.appFunctions).map((item, index)=>(
            <BaseBox
                key = {`functions_${item}`}
                isCheckBox={true}
                style = {{
                    //flex: 4,
                    marginTop: index > 0 ? 4 : 0,
                    backgroundColor: 'transparent',
                    borderRadius: appStyle.borderRadius.additional,
                }}
                android_ripple={{
                    color: Thema.icons.accents.primary,
                    borderless: true,
                    foreground: false
                }}
                Item = {
                    <Text style = {[staticStyles.listText, {color: Thema.texts.neutrals.secondary}]}>
                        {item}
                    </Text>
                }
                Check = {checkGroup[index]}
                onPress = {()=>{settingFunctions(index)}}
                BoxBorderRadius = {appStyle.borderRadius.additional}
                ColorsChange = {{
                    true: Thema.icons.accents.primary, 
                    false: `${Thema.icons.accents.quaternary}00`
                }}
            />))}
        </View>
    </>)
}

const staticStyles = StyleSheet.create({
    languageSelector: {
        flexDirection: 'row',
        alignItems : 'center',
        
    },
    verticalLine: {
        height: 45,
        width: 1.5,
        marginRight: 10
    },
    switchText: {
        textAlign: 'justify', 
        width: '70%',
    },
    text: {
        fontSize: 16, 
        fontWeight: '400', 
        letterSpacing: 0.5,
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