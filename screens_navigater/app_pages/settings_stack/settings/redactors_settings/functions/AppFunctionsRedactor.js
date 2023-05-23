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
    Keyboard,
    Vibration
} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import DraggableFlatList, {ScaleDecorator,} from "react-native-draggable-flatlist";

import { MaterialCommunityIcons } from '@expo/vector-icons';

import dataRedactor from "../../../../../../app_async_data_manager/data_redactor";

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";

import { 
    BasePressable,
    BaseBox,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";


import commonStaticStyles, { SwitchField, BoxsField, ripple } from "../CommonElements";



export default LanguageRedactor = ({
    appStyle,
    r_setAppStyle,
    //setAppStyle,

    appConfig,
    r_setAppConfig,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors

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
            Object.keys(appConfig.appFunctions).map((item, index)=>{
                let value = appConfig.appFunctions[item].used
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

    const settingFunctions = (index, subsequence) => {
        const newGroup = index != undefined? getGroup(index) : checkGroup
        const newAppConfig = JSON.parse(JSON.stringify(appConfig));//getNewAppConfigObject();
        let usedSubsequence = []
        
        if(subsequence){
            newAppConfig.screenSubsequence = subsequence
            subsequence.map((item, index)=>{
                if(newGroup[Object.keys(newAppConfig.appFunctions).indexOf(item)]){
                    usedSubsequence.push(item)
                }
            }) 
        } else {
            newAppConfig.screenSubsequence.map((item, index)=>{
                if(newGroup[Object.keys(newAppConfig.appFunctions).indexOf(item)]){
                    usedSubsequence.push(item)
                }
            }) 
        }
        if((usedSubsequence.includes('settings') && usedSubsequence.length >= 2) || (!usedSubsequence.includes('settings') && usedSubsequence.length >= 1)){
            console.log('usedSubsequence', usedSubsequence)
            Object.keys(newAppConfig.appFunctions).map((item, index)=>{
                newAppConfig.appFunctions[item].used = newGroup[index]
                !newGroup[index]? newAppConfig.appFunctions[item].useId = null : null
                if(usedSubsequence && newGroup[index]){
                    newAppConfig.appFunctions[item].useId = usedSubsequence.indexOf(item)
                }
            })

            r_setAppConfig(newAppConfig);
            dataRedactor("storedAppConfig", newAppConfig);

            setCheckGroup(newGroup)

            if(usedSubsequence.length == 1 && appStyle.navigationMenu.type == 'classical'){menuDisplay(0)}
            else if(usedSubsequence.length >= 1 && (appStyle.navigationMenu.type == 'classical' && appStyle.navigationMenu.height == 0)){menuDisplay(50)}
        }
    }

    const menuDisplay = (value) => {
        const newAppStyle = JSON.parse(JSON.stringify(appStyle));
        newAppStyle.navigationMenu.height = value
        dataRedactor("storedAppStyle",newAppStyle);
        r_setAppStyle(newAppStyle);
    }

    const [data, setData] = useState(appConfig.screenSubsequence);

    const endDrag = ({ data }) => {
        console.log('funcs', data)
        settingFunctions(undefined, data)
        setData(data)
    }

    const renderItem = ({ item, drag = undefined, isActive = false }) => {
        //const useIndex = getIndex()
        const index = Object.keys(appConfig.appFunctions).indexOf(item)
        //console.log('funcs inex', index, useIndex)
        const longPress = () => {
            //console.log('funcs longpress', props)
            Vibration.vibrate([5,10])
            drag? drag() : null
        }
        if(item == 'settings'){return null}
        return (
        <ScaleDecorator>
            <View 
                style={{
                    backgroundColor: '#00000001',
                    borderRadius: appStyle.borderRadius.additional,
                    marginLeft: 30,
                    width: '85%',
                }}
            >
            <Pressable
                delayLongPress={300}
                onLongPress={longPress}
                disabled={isActive}
                style={[
                    { 
                        height: 32,
                        //marginLeft: 30,
                        //width: '85%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        borderRadius: appStyle.borderRadius.additional,
                        backgroundColor: isActive ? `${Theme.basics.neutrals.tertiary}10` : 'transparent',
                    },
                ]}
                android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.basics.neutrals.tertiary) : false}
            >
                <BaseBox
                    key = {`functions_${item}`}
                    isCheckBox={true}
                    style = {{
                        //flex: 4,
                        width: '80%',
                        //marginTop: index > 0 ? 4 : 0,
                        backgroundColor: 'transparent',
                        borderRadius: appStyle.borderRadius.additional,
                    }}
                    android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.icons.accents.secondary) : false}
                    Item = {<Text style = {[staticStyles.listText, {color: Theme.texts.neutrals.secondary}]}>{item}</Text>}
                    check = {checkGroup[index]}
                    onPress = {()=>{settingFunctions(index)}}
                    boxBorderRadius = {appStyle.borderRadius.additional}
                    disignType = {appStyle.selectorsDisign.checkBox}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.icons.accents.secondary,
                        secondary: Theme.icons.accents.quaternary,
                    }}
                />
                <MaterialCommunityIcons name="drag-horizontal-variant" size={26} color={Theme.icons.neutrals.secondary} />
            </Pressable>
            </View>
            </ScaleDecorator>
        )
    }

    return (<View style={{paddingBottom: 12}}>
        <DraggableFlatList
            data={data}
            onDragEnd={endDrag}
            keyExtractor={(item) => item}
            renderItem={renderItem}
        />
        <View 
            style={{
                backgroundColor: '#00000001',
                borderRadius: appStyle.borderRadius.additional,
                marginLeft: 30,
                width: '85%',
            }}
        >
            <View
                style={[
                    { 
                        height: 32,
                        //marginLeft: 30,
                        //width: '85%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        borderRadius: appStyle.borderRadius.additional,
                        backgroundColor: 'transparent',
                    },
                ]}
                
            >
                <BaseBox
                    isCheckBox={true}
                    style = {{
                        //flex: 4,
                        width: '80%',
                        //marginTop: index > 0 ? 4 : 0,
                        backgroundColor: 'transparent',
                        borderRadius: appStyle.borderRadius.additional,
                    }}
                    android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.icons.accents.secondary) : false}
                    Item = {<Text style = {[staticStyles.listText, {color: Theme.texts.neutrals.secondary}]}>{'settings'}</Text>}
                    check = {checkGroup[Object.keys(appConfig.appFunctions).indexOf('settings')]}
                    onPress = {()=>{settingFunctions(Object.keys(appConfig.appFunctions).indexOf('settings'))}}
                    boxBorderRadius = {appStyle.borderRadius.additional}
                    disignType = {appStyle.selectorsDisign.checkBox}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.icons.accents.secondary,
                        secondary: Theme.icons.accents.quaternary,
                    }}
                />
            </View>
        </View>
    </View>)
}

const staticStyles = StyleSheet.create({
    
    ...commonStaticStyles
});