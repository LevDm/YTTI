import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import LanguagesAppList, {languagesApp} from "../../language/language";
import ThemesColorsAppList, {themesApp} from "../../styles/ColorsApp";
import dataRedactor from "../../async_data_manager/data_redactor";
import ColorSplash from "../../componets/StyleColorSplash";
import Slider from '@react-native-community/slider';
import { 
    BasePressable,
    BaseCheckBox,
    BaseSwitch 
} from "../../componets/base/BaseElements";
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


const positionFunctionButton = {min: 0, max: 2, step: 1}
const valuePosition = ['left','center','right']

export default ListsRedactor = ({
    appStyle,
    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    LanguageAppIndex  
}) => {

    const [sliderValue, setSliderValue] = useState(valuePosition.indexOf(appStyle.functionButton.position));

    const setPrewBasic = (value) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.functionButton.position = valuePosition[Number(value)];
        setPreviewAppStyle(newAppStyle);
    }
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

        let newAppStyle = getNewAppStyleObject();
        newAppStyle.functionButton.position = valuePosition[index];
        setPreviewAppStyle(newAppStyle);
    };

    return (<>
        <Text>position </Text>
        <View 
            style = {[{}]}
        >
            {valuePosition.map((item, index)=>{
                return(
                    <BaseCheckBox
                        key = {item+index}
                        style = {{
                            borderRadius: appStyle.borderRadius.additional,
                            marginVertical: 5
                        }}
                        //rippleColor = {ThemesColorsAppList[ThemeColorsAppIndex].shadowWhite0}
                        Item = {<Text>{item}</Text>}
                        Check = {checkGroup[index]}
                        onPress = {()=>{positionButtonSetting(item, index)}}
                        BoxBorderRadius = {appStyle.borderRadius.additional}
                        ColorsChange = {{true: ThemesColorsAppList[ThemeColorsAppIndex].sky, false: ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp}}
                    />
                )
            })}
        </View>
    </>)
}

const staticStyles = StyleSheet.create({
    themeName: {
        fontSize: 14,
        fontWeight: 'bold',
        fontVariant: ['small-caps']
    },
});