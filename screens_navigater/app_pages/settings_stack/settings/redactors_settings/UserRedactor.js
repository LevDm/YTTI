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

    const [focusTI, setFocusTI] = useState(false)

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
        if(focusTI){
            //console.log(texInputref.current)
            setTimeout(()=>{
                texInputref.current.focus()
            }, 100) 
        }
    },[focusTI])

    useEffect(()=>{
        if(!keyboardVisible){
            setFocusTI(false)
        }
    },[keyboardVisible])
    
    const onFocus = ()=>{
        console.log('focus')
        setFocusTI(true)  
    }

    const onEnd = ()=>{
        console.log('end')
        
        setFocusTI(false)
    }


    return (<>
    <View 
        style = {[{
            marginLeft: 20,
            width: "80%"
        }]}
    >
       
        <Modal
            visible={focusTI}
            transparent = {true}
        >
            <View
                style={{
                    position: 'absolute',
                    //backgroundColor: 'green',
                    height: 50,
                    width: '100%',
                    bottom: 0
                }}
            >
                <TextInput
                    ref={texInputref}
                    style={[{
                        flex: 1,
                        backgroundColor: 'white',
                        paddingHorizontal: 10
                    }]}
                    autoCorrect={false}
                    autoFocus={false}
                    //onFocus={onFocus}
                    onSubmitEditing={onEnd}
                    onEndEditing={onEnd}
                    placeholder={'Name'}
                    maxLength={70}
                    defaultValue={textInputValue}
                    selectTextOnFocus={true}
                    onChangeText={(text)=>{
                        setTextInputValue(text)
                        console.log(text)
                    }}
                    
                    selectionColor={'blue'}
                    //android
                    //autoComplete={'username'}
                    cursorColor={'black'}
                />
            </View>
        </Modal>
        <BasePressable
            type="t"
            text={textInputValue? textInputValue : 'your name'}
            onPress={onFocus}
        />
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