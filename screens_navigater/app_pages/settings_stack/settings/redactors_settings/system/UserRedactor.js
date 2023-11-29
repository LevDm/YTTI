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

import BaseTextInput from "../../../../../../general_components/base_components/BaseTextInput";

import commonStaticStyles, { SwitchField, ripple } from "../CommonElements";
import useLanguage from "../../../../../../app_hooks/useLanguage";
import { connect, useSelector } from "react-redux";
import mapStateToProps from "../../../../../../app_redux_files/stateToProps";
import mapDispatchToProps from "../../../../../../app_redux_files/dispatchToProps";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

const UserRedactor = (props) => {
    const {
        uiComposition,
        showAllSettings,

        Theme,
        r_uiStyle,
        
        userData,
        r_setUserData
    } = props

    const Language = useLanguage().SettingsScreen.Redactors
    //const userData = useSelector((state)=>state.userData)

    const [textInputValue, setTextInputValue] = useState(userData.name)

    const exit = (text)=>{
        console.log('>>User name input:', text,textInputValue)
        const copyUserData = JSON.parse(JSON.stringify(userData))
        //copyUserData.updated = true
        if(text && typeof text === 'string'){
            let ROLE = undefined
            if(text == 'SET_ROLE_ADMIN'){
                copyUserData.name = 'admin'
                setTextInputValue('admin')
                ROLE = 'a'
            } else if (text == 'SET_ROLE_USER'){
                copyUserData.name = 'user'
                setTextInputValue('user')
                ROLE = 'u'
            } else {
                copyUserData.name = text 
            }

            if(ROLE){
                console.log('SET_ROLE_'+ROLE)
                copyUserData.role = ROLE
            }
        } else {
            copyUserData.name = null
        }
        r_setUserData(copyUserData)
    }

    const welcomeUsedSetting = (value) => {
        uiComposition.welcome.show.value = value // value
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
                maxLength: 25,

                selectionColor: Theme.texts.accents.primary,

                //android
                autoComplete: ('username', 'username-new', 'name'),
                cursorColor: Theme.texts.accents.primary
            }}
            basePressableProps={{
                style: {
                    height: 50,
                    marginLeft: 6,
                    width: (deviceWidth -60 -24),
                    //paddingLeft: 10,
                    borderRadius: r_uiStyle.borderRadius.secondary
                    //backgroundColor: 'red',                  
                },
                styleItemContainer: {
                    justifyContent: 'flex-end',
                    paddingHorizontal: 6,
                    flexDirection: 'row-reverse'
                    //alignItems: 'center'
                },
                textStyle: [{
                    color: textInputValue? Theme.texts.neutrals.secondary : Theme.texts.neutrals.tertiary,
                    width: (deviceWidth -60 -25 -24 -12),
                }, staticStyles.text],
                textProps: {
                    numberOfLines: 2,
                },
                android_ripple: ripple(Theme.icons.accents.primary),
                type: 'ti', 
                icon: {
                    name: textInputValue? "account-box-outline" : "pencil", 
                    size: 25, 
                    color: textInputValue? Theme.icons.accents.secondary : Theme.texts.neutrals.tertiary
                }
            }}
        />
        {showAllSettings && 
        <SwitchField
            textTitle = {Language.loadAnimation.welcome}
            textStates = {Language.loadAnimation.welcomeState}
            //text = {`${Language.welcome} ${Language.welcomeState[`${welcomeUsed}`]}`}
            aValue={uiComposition.welcome.show}
            //primeValue={appConfig.splash.welcome}
            onChange={welcomeUsedSetting}
            style={{
                //height: 60,
                //flex: 1
            }}
            appStyle = {r_uiStyle}
            Theme={Theme}
        />}
    </View>
    </>)
}
export default connect(mapStateToProps('USER_SETTINGS'))(UserRedactor);


const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});