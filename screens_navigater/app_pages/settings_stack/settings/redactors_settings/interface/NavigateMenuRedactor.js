import React, {useState, useRef, useEffect} from "react";

import {StyleSheet, Text, Pressable, ScrollView,FlatList, SectionList, View,Button, Dimensions, Switch, ActivityIndicator} from 'react-native';

import Reanimated from "react-native-reanimated";
import {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    cancelAnimation,
    withTiming
} from 'react-native-reanimated';

import languagesAppList, { languagesApp } from "../../../../../../app_values/Languages";
import themesColorsAppList, { themesApp } from "../../../../../../app_values/Themes";
import { 
    BasePressable,
    BaseBox,
    BaseSlider,
    BaseSwitch 
} from "../../../../../../general_components/base_components/BaseElements";

import commonStaticStyles, { SwitchField, SliderField, BoxsField } from "../CommonElements";

//const menuTypes = ['classical','classical_animated','hidden', 'not'];
//const positionNavigateMenu = {min: 20, max: 80, step: 5}
//const valuePosition = ['left','center','right']
//const heightNavigateMenu = {min: 35, max: 65, step: 5}
import { menuTypes, positionNavigateMenu, valuePosition, heightNavigateMenu, drawerPositions } from "../../../../../../app_values/AppDefault";

export default NavigateMenuRedactor = ({
    appStyle,
    setAppStyle,
    r_setAppStyle,

    previewAppStyle,
    setPreviewAppStyle,

    previewAppStyleA,

    getNewAppStyleObject,

    ThemeColorsAppIndex,
    ThemeSchema,
    LanguageAppIndex  
}) => {
    const Theme = themesColorsAppList[ThemeColorsAppIndex][ThemeSchema]
    const Language = languagesAppList[LanguageAppIndex].SettingsScreen.Redactors.navigationMenu

    const [previewMenuType, setPreviewMenuType] = useState(appStyle.navigationMenu.type)

    const checkBoxPress = (activeIndex) => {
        const type = menuTypes[activeIndex]
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        //let newAppStyle = getNewAppStyleObject();
        if(type == "hidden" || type =="not"){
            newAppStyle.navigationMenu.height = 0
        } else {
            //console.log('new select class')
            newAppStyle.navigationMenu.height = 50
            setSliderValueMenuHeight(50)
        }
        newAppStyle.navigationMenu.type = type
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;

        setPreviewMenuType(type)
    };

    const [signature, setSignature] = useState(appStyle.navigationMenu.signatureIcons);
    const signatureChange = () =>{
        //let newAppStyle = getNewAppStyleObject();
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.signatureIcons = !signature;
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
        setSignature(!signature)
    }

    const [rippleEffect, setRippleEffect] = useState(appStyle.navigationMenu.rippleEffect);
    const rippleEffectChange = () =>{
        //let newAppStyle = getNewAppStyleObject();
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.rippleEffect = !rippleEffect;
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
        setRippleEffect(!rippleEffect)
    }

    const [sliderValueVert, setSliderValueVert] = useState(appStyle.navigationMenu.position.vertical);
    const setPrewBasicVertPos = (value) => {
        //let newAppStyle = getNewAppStyleObject();
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.position.vertical = Number(value);
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    }

    const [sliderValueMenuHeight, setSliderValueMenuHeight] = useState(appStyle.navigationMenu.height);
    const setPrewBasicMenuHeight = (value) => {
        //let newAppStyle = getNewAppStyleObject();
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.height = Number(value);
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    }

    const horizontalPositionSetting = (index) => {
        const positionType = valuePosition[index]
        //let newAppStyle = getNewAppStyleObject();
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.position.horizontal = positionType
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    };

    const drawerPositionSetting = (index) => {
        const drawerPosition =  drawerPositions[index]
        //let newAppStyle = getNewAppStyleObject();
        const newAppStyle = JSON.parse(JSON.stringify(previewAppStyleA.value));
        newAppStyle.navigationMenu.drawerPosition = drawerPosition
        //setPreviewAppStyle(newAppStyle);
        cancelAnimation(previewAppStyleA);
        previewAppStyleA.value = newAppStyle;
    };

    const tingDuration = 300
    const entering = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(1, { duration: tingDuration }),
          transform: [
            {scale: withTiming(1, { duration: tingDuration })}
          ]
        };
        const initialValues = {
          opacity: 0,
          transform: [
            {scale: .97}
          ]
        };
        return {
          initialValues,
          animations,
        };
    };
    const exiting = (targetValues) => {
        'worklet';
        const animations = {
          opacity: withTiming(0, { duration: tingDuration }),
        };
        const initialValues = {
          opacity: 1,
        };
        return {
          initialValues,
          animations,
        };
    };

    return (
    <View 
        style ={{
            
        }}
    >
    <BoxsField
        //  'one'>true || 'multiple'>false
        isChoiceOne={true}
        title = {Language.type}
        //  'one'>index || 'multiple'>[indexs]
        primaryValue = {menuTypes.indexOf(appStyle.navigationMenu.type)} 
        groupSize = {menuTypes.length}
        groupItems = {Language.types}         
        onPress = {(activeIndex)=>{checkBoxPress(activeIndex)}}          
        appStyle = {appStyle}
        ThemeColorsAppIndex = {ThemeColorsAppIndex}
        ThemeSchema = {ThemeSchema}
    />

    <Text style = {[staticStyles.text, {color: Theme.texts.neutrals.secondary, marginTop: 15, paddingLeft: 10}]}>
        {Language.menuParams}
    </Text>
    
    <View
        style = {[{
            height: 215,
        }]}
    >   
        <SwitchField
            text = {`${Language.rippleEffect} ${Language.rippleEffectState[rippleEffect]}`}
            primeValue={rippleEffect}
            onChange={rippleEffectChange}
            appStyle = {appStyle}
            ThemeColorsAppIndex = {ThemeColorsAppIndex}
            ThemeSchema = {ThemeSchema}
        />
        
        {previewMenuType == menuTypes[2] && 
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
        >
            <BoxsField
                //  'one'>true || 'multiple'>false
                isChoiceOne={true}
                title = {Language.horizontalPositionDrawer}
                //  'one'>index || 'multiple'>[indexs]
                primaryValue = {drawerPositions.indexOf(appStyle.navigationMenu.drawerPosition)} 
                groupSize = {drawerPositions.length}
                groupItems = {Language.horizontalPositionsDrawer}         
                onPress = {(activeIndex)=>{drawerPositionSetting(activeIndex)}}          
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Reanimated.View>}

        {previewMenuType == menuTypes[1] &&  
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
        >
            <SliderField
                style = {{marginTop: 15}}
                title = {Language.verticalPosition}
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}
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
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Reanimated.View>}

        {previewMenuType == menuTypes[1] && 
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
        >
            <BoxsField
                //  'one'>true || 'multiple'>false
                isChoiceOne={true}
                title = {Language.horizontalPosition}
                //  'one'>index || 'multiple'>[indexs]
                primaryValue = {valuePosition.indexOf(appStyle.navigationMenu.position.horizontal)} 
                groupSize = {valuePosition.length}
                groupItems = {Language.horizontalPositions}         
                onPress = {(activeIndex)=>{horizontalPositionSetting(activeIndex)}}          
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Reanimated.View>}

        {previewMenuType == menuTypes[0] && 
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
        >
            <SliderField
                title = {Language.height}
                signaturesText = {{left: Language.slider.min, right: Language.slider.max}}     
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
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Reanimated.View>}

        {previewMenuType == menuTypes[0] && 
        <Reanimated.View 
            //exiting={exiting} 
            entering={entering}
        >
            <SwitchField
                text = {`${Language.signature} ${Language.signatureState[signature]}`}
                primeValue={signature}
                onChange={signatureChange}
                appStyle = {appStyle}
                ThemeColorsAppIndex = {ThemeColorsAppIndex}
                ThemeSchema = {ThemeSchema}
            />
        </Reanimated.View>}
    </View>
    </View>)
}

const staticStyles = StyleSheet.create({

    ...commonStaticStyles
});