import React, {useState, useRef, useEffect} from "react";

import {
    Text,
    Pressable, 
    View, 
    Dimensions,  
    ActivityIndicator, 
    StyleSheet,
    TextInput
} from 'react-native';

import Reanimated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    useDerivedValue
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
        //marginLeft: 10,
        fontSize: 17, 
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
        fontSize: 17, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5,
        textAlign: 'justify', 
        width: '70%'
    },
    listText: {
        //paddingLeft: 10,
        marginLeft: 5,
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    signaturesText: {
        //fontVariant: ['small-caps'],
        fontWeight: '400',
        fontSize: 13,
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
})
export default commonStaticStyles

export const ripple = (color) => ({
    color: `${color}20`,
    borderless: true,
    foreground: false
})

const Reanimated_TextInput = Reanimated.createAnimatedComponent(TextInput);

export const SwitchField = ({
    aValue,
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

    const switchState = useDerivedValue(()=>aValue? aValue.value : primeValue)
    //console.log(switchValue, primeValue, textStates)

    

    const onPress = () => {
        //setSwitchValue(!switchValue)
        //onChange(!switchValue)
        onChange(!switchState.value)
        //onChange()
    }

    const categoryText = useAnimatedProps(()=>{
        //console.log(Language.StructureScreen.typesSettings[`${structure[accentCategory.value].category}`].type)
        return {
            value: `${textTitle}: ${textStates[switchState.value]}`,
            text:  `${textTitle}: ${textStates[switchState.value]}`,
        }
        //,[Language, LanguageAppIndex]
    })

    return (
        <View
            {...viewProps}
            style = {[{
                backgroundColor: "transparent", 
                //marginHorizontal: 5,
                //width: '100%',
                marginVertical: 4,
                paddingHorizontal: 8,
                justifyContent: 'flex-start',
                //marginLeft: 8,
                //marginRight: 15,
                paddingVertical: 2.5,
                borderRadius: appStyle.borderRadius.additional,
            }, style]}
        >
        <BaseSwitch
            size={22}
            designType = {appStyle.selectors.design.switch}
            style = {[{
                justifyContent: 'flex-end',
                width: '100%',
                //backgroundColor: 'red',
                flexDirection: 'row-reverse',           
                //alignItems: 'center',
                //alignContent: 'center',
                //paddingHorizontal: 5,
            }]}
            separator = {true}
            separatorStyle = {{
                backgroundColor: `${Theme.specials.separator}40`,
                height: 35,//'90%',
                width: 1,
                borderRadius: 0.5,
                marginLeft: 4,
                marginRight: 12
            }}
            Item = {
                <Reanimated_TextInput     
                    editable = {false}
                    multiline={true}
                    style = {[                  
                        commonStaticStyles.text, //commonStaticStyles.switchText,
                        {
                            width: '74%',
                            minHeight: 45,
                            marginLeft: 0,
                            //paddingLeft: 3,
                            //backgroundColor: 'red',
                            color: Theme.texts.neutrals.secondary
                        }]}
                    animatedProps={categoryText}
                />
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
                style: appStyle.effects.shadows == 'none' && appStyle.selectors.ignoredShadows.disable? 'material' : appStyle.effects.shadows,
                colors: Theme.specials.shadow
            }}
            //primeValue={switchValue}
            aValue = {switchState}
            onChange={onPress}
        />
        </View>
    )
}


export const BoxsField = ({
    isChoiceOne, //  'one'>true || 'multiple'>false
    title,

    aValue = undefined,
    primaryValue: value, //  'one'>index || 'multiple'>[indexs]
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
        'worklet';
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

    const cg = useDerivedValue(()=>{
        //aValue? console.log('UPDATE', groupItems, aValue.value) : null
        return getGroup(aValue? aValue.value : value)
    }, [aValue, value])

    /*
    const [checkGroup, setCheckGroup] = useState(getGroup(value));
    useEffect(()=>{
        //console.log('boxs UE')
        const newGroup = getGroup(value)
        JSON.stringify(checkGroup) != JSON.stringify(newGroup)? setCheckGroup(newGroup) : null
    }, [value])
    */

    const checkBoxPress = (index) => {
        const newGroup = isChoiceOne? getGroup(index) : reGroup(index, JSON.parse(JSON.stringify(cg.value)))
        onPress(isChoiceOne? index : toIndexs(newGroup))
        console.log(newGroup)
        cg.value = newGroup
        //setCheckGroup(newGroup);
    }

    return (
        <View
            style={{
                //width: '100%',
                marginVertical: 4,
                paddingHorizontal: 8,
                justifyContent: 'flex-start'
            }}
            props={props}

        >
            {title && <Text style = {[commonStaticStyles.text, {color: Theme.texts.neutrals.secondary}]}>
                {title}
            </Text>}
            <View 
                style = {[{
                    //marginTop: 2,
                    marginLeft: 8,
                    //width: '100%',
                    //marginHorizontal: 8,
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
                            renderItem(JSON.parse(JSON.stringify(cg.value))[index], index)
                    }
                    //check = {checkGroup[index]}
                    boxId = {index}
                    aCheck = {cg}
                    //check = {[index]}
                    onPress = {()=>{checkBoxPress(index)}}
                    boxBorderRadius = {appStyle.borderRadius.additional}
                    designType = {isChoiceOne? appStyle.selectors.design.radioButton : appStyle.selectors.design.checkBox}
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

const R_Slider = Reanimated.createAnimatedComponent(Slider)

export const SliderField = ({
    viewProps,

    title,
    
    signaturesText = {left: 'left bord',right: 'right bord'},
    maximumValue,
    minimumValue,
    onSlidingStart,
    onSlidingComplete,
    onValueChange,
    step,
    value,

    aValue = undefined,

    appStyle,
    ThemeColorsAppIndex,
    ThemeSchema,
}, props) => {

    /* 
    const [sliderValue, setSliderValue] = useState(value);

    useEffect(()=>{
        sliderValue != value? setSliderValue(value) : null
    }, [value])
    */
    const aSlider = useDerivedValue(()=>{
        //aValue? console.log('UPDATE', title, aValue.value) : null
        return aValue? aValue.value : value
    }, [aValue, value])

    const sliderValue = useAnimatedProps(()=>({value: aSlider.value}))

    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    return (
        <View
            //onResponderGrant={() => true}
            //onMoveShouldSetResponder={() => true}
            //props = {props}
            {...viewProps}
            style = {[{
                //backgroundColor: 'red',
                marginVertical: 4,
                paddingHorizontal: 8,
                //justifyContent: 'flex-start'
                minHeight: 60,
            },]}
            
            onStartShouldSetResponder={()=>true}
            onMoveShouldSetResponde={()=>true}
        >
            <Text style = {[commonStaticStyles.text, { color: Theme.texts.neutrals.secondary, }]}>
                {title}
            </Text>
            <View
                style = {{
                    //backgroundColor: 'red',
                    //flexDirection: 'row',
                    //justifyContent: 'space-between',
                    width: '100%',
                    height: 40,
                    paddingBottom: 15,

                    //marginHorizontal: 20,
                    //marginRight: 15,
                }}
            >
                <Text
                    style = {[commonStaticStyles.signaturesText, {
                        position: 'absolute',
                        left: 10,
                        bottom: 3,
                        color: Theme.texts.neutrals.tertiary
                    }]}
                >
                    {signaturesText.left}
                </Text>
                <R_Slider
                
                    onResponderGrant={() => true}
                    onResponderTerminationRequest={()=>false}
                    onStartShouldSetResponder={()=>true}
                    onMoveShouldSetResponde={()=>true}

                    style = {{
                        flex: 1,
                    }}
                    minimumTrackTintColor = {Theme.icons.accents.tertiary}
                    maximumTrackTintColor = {Theme.icons.accents.quaternary}
                    thumbTintColor = {Theme.icons.accents.secondary}

                    
                    maximumValue = {maximumValue}
                    minimumValue = {minimumValue}
                    step = {step}
                    onSlidingStart = {onSlidingStart}
                    onSlidingComplete = {onSlidingComplete}
                    onValueChange = {onValueChange}
                    
                    //value = {sliderValue}
                    animatedProps={sliderValue}
                />
                <Text
                    style = {[commonStaticStyles.signaturesText, {
                        position: 'absolute',
                        right: 10,
                        bottom: 3,
                        color: Theme.texts.neutrals.tertiary
                    }]}
                >
                    {signaturesText.right}
                </Text>
            </View>
        </View>
    )
}