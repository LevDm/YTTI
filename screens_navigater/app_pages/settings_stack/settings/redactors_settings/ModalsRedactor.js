import React, { useState, useRef, useEffect } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import languagesAppList, { languagesApp } from "../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../app_values/Themes";

import { 
    BasePressable,
    BaseBox,
    BaseSwitch,
    BaseSlider 
} from "../../../../../general_components/base_components/BaseElements";

//const borderRadiusValues = {min: 0, max: 32, step: 1}
//import { borderRadiusValues } from "../../../../../app_values/AppDefault";

export default ModalsRedactor = ({
    appStyle,

    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex   
}) => {

    const [ horizontalProximity, setHorizontalProximity ] = useState(appStyle.modals.horizontalProximity == 0? true : false)
    const [ outLine, setOutLine ] = useState(appStyle.modals.outline)
    const [ dimOut, setDimOut ] = useState(appStyle.modals.dimOut)
    //modals: {
    //    horizontalProximity: 5,
    //    outline: true,
    //    dimOut: true


    const Thema = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.modals

    
    const changeHorizontalProximity = () => {
        const newAppStyle = getNewAppStyleObject();
        newAppStyle.modals.horizontalProximity = !horizontalProximity? 0 : 5
        setPreviewAppStyle(newAppStyle);

        setHorizontalProximity(!horizontalProximity)
    }

    const changeOutLine = () => {
        const newAppStyle = getNewAppStyleObject();
        newAppStyle.modals.outline = !outLine
        setPreviewAppStyle(newAppStyle);

        setOutLine(!outLine)
    }

    const changeDimOut = () => {
        const newAppStyle = getNewAppStyleObject();
        newAppStyle.modals.dimOut = !dimOut
        setPreviewAppStyle(newAppStyle);

        setDimOut(!dimOut)
    }

    

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
            Object.keys(appStyle.modals.highlightMethods).map((item, index)=>{
                let value = appStyle.modals.highlightMethods[item]
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

    const settingMethods = (index) => {
        const newGroup = getGroup(index)
        const newAppStyle = getNewAppStyleObject();
        Object.keys(newAppStyle.modals.highlightMethods).map((item, index)=>{
            newAppStyle.modals.highlightMethods[item] = newGroup[index]
        })
        setPreviewAppStyle(newAppStyle);


        setCheckGroup(newGroup)
    }

    return (<>
        <View
            style = {{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                //marginTop: 15,
                maxHeight: 60
            }}
        >   
            <Text style = {[staticStyles.text, staticStyles.switchText, {color: Thema.texts.neutrals.secondary}]}>
                {Language[`horizontalProximity`]} {Language[`horizontalProximityState`][`${horizontalProximity}`]}
            </Text>
            <View style={[staticStyles.verticalLine, {backgroundColor: Thema.icons.accents.tertiary}]}/>
            <BaseSwitch
                size={24}
                style = {{
                    right: 20,
                    height: '100%'
                }}
                trackStyle={{
                    borderRadius: appStyle.borderRadius.additional,
                }}
                thumbStyle = {{
                    borderRadius: appStyle.borderRadius.additional,
                    borderWidth: 3,
                    borderColor:  Thema.icons.accents[horizontalProximity?"primary":"quaternary"]
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
                primeValue={horizontalProximity}
                onChange={changeHorizontalProximity}
            />
        </View>    
        <Text style = {[staticStyles.text, {color: Thema.texts.neutrals.secondary, marginTop: 15}]}>
            {Language.highlightMethods}
        </Text>
        <View
            style = {{
                //flex: 1,
                height: 94,
                marginLeft: 20,
                width: '70%',
                justifyContent: 'space-between',
            }}
        >
            {Object.keys(appStyle.modals.highlightMethods).map((item, index)=>(
                <BaseBox
                    key = {`highlightMethods_${item}`}
                    isCheckBox={true}
                    style = {{
                        //flex: 4,
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
                            {Language[item]}
                        </Text>
                    }
                    Check = {checkGroup[index]}
                    onPress = {()=>{settingMethods(index)}}
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
    text: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    listText: {
        //paddingLeft: 10,
        marginLeft: 5,
        fontSize: 14, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    adaptiveText: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5,
        textAlign: 'justify', 
        width: '70%'
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
