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
        marginLeft: 10,
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
        width: '83%',
    },
    verticalLine: {
        height: 45,
        width: 1.5,
        marginRight: 10
    }
})
export default commonStaticStyles

export const ripple = (color) => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
})

export const SwitchField = ({
    primeValue,
    onChange,
    text,
    textTitle,
    textStates,
    viewProps,
    style,
    appStyle,
    ThemeColorsAppIndex,
    ThemeSchema,
}, props) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const [switchValue, setSwitchValue] = useState(primeValue)

    //console.log(switchValue, primeValue, textStates)

    useEffect(()=>{
        primeValue != switchValue? setSwitchValue(primeValue) : null
    },[primeValue])

    const onPress = () => {
        setSwitchValue(!switchValue)
        onChange(!switchValue)
    }

    return (
        <View
            {...viewProps}
            style = {[{
                backgroundColor: "transparent", 
                marginHorizontal: 5,
                marginRight: 15,
                paddingVertical: 2.5,
                borderRadius: appStyle.borderRadius.additional,
            }, style]}
        >
        <BaseSwitch
            size={22}
            disignType = {appStyle.selectorsDisign.switch}
            style = {[{
                justifyContent: 'space-between',
                flexDirection: 'row-reverse',           
                alignItems: 'center',
                alignContent: 'center',
                paddingHorizontal: 5,
            }]}
            separator = {true}
            separatorStyle = {{
                backgroundColor: `${Theme.specials.separator}40`,
                height: 35,//'90%',
                width: 1,
                borderRadius: 0.5,
                marginLeft: 4,
                marginRight: 10
            }}
            Item = {
                <Text 
                    style = {[
                        commonStaticStyles.text, 
                        commonStaticStyles.switchText, 
                        {   
                            marginLeft: 0,
                            paddingLeft: 10,
                            //backgroundColor: 'red',
                            color: Theme.texts.neutrals.secondary
                        }
                    ]}
                    //
                >
                    {textTitle} {textStates[switchValue]}
                </Text>
            }
            android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.icons.accents.secondary) : false}
            borderRadius={appStyle.borderRadius.additional}
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
            primeValue={switchValue}
            onChange={onPress}
        />
        </View>
    )
}


export const BoxsField = ({
    isChoiceOne, //  'one'>true || 'multiple'>false
    title,

    primaryValue, //  'one'>index || 'multiple'>[indexs]
    groupSize,

    //groupValues,
    groupItems,
    Item: renderItem = false,
    onPress,
    
    appStyle,
    ThemeColorsAppIndex,
    ThemeSchema,
    }, props) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]

    const getGroup = (activeIndex) => {
        const newGroup = new Array(groupSize);
        for (let i = 0; i < newGroup.length; i++){newGroup[i] = (isChoiceOne? i == activeIndex : activeIndex.includes(i))}
        return newGroup
    }

    const reGroup = (activateIndex, group) => {
        const newGroup = [...group]
        newGroup[activateIndex] = !group[activateIndex]
        return newGroup
    }
    
    const toIndexs = (group) => {
        return group.map((item, index)=> item? index : -1).filter(item => item >= 0);
    }

    const [checkGroup, setCheckGroup] = useState(getGroup(primaryValue));

    useEffect(()=>{
        const newGroup = getGroup(primaryValue)
        JSON.stringify(checkGroup) != JSON.stringify(newGroup)? setCheckGroup(newGroup) : null
    }, [primaryValue])

    const checkBoxPress = (index) => {
        const newGroup = isChoiceOne? getGroup(index) : reGroup(index, checkGroup)
        onPress(isChoiceOne? index : toIndexs(newGroup))
        setCheckGroup(newGroup);
    }

    return (
        <View
            props={props}

        >
            {title && <Text style = {[commonStaticStyles.text, {color: Theme.texts.neutrals.secondary, paddingLeft: 10}]}>
                {title}
            </Text>}
            <View 
                style = {[{
                    //marginTop: 2,
                    marginLeft: 30,
                    width: '85%'
                }]}
            >
                {groupItems.map((item, index)=>(
                <BaseBox
                    isCheckBox={!isChoiceOne}
                    key = {'boxs_field_'+Math.random()}
                    style = {{
                        marginTop: index? 2 : 0,
                        borderRadius: appStyle.borderRadius.additional,
                        backgroundColor: 'transparent'
                    }}
                    android_ripple={appStyle.effects.ripple != 'none'? ripple(Theme.icons.accents.secondary) : false}
                    Item = {
                        !renderItem? 
                            <Text style = {[commonStaticStyles.listText, {color: Theme.texts.neutrals.secondary}]}>{groupItems[index]}</Text> 
                        : 
                            renderItem(checkGroup[index], index)
                    }
                    check = {checkGroup[index]}
                    onPress = {()=>{checkBoxPress(index)}}
                    boxBorderRadius = {appStyle.borderRadius.additional}
                    disignType = {isChoiceOne? appStyle.selectorsDisign.radioButton : appStyle.selectorsDisign.checkBox}
                    colors={{
                        background: Theme.basics.neutrals.secondary,
                        primary: Theme.icons.accents.secondary,
                        secondary: Theme.icons.neutrals.tertiary,
                        //tertiary: Theme.icons.accents.quaternary,
                        //quaternary: Theme.icons.neutrals.tertiary,
                    }}
                    /*
                    shadow = {{
                        style: appStyle.effects.shadows,
                        colors: Theme.specials.shadow
                    }}
                    */
                />
                ))}
            </View>
        </View>
    )
}

import Slider from "@react-native-community/slider";

export const SliderField = ({
    viewProps,

    title,
    
    signaturesText = {left: 'left bord',right: 'right bord'},
    maximumValue,
    minimumValue,
    onSlidingComplete,
    onValueChange,
    step,
    value,

    appStyle,
    ThemeColorsAppIndex,
    ThemeSchema,
}, props) => {

    const [sliderValue, setSliderValue] = useState(value);

    useEffect(()=>{
        sliderValue != value? setSliderValue(value) : null
    }, [value])

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    return (
        <View
            
            //props = {props}
            style = {[{
                //backgroundColor: 'red',
                height: 60,
            },]}
            {...viewProps}
        >
            <Text style = {[commonStaticStyles.text, {marginLeft: 20, color: Theme.texts.neutrals.secondary}]}>
                {title}
            </Text>
            <View
                style = {{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                    height: 40,
                    paddingBottom: 15,
                    marginHorizontal: 20,
                    marginRight: 15,
                }}
            >
                <Text
                    style = {[commonStaticStyles.signaturesText, {
                        position: 'absolute',
                        left: 10,
                        bottom: 5,
                        color: Theme.texts.neutrals.tertiary
                    }]}
                >
                    {signaturesText.left}
                </Text>
                <Slider                
                    style = {{
                        flex: 1,
                    }}
                    minimumTrackTintColor = {Theme.icons.accents.tertiary}
                    maximumTrackTintColor = {Theme.icons.accents.quaternary}
                    thumbTintColor = {Theme.icons.accents.secondary}

                    value = {sliderValue}
                    maximumValue = {maximumValue}
                    minimumValue = {minimumValue}
                    step = {step}
                    onSlidingComplete = {onSlidingComplete}
                    onValueChange = {onValueChange}                   
                />
                <Text
                    style = {[commonStaticStyles.signaturesText, {
                        position: 'absolute',
                        right: 10,
                        bottom: 5,
                        color: Theme.texts.neutrals.tertiary
                    }]}
                >
                    {signaturesText.right}
                </Text>
            </View>
        </View>
    )
}