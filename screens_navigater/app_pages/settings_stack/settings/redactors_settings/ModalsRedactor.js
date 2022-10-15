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

    return (
        <View
            style = {{

            }}
        >   
            {Object.keys(appStyle.modals).map((item, index)=>{
                
                let primaryValue
                let changer
                switch(item){
                    case 'horizontalProximity':
                        primaryValue = horizontalProximity
                        changer = changeHorizontalProximity
                        break;
                    case 'outline':
                        primaryValue = outLine
                        changer = changeOutLine
                        break;
                    case 'dimOut':
                        primaryValue = dimOut
                        changer = changeDimOut
                        break;
                } 


                return (
                    <View
                        key={`switchs_${index}_${item}`}
                        style = {{
                            marginTop: index > 0 ? 5 : 0,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Text style = {[staticStyles.text, staticStyles.switchText, {color: Thema.texts.neutrals.secondary}]}>
                            {item}
                        </Text>
                        <View style={[staticStyles.verticalLine, {backgroundColor: Thema.icons.accents.tertiary}]}/>
                        <BaseSwitch
                            size={24}
                            style = {{
                                right: 20,
                            }}
                            trackStyle={{
                                borderRadius: appStyle.borderRadius.additional,
                            }}
                            thumbStyle = {{
                                borderRadius: appStyle.borderRadius.additional,
                                borderWidth: 3,
                                borderColor:  Thema.icons.accents[primaryValue?"primary":"quaternary"]
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
                            primeValue={primaryValue}
                            onChange={changer}
                        />
                    </View>
                )
            })}
    </View>)
}

const staticStyles = StyleSheet.create({
    text: {
        fontSize: 16, 
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
