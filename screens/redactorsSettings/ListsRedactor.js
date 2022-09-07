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


const listsTextSize = {min: 10, max: 20, step: 1}

const listsProximity = {min: 1, max: 5, step: 1}

export default ListsRedactor = ({
    appStyle,
    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    LanguageAppIndex  
}) => {

    const [sliderTextSizeValue, setSliderTextSizeValue] = useState(appStyle.lists.textSize);

    const setPrewTextSize = (value) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.lists.textSize = Number(value);
        setPreviewAppStyle(newAppStyle);
    }

    const [sliderProximityValue, setSliderProximityValue] = useState(appStyle.lists.proximity);

    const setPrewProximity = (value) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.lists.proximity = Number(value);
        setPreviewAppStyle(newAppStyle);
    }


    const [fullWidth, setFullWidth] = useState(appStyle.lists.fullWidth);
    
    const fullWidthChange = () =>{
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.lists.fullWidth = !fullWidth;
        setPreviewAppStyle(newAppStyle);
        setFullWidth(!fullWidth)
    }

    const [shadowUse, setShadowUse] = useState(appStyle.lists.shadow);
    
    const shadowChange = () =>{
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.lists.shadow = !shadowUse;
        setPreviewAppStyle(newAppStyle);
        setShadowUse(!shadowUse)
    }


    return (<>
        <Text>text size</Text>
        <View
            style = {{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: "100%",
                height: 60,
                
            }}
        >
            <Text
                style = {{
                    position: 'absolute',
                    left: 0,
                    color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral
                }}
            >
                smalle
            </Text>
            <Slider
                style = {{
                    flex: 1
                    //width: "70%"
                }}
                minimumValue={listsTextSize.min}
                maximumValue={listsTextSize.max}
                step = {listsTextSize.step}
                value = {sliderTextSizeValue}
                onSlidingComplete = {(value)=>{                 
                    setSliderTextSizeValue(value);
                    setPrewTextSize(value);
                }}
                onValueChange = {(value)=>{              
                    setPrewTextSize(value);
                }}
                minimumTrackTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].skyUpUp}
                maximumTrackTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp}
                thumbTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].sky}
            />
            <Text
                style = {{
                    position: 'absolute',
                    right: 0,
                    color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral
                }}
            >
                more
            </Text>
        </View>

        <Text>proximity</Text>
        <View
            style = {{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: "100%",
                height: 60,
                
            }}
        >
            <Text
                style = {{
                    position: 'absolute',
                    left: 0,
                    color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral
                }}
            >
                smalle
            </Text>
            <Slider
                style = {{
                    flex: 1
                    //width: "70%"
                }}
                minimumValue={listsProximity.min}
                maximumValue={listsProximity.max}
                step = {listsProximity.step}
                value = {sliderProximityValue}
                onSlidingComplete = {(value)=>{                 
                    setSliderProximityValue(value);
                    setPrewProximity(value);
                }}
                onValueChange = {(value)=>{              
                    setPrewProximity(value);
                }}
                minimumTrackTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].skyUpUp}
                maximumTrackTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp}
                thumbTintColor = {ThemesColorsAppList[ThemeColorsAppIndex].sky}
            />
            <Text
                style = {{
                    position: 'absolute',
                    right: 0,
                    color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral
                }}
            >
                more
            </Text>
        </View>
        
        <View
            style = {{
                flexDirection: 'row',
                //backgroundColor: 'red',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 60
            }}
        >
        <Text
            style = {{color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral}}
        >
            full width: {String(fullWidth)}
        </Text>
        <BaseSwitch
            size={24}
            style = {{
                right: 20
            }}
            trackStyle={{
                borderRadius: appStyle.borderRadius.additional,
            }}
            thumbStyle = {{
                borderRadius: appStyle.borderRadius.additional,
                borderWidth: 3,
                borderColor: fullWidth? ThemesColorsAppList[ThemeColorsAppIndex].sky : ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp,
            }}
            colors={{
                track: { 
                    false: ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp, 
                    true: ThemesColorsAppList[ThemeColorsAppIndex].sky  
                },
                thumb: { 
                    false: ThemesColorsAppList[ThemeColorsAppIndex].symbolLight, 
                    true: ThemesColorsAppList[ThemeColorsAppIndex].symbolLight  
                }
            }}
            primeValue={fullWidth}
            onChange={fullWidthChange}
        />
        </View>

        <View
            style = {{
                flexDirection: 'row',
                //backgroundColor: 'red',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 60
            }}
        >
        <Text
            style = {{color: ThemesColorsAppList[ThemeColorsAppIndex].symbolNeutral}}
        >
            Shadow: {String(shadowUse)}
        </Text>
        <BaseSwitch
            size={24}
            style = {{
                right: 20
            }}
            trackStyle={{
                borderRadius: appStyle.borderRadius.additional,
            }}
            thumbStyle = {{
                borderRadius: appStyle.borderRadius.additional,
                borderWidth: 3,
                borderColor: shadowUse? ThemesColorsAppList[ThemeColorsAppIndex].sky : ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp,
            }}
            colors={{
                track: { 
                    false: ThemesColorsAppList[ThemeColorsAppIndex].skyUpUpUp, 
                    true: ThemesColorsAppList[ThemeColorsAppIndex].sky  
                },
                thumb: { 
                    false: ThemesColorsAppList[ThemeColorsAppIndex].symbolLight, 
                    true: ThemesColorsAppList[ThemeColorsAppIndex].symbolLight  
                }
            }}
            primeValue={shadowUse}
            onChange={shadowChange}
        />
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