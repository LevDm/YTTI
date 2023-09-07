import React, { useState, useRef, useEffect } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Application from 'expo-application';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    useDerivedValue,
    runOnJS,
    cancelAnimation
} from 'react-native-reanimated';

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";
import { 
    BasePressable,
    BaseBox,
    BaseSwitch,
    BaseSlider 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { SwitchField, BoxsField } from "../CommonElements";

//const borderRadiusValues = {min: 0, max: 32, step: 1}
//import { borderRadiusValues } from "../../../../../app_values/AppDefault";

import { modalsHorizontalProximity } from "../../../../../../app_values/AppDefault";

export default Info = ({
    
 
    //setPreviewAppStyle,
    //getNewAppStyleObject,
    appStyle,
    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex   
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.modals

    return (

        <View 
            style={{
                //flex: 1, //-headerHeight-selectorLineHeight
                width: '100%',
                alignItems: 'center',
                //backgroundColor: 'red',
                justifyContent: 'space-between',
                paddingHorizontal: 32,
                flexDirection: 'row'
            }}
        >   
            <MaskedView
                style={{height: 25, width: 100, flexDirection: 'row'}}
                maskElement={
                <View
                    style={{
                        // Transparent background because mask is based off alpha channel.
                        backgroundColor: 'transparent',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                >
                    <Ionicons name="logo-react" size={18} color="black" />
                    <Text 
                        style = {[{
                            //color: 'transparent',//,
                            fontSize: 18,
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            letterSpacing: 1,
                            fontVariant: ['small-caps'],
                            opacity: .5,
                            marginBottom: 2
                        }]}
                    >
                        F1F<Text style={{fontSize: 12, left: -10}}>.GUI's</Text>
                    </Text>
                </View>}
            >
            {/* COLORS */}
            <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}

                style ={{
                    flex: 1
                }}
                colors = {['#06bcee','#f010f0']}
            />
            </MaskedView>

            <Text 
                style = {[{
                    //color: 'transparent',//,
                    //backgroundColor: 'blue',
                    fontSize: 14,
                    height: 25,
                    fontWeight: 'bold',
                    //fontStyle: 'italic',
                    //bottom: 25,
                    letterSpacing: 1.2,
                    fontVariant: ['small-caps'],
                    color: Theme.texts.neutrals.secondary,
                    verticalAlign: 'middle'
                }]}
            >
                YTTI {Application.nativeApplicationVersion}
            </Text>
        </View>
    )
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});
