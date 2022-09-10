import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, Animated, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import LanguagesAppList from "../../language/language";
import ThemesColorsAppList from "../../styles/ColorsApp";
import languagesAppList, {languagesApp}  from "../../Languages";
import themesColorsAppList, {themesApp} from "../../Themes";
import dataRedactor from "../../async_data_manager/data_redactor";
import ColorSplash from "../../componets/StyleColorSplash";
import Slider from '@react-native-community/slider';
import { 
    BasePressable,
    BaseCheckBox,
    BaseSlider,
    BaseSwitch 
} from "../../componets/base/BaseElements";
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {SvgXml, Rect, Defs, RadialGradient, Stop, Path} from "react-native-svg";

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


//const listsTextSize = {min: 10, max: 20, step: 1}
//const listsProximity = {min: 1, max: 5, step: 1}
import { listsTextSize, listsProximity } from "../../AppDefault";

export default ListsRedactor = ({
    appStyle,
    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    LanguageAppIndex  
}) => {
    const Thema = themesColorsAppList[ThemeColorsAppIndex]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.lists


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
        <Text style = {[staticStyles.text, {color: Thema.neutrals.secondary}]}>{Language.textSize}</Text>
        <BaseSlider
            signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
            signaturesStyle = {[staticStyles.signaturesText, {color: Thema.neutrals.tertiary}]}        
            
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
            minimumTrackTintColor = {Thema.icons.accents.tertiary}
            maximumTrackTintColor = {Thema.icons.accents.quaternary}
            thumbTintColor = {Thema.icons.accents.primary}
        />
        <Text style = {[staticStyles.text, {color: Thema.neutrals.secondary, marginTop: 15}]}>{Language.proximity}</Text>
        <BaseSlider
            signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
            signaturesStyle = {[staticStyles.signaturesText, {color: Thema.neutrals.tertiary}]} 

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
            minimumTrackTintColor = {Thema.icons.accents.tertiary}
            maximumTrackTintColor = {Thema.icons.accents.quaternary}
            thumbTintColor = {Thema.icons.accents.primary}
        />
        <View
            style = {{
                flexDirection: 'row',
                //backgroundColor: 'red',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 60,
                marginTop: 15
            }}
        >
            <Text style = {[staticStyles.text, {color: Thema.neutrals.secondary, textAlign: 'justify', width: '70%'}]}>
                {Language.fullWidth} {Language.fullWidthState[`${fullWidth}`]}
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
                    borderColor: Thema.icons.accents[fullWidth?"primary" : "quaternary"],
                }}
                colors={{
                    track: { 
                        false: Thema.icons.accents.quaternary, 
                        true: Thema.icons.accents.primary  
                    },
                    thumb: { 
                        false: Thema.icons.neutrals.primary, 
                        true: Thema.icons.neutrals.primary  
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
                height: 60,
                marginTop: 15
            }}
        >
        <Text style = {[staticStyles.text, {color: Thema.neutrals.secondary, textAlign: 'justify', width: '70%'}]}>
            {Language.shadows} {Language.shadowsState[`${shadowUse}`]}
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
                borderColor: Thema.icons.accents[shadowUse?"primary" : "quaternary"],
            }}
            colors={{
                track: { 
                    false: Thema.icons.accents.quaternary, 
                    true: Thema.icons.accents.primary  
                },
                thumb: { 
                    false: Thema.icons.neutrals.primary, 
                    true: Thema.icons.neutrals.primary  
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