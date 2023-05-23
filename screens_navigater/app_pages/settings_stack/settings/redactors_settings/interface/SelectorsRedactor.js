import React, { useState, useRef, useEffect } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
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

import commonStaticStyles, { BoxsField } from "../CommonElements";

import { switchDisign, checkBoxDisign, radioButtonDisign } from "../../../../../../app_values/AppDefault";

export default SelectorsRedactor = ({
    appStyle,
 
    //setPreviewAppStyle,
    //getNewAppStyleObject,

    previewAppStyleA,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex   
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.selectors


    const designSetting = (type, option) => {
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.selectorsDisign[type] = option;
        newAppStyle.presetUsed = 'YTAT-custom';
        cancelAnimation(previewAppStyleA)
        previewAppStyleA.value = newAppStyle
    }

    const itemSize = 70

    const getGroup = (activeIndex, groupSize) => {
        const newGroup = new Array(groupSize);
        for (let i = 0; i < newGroup.length; i++){newGroup[i] = (i == activeIndex)}
        return newGroup
    }

    const [checkGroupSW, setCheckGroupSW] = useState(getGroup(switchDisign.indexOf(appStyle.selectorsDisign.switch), switchDisign.length));
    const swPress = (index) => {
        const newGroup = getGroup(index, switchDisign.length)
        designSetting('switch', switchDisign[index])
        setCheckGroupSW(newGroup);
    }

    const [checkGroupCB, setCheckGroupCB] = useState(getGroup(checkBoxDisign.indexOf(appStyle.selectorsDisign.checkBox), checkBoxDisign.length));
    const cbPress = (index) => {
        const newGroup = getGroup(index, checkBoxDisign.length)
        designSetting('checkBox', checkBoxDisign[index])
        setCheckGroupCB(newGroup);
    }

    const [checkGroupRB, setCheckGroupRB] = useState(getGroup(radioButtonDisign.indexOf(appStyle.selectorsDisign.radioButton), radioButtonDisign.length));
    const rbPress = (index) => {
        const newGroup = getGroup(index, radioButtonDisign.length)
        designSetting('radioButton', radioButtonDisign[index])
        setCheckGroupRB(newGroup);
    }

    useEffect(()=>{
        const newGroupSW = getGroup(switchDisign.indexOf(appStyle.selectorsDisign.switch), switchDisign.length)
        const newGroupCB = getGroup(checkBoxDisign.indexOf(appStyle.selectorsDisign.checkBox), checkBoxDisign.length)
        const newGroupRB = getGroup(radioButtonDisign.indexOf(appStyle.selectorsDisign.radioButton), radioButtonDisign.length)

        JSON.stringify(checkGroupSW) != JSON.stringify(newGroupSW)? setCheckGroupSW(newGroupSW) : null
        JSON.stringify(checkGroupCB) != JSON.stringify(newGroupCB)? setCheckGroupCB(newGroupCB) : null
        JSON.stringify(checkGroupRB) != JSON.stringify(newGroupRB)? setCheckGroupRB(newGroupRB) : null
    }, [appStyle])

    return (<View style={{paddingBottom: 12}}>
        <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 10, marginTop: 5}]}>{Language.switchs}</Text>
        <FlatList 
            horizontal
            data={switchDisign}
            style={{
                marginLeft: 30
            }}
            renderItem={({item, index})=> (
                <View 
                    key={'switch_'+item+index}
                    style = {{
                        height: itemSize,
                        width: itemSize,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        borderRadius: appStyle.borderRadius.additional,
                    }}
                >
                    <Pressable
                        style = {{
                            height: itemSize,
                            width: itemSize,
                            justifyContent: 'center',
                            alignItems: 'center',
    
                            paddingLeft: 8,
                            borderRadius: appStyle.borderRadius.additional,
                            borderWidth: 2,
                            borderColor: checkGroupSW[index]? Theme.icons.accents.secondary : 'transparent'
                        }}

                        onPress={()=>{swPress(index)}}
                    >
                        <BaseSwitch
                            size={22}
                            disignType = {item}
                            borderRadius={appStyle.borderRadius.additional}
                            Item={false}
                            colors={{
                                background: Theme.basics.neutrals.secondary,
                                primary: Theme.icons.accents.secondary,
                                secondary: Theme.icons.accents.tertiary,
                                tertiary: Theme.icons.neutrals.tertiary,
                                quaternary: Theme.icons.neutrals.quaternary,
                            }}
                            shadow = {{
                                style: appStyle.effects.shadows,
                                colors: Theme.specials.shadow
                            }}
                            primeValue={false}
                        />
                        <BaseSwitch
                            size={22}
                            disignType = {item}
                            borderRadius={appStyle.borderRadius.additional}
                            Item={false}
                            colors={{
                                background: Theme.basics.neutrals.secondary,
                                primary: Theme.icons.accents.secondary,
                                secondary: Theme.icons.accents.tertiary,
                                tertiary: Theme.icons.neutrals.tertiary,
                                quaternary: Theme.icons.neutrals.quaternary,
                            }}
                            shadow = {{
                                style: appStyle.effects.shadows,
                                colors: Theme.specials.shadow
                            }}
                            primeValue={true}
                        />
                        <View style={{position: 'absolute',height: itemSize, width: itemSize, backgroundColor: 'transparent'}}/>
                    </Pressable>
                </View>
            )}
        />

        <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 10, marginTop: 5}]}>{Language.checkBoxs}</Text>
        <FlatList 
            horizontal
            data={checkBoxDisign}
            style={{
                marginLeft: 30
            }}
            renderItem={({item, index})=> (
                <View 
                    key={'checkbox_'+item+index}
                    style = {{
                        height: itemSize,
                        width: itemSize,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        borderRadius: appStyle.borderRadius.additional,
                    }}
                >
                    <Pressable
                        style = {{
                            height: itemSize,
                            width: itemSize,
                            justifyContent: 'center',
                            alignItems: 'center',
    
                            //paddingLeft: 8,
                            borderRadius: appStyle.borderRadius.additional,
                            borderWidth: 2,
                            borderColor: checkGroupCB[index]? Theme.icons.accents.secondary : 'transparent'
                        }}

                        onPress={()=>{cbPress(index)}}
                    >
                        <BaseBox
                            isCheckBox={true}
                            style={{marginRight: 24}}
                            Item = {false}
                            check = {false}
                            boxBorderRadius = {appStyle.borderRadius.additional}
                            disignType = {item}
                            colors={{
                                background: Theme.basics.neutrals.secondary,
                                primary: Theme.icons.accents.secondary,
                                secondary: Theme.icons.neutrals.tertiary,
                            }}
                        />
                        <BaseBox
                            isCheckBox={true}
                            style={{marginLeft: 24}}
                            Item = {false}
                            check = {true}
                            boxBorderRadius = {appStyle.borderRadius.additional}
                            disignType = {item}
                            colors={{
                                background: Theme.basics.neutrals.secondary,
                                primary: Theme.icons.accents.secondary,
                                secondary:  Theme.icons.neutrals.tertiary,
                            }}
                        />
                        <View style={{position: 'absolute',height: itemSize, width: itemSize, backgroundColor: 'transparent'}}/>
                    </Pressable>
                </View>
            )}
        />

        <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 10, marginTop: 5}]}>{Language.radioButtons}</Text>
        <FlatList 
            horizontal
            data={radioButtonDisign}
            style={{
                marginLeft: 30
            }}
            renderItem={({item, index})=> (
                <View 
                    key={'radiobutton_'+item+index}
                    style = {{
                        height: itemSize,
                        width: itemSize,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        borderRadius: appStyle.borderRadius.additional,
                    }}
                >
                    <Pressable
                        style = {{
                            height: itemSize,
                            width: itemSize,
                            justifyContent: 'center',
                            alignItems: 'center',
    
                            //paddingLeft: 8,
                            borderRadius: appStyle.borderRadius.additional,
                            borderWidth: 2,
                            borderColor: checkGroupRB[index]? Theme.icons.accents.secondary : 'transparent'
                        }}

                        onPress={()=>{rbPress(index)}}
                    >
                        <BaseBox
                            isCheckBox={false}
                            style={{marginRight: 24}}
                            Item = {false}
                            check = {false}
                            boxBorderRadius = {appStyle.borderRadius.additional}
                            disignType = {item}
                            colors={{
                                background: Theme.basics.neutrals.secondary,
                                primary: Theme.icons.accents.secondary,
                                secondary:  Theme.icons.neutrals.tertiary,
                            }}
                        />
                        <BaseBox
                            isCheckBox={false}
                            style={{marginLeft: 24}}
                            Item = {false}
                            check = {true}
                            boxBorderRadius = {appStyle.borderRadius.additional}
                            disignType = {item}
                            colors={{
                                background: Theme.basics.neutrals.secondary,
                                primary: Theme.icons.accents.secondary,
                                secondary:  Theme.icons.neutrals.tertiary,
                            }}
                        />
                        <View style={{position: 'absolute',height: itemSize, width: itemSize, backgroundColor: 'transparent'}}/>
                    </Pressable>
                </View>
            )}
        />
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});
