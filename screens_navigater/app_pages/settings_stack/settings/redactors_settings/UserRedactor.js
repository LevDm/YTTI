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
import dataRedactor from "../../../../../async_data_manager/data_redactor";

import themesColorsAppList, {themesApp} from "../../../../../app_values/Themes";
import languagesAppList, { languagesApp } from "../../../../../app_values/Languages";

import { 
    BasePressable,
    BaseBox,
    BaseSwitch 
} from "../../../../../general_components/base_components/BaseElements";

export default UserRedactor = ({
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
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.user

    
    const [textInputValue, setTextInputValue] = useState(appConfig.user.name? appConfig.user.name : null)

    const exit = ()=>{
        console.log(textInputValue)

        let newAppConfig = getNewAppConfigObject();
        //console.log('this',newAppConfig)
        newAppConfig.user.name = textInputValue;
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);
    }

    const [welcomeUsed, setWelcomeUsed] = useState(appConfig.user.welcome)

    const welcomeUsedSetting = () => {
        let newAppConfig = getNewAppConfigObject();
        newAppConfig.user.welcome = !welcomeUsed
        r_setAppConfig(newAppConfig);
        dataRedactor("storedAppConfig", newAppConfig);

        setWelcomeUsed(!welcomeUsed)
    }


    return (<>
    <View 
        style = {[{
            //marginLeft: 20,
            //width: "80%"
            
        }]}
    >
        <Text style = {[staticStyles.text, {color: Thema.texts.neutrals.secondary}]}>
            {Language.accost}
        </Text>
        <BaseTextInput 
            textValue={textInputValue}
            setTextValue={setTextInputValue}
            exit={exit}
            paneleStyle={{
                borderColor: Thema.basics.accents.primary,
                backgroundColor: Thema.basics.grounds.primary,
            }}
            textInputProps={{
                style: {
                    color: Thema.texts.neutrals.secondary,
                    fontSize: 16
                },
                
                placeholder: Language.name,
                placeholderTextColor: Thema.texts.neutrals.tertiary,
                maxLength: 70,

                selectionColor: Thema.texts.accents.primary,

                //android
                autoComplete: ('username', 'username-new', 'name'),
                cursorColor: Thema.texts.accents.primary
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
                    color: textInputValue? Thema.texts.neutrals.secondary : Thema.texts.neutrals.tertiary,
                }, staticStyles.text],
                textProps: {
                    numberOfLines: 2,
                },
                android_ripple: {
                    color: Thema.icons.accents.primary,
                    borderless: true,
                    foreground: false
                },
                type: 'ti', 
                icon: {
                    name: textInputValue? "account-box-outline" : "pencil-outline", 
                    size: 25, 
                    color: textInputValue? Thema.icons.accents.primary : Thema.texts.neutrals.tertiary
                }
            }}
        />
    </View>
    <View
        style = {{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 60,
            paddingLeft: !appStyle.splachLoadShow? 10 : 0
        }}
    >      
        <Text style = {[staticStyles.text, staticStyles.switchText, {color: Thema.texts.neutrals.secondary}]}>
            {Language.welcome} {Language.welcomeState[`${welcomeUsed}`]}
        </Text>
        <View style={[staticStyles.verticalLine, {backgroundColor: Thema.icons.accents.tertiary}]}/>
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
                borderColor: Thema.icons.accents[welcomeUsed?"primary" : "quaternary"],
            }}
            colors={{
                track: { 
                    false: Thema.icons.accents.quaternary, 
                    true: Thema.icons.accents.primary  
                },
                thumb: { 
                    false: Thema.icons.accents.quaternary, 
                    true: Thema.icons.accents.primary, 
                }
            }}
            primeValue={welcomeUsed}
            onChange={welcomeUsedSetting}
        />
        {!appStyle.splachLoadShow && 
        <View
            style = {{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backgroundColor: '#00000025',
                borderRadius: appStyle.borderRadius.additional
            }}
        />}
    </View>
    </>)
}

const BaseTextInput = ({
    //generals
    textValue,
    setTextValue,

    exit,
    enter,
    focus,

    //panele
    paneleStyle,
    //text input
    textInputProps,
    //pressable
    basePressableProps,
}) => {
    const [openState, setOpenState] = useState(false)
    const [textInputValue, setTextInputValue] = useState(null)
    
    const texInputref = useRef()

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(()=>{
        if(openState){
            setTimeout(()=>{
                texInputref.current.focus()
            }, 100) 
        }
    },[openState])

    useEffect(()=>{
        if(!keyboardVisible){
            openState ? onExit() : null
        }
    },[keyboardVisible])

    const onFocus = () => {
        setOpenState(true)
        focus? focus() : null
    }
    
    const onEnter =()=> {
        
        enter? enter() : null
    }

    const onExit =()=> {

        setOpenState(false)
        exit? exit() : null
    }

    return (
        <>
        <Modal
            visible={openState}
            transparent = {true}
        >
            <View
                style={[{
                    position: 'absolute',
                    height: 50,
                    width: '100%',
                    bottom: 0,
                    borderTopWidth: 1,
                    borderColor: 'grey',
                    backgroundColor: 'white',
                    paddingHorizontal: 20
                }, paneleStyle]}
            >
                <TextInput
                    ref={texInputref}

                    //all props
                    {...textInputProps}

                    style={[{
                        flex: 1,
                        color: 'black',
                        fontSize: 16
                    }, textInputProps.style]}

                    onSubmitEditing={onEnter}
                    onEndEditing={onExit}
                    placeholder={textInputProps.placeholder}
                    placeholderTextColor = {textInputProps.placeholderTextColor}
                    maxLength={textInputProps.maxLength}
                    defaultValue={textValue}
                    selectTextOnFocus={true}
                    onChangeText={(text)=>{
                        setTextValue(text)
                    }}
                    
                    selectionColor = {textInputProps.selectionColor}
                    
                    //android
                    autoComplete={textInputProps.autoComplete}
                    cursorColor={textInputProps.cursorColor}            
                />
            </View>
        </Modal>
        <BasePressable
            type="t"

            //all props
            {...basePressableProps}

            text={textValue? textValue : textInputProps.placeholder}
            onPress={onFocus}
        />
        </>
    )
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