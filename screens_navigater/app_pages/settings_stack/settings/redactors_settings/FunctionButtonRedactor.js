import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import languagesAppList, {languagesApp}  from "../../../../../app_values//Languages";
import themesColorsAppList, {themesApp} from "../../../../../app_values//Themes";

import { 
    BasePressable,
    BaseCheckBox,
    BaseSlider,
    BaseSwitch 
} from "../../../../../general_components/base_components/BaseElements";

import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


//const sizeButton = {min: 40, max: 70, step: 5}
//const valuePosition = ['left','center','right']
import { sizeButton, valuePosition } from "../../../../../app_values//AppDefault";

export default ListsRedactor = ({
    appStyle,
    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    LanguageAppIndex  
}) => {
    const Thema = themesColorsAppList[ThemeColorsAppIndex]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.bobberButton

    const [sliderValue, setSliderValue] = useState(appStyle.functionButton.size);

    const getGroup = (type) => {
        let group = []
        for (let i of valuePosition){
            let check = false
            if(type === i){check = true}
            group.push(check)
        }
        return group
    };

    const [checkGroup, setCheckGroup] = useState(getGroup(appStyle.functionButton.position));

    const positionButtonSetting = (positionType, index) => {
        setCheckGroup(getGroup(positionType));
        const newAppStyle = getNewAppStyleObject();
        newAppStyle.functionButton.position = valuePosition[index];
        setPreviewAppStyle(newAppStyle);
    };

    const settingSizeButton = (value, isComplete) =>{
        const newAppStyle = getNewAppStyleObject();
        isComplete? setSliderValue(value) : null
        newAppStyle.functionButton.size = Number(value);
        setPreviewAppStyle(newAppStyle);
    }

    return (<>
        <Text style = {[staticStyles.text, {color: Thema.texts.neutrals.secondary}]}>
            {Language.position}
        </Text>
        <View 
            style = {[{}]}
        >
            {valuePosition.map((item, index)=>{
                return(
                    <BaseCheckBox
                        key = {item+index}
                        style = {{
                            borderRadius: appStyle.borderRadius.additional,
                            //marginVertical: 5
                        }}
                        //rippleColor = {ThemesColorsAppList[ThemeColorsAppIndex].shadowWhite0}
                        Item = {<Text style = {[staticStyles.listText, {color: Thema.texts.neutrals.secondary}]}>{Language.positions[index]}</Text>}
                        Check = {checkGroup[index]}
                        onPress = {()=>{positionButtonSetting(item, index)}}
                        BoxBorderRadius = {appStyle.borderRadius.additional}
                        ColorsChange = {{true: Thema.icons.accents.primary, false: Thema.icons.accents.quaternary}}
                    />
                )
            })}
        </View>
        <Text style = {[staticStyles.text, {color: Thema.texts.neutrals.secondary, marginTop: 15}]}>
            {Language.size}
        </Text>
        <BaseSlider
            signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
            signaturesStyle = {[staticStyles.signaturesText, {color: Thema.texts.neutrals.tertiary}]}
            areaStyle = {{marginHorizontal: 20}}
            minimumValue={sizeButton.min}
            maximumValue={sizeButton.max}
            step = {sizeButton.step}
            value = {sliderValue}
            onSlidingComplete = {(value)=>{settingSizeButton(value, true)}}
            onValueChange = {(value)=>{settingSizeButton(value, false)}}
            minimumTrackTintColor = {Thema.icons.accents.primary}
            maximumTrackTintColor = {Thema.icons.accents.quaternary}
            thumbTintColor = {Thema.icons.accents.primary}
        />
    </>)
}

const staticStyles = StyleSheet.create({
    text: {
        fontSize: 16, 
        //fontVariant: ['small-caps'], 
        fontWeight: '400', 
        letterSpacing: 0.5
    },
    listText: {
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
    }
});