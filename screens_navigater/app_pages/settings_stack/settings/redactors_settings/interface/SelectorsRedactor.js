import React, { useState, useRef, useEffect } from "react";

import { StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import Reanimated, {
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

import commonStaticStyles, { BoxsField, SwitchField } from "../CommonElements";

import { switchDisign, checkBoxDisign, radioButtonDisign } from "../../../../../../app_values/AppDefault";
import { render } from "react-dom";

const Reanimated_Pressable = Reanimated.createAnimatedComponent(Pressable)

const SW_Item = (props) => {
    const {
        itemSize,

        item,
        index,
        sw,

        swPress,

        appStyle,
        ThemeColorsAppIndex,
        ThemeSchema
    } = props
    
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const itemAccent = useDerivedValue(()=> sw.value[index])

    const accentStyle = useAnimatedStyle(()=>{
        return {
            borderColor: withTiming(itemAccent.value? Theme.icons.accents.secondary : 'transparent', {duration: 200})
        }
    })

    return (
        <View
            key = {props.idKey} 
            style = {{
                height: itemSize,
                width: itemSize,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                borderRadius: appStyle.borderRadius.additional,
            }}
        >
            <Reanimated_Pressable
                style = {[{
                    height: itemSize,
                    width: itemSize,
                    justifyContent: 'center',
                    alignItems: 'center',

                    paddingLeft: 8,
                    borderRadius: appStyle.borderRadius.additional,
                    borderWidth: 2,
                    //borderColor: checkGroupSW[index]? Theme.icons.accents.secondary : 'transparent'
                }, accentStyle]}

                onPress={()=>{swPress(index)}}
            >
                <BaseSwitch
                    size={22}
                    designType = {item}
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
                        style: appStyle.effects.shadows == 'none' && appStyle.selectors.ignoredShadows.disable? 'material' : appStyle.effects.shadows,
                        colors: Theme.specials.shadow
                    }}
                    primeValue={false}
                />
                <BaseSwitch
                    size={22}
                    designType = {item}
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
                        style: appStyle.effects.shadows == 'none' && appStyle.selectors.ignoredShadows.disable? 'material' : appStyle.effects.shadows,
                        colors: Theme.specials.shadow
                    }}
                    primeValue={true}
                />
                <View style={{position: 'absolute',height: itemSize, width: itemSize, backgroundColor: 'transparent'}}/>
            </Reanimated_Pressable>
        </View>
    )
}

const CB_Item = (props) => {
    const {
        itemSize,

        item,
        index,

        cb,

        cbPress,

        appStyle,
        ThemeColorsAppIndex,
        ThemeSchema
    } = props
    
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const itemAccent = useDerivedValue(()=> cb.value[index])

    const accentStyle = useAnimatedStyle(()=>{
        return {
            borderColor: withTiming(itemAccent.value? Theme.icons.accents.secondary : 'transparent', {duration: 200})
        }
    })

    return (
        <View 
            key={props.idKey}
            style = {{
                height: itemSize,
                width: itemSize,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                borderRadius: appStyle.borderRadius.additional,
            }}
        >
            <Reanimated_Pressable
                style = {[{
                    height: itemSize,
                    width: itemSize,
                    justifyContent: 'center',
                    alignItems: 'center',

                    //paddingLeft: 8,
                    borderRadius: appStyle.borderRadius.additional,
                    borderWidth: 2,
                    //borderColor: checkGroupSW[index]? Theme.icons.accents.secondary : 'transparent'
                }, accentStyle]}

                onPress={()=>{cbPress(index)}}
            >
                <BaseBox
                    isCheckBox={true}
                    style={{marginRight: 24}}
                    Item = {false}
                    check = {false}
                    boxBorderRadius = {appStyle.borderRadius.additional}
                    designType = {item}
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
                    designType = {item}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.icons.accents.secondary,
                        secondary:  Theme.icons.neutrals.tertiary,
                    }}
                />
                <View style={{position: 'absolute',height: itemSize, width: itemSize, backgroundColor: 'transparent'}}/>
            </Reanimated_Pressable>
        </View>
    )
}

const RB_Item = (props) => {
    const {
        itemSize,

        item,
        index,

        rb,

        rbPress,

        appStyle,
        ThemeColorsAppIndex,
        ThemeSchema
    } = props
    
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const itemAccent = useDerivedValue(()=> rb.value[index])

    const accentStyle = useAnimatedStyle(()=>{
        return {
            borderColor: withTiming(itemAccent.value? Theme.icons.accents.secondary : 'transparent', {duration: 200})
        }
    })

    return (
        <View 
            key={props.idKey}
            style = {{
                height: itemSize,
                width: itemSize,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                borderRadius: appStyle.borderRadius.additional,
            }}
        >
            <Reanimated_Pressable
                style = {[{
                    height: itemSize,
                    width: itemSize,
                    justifyContent: 'center',
                    alignItems: 'center',

                    //paddingLeft: 8,
                    borderRadius: appStyle.borderRadius.additional,
                    borderWidth: 2,
                    //borderColor: checkGroupSW[index]? Theme.icons.accents.secondary : 'transparent'
                }, accentStyle]}

                onPress={()=>{rbPress(index)}}
            >
                <BaseBox
                    isCheckBox={false}
                    style={{marginRight: 24}}
                    Item = {false}
                    check = {false}
                    boxBorderRadius = {appStyle.borderRadius.additional}
                    designType = {item}
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
                    designType = {item}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.icons.accents.secondary,
                        secondary:  Theme.icons.neutrals.tertiary,
                    }}
                />
                <View style={{position: 'absolute',height: itemSize, width: itemSize, backgroundColor: 'transparent'}}/>
            </Reanimated_Pressable>
        </View>
    )
}

const itemSize = 70

export default SelectorsRedactor = (props) => {
    const {
        uiStyle,
        uiTheme,

        showAllSettings,

        tagStyle,

        aStyle,
        aTheme, 
        aPalette, 
        aScheme,

        appStyle,
        appConfig,
        redactorsSet,
        ThemeColorsAppIndex,
        ThemeSchema,
        LanguageAppIndex
    } = props

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.selectors


    const designSetting = (type, option) => {
        uiStyle.selectors.design[type].value = option;
        tagStyle('selectors.design.'+type)
    }

    const getGroup = (activeIndex, groupSize) => {
        'worklet';
        const newGroup = new Array(groupSize);
        for (let i = 0; i < newGroup.length; i++){newGroup[i] = (i == activeIndex)}
        return newGroup
    }

    const swPress = (index) => {
        designSetting('switch', switchDisign[index])
    }

    const cbPress = (index) => {
        designSetting('checkBox', checkBoxDisign[index])
    }

    const rbPress = (index) => {
        designSetting('radioButton', radioButtonDisign[index])
    }


    const sw = useDerivedValue(()=>getGroup(switchDisign.indexOf(uiStyle.selectors.design.switch.value), switchDisign.length))
    const cb = useDerivedValue(()=>getGroup(checkBoxDisign.indexOf(uiStyle.selectors.design.checkBox.value), checkBoxDisign.length))
    const rb = useDerivedValue(()=>getGroup(radioButtonDisign.indexOf(uiStyle.selectors.design.radioButton.value), radioButtonDisign.length))

    const disableChange = (value) =>{
        uiStyle.selectors.ignoredShadows.disable.value = value;
    }

    return (<View style={{paddingBottom: 12}}>
        {showAllSettings && 
        <SwitchField
            textTitle = {Language.disabledShadows}
            textStates = {Language.disabledShadowsState}
            //text = {`${Language.invertColors} ${Language.invertColorsState[invertColors]}`}
            //primeValue={disabledShadows}
            aValue={uiStyle.selectors.ignoredShadows.disable}
            onChange={disableChange}
            style = {{
                marginTop: 10
            }}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />}


        <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 10, marginTop: 5}]}>{Language.switchs}</Text>
        <FlatList 
            //horizontal
            numColumns={4}
            data={switchDisign}
            style={{
                marginLeft: 30
            }}
            renderItem={({item, index})=> (
                <SW_Item 
                    idKey={'switch_'+item+index}

                    itemSize = {itemSize}
                    item = {item}
                    index = {index}

                    swPress={swPress}

                    sw = {sw}

                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema={ThemeSchema}
                />
            )}
        />

        <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 10, marginTop: 5}]}>{Language.checkBoxs}</Text>
        <FlatList 
            //horizontal
            numColumns={4}
            data={checkBoxDisign}
            style={{
                marginLeft: 30
            }}
            renderItem={({item, index})=> (
                <CB_Item 
                    idKey={'checkbox_'+item+index}

                    itemSize = {itemSize}
                    item = {item}
                    index = {index}

                    cbPress={cbPress}

                    cb = {cb}

                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema={ThemeSchema}
                />         
            )}
        />

        <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 10, marginTop: 5}]}>{Language.radioButtons}</Text>
        <FlatList 
            //horizontal
            numColumns={4}
            data={radioButtonDisign}
            style={{
                marginLeft: 30
            }}
            renderItem={({item, index})=> (
                <RB_Item 
                    idKey={'radiobutton_'+item+index}

                    itemSize = {itemSize}
                    item = {item}
                    index = {index}

                    rbPress={rbPress}

                    rb = {rb}

                    appStyle = {appStyle}
                    ThemeColorsAppIndex = {ThemeColorsAppIndex}
                    ThemeSchema={ThemeSchema}
                />   
            )}
        />
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});
