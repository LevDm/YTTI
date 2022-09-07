import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text,Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

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

import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../../componets/base/BaseElements";

export default Ohter = ({
    appStyle,
    setAppStyle,
    r_setAppStyle,
    getNewAppStyleObject,
    LanguageStore  
}) => {

    return (<>
        
    </>)
}

const staticStyles = StyleSheet.create({
    buttons: {
        flex: 0,
        height: 100, 
        width: 100,
        marginRight: 10,
    },
    buttonsText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontVariant: ['small-caps']
    },
});