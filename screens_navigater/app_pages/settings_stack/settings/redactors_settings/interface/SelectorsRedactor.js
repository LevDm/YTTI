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

import BaseBox from "../../../../../../general_components/base_components/BaseBox";
import BaseSwitch from "../../../../../../general_components/base_components/BaseSwitch";

import commonStaticStyles, { BoxsField, SwitchField } from "../CommonElements";

import { switchDisign, checkBoxDisign, radioButtonDisign } from "../../../../../../app_values/AppDefault";
import { render } from "react-dom";
import useLanguage from "../../../../../../app_hooks/useLanguage";

const Reanimated_Pressable = Reanimated.createAnimatedComponent(Pressable)

const SW_Item = (props) => {
    const {
        itemSize,

        item,
        index,
        sw,

        swPress,

        appStyle,
        Theme
    } = props
    
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
                borderRadius: appStyle.borderRadius.secondary,
            }}
        >
            <Reanimated_Pressable
                style = {[{
                    height: itemSize,
                    width: itemSize,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: appStyle.borderRadius.secondary,
                    borderWidth: 2,
                    //borderColor: checkGroupSW[index]? Theme.icons.accents.secondary : 'transparent'
                }, accentStyle]}

                onPress={()=>{swPress(index)}}
            >
                <BaseSwitch
                    style={{marginBottom: 3,}}
                    size={22}
                    designType = {item}
                    borderRadius={appStyle.borderRadius.secondary}
                    Item={null}
                    colors={{
                        background: Theme.basics.neutrals.quaternary,
                        primary: Theme.specials.selector.primary,
                        secondary: Theme.specials.selector.secondary,
                        tertiary: Theme.specials.selector.tertiary,
                        quaternary: Theme.specials.selector.quaternary,
                    }}
                    primeValue={false}
                />

                <BaseSwitch
                    size={22}
                    designType = {item}
                    borderRadius={appStyle.borderRadius.secondary}
                    Item={null}
                    colors={{
                        background: Theme.basics.neutrals.quaternary,
                        primary: Theme.specials.selector.primary,
                        secondary: Theme.specials.selector.secondary,
                        tertiary: Theme.specials.selector.tertiary,
                        quaternary: Theme.specials.selector.quaternary,
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
        Theme
    } = props
    
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
                borderRadius: appStyle.borderRadius.secondary,
            }}
        >
            <Reanimated_Pressable
                style = {[{
                    height: itemSize,
                    width: itemSize,
                    justifyContent: 'center',
                    alignItems: 'center',

                    //paddingLeft: 8,
                    borderRadius: appStyle.borderRadius.secondary,
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
                    boxBorderRadius = {appStyle.borderRadius.secondary}
                    designType = {item}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.specials.selector.primary,
                        secondary: Theme.specials.selector.quaternary,
                    }}
                />
                <BaseBox
                    isCheckBox={true}
                    style={{marginLeft: 24}}
                    Item = {false}
                    check = {true}
                    boxBorderRadius = {appStyle.borderRadius.secondary}
                    designType = {item}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.specials.selector.primary,
                        secondary: Theme.specials.selector.quaternary,
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
        Theme,
    } = props
    
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
                borderRadius: appStyle.borderRadius.secondary,
            }}
        >
            <Reanimated_Pressable
                style = {[{
                    height: itemSize,
                    width: itemSize,
                    justifyContent: 'center',
                    alignItems: 'center',

                    //paddingLeft: 8,
                    borderRadius: appStyle.borderRadius.secondary,
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
                    boxBorderRadius = {appStyle.borderRadius.secondary}
                    designType = {item}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.specials.selector.primary,
                        secondary: Theme.specials.selector.quaternary,
                    }}
                />
                <BaseBox
                    isCheckBox={false}
                    style={{marginLeft: 24}}
                    Item = {false}
                    check = {true}
                    boxBorderRadius = {appStyle.borderRadius.secondary}
                    designType = {item}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.specials.selector.primary,
                        secondary: Theme.specials.selector.quaternary,
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

        r_uiStyle,
        Theme,
    } = props

    const Language = useLanguage().SettingsScreen.Redactors.selectors


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


    return (<View style={{paddingBottom: 12}}>
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

                    appStyle = {r_uiStyle}
                    Theme = {Theme}
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

                    appStyle = {r_uiStyle}
                    Theme = {Theme}
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

                    appStyle = {r_uiStyle}
                    Theme = {Theme}
                />   
            )}
        />
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});
