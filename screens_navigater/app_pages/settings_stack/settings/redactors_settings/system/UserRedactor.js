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

//import LanguagesAppList, {languagesApp} from "../../../../../language/language";
//import ThemesColorsAppList, {themesApp} from "../../../../../styles/ColorsApp";
import dataRedactor from "../../../../../../app_async_data_manager/data_redactor";

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";

import { 
    BasePressable,
    BaseBox,
    BaseSwitch,
    BaseTextInput 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { SwitchField, ripple } from "../CommonElements";

export default UserRedactor = ({
    appStyle,
    //setAppStyle,

    appConfig,
    r_setAppConfig,

    //r_setLanguageApp,
    //getNewAppStyleObject,
    //getNewAppConfigObject,
    //LanguageStore,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors

    const [textInputValue, setTextInputValue] = useState(appConfig.user.name? appConfig.user.name : null)

    const exit = (text)=>{
        console.log('>>User name input:', text,textInputValue)
        const newAppConfig = JSON.parse(JSON.stringify(appConfig));
        //let newAppConfig = getNewAppConfigObject();
        //console.log('this',newAppConfig)
        
        let ROLE = undefined
        if(text == 'SET_ROLE_ADMIN'){
            newAppConfig.user.name = 'admin'
            setTextInputValue('admin')
            ROLE = 'a'
        } else if (text == 'SET_ROLE_USER'){
            newAppConfig.user.name = 'user'
            setTextInputValue('user')
            ROLE = 'u'
        } else {
            newAppConfig.user.name = typeof text === 'string'? text : '';
        }

        if(ROLE){
            console.log('SET_ROLE_'+ROLE)
            newAppConfig.user.role = ROLE
        }
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);
    }

    const welcomeUsedSetting = (value) => {
        const newAppConfig = JSON.parse(JSON.stringify(appConfig));
        newAppConfig.splash.welcome = value;// !welcomeUsed
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);
    }


    return (<>
    <View 
        style = {[{
            //marginLeft: 20,
            //width: "80%"
            paddingBottom: 12
        }]}
    >
        <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 10}]}>
            {Language.user.accost}
        </Text>
        <BaseTextInput 
            textValue={textInputValue}
            setTextValue={setTextInputValue}
            exit={exit}
            paneleStyle={{
                borderColor: Theme.basics.accents.primary,
                backgroundColor: Theme.basics.neutrals.secondary,
            }}
            textInputProps={{
                style: {
                    color: Theme.texts.neutrals.secondary,
                    fontSize: 16
                },
                
                placeholder: Language.user.name,
                placeholderTextColor: Theme.texts.neutrals.tertiary,
                maxLength: 70,

                selectionColor: Theme.texts.accents.primary,

                //android
                autoComplete: ('username', 'username-new', 'name'),
                cursorColor: Theme.texts.accents.primary
            }}
            basePressableProps={{
                style: {
                    height: 50,
                    marginLeft: 5,
                    //paddingLeft: 10,
                    borderRadius: appStyle.borderRadius.additional
                    //backgroundColor: 'red',                  
                },
                styleItemContainer: {
                    justifyContent: 'flex-end',
                    paddingRight: 15,
                    flexDirection: 'row-reverse'
                    //alignItems: 'center'
                },
                textStyle: [{
                    color: textInputValue? Theme.texts.neutrals.secondary : Theme.texts.neutrals.tertiary,
                }, staticStyles.text],
                textProps: {
                    numberOfLines: 2,
                },
                android_ripple: appStyle.effects.ripple != 'none'? ripple(Theme.icons.accents.primary) : false,
                type: 'ti', 
                icon: {
                    name: textInputValue? "account-box-outline" : "pencil-outline", 
                    size: 25, 
                    color: textInputValue? Theme.icons.accents.secondary : Theme.texts.neutrals.tertiary
                }
            }}
        />
        {appConfig.user.role == 'a' && 
        <SwitchField
            textTitle = {Language.loadAnimation.welcome}
            textStates = {Language.loadAnimation.welcomeState}
            //text = {`${Language.welcome} ${Language.welcomeState[`${welcomeUsed}`]}`}
            primeValue={appConfig.splash.welcome}
            onChange={welcomeUsedSetting}
            style={{
                //height: 60,
                //flex: 1
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />}
    </View>
    </>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});