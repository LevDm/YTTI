import React, {useState, useRef, useEffect} from "react";

import {
    Text,
    Pressable, 
    View, 
    Dimensions,  
    ActivityIndicator, 
    StyleSheet
} from 'react-native';

import Reanimated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import { 
    BasePressable,
    BaseBox,
    BaseSwitch,
    BaseSlider 
} from "../../../../../general_components/base_components/BaseElements";

import themesColorsAppList, { themesApp } from "../../../../../app_values/Themes";

const commonStaticStyles = StyleSheet.create({
    text: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    themeName: {
        fontSize: 14,
        fontWeight: 'bold',
        fontVariant: ['small-caps']
    },
    adaptiveText: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5,
        textAlign: 'justify', 
        width: '70%'
    },
    listText: {
        //paddingLeft: 10,
        marginLeft: 5,
        fontSize: 14, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
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
export default commonStaticStyles

export const SwitchField = ({
    primeValue,
    onChange,
    text,
    viewProps,
    style,
    appStyle,
    ThemeColorsAppIndex,
    ThemeSchema,
}) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    return (
    <View
        style = {[{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }, style]}
        {...viewProps}
    >
        <Text style = {[commonStaticStyles.text, commonStaticStyles.switchText, {color: Theme.texts.neutrals.secondary}]}>
            {text}
        </Text>
        <View style={[commonStaticStyles.verticalLine, {backgroundColor: Theme.icons.accents.tertiary}]}/>
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
                borderColor:  Theme.icons.accents[primeValue?"primary":"quaternary"]
            }}
            colors={{
                track: { 
                    false: Theme.icons.accents.quaternary, 
                    true: Theme.icons.accents.primary
                },
                thumb: { 
                    false: Theme.basics.grounds.primary,//Theme.icons.accents.quaternary, 
                    true: Theme.basics.grounds.primary,//Theme.icons.accents.primary, 
                }
            }}
            primeValue={primeValue}
            onChange={onChange}
        />
    </View>
    )
}