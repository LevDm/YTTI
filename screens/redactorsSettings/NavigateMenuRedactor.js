import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Animated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

import languagesAppList, {languagesApp}  from "../../Languages";
import themesColorsAppList, {themesApp} from "../../Themes";
import dataRedactor from "../../async_data_manager/data_redactor";
import ColorSplash from "../../componets/StyleColorSplash";

import Slider from '@react-native-community/slider';
import { BlurView } from "expo-blur";
//import BasePressable from "../../componets/base/BasePressable";
//import BaseCheckBox from "../../componets/base/BaseCheckBox";
import { 
    BasePressable,
    BaseCheckBox,
    BaseSlider,
    BaseSwitch 
} from "../../componets/base/BaseElements";

//const menuTypes = ['classical','classical_animated','hidden', 'not'];
//const positionNavigateMenu = {min: 20, max: 80, step: 5}
//const valuePosition = ['left','center','right']
//const heightNavigateMenu = {min: 35, max: 65, step: 5}
import { menuTypes, positionNavigateMenu, valuePosition, heightNavigateMenu } from "../../AppDefault";

export default NavigateMenuRedactor = ({
    appStyle,
    setAppStyle,
    r_setAppStyle,

    setPreviewAppStyle,
    getNewAppStyleObject,

    ThemeColorsAppIndex,
    LanguageAppIndex  
}) => {
    const Thema = themesColorsAppList[ThemeColorsAppIndex]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.navigationMenu

    const getGroup = (type) => {
        let group = []
        for (let i of menuTypes){
            let check = false
            if(type === i){check = true}
            group.push(check)
        }
        return group
    };

    const getGroupPositions = (type) => {
        let group = []
        for (let i of valuePosition){
            let check = false
            if(type === i){check = true}
            group.push(check)
        }
        return group
    };

    const [checkGroup, setCheckGroup] = useState(getGroup(appStyle.navigationMenu.type));
    const checkBoxPress = (type) => {
        const newGroup = getGroup(type)
        let newAppStyle = getNewAppStyleObject();
        if(type == "hidden"){
            newAppStyle.navigationMenu.height = 0
        }
        newAppStyle.navigationMenu.type = type
        console.log('newAppStyle',newAppStyle)
        setPreviewAppStyle(newAppStyle);
        setCheckGroup(newGroup);
    };

    const [signature, setSignature] = useState(appStyle.navigationMenu.signatureIcons);
    const signatureChange = () =>{
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.signatureIcons = !signature;
        setPreviewAppStyle(newAppStyle);
        setSignature(!signature)
    }

    const [sliderValueVert, setSliderValueVert] = useState(appStyle.navigationMenu.position.vertical);
    const setPrewBasicVertPos = (value) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.position.vertical = Number(value);
        setPreviewAppStyle(newAppStyle);
    }

    const [sliderValueMenuHeight, setSliderValueMenuHeight] = useState(appStyle.navigationMenu.height);
    const setPrewBasicMenuHeight = (value) => {
        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.height = Number(value);
        setPreviewAppStyle(newAppStyle);
    }

    const [checkGroupHorPos, setCheckGroupHorPos] = useState(getGroupPositions(appStyle.navigationMenu.position.horizontal));
    const horizontalPositionSetting = (positionType, index) => {
        setCheckGroupHorPos(getGroupPositions(positionType));

        let newAppStyle = getNewAppStyleObject();
        newAppStyle.navigationMenu.position.horizontal = positionType//valuePosition[index];
        setPreviewAppStyle(newAppStyle);
    };

    return (<>
    <Text style = {[staticStyles.text, {color: Thema.neutrals.secondary}]}>
        {Language.type}
    </Text>
    <View 
        style = {[{
            marginTop: 5
        }]}
    >
        {menuTypes.map((item, index)=>(
        <BaseCheckBox
            key = {item+index}
            //rippleColor = {ThemesColorsAppList[ThemeColorsAppIndex].shadowWhite0}
            Item = {<Text style = {[staticStyles.listText, {color: Thema.neutrals.secondary}]}>{Language.types[index]}</Text>}
            Check = {checkGroup[index]}
            onPress = {()=>{checkBoxPress(item)}}
            BoxBorderRadius = {appStyle.borderRadius.additional}
            ColorsChange = {{true: Thema.accents.primary, false: Thema.accents.quaternary}}
        />
        ))}
    </View>
    <Text style = {[staticStyles.text, {color: Thema.neutrals.secondary, marginTop: 15,}]}>
        {Language.menuParams}
    </Text>
    <View
        style = {[{

        }]}
    >   
        {checkGroup[2] && <>
        <Text style = {[staticStyles.text, {color: Thema.neutrals.secondary}]}>
            {Language.verticalPosition}
        </Text>
        <BaseSlider
            signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
            signaturesStyle = {[staticStyles.signaturesText, {color: Thema.neutrals.tertiary}]}

            style = {{
                flex: 1
            }}
            minimumValue={positionNavigateMenu.min}
            maximumValue={positionNavigateMenu.max}
            step = {positionNavigateMenu.step}
            value = {sliderValueVert}
            onSlidingComplete = {(value)=>{                 
                setSliderValueVert(value);
                setPrewBasicVertPos(value);
            }}
            onValueChange = {(value)=>{              
                setPrewBasicVertPos(value);
            }}
            minimumTrackTintColor = {Thema.accents.tertiary}
            maximumTrackTintColor = {Thema.accents.quaternary}
            thumbTintColor = {Thema.accents.primary}
        />

        <View
            style = {{
                height: 60,
                marginTop: 15
            }}
        >
            <Text
                style = {[staticStyles.text, {color: Thema.neutrals.secondary}]}
            >
                {Language.horizontalPosition}
            </Text>
            <View
                style = {{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}
            >
                {valuePosition.map((item, index)=>(
                <BaseCheckBox
                    key = {item+index}
                    //rippleColor = {ThemesColorsAppList[ThemeColorsAppIndex].shadowWhite0}
                    Item = {<Text style = {[staticStyles.listText, {color: Thema.neutrals.secondary}]} >{Language.horizontalPositions[index]}</Text>}
                    Check = {checkGroupHorPos[index]}
                    onPress = {()=>{horizontalPositionSetting(item, index)}}
                    BoxBorderRadius = {appStyle.borderRadius.additional}
                    ColorsChange = {{true: Thema.accents.primary, false: Thema.accents.quaternary}}
                />
                ))}
            </View>
        </View>
        </>}
        {!checkGroup[2] && <>
            <Text style = {[staticStyles.text, {color: Thema.neutrals.secondary}]}>
                {Language.height}
            </Text>
            <BaseSlider
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
                signaturesStyle = {[staticStyles.signaturesText, {color: Thema.neutrals.tertiary}]}        
                
                style = {{
                    flex: 1
                }}
                minimumValue={heightNavigateMenu.min}
                maximumValue={heightNavigateMenu.max}
                step = {heightNavigateMenu.step}
                value = {sliderValueMenuHeight}
                onSlidingComplete = {(value)=>{                 
                    setSliderValueMenuHeight(value);
                    setPrewBasicMenuHeight(value);
                }}
                onValueChange = {(value)=>{              
                    setPrewBasicMenuHeight(value);
                }}
                minimumTrackTintColor = {Thema.accents.tertiary}
                maximumTrackTintColor = {Thema.accents.quaternary}
                thumbTintColor = {Thema.accents.primary}
            />
            <View
                style ={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 15,
                    height: 60
                }}
            >
                <Text
                    style = {[staticStyles.text, {color: Thema.neutrals.secondary}]}
                >
                    {Language.signature} {Language.signatureState[signature]}
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
                        borderColor: Thema.accents[signature? "primary" : "quaternary"]  ,
                    }}
                    colors={{
                        track: { 
                            false: Thema.accents.quaternary, 
                            true: Thema.accents.primary
                        },
                        thumb: { 
                            false: Thema.icons.neutrals.primary, 
                            true: Thema.icons.neutrals.primary  
                        }
                    }}
                    primeValue={signature}
                    onChange={signatureChange}
                />
            </View>
        </>}
    </View>
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